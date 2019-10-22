const WebSocket = require('ws')
const vm = require("vm")

const wss = new WebSocket.Server({ port: 2080 })
var sandbox = {}
var context = vm.createContext(sandbox)

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let messageObject = JSON.parse(message)
    switch(messageObject.cmd) {
      case "loadJS":
        let result = vm.runInContext(messageObject.script, sandbox)
        ws.send(JSON.stringify({cmd: 'loadJS', result: String(result)}))
        break
      case "evaluateJS":
        break
    }
  })
})