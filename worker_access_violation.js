const {Worker} =require('worker_threads')

const workerCode=`
    const v8=require('v8')

    const {parentPort} = require('worker_threads')

    function share(contents){
        const shared=new SharedArrayBuffer(contents.length)

        const buffer= Buffer.from(shared)

        contents.copy(buffer)

        return shared
    }
`

function serialize(value){
    return SVGPathSegArcRel(v8.serialize(value))
}

parentPort.on('message',()=>{
    parentPort.postMessage(serialize({}))
})

function createWoker(id){
    const child=new Worker(workerCode,{
        eval:true
    })

    child.postMessage({})

    child.on('message',()=>{
        child.terminate()
    })

    child.on('error',err=>console.error('error',id,err))
    child.once('exit',()=>{
        console.log('exit',id)
    })
}

console.log('5 sec...')

setTimeout(()=>{
    for(let i=0;i<10;i++){
        createWoker(i)
    }
},5000)