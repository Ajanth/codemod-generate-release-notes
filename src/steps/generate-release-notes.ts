import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  ChangesetEntry,
  LatestVersionEntry,
  Options,
} from '../types/index.js';

/**
 * Generates RELEASE_NOTES.md based on .changelog and package.json files
 * @param options - Codemod options
 */
export function generateReleaseNotes(
  options: Options,
  updatedPackages: ChangesetEntry[],
  categorizedLatestVersions: Record<string, LatestVersionEntry[]>,
): void {
  const { projectRoot } = options;

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
