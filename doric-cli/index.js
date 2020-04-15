#!/usr/bin/env node

var program = require('commander');

program
    .command('create <name>')
    .action(function (name, cmd) {
        console.log('create ' + name + (cmd.native ? ' native' : 'js'))
        require('./scripts/init')(name)
    })
program
    .command('new <name>')
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
program
    .command('kotlin <name>')
    .action(function (name, cmd) {
        console.log('create kotlin project:' + name + (cmd.native ? ' native' : 'js'))
        require('./scripts/init')(name, true)
    })
program.parse(process.argv)
