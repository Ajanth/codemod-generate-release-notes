import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';
import { readPackageJson } from '@codemod-utils/json';

import {
  LatestVersionEntry,
  Options,
  VersionNameCategory,
} from '../types/index.js';

// Step: Parse package.json Files to get Versions, Names grouped by Categories
export function fetchCategorizedLatestVersions(
  options: Options,
): Record<string, LatestVersionEntry[]> {
  const { projectRoot } = options;
  const packageRoots = getPackageRoots(projectRoot);
  const versionNameCategories = packageRoots
    .map((packageRoot) => {
      try {
        const packageJson = readPackageJson({ projectRoot: packageRoot });
        const category = getCategoryFromPath(projectRoot, packageRoot);
        return {
          name: packageJson['name'],
          version: packageJson['version'],
          category,
        };
      } catch {
        return undefined;
      }
    })
    .filter(allow) as VersionNameCategory[];

  // Organize Latest Versions by Category
  const categorizedLatestVersions: Record<string, LatestVersionEntry[]> = {};
  versionNameCategories.forEach((versionNameCategory: VersionNameCategory) => {
    if (!categorizedLatestVersions[versionNameCategory.category]) {
      categorizedLatestVersions[versionNameCategory.category] = [];
    }

    categorizedLatestVersions[versionNameCategory.category]!.push({
      version: versionNameCategory.version!,
      name: versionNameCategory.name!,
    });
  });

  return categorizedLatestVersions;
}

function allow(input?: VersionNameCategory): boolean {
  if (!input || !input.version || !input.name || !input.category) {
    return false;
  }

  return new RegExp(/^\d+\.\d+\.\d+$/).test(input.version);
}

function getPackageRoots(projectRoot: string): string[] {
  const packageRoots = findFiles('packages/**/package.json', {
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
