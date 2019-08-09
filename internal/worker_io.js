const {Object}=primodials

const {
    handle_onclose:handleOnCloseSymbol,
    oninit:onInitSymbol,
    on_message_symbol:noMessagesSymbol
} = internalBinding('symbols')

const {
    MessagePort,
    MessageChannel,
    drainMessagePort,
    moveMessagePortToContext,
    receiveMessageOnPort:receiveMessageOnPort_,
    stopMessagePort
} = internalBinding('messaging')

const {
    threadId,
    getEnvMessagePort
} = internalBinding('worker')

const {Readable,Writable} = require('stream')
const EventEmitter = require('events')
const {inspect} = require('internal/util/inspect')
const debug = require('internal/util/debuglog').debuglog('worker');

const kIncrementsPortRef = Symbol('kIncrementsPortRef');
const kName = Symbol('kName');
const kOnMessageListener = Symbol('kOnMessageListener');
const kPort = Symbol('kPort');
const kWaitingStreams = Symbol('kWaitingStreams');
const kWritableCallbacks = Symbol('kWritableCallbacks');
const kStartedReading = Symbol('kStartedReading');
const kStdioWantsMoreDataCallback = Symbol('kStdioWantsMoreDataCallback');

const messageTypes = {
    UP_AND_RUNNING: 'upAndRunning',
    COULD_NOT_SERIALIZE_ERROR: 'couldNotSerializeError',
    ERROR_MESSAGE: 'errorMessage',
    STDIO_PAYLOAD: 'stdioPayload',
    STDIO_WANTS_MORE_DATA: 'stdioWantsMoreData',
    LOAD_SCRIPT: 'loadScript'
  };

  class ReadableWorkerStdio extends Readable{
      constructor(port,name){
          super()
          this[kPort]=port
          this[kName]=name
          this[kIncrementsPortRef]=true
          this[kStartedReading]=false

          //有 on 方法，说明 readable 继承自 emitter
          this.on('end',()=>{
            if(this[kStartedReading]&&this[kIncrementsPortRef]){
                if(--this[kPort][kWaitingStreams]===0){
                    this[kPort].unref()
                }
            }
          })
      }

      _read(){
          if(!this[kStartedReading]&&this[kIncrementsPortRef]){
              this[kStartedReading]=true
              if(this[kPort][kWaitingStreams]++===0){
                  this[kPort]=ref()
              }
          }

          this[kPort].postMessage({
              type:messageTypes.STDIO_WANTS_MORE_DATA,
              stream:this[kName]
            })
      }
  }

  class WritableWorkerStdio extends Writable{
      constructor(port,name){
          super({decodeString:false})
          this[kPort]=port
          this[kName]=name
          this[kWritableCallbacks]=[]
      }

      _write(chunk,encoding,cb){
          this[kPort].postMessage({
              type:messageTypes.STDIO_PAYLOAD,
              stream:this[kName],
              chunk,
              encoding
          })

          this[kWritableCallbacks].push(cb)
          if(this[kPort][kWaitingStreams]++===0){
              this[kPort].ref()
          }
      }

      _final(cb){
          this[kPort].postMessage({
              type:messageTypes.STDIO_PAYLOAD,
              stream:this[kName],
              chunk:null
          })
          cb()
      }

      //无法被继承
      [kStdioWantsMoreDataCallback](){
          const cbs = this[kWritableCallbacks]
          this[kWritableCallbacks]=[]
          for(const cb of cbs){
              cb()
          }
          if((this[kPort][kWaitingStreams]-=cbs.length)===0){
              this[kPort].unref()
          }
      }
  }

  //输出 io 操作
  function createWorkerStdio(){
      const port = getEnvMessagePort()
      port[kWaitingStreams]=0
      return{
          stdin: new ReadableWorkerStdio(port,'stdin'),
          stdout: new WritableWorkerStdio(port,'stdout'),
          stderr: new WritableWorkerStdio(port,'stderr')
      }
  }

  function receiveMessageOnPort(port){
      const message = receiveMessageOnPort_(port)
      if(message===noMessagesSymbol) return undefined
      return {message}
  }

  module.exports={
      drainMessagePort,
      messageTypes,
      kPort,
      kIncrementsPortRef,
      kWaitingStreams,
      kStdioWantsMoreDataCallback,
      moveMessagePortToContext,
      MessagePort,
      MessageChannel,
      receiveMessageOnPort,
      setupPortReferencing,
      ReadableWorkerStdio,
      WritableWorkerStdio,
      createWorkerStdio
  }