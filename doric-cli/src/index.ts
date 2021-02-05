#!/usr/bin/env node

import commander from "commander"
import create from "./create"

commander
    .command('create <name>')
    .action(async function (name, cmd) {
        await create(name);
    })
commander
    .command('new <name>')
    .action(async function (name, cmd) {
        await create(name);
    })
commander
    .command('dev')
    .action(function () {
    })
commander
    .command('build')
    .action(function () {
    })
commander
    .command('clean')
    .action(function () {
    })
commander.parse(process.argv)
