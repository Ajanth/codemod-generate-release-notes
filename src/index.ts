import {
  createOptions,
  fetchCategorizedLatestVersions,
  fetchUpdatedPackages,
  generateReleaseNotes,
  packageJsonFilesSinceLastTag,
} from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);
  const updatedPackages = fetchUpdatedPackages(
    options,
    packageJsonFilesSinceLastTag,
  );
  const categorizedLatestVersions = fetchCategorizedLatestVersions(options);
  generateReleaseNotes(options, updatedPackages, categorizedLatestVersions);
}
