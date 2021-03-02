import { ChildProcess, spawn, SpawnOptionsWithoutStdio } from "child_process";
import "colors";
const debug = false
export namespace Shell {
  export async function execWithPipe(
    cmd: {
      command: string;
      args?: ReadonlyArray<string>;
      options?: SpawnOptionsWithoutStdio & {
        silence?: boolean; //不打印耗时,默认为false
        verbose?: boolean; //打印输出内容,默认为true
      };
    },
    pipedCmd: {
      command: string;
      args?: ReadonlyArray<string>;
      options?: SpawnOptionsWithoutStdio;
    }
  ) {
    const { command, args, options } = cmd;
    if (!options?.silence) {
      debug && console.log(`>>>>>>>>${command} ${args ? args.join(" ") : ""}`);
    }
    const now = new Date().getTime();
    return new Promise((resolve, reject) => {
      const cmd = spawn(command, args, options);
      const piped = spawn(pipedCmd.command, pipedCmd.args, pipedCmd.options);
      cmd.stdout.pipe(piped.stdin);
      cmd.stderr.pipe(piped.stdin);
      piped.stdout.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.log(data.toString());
        }
      });

      piped.stderr.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.error(data.toString());
        }
      });

      cmd.on("close", (code) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          if (code !== 0) {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`.red);
          } else {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`);
          }
        }
        resolve(code);
      });
      cmd.on("error", (err) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          debug && console.log(`error:${err} 耗时 ${cost}ms <<<<<<<<`);
        }
        reject(err);
      });
    });
  }

  export async function execProcess(
    command: string,
    args?: ReadonlyArray<string>,
    options?: SpawnOptionsWithoutStdio & {
      silence?: boolean; //不打印耗时,默认为false
      verbose?: boolean; //打印输出内容,默认为true
      consoleHandler?: (info: string) => void; //命令行输出内容处理
    }
  ): Promise<ChildProcess> {
    if (!options?.silence) {
      debug && console.log(`>>>>>>>>${command} ${args ? args.join(" ") : ""}`);
    }
    const now = new Date().getTime();
    return new Promise((resolve) => {
      const cmd = spawn(command, args, options);
      cmd.stdout.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.log(data.toString());
        }
        if (options?.consoleHandler) {
          options.consoleHandler(data.toString());
        }
      });

      cmd.stderr.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.error(data.toString());
        }
        if (options?.consoleHandler) {
          options.consoleHandler(data.toString());
        }
      });

      cmd.on("close", (code) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          if (code !== 0) {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`.red);
          } else {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`);
          }
        }
      });
      cmd.on("error", (err) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          debug && console.log(`error:${err} 耗时 ${cost}ms <<<<<<<<`);
        }
      });
      resolve(cmd);
    });
  }


  export async function exec(
    command: string,
    args?: ReadonlyArray<string>,
    options?: SpawnOptionsWithoutStdio & {
      silence?: boolean; //不打印耗时,默认为false
      verbose?: boolean; //打印输出内容,默认为true
      consoleHandler?: (info: string) => void; //命令行输出内容处理
    }
  ) {
    if (!options?.silence) {
      debug && console.log(`>>>>>>>>${command} ${args ? args.join(" ") : ""}`);
    }
    const now = new Date().getTime();
    return new Promise((resolve, reject) => {
      const cmd = spawn(command, args, options);
      cmd.stdout.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.log(data.toString());
        }
        if (options?.consoleHandler) {
          options.consoleHandler(data.toString());
        }
      });

      cmd.stderr.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.error(data.toString());
        }
        if (options?.consoleHandler) {
          options.consoleHandler(data.toString());
        }
      });

      cmd.on("close", (code) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          if (code !== 0) {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`.red);
          } else {
            debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`);
          }
        }
        resolve(code);
      });
      cmd.on("error", (err) => {
        if (!options?.silence) {
          const cost = new Date().getTime() - now;
          debug && console.log(`error:${err} 耗时 ${cost}ms <<<<<<<<`);
        }
        reject(err);
      });
    });
  }
  export async function execOut(
    command: string,
    args?: ReadonlyArray<string>,
    options?: SpawnOptionsWithoutStdio & {
      silence?: boolean; //不打印耗时,默认为false
      verbose?: boolean; //打印输出内容,默认为true
    }
  ): Promise<string> {
    debug && console.log(`>>>>>>>>${command} ${args ? args.join(" ") : ""}`);
    const now = new Date().getTime();
    return new Promise((resolve, reject) => {
      const cmd = spawn(command, args, options);
      const result: string[] = [];
      cmd.stdout.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.log(data.toString());
        }
        result.push(data.toString());
      });

      cmd.stderr.on("data", (data) => {
        if (options?.verbose !== false) {
          debug && console.error(data.toString());
        }
        result.push(data.toString());
      });

      cmd.on("close", (code) => {
        const cost = new Date().getTime() - now;
        if (code !== 0) {
          debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`.red);
        } else {
          debug && console.log(`exitCode:${code} 耗时 ${cost}ms <<<<<<<<`);
        }
        resolve(result.join("\n"));
      });
      cmd.on("error", (err) => {
        const cost = new Date().getTime() - now;
        debug && console.log(`error:${err} 耗时 ${cost}ms <<<<<<<<`.red);
        reject(err);
      });
    });
  }
}
