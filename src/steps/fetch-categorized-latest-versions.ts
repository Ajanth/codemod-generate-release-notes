import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';
import { readPackageJson } from '@codemod-utils/json';

import {
  Options,
  PackageNameVersionEntry,
  VersionNameCategory,
} from '../types/index.js';

// Step: Parse package.json Files to get Versions, Names grouped by Categories
export function fetchCategorizedLatestVersions(
  options: Options,
): Record<string, PackageNameVersionEntry[]> {
  const { packagesPath, projectRoot } = options;
  const packageRoots = getPackageRoots(packagesPath, projectRoot);
  const versionNameCategories = packageRoots
    .map((packageRoot) => {
      try {
        const packageJson = readPackageJson({ projectRoot: packageRoot });
        const category = getCategoryFromPath(projectRoot, packageRoot);
        return {
          name: packageJson['name'],
          version: packageJson['version'],
          isPrivate: packageJson['private'] === true,
          category,
        };
      } catch {
        return undefined;
      }
    })
    .filter(allow) as VersionNameCategory[];

  // Organize Latest Versions by Category
  const categorizedLatestVersions: Record<string, PackageNameVersionEntry[]> =
    {};
  versionNameCategories.forEach((versionNameCategory: VersionNameCategory) => {
    if (!categorizedLatestVersions[versionNameCategory.category]) {
      categorizedLatestVersions[versionNameCategory.category] = [];
    }

    categorizedLatestVersions[versionNameCategory.category]!.push({
      name: versionNameCategory.name!,
      version: versionNameCategory.version!,
    });
  });

  return categorizedLatestVersions;
}

function allow(input?: VersionNameCategory): boolean {
  if (
    !input ||
    !input.version ||
    !input.name ||
    !input.category ||
    input.isPrivate
  ) {
    return false;
  }

  return new RegExp(/^\d+\.\d+\.\d+$/).test(input.version);
}

function getPackageRoots(packagesPath: string, projectRoot: string): string[] {
  const packageRoots = findFiles(`${packagesPath}/**/package.json`, {
    ignoreList: ['**/{dist,node_modules}/**/*'],
    projectRoot,
  }).map((filePath) => {
    return join(projectRoot, filePath.replace(/package\.json$/, ''));
  });

  const isMonorepo = packageRoots.length > 1;

  if (isMonorepo) {
    // Remove the workspace root
    return packageRoots.filter((packageRoot) => packageRoot !== projectRoot);
  }

  return packageRoots;
}

/**
 * Determines the category of a package based on its file path
 * @param filePath - Path to the package.json file
 * @returns Category name
 */
function getCategoryFromPath(projectRoot: string, packageRoot: string): string {
  const parsedPath = parseFilePath(packageRoot.replace(projectRoot, ''));
  const segments = parsedPath.dir.split('/');

  // Assuming the structure is packages/<category>/<package>/package.json
  const category = segments[2] || 'Uncategorized';
  return category;
}
