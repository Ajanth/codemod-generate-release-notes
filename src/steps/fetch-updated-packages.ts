import { execSync } from 'node:child_process';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/json';

import { Options, PackageNameVersionEntry } from '../types/index.js';

// Step: Fetch Updated Packages from the Latest Commit's package.json Files
export function fetchUpdatedPackages(
  options: Options,
  customPackageJsonFilesSinceLastTag: (projectRoot: string) => string[],
): PackageNameVersionEntry[] {
  const { projectRoot } = options;

  const changedPackageJsonFiles =
    customPackageJsonFilesSinceLastTag(projectRoot);

  const updatedPackages: PackageNameVersionEntry[] = [];

  for (const filePath of changedPackageJsonFiles) {
    const fullPath = join(projectRoot, filePath.replace('package.json', ''));
    const packageData = readPackageJson({ projectRoot: fullPath });

    if (packageData.name && packageData.private !== true) {
      updatedPackages.push({
        name: packageData.name,
        version: packageData.version!,
      });
    }
  }

  return updatedPackages;
}

export function packageJsonFilesSinceLastTag(projectRoot: string): string[] {
  const lastTag = execSync('git describe --tags --abbrev=0', {
    cwd: projectRoot,
  })
    .toString()
    .trim();

  const changedFilesOutput = execSync(`git diff --name-only ${lastTag} HEAD`, {
    cwd: projectRoot,
  })
    .toString()
    .trim();

  const changedFiles = changedFilesOutput ? changedFilesOutput.split('\n') : [];

  return changedFiles.filter((filePath) => filePath.endsWith('package.json'));
}
