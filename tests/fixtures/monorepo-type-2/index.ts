import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('monorepo-type-2/input');
const outputProject = convertFixtureToJson('monorepo-type-2/output');

export { inputProject, outputProject };
