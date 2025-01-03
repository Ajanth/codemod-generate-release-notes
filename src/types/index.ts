export type CodemodOptions = {
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

export type LatestVersionEntry = {
  name: string;
  version: string;
};

export type VersionNameCategory = {
  category: string;
  name: string | undefined;
  version: string | undefined;
};

export type Options = CodemodOptions;
