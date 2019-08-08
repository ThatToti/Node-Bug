const EventEmitter = require('events')

class Worker extends EventEmitter{
    constructor(){
        super()
    }

    postMessage(msg){
        this.emit('message',msg)
    }
}

const worker = new Worker()

worker.on('message',(msg)=>{console.log(msg)})
worker.postMessage('触发了 msg')

// const listener = new EventEmitter()

// listener.on('demo',()=>{
//     console.log('demo is trigger')
// })

// listener.emit('demo')