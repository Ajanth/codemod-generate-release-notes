import {
  createOptions,
  fetchCategorizedLatestVersions,
  fetchUpdatedPackages,
  generateReleaseNotes,
} from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);
  const updatedPackages = fetchUpdatedPackages(options);
  const categorizedLatestVersions = fetchCategorizedLatestVersions(options);
  generateReleaseNotes(options, updatedPackages, categorizedLatestVersions);
}
