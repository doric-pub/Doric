#!/usr/bin/env node

import commander from "commander"
import { build, clean } from "./actions";
import create from "./create"
import dev from "./dev"
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
    .action(async function () {
        await dev()
    })
commander
    .command('build')
    .action(async function () {
        await build();
    })
commander
    .command('clean')
    .action(async function () {
        await clean();
    })
commander.parse(process.argv)
