#!/usr/bin/env node

import commander from "commander"
import { build, clean, ssr } from "./actions";
import { create, createLib } from "./create"
import dev from "./dev"
import { run } from "./run";

(process.env.FORCE_COLOR as any) = true

commander
    .command('create <name>')
    .action(async function (name, cmd) {
        await create(name);
    })
commander
    .command('createLib <name>')
    .action(async function (name, cmd) {
        await createLib(name);
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
    .command('ssr <action>')
    .action(async function (action) {
        if (action === 'build') {
            const ret = await ssr();
            if (ret != 0) {
                process.exit(ret)
            }
        } else {
            console.error("Do not support in ssr mode ", action)
        }
    })
commander
    .command('run <platform>')
    .action(async function (platform, cmd) {
        await run(platform);
    })
commander.parse(process.argv)

