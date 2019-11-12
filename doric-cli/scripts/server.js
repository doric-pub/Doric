const ws = require('nodejs-websocket')
const { exec, spawn } = require('child_process')

const createServer = () => {
    let server = ws.createServer(connection => {
        console.log('connected', connection.key)
        connection.on('text', function (result) {
            console.log('text', result)
            let resultObject = JSON.parse(result)
            switch(resultObject.cmd) {
                case 'DEBUG':
                    let contextId = resultObject.data.contextId
                    let projectHome = resultObject.data.projectHome
                    console.log(projectHome)
                    {
                        const code = spawn('code', [projectHome, projectHome + "/src/Snake.ts"])
                        code.stdout.on('data', (data) => {
                            console.log(`stdout: ${data}`)
                        })
                        
                        code.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`)
                        })
                          
                        code.on('close', (code) => {
                            console.log(`child process exited with code ${code}`)
                        })
                    }
                    {
                        setTimeout(() => {
                            exec('osascript -e \'tell application "System Events"\ntell application "Visual Studio Code" to activate\nkey code 96\nend tell\'', (err, stdout, stderr) => {
                                if (err) {
                                  // node couldn't execute the command
                                  console.log(`stdout: ${err}`)
                                  return;
                                }
                              
                                // the *entire* stdout and stderr (buffered)
                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                            })
                        }, 4000)
                    }
                    
                    break
            }
        })
        connection.on('connect', function (code) {
            console.log('connect', code)
        })
        connection.on('close', function (code) {
            console.log('close', code)
        })
        connection.on('error', function (code) {
            console.log('error', code)
        })
    })
    return server
}

module.exports = createServer()