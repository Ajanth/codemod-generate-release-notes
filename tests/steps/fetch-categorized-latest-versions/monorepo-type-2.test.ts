import { assert, loadFixture, test } from '@codemod-utils/tests';

import { fetchCategorizedLatestVersions } from '../../../src/steps/fetch-categorized-latest-versions.js';
import { PackageNameVersionEntry } from '../../../src/types/index.js';
import { inputProject } from '../../fixtures/monorepo-type-2/index.js';
import { options } from '../../helpers/shared-test-setups/monorepo-type-2.js';

test('steps | fetch-categorized-latest-versions | should exclude private packages', function () {
  loadFixture(inputProject, options);

  const categorizedLatestVersions: Record<string, PackageNameVersionEntry[]> =
    fetchCategorizedLatestVersions(options);

  const expected: Record<string, PackageNameVersionEntry[]> = {
    'category-1': [{ name: 'c', version: '0.2.5' }],
    'category-2': [{ name: 'e', version: '0.2.0' }],
    uncategorized: [{ name: 'f', version: '2.3.4' }],
  };

  assert.deepStrictEqual(
    categorizedLatestVersions,
    expected,
    'Private packages should not be included in the output',
  );
});
