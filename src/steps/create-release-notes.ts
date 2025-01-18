import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Options, PackageNameVersionEntry } from '../types/index.js';

export function createReleaseNotes(
  updatedPackages: PackageNameVersionEntry[],
  updateScript: string,
  latestVersions: Record<string, PackageNameVersionEntry[]>,
  options: Options,
): void {
  const { projectRoot } = options;

  let fileContent = '';

  // Section: Updated Packages
  fileContent += '## Updated packages\n\n';

  if (updatedPackages.length === 0) {
    fileContent += 'None\n';
  } else {
    fileContent += 'How to update:\n\n';
    fileContent += '```sh\n';
    fileContent += updateScript;
    fileContent += '\n```\n\n';

    updatedPackages.forEach(({ name }) => {
      fileContent += `- ${name}\n`;
    });
  }

  fileContent += '\n\n';

  // Section: Latest Versions
  fileContent += '## Latest versions\n\n';

  for (const [category, packages] of Object.entries(latestVersions)) {
    fileContent += `### ${category}\n\n`;
    fileContent += `| Name | Version |\n`;
    fileContent += `|--|:--:|\n`;

    packages.forEach(({ name, version }) => {
      fileContent += `| ${name} | ${version} |\n`;
    });

    fileContent += '\n';
  }

  const releaseNotesPath = join(projectRoot, 'RELEASE_NOTES.md');

  writeFileSync(releaseNotesPath, fileContent.trim(), 'utf8');
}
