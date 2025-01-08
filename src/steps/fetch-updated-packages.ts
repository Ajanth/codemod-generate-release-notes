import { execSync } from 'node:child_process';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/json';

import { Options, PackageNameVersionEntry } from '../types/index.js';

// Step: Fetch Updated Packages from the Latest Commit's CHANGELOG.md Files
export function fetchUpdatedPackages(
  options: Options,
): PackageNameVersionEntry[] {
  const { packagesPath, projectRoot } = options;

  let changedPackageJsonFiles = packageJsonFilesFromLastCommit(
    packagesPath,
    projectRoot,
  );
  const updatedPackages: PackageNameVersionEntry[] = [];

  changedPackageJsonFiles = changedPackageJsonFiles.filter((filePath) => {
    // we skip package.json files in the root since we don't include them in the release notes
    // to review later if this can be an option
    if (filePath === '/package.json') {
      return false;
    }
    return true;
  });

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

function packageJsonFilesFromLastCommit(
  packagesPath: string,
  projectRoot: string,
): string[] {
  const lastCommitHash = execSync('git rev-parse HEAD', { cwd: projectRoot })
    .toString()
    .trim();

  const changedFilesOutput = execSync(
    `git diff-tree --no-commit-id --name-only -r ${lastCommitHash}`,
    { cwd: projectRoot },
  )
    .toString()
    .trim();

  const changedFiles = changedFilesOutput ? changedFilesOutput.split('\n') : [];

  return changedFiles.filter(
    (filePath) =>
      filePath.startsWith(packagesPath) && filePath.endsWith('package.json'),
  );
}
