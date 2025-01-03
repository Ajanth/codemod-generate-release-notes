import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';
import { readPackageJson } from '@codemod-utils/json';
import { execSync } from 'child_process';

import type {
  ChangesetEntry,
  LatestVersionEntry,
  Options,
  VersionNameCategory,
} from '../types/index.js';
import { parseChangelogFile } from '../utils/parse-changelog.js';

/**
 * Generates RELEASE_NOTES.md based on .changelog and package.json files
 * @param options - Codemod options
 */
export function generateReleaseNotes(options: Options): void {
  const { projectRoot } = options;

  // Step 1: Fetch Updated Packages from the Latest Commit's CHANGELOG.md Files
  const changelogFiles = changeLogFilesFromLastCommit(projectRoot);

  const updatedPackages = updatedPackagesFromChangelogFiles(
    changelogFiles,
    projectRoot,
  );

  // Step 2: Parse package.json Files to get Versions, Names, and Categories
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

  // Step 3: Generate Markdown Content
  let markdownContent = '';

  // Section: Updated Packages
  markdownContent += '## Updated packages\n\n';
  updatedPackages.forEach(({ packageName, prNumbers }) => {
    const prNumbersFormatted = prNumbers.map((pr) => `#${pr}`).join(', ');
    markdownContent += `- ${packageName} (${prNumbersFormatted})\n`;
  });

  // Section: Latest Versions
  markdownContent += '\n## Latest versions\n\n';
  for (const [category, packages] of Object.entries(
    categorizedLatestVersions,
  )) {
    markdownContent += `### ${category}\n\n`;
    markdownContent += `| Name | Version |\n`;
    markdownContent += `|--|:--:|\n`;
    packages.forEach(({ name, version }) => {
      markdownContent += `| ${name} | ${version} |\n`;
    });
    markdownContent += `\n`;
  }

  // Step 4: Write to RELEASE_NOTES.md
  const releaseNotesPath = join(projectRoot, 'RELEASE_NOTES.md');
  writeFileSync(releaseNotesPath, markdownContent, 'utf8');

  console.log(`RELEASE_NOTES.md has been generated at ${releaseNotesPath}`);
}

function allow(input?: VersionNameCategory): boolean {
  if (!input || !input.version || !input.name || !input.category) {
    return false;
  }

  return new RegExp(/^\d+\.\d+\.\d+$/).test(input.version);
}

function changeLogFilesFromLastCommit(projectRoot: string): string[] {
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

  return changedFiles.filter((filePath) => filePath.endsWith('CHANGELOG.md'));
}

function updatedPackagesFromChangelogFiles(
  changelogFiles: string[],
  projectRoot: string,
): ChangesetEntry[] {
  return changelogFiles.flatMap((filePath) => {
    const content = readFileSync(join(projectRoot, filePath), 'utf8');
    return parseChangelogFile(content);
  });
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
