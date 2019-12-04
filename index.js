#!/usr/bin/env node

var program = require('commander');

program
    .command('create <name>')
    .option('-n, --native', 'Native')
    .action(function (name, cmd) {
        console.log('create ' + name + (cmd.native ? ' native' : 'js'))
        require('./scripts/init')(name)
    })
program
    .command('dev')
    .action(function () {
        require('./scripts/watcher')
    })
program
    .command('build')
    .action(function () {
        require('./scripts/command').build()
    })
program
    .command('clean')
    .action(function () {
        require('./scripts/command').clean()
    })
program.parse(process.argv)
