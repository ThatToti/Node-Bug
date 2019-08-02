'use strict'

const {
    isMainThread,//是否是主线程
    SHARE_ENV,//dont know
    threadId,// 线程 id
    Worker// 子线程的构造函数
} =require('internal/worker')

const {
    MessagePort,//通信接口
    MessageChannel,//通信通道
    moveMessagePortToContext,//dont know
    receiveMessageOnPort//dont know
}=require('internal/worker/io')

module.exports={
    isMainThread,
    MessagePort,
    MessageChannel,
    moveMessagePortToContext,
    receiveMessageOnPort,
    threadId,
    SHARE_ENV,
    Worker,
    parentPort:null,//导出时候才来设置
    workerData:null//导出才有的对象
}