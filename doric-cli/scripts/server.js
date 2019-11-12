const ws = require('nodejs-websocket')

const createServer = () => {
    let server = ws.createServer(connection => {
        console.log('connected', connection.key)
        connection.on('text', function (result) {
            console.log('text', result)
            let resultObject = JSON.parse(result)
            switch(resultObject.cmd) {
                case 'debug':
                    let contextId = resultObject.contextId
                    
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