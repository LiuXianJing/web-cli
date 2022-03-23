#!/usr/bin/env node

console.log('enter index.js...')

const program = require('commander');
program.version(require('../package').version, '-v, --version');

program
    .command('init')
    .description('初始化模板...')
    .action((...args) => {
        require('../init.js')(...args);
    });

program.command('help')
  .description('查看帮助')
  .alias('h')
  .action(() => program.help());

program.parse(process.argv);