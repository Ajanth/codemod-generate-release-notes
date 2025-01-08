import type { CodemodOptions, Options } from '../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { packagesPath, projectRoot } = codemodOptions;

  return {
    packagesPath,
    projectRoot,
  };
}
