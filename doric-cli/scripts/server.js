const ws = require('nodejs-websocket')
const { exec, spawn } = require('child_process')

var clientConnection = null
var debuggerConnection = null

const createServer = () => {
    let server = ws.createServer(connection => {
        console.log('connected', connection.headers.host)

        if (connection.headers.host.startsWith("localhost")) {
            console.log("debugger " + connection.key + " attached to dev kit")
            debuggerConnection = connection

            clientConnection.sendText(JSON.stringify({
                cmd: 'SWITCH_TO_DEBUG'
            }), function() {

            })
        } else {
            console.log("client " + connection.key + " attached to dev kit")
        }

        connection.on('text', function (result) {
            console.log('text', result)
            let resultObject = JSON.parse(result)
            switch(resultObject.cmd) {
                case 'DEBUG':
                    clientConnection = connection

                    let contextId = resultObject.data.contextId
                    let projectHome = resultObject.data.projectHome
                    let source = resultObject.data.source
                    console.log(connection.key + " request debug, project home: " + projectHome)

                    spawn('code', [projectHome, projectHome + "/src/" + source])
                    setTimeout(() => {
                        exec('osascript -e \'tell application "System Events"\ntell application "Visual Studio Code" to activate\nkey code 96\nend tell\'', (err, stdout, stderr) => {
                            if (err) {
                              console.log(`stdout: ${err}`)
                            }
                        })
                    }, 3000)
                    
                    break
            }
        })
        connection.on('connect', function (code) {
            console.log('connect', code)
        })
        connection.on('close', function (code) {
            console.log('close: code = ' + code, connection.key)
        })
        connection.on('error', function (code) {
            console.log('error', code)
        })
    })
    return server
}

module.exports = createServer()