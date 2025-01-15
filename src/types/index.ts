export type CodemodOptions = {
  packagesPath: string;
  projectRoot: string;
};

export type PackageNameVersionEntry = {
  name: string;
  version: string;
};

export type VersionNameCategory = {
  category: string;
  name: string | undefined;
  version: string | undefined;
};

export type Options = CodemodOptions;
