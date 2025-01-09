import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('monorepo-type-1/input');
const outputProject = convertFixtureToJson('monorepo-type-1/output');

export { inputProject, outputProject };
