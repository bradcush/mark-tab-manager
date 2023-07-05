import { Command } from 'commander';
import { generate } from './generate';

// We only intend to run the generate
// script from the command-line
const program = new Command();
program.option('-b, --browser <browser>', 'Browser engine, chromium');
program.parse(process.argv);
const options = program.opts();
generate(options);
