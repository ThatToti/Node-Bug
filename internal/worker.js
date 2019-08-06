
const { Object }=primordials

const EventEmitter = require('events')
const assert = require('internal/assert')
const path = require('path')
const {parhToFileURL}=require('url')

const {
    ERR_WORKER_PATH,
    ERR_WORKER_UNSERIALIZABLE_ERROR,
    ERR_WORKER_UNSUPPORTED_EXTENSION,
    ERR_WORKER_INVALID_EXEC_ARGV,
    ERR_INVALID_ARG_TYPE,  
} = require('internal/errors').codes
const { deserializeError } = require('internal/error-serdes');

const {valiadateString}=require('internal/validators')
const { getOptionValue } = require('internal/options');

const workerIo = require('internal/worker/io')

const {
    drainMessagePort,
    MessageChannel,
    messageTypes,
    kPort,
    kIncrementsPortRef,
    kWaitingStreams,
    kStdioWantsMoreDataCallback,
    setupPortReferencing,
    ReadableWorkerStdio,
    WritableWorkerStdio
} = workerIo

const {
    ownsProcessState,
    isMainThread,
    threadId,
    Worker:WorkerImpl
}=internalBinding('worker')

const kHandle = Symbol('kHandle');
const kPublicPort = Symbol('kPublicPort');
const kDispose = Symbol('kDispose');
const kOnExit = Symbol('kOnExit');
const kOnMessage = Symbol('kOnMessage');
const kOnCouldNotSerializeErr = Symbol('kOnCouldNotSerializeErr');
const kOnErrorMessage = Symbol('kOnErrorMessage');
const kParentSideStdio = Symbol('kParentSideStdio');

const SHARE_ENV = Symbol.for('nodejs.worker_threads.SHARE_ENV');

const debug = require('internal/util/debuglog').debuglog('worker');

//curent work dir
let cwdCounter

class Worker extends EventEmitter{
    constructor(filename,options={}){
        super()
        debug(`[${threadId}] create new worker`,filename,options)
        valiadateString(filename,'filename')

        if(options.execArgv&&!Array.isArray(options.execArgv)){
            throw new ERR_INVALID_ARG_TYPE('options.execArgv','array',options.execArgv)
        }

        if(!options.eval){
            //判断是否是绝对路径
            if(!path.isAbsolute(filename)&&!/^\.\.?[\\/]/.test(filename)){}
        }
    }
}


