import { assert, loadFixture, test } from '@codemod-utils/tests';

import { fetchUpdatedPackages } from '../../../src/steps/fetch-updated-packages.js';
import { PackageNameVersionEntry } from '../../../src/types/index.js';
import { inputProject } from '../../fixtures/monorepo-type-1/index.js';
import { options } from '../../helpers/shared-test-setups/monorepo-type-1.js';

test('steps | fetch-updated-packages', function () {
  loadFixture(inputProject, options);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockPackageJsonFilesSinceLastTag = (_projectRoot: string): string[] => {
    return [
      'packages/category-1/a/package.json',
      'packages/category-2/d/package.json',
      'package.json',
    ];
  };

  const updatedPackages: PackageNameVersionEntry[] = fetchUpdatedPackages(
    options,
    mockPackageJsonFilesSinceLastTag,
  );

  const expected: PackageNameVersionEntry[] = [
    {
      name: 'a',
      version: '0.3.1',
    },
    {
      name: 'd',
      version: '0.3.4',
    },
  ];

  assert.deepStrictEqual(
    updatedPackages,
    expected,
    'fetchUpdatedPackages should return updated packages correctly',
  );
});
