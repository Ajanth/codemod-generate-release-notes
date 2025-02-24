import { join, relative, sep } from 'node:path';

import { getPackageRoots } from '@codemod-utils/files';
import { readPackageJson } from '@codemod-utils/json';

import type {
  Options,
  PackageNameVersionEntry,
  VersionNameCategory,
} from '../types/index.js';

export function getLatestVersions(
  options: Options,
): Record<string, PackageNameVersionEntry[]> {
  const { packagesPath, projectRoot } = options;

  const packageRoots = getPackageRoots(options);

  const packageData = packageRoots.reduce<VersionNameCategory[]>(
    (accumulator, packageRoot) => {
      const packageJson = readPackageJson({ projectRoot: packageRoot });

      if (packageJson.private === true) {
        return accumulator;
      }

      const filePath = relative(join(projectRoot, packagesPath), packageRoot);
      const category = getCategory(filePath);

      accumulator.push({
        category,
        name: packageJson.name ?? '',
        version: packageJson.version ?? '',
      });

      return accumulator;
    },
    [],
  );

  // Group packages by category
  const latestVersions: Record<string, PackageNameVersionEntry[]> = {};

  packageData.forEach((versionNameCategory: VersionNameCategory) => {
    const { category, name, version } = versionNameCategory;

    if (!latestVersions[category]) {
      latestVersions[category] = [];
    }

    if (name && version) {
      latestVersions[category].push({
        name,
        version,
      });
    }
  });

  return latestVersions;
}

function getCategory(filePath: string): string {
  const segments = filePath.split(sep);

  return segments[0] ?? 'Uncategorized';
}
