[![This project uses GitHub Actions for continuous integration.](https://github.com/Ajanth/codemod-generate-release-notes/actions/workflows/ci.yml/badge.svg)](https://github.com/Ajanth/codemod-generate-release-notes/actions/workflows/ci.yml)

# codemod-generate-release-notes

*A codemod to generate a consolidated RELEASE_NOTES.md file by analyzing updated packages and their versions in a monorepo.*

## Why use it?

When you have a monorepo with multiple packages updated in every release, it can be difficult to create release notes manually by going over the package.json/changelog files.

This codemod scans for updated `package.json` files, categorizes packages by their folder structure, and generates a `RELEASE_NOTES.md` file with updated packages and their latest versions.

## Usage

At the workspace root, install `codemod-generate-release-notes` as a development dependency.

Then, run the codemod after you create a tag commit on the main branch but before you release the tag in github.

### Optional Arguments

- `--root <path>`:
    
    Specifies the root directory of the project where the codemod should run.
    
- `--packagesPath <path>`:
    
    Specifies the relative path to the packages directory within the project. This allows the codemod to locate package JSON files correctly in various repository structures and categorize them
    

```sh
npx codemod-generate-release-notes --root <path/to/your/project> --packagesPath <relative/path/to/packages-folder>
```

### Limitations

The codemod is designed to cover typical cases in monorepo setups using conventional package structures. It might not handle very custom or unconventional setups without adjustments.

To better meet your needs, consider cloning the repo and running the codemod locally for customization:

```sh
cd <path/to/cloned/repo>

# Compile TypeScript
pnpm build

# Run codemod
./dist/bin/codemod-generate-release-notes.js --root <path/to/your/project>
```


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
