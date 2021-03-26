#!/usr/bin/env node

import commander from "commander"
import { build, clean } from "./actions";
import create from "./create"
import dev from "./dev"
import { run } from "./run";

(process.env.FORCE_COLOR as any) = true

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
        const ret = await build();
        if (ret != 0) {
            process.exit(ret)
        }
    })
commander
    .command('clean')
    .action(async function () {
        await clean();
    })

commander
    .command('run <platform>')
    .action(async function (platform, cmd) {
        await run(platform);
    })
commander.parse(process.argv)

