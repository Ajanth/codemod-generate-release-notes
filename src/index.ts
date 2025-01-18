import { getUpdateScript } from './steps/get-update-script.js';
import {
  createOptions,
  createReleaseNotes,
  getLatestVersions,
  getUpdatedPackages,
} from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  const updatedPackages = getUpdatedPackages(options);
  const updateScript = getUpdateScript(updatedPackages);
  const latestVersions = getLatestVersions(options);

  createReleaseNotes(updatedPackages, updateScript, latestVersions, options);
}
