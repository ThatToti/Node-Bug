const { Worker,isMainThread,parentPort,workerData,threadId,MessageChannel,MessagePort} = require('worker_threads')

function mainThread(){
    // const worker = new Worker(__filename,{workerData:0})
    const worker1=new Worker(__filename)
    const worker2=new Worker(__filename)

    const subChannel=new MessageChannel()
    worker1.postMessage({hereIsYourPort:subChannel.port1},[subChannel.port1])
    worker2.postMessage({hereIsYourPort:subChannel.port2},[subChannel.port2])

    // worker.on('exit', code => { console.log(`main: worker stopped with exit code ${code}`); });

    // worker.on('message', msg => {
    //     console.log(`main: receive ${msg}`);
    //     worker.postMessage(msg + 1);
    // });
}

function workerThread(){
    // console.log(`worker: threadId ${threadId} start with ${__filename}`)
    // console.log(`worker:workerData ${workerData}`)

    // parentPort.on('message',msg=>{
    //     console.log(`worker:receive ${msg}`)
    //     if(msg===5){process.exit()}
    //     parentPort.postMessage(msg)
    // })
    // parentPort.postMessage(workerData)
    parentPort.once('message',value=>{
        value.hereIsYourPort.postMessage('hello')
        value.hereIsYourPort.on('message',msg=>{
            console.log(`thread ${threadId}: receive ${msg}`)
        })
    })
}

if(isMainThread){
    mainThread()
}else{
    workerThread()
}

// if(isMainThread){
//     console.log(__filename)
//     module.exports=async function parseJSAsync(script){
//         return new Promise((res,rej)=>{
//             const worker = new Worker(__filename,{
//                 workerData:script
//             })

//             worker.on('message',res)
//             worker.on('error',rej)
//             worker.on('exit',(code)=>{
//                 if(code!==0){
//                     rej(new Error(`Worker stopped with exit code ${code}`))
//                 }
//             })
//         })
//     }
// }else{
//     console.log(__filename)
//     const parse = (script)=>{console.log(script)}
//     const script= workerData
//     parentPort.postMessage(parse(script))
// }