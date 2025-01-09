#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'codemod-generate-release-notes';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    alias: 'r',
    describe: 'Root directory of the project (application-client)',
    type: 'string',
    default: process.cwd(),
  })
  .option('packagesPath', {
    alias: 'o',
    describe: 'path where child packages live, relative to the root path',
    type: 'string',
    default: 'packages',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

const codemodOptions: CodemodOptions = {
  packagesPath: argv['packagesPath'],
  projectRoot: argv['root'],
};

runCodemod(codemodOptions);
