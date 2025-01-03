type CodemodOptions = {
  outputPath: string;
  projectRoot: string;
};

/**
 * Interface for Changeset entries
 */
export type ChangesetEntry = {
  packageName: string;
  prNumbers: string[];
  version: string;
};

export type Options = CodemodOptions;
