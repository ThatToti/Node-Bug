const {Worker ,isMainThread,parentPort,workerData}=require('worker_threads')

function mainThread(){
    console.log('this is main thread')

    let worker = new Worker(__filename)

    worker.on('message',msg=>{
        console.log(`first value is ${msg.val}`)
    })

    worker.on('error',console.error)

    worker.on('exit',code=>{
        if(code!=0) console.error(new Error())
    })

    setTimeout(()=>{
        console.log('send')
    },0)
}

function workerThread(){
    function random(min,max){
        return Math.random()*(max-min)+min
    }

    const sorter=requ
}

if(isMainThread){
    mainThread()
}else{
    workerThread()
}

