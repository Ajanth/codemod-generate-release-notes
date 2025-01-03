import { ChangesetEntry } from '../types/index.js';

/**
 * Parses a CHANGELOG.md file to extract the latest package name and PR numbers.
 * @param content - Content of the CHANGELOG.md file for a specific package
 * @returns An array of ChangesetEntry objects, each containing the package name, latest version, and PR numbers.
 */
export function parseChangelogFile(content: string): ChangesetEntry[] {
  const entries: ChangesetEntry[] = [];
  const lines = content.split('\n');

  let packageName = '';
  const prNumbers: string[] = [];
  let inLatestVersionSection = false;

  for (const line of lines) {
    // Extract package name from the first line
    const packageMatch = line.match(/^#\s+(@[\w-]+\/[\w-]+)/);
    if (packageMatch) {
      packageName = packageMatch[1]!;
      continue;
    }

    // Detect the start of the latest version section
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      if (inLatestVersionSection) {
        break; // Only parse the first (latest) version section
      }
      inLatestVersionSection = true;
      continue;
    }

    // If within the latest version section, extract PR numbers
    if (inLatestVersionSection) {
      const prMatch = line.match(/-\s+\[#(\d+)\]/);
      if (prMatch) {
        prNumbers.push(prMatch[1]!);
      }
    }
  }

  if (packageName && prNumbers.length > 0) {
    entries.push({ packageName, prNumbers });
  }

  return entries;
}
