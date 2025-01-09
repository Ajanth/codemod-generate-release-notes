import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, loadFixture, test } from '@codemod-utils/tests';

import { generateReleaseNotes } from '../../../src/steps/generate-release-notes.js';
import { PackageNameVersionEntry } from '../../../src/types/index.js';
import { options } from '../../helpers/shared-test-setups/monorepo-type-1.js';

const inputProject = {
  'dummy-file.txt': 'This is a dummy file to simulate the project structure.',
};

test('steps | generate-release-notes | should generate release notes for updated packages', function () {
  loadFixture(inputProject, options);

  const updatedPackages: PackageNameVersionEntry[] = [
    { name: 'package-a', version: '1.0.0' },
    { name: 'package-c', version: '2.3.4' },
  ];

  const categorizedLatestVersions: Record<string, PackageNameVersionEntry[]> = {
    'category-1': [
      { name: 'package-a', version: '1.0.0' },
      { name: 'package-b', version: '1.2.0' },
    ],
    'category-2': [{ name: 'package-c', version: '2.3.4' }],
  };

  generateReleaseNotes(options, updatedPackages, categorizedLatestVersions);

  const releaseNotesPath = join(options.projectRoot, 'RELEASE_NOTES.md');
  const generatedContent = readFileSync(releaseNotesPath, 'utf8');

  const expectedContent = `## Updated packages

- package-a 
- package-c 

## Latest versions

### category-1

| Name | Version |
|--|:--:|
| package-a | 1.0.0 |
| package-b | 1.2.0 |

### category-2

| Name | Version |
|--|:--:|
| package-c | 2.3.4 |

`;

  assert.strictEqual(
    generatedContent,
    expectedContent,
    'The generated RELEASE_NOTES.md content should match the expected output',
  );
});

test('steps | generate-release-notes | should handle empty inputs gracefully', function () {
  loadFixture(inputProject, options);

  const updatedPackages: PackageNameVersionEntry[] = [];
  const categorizedLatestVersions: Record<string, PackageNameVersionEntry[]> =
    {};

  generateReleaseNotes(options, updatedPackages, categorizedLatestVersions);

  const releaseNotesPath = join(options.projectRoot, 'RELEASE_NOTES.md');
  const generatedContent = readFileSync(releaseNotesPath, 'utf8');

  console.log(`generatedContent: ${generatedContent}`);

  const expectedContent = `## Updated packages


## Latest versions

`;

  assert.strictEqual(
    generatedContent,
    expectedContent,
    'The generated RELEASE_NOTES.md content should handle empty inputs gracefully',
  );
});
