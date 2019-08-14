#ifndef SRC_NODE_MESSAGING_H_
#define SRC_NODE_MESSAGING_H_

#if defined(NODE_WANT_INTERNALS) && NODE_WANT_INTERNALS

#include "env.h"
#include "node_mutex.h"
#include "sharedarraybuffer_metadata.h"
#include <list>

namespace node{
namespace worker{

    class MessagePortData;
    class MessagePort;

    //单个通信 message
    class Message:public MemoryRetainer{
        public:


        explicit Message(MallocedBuffer<char>&&payload = MallocedBuffer<char>())

        Message(Message&&other) = default
        Message&operator=(Message &&other) = default
        Message& operator=(const Message&)=delete
        Message(const Message&)=delete

        bool IsCloseMessage() const

        v8::MaybeLocal<v8::Value> Deserialize(Environment* env,v8::Local<v8::Context> context)

        v8::Maybe<bool> Serialize(Environment* env,
                            v8::Local<v8::Context> context,
                            v8::Local<v8::Value> input,
                            v8::Local<v8::Value> transfer_list,
                            v8::Local<v8::Object> source_port =
                                v8::Local<v8::Object>());

        void AddSharedArrayBuffer(const SharedArrayBufferMetadataReference& ref)

        void AddMessagePort(std::unique_ptr<MessagePortData>&& data)

        uint32_t AddWASMModule(v8::WasmModuleObject::TransferrableModule&& mod)
        
        const std::vector<std::unique_prt<MessagePortData>>& message_ports() const{
            return message_ports_
        }

        void MemoryInfo(MemoryTracker* tracker) const override

        SET_MEMORY_INFO_NAME(Message)
        SET_SELF_SIZE(Message)

        private:
            MallocedBuffer<char> main_message_buf_
            std::vector<MallocedBuffer<char>> array_buffer_contents_
            std::vector<SharedArrayBufferMetadataReference> shared_array_buffers_
            std::vector<std::unique_ptr<MessagePortData>> message_ports_
            std::<v8::WasmModuleObject::TransferrableModule> wasm_modules_

        friend class MessagePort
    }
}
}