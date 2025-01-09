import { assert, loadFixture, test } from '@codemod-utils/tests';

import { fetchCategorizedLatestVersions } from '../../../src/steps/fetch-categorized-latest-versions.js';
import { PackageNameVersionEntry } from '../../../src/types/index.js';
import { inputProject } from '../../fixtures/monorepo-type-1/index.js';
import { options } from '../../helpers/shared-test-setups/monorepo-type-1.js';

test('steps | fetch-categorized-latest-versions | should group versions by category', function () {
  loadFixture(inputProject, options);

  const categorizedLatestVersions: Record<string, PackageNameVersionEntry[]> =
    fetchCategorizedLatestVersions(options);

  const expected: Record<string, PackageNameVersionEntry[]> = {
    'category-1': [
      { name: 'a', version: '0.3.1' },
      { name: 'b', version: '0.4.0' },
      { name: 'c', version: '0.2.5' },
    ],
    'category-2': [
      { name: 'd', version: '0.3.4' },
      { name: 'e', version: '0.2.0' },
    ],
    uncategorized: [{ name: 'f', version: '2.3.4' }],
  };

  assert.deepStrictEqual(
    categorizedLatestVersions,
    expected,
    'fetchCategorizedLatestVersions should return categorized packages correctly',
  );
});
