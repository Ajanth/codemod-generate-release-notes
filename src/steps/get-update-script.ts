import { PackageNameVersionEntry } from '../types/index.js';

export function getUpdateScript(
  updatedPackages: PackageNameVersionEntry[],
): string {
  if (updatedPackages.length === 0) {
    return '';
  }

  const packagesWithVersions = updatedPackages
    .map(({ name, version }) => `${name}@${version}`)
    .join(' ');

  return `pnpm update -r ${packagesWithVersions}`;
}
