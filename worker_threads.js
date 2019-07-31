const { Worker,isMainThread,parentPort,workerData,threadId} = require('worker_threads')

function mainThread(){
    const worker = new Worker(__filename,{workerData:0})

    worker.on('exit', code => { console.log(`main: worker stopped with exit code ${code}`); });

    worker.on('message', msg => {
        console.log(`main: receive ${msg}`);
        worker.postMessage(msg + 1);
    });
}

function workerThread(){
    console.log(`worker: threadId ${threadId} start with ${__filename}`)
    console.log(`worker:workerData ${workerData}`)

    parentPort.on('message',msg=>{
        console.log(`worker:receive ${msg}`)
        if(msg===5){process.exit()}
        parentPort.postMessage(msg)
    })
    parentPort.postMessage(workerData)
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