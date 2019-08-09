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