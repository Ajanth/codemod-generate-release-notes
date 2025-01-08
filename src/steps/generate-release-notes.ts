import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Options, PackageNameVersionEntry } from '../types/index.js';

/**
 * Generates RELEASE_NOTES.md based on package.json files
 * @param options - Codemod options
 */
export function generateReleaseNotes(
  options: Options,
  updatedPackages: PackageNameVersionEntry[],
  categorizedLatestVersions: Record<string, PackageNameVersionEntry[]>,
): void {
  const { projectRoot } = options;

  let markdownContent = '';

  // Section: Updated Packages
  markdownContent += '## Updated packages\n\n';
  updatedPackages.forEach(({ name }) => {
    markdownContent += `- ${name} \n`;
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

  //Write to RELEASE_NOTES.md
  const releaseNotesPath = join(projectRoot, 'RELEASE_NOTES.md');
  writeFileSync(releaseNotesPath, markdownContent, 'utf8');

  console.log(`RELEASE_NOTES.md has been generated at ${releaseNotesPath}`);
}
