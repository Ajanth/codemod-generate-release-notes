#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'ember-codemod-generate-release-notes';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    alias: 'r',
    describe: 'Root directory of the project (application-client)',
    type: 'string',
    default: process.cwd(),
  })
  .option('output', {
    alias: 'o',
    describe: 'Output path for RELEASE_NOTES.md',
    type: 'string',
    default: 'RELEASE_NOTES.md',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'],
  outputPath: argv['output'],
};

console.log('Project Root:', codemodOptions.projectRoot);
console.log('Output Path:', codemodOptions.outputPath);

runCodemod(codemodOptions);
