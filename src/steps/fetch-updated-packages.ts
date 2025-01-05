import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ChangesetEntry, Options } from '../types/index.js';
import { parseChangelogFile } from '../utils/parse-changelog.js';

// Step: Fetch Updated Packages from the Latest Commit's CHANGELOG.md Files
export function fetchUpdatedPackages(options: Options): ChangesetEntry[] {
  const { projectRoot } = options;

  const changelogFiles = changeLogFilesFromLastCommit(projectRoot);
  return changelogFiles.flatMap((filePath) => {
    const content = readFileSync(join(projectRoot, filePath), 'utf8');
    return parseChangelogFile(content);
  });
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
