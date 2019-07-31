const { Worker,isMainThread,parentPort,workerData} = require('worker_threads')

if(isMainThread){
    console.log(__filename)
    module.exports=async function parseJSAsync(script){
        return new Promise((res,rej)=>{
            const worker = new Worker(__filename,{
                workerData:script
            })

            worker.on('message',res)
            worker.on('error',rej)
            worker.on('exit',(code)=>{
                if(code!==0){
                    rej(new Error(`Worker stopped with exit code ${code}`))
                }
            })
        })
    }
}else{
    console.log(__filename)
    const parse = (script)=>{console.log(script)}
    const script= workerData
    parentPort.postMessage(parse(script))
}