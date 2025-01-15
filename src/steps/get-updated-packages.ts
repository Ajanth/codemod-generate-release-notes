import { execSync } from 'node:child_process';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/json';

import { Options, PackageNameVersionEntry } from '../types/index.js';

export function getUpdatedPackages(
  options: Options,
): PackageNameVersionEntry[] {
  const { projectRoot } = options;

  const packageJsonPaths = findPackageJsonPaths(projectRoot);
  const updatedPackages: PackageNameVersionEntry[] = [];

  for (const filePath of packageJsonPaths) {
    const packageRoot = join(
      projectRoot,
      filePath.replace(/package\.json$/, ''),
    );

    const packageJson = readPackageJson({ projectRoot: packageRoot });

    if (packageJson.private === true) {
      continue;
    }

    updatedPackages.push({
      name: packageJson.name ?? '',
      version: packageJson.version ?? '',
    });
  }

  return updatedPackages;
}

function findPackageJsonPaths(projectRoot: string): string[] {
  function runGitCommand(command: string): string {
    try {
      return execSync(command, { cwd: projectRoot }).toString().trim();
    } catch {
      return '';
    }
  }

  const mostRecentTag = runGitCommand('git describe --tags --abbrev=0');
  const filePaths = runGitCommand(`git diff --name-only ${mostRecentTag} HEAD`);

  return filePaths
    .split('\n')
    .filter((filePath) => filePath.endsWith('package.json'));
}
