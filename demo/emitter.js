const EventEmitter = require('events')

const listener = new EventEmitter()

listener.on('demo',()=>{
    console.log('demo is trigger')
})

listener.emit('demo')