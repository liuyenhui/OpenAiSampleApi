import OpenAI from 'openai'


const client = new OpenAI({
    baseURL:process.env.OPENAI_BASE_URL
});

//---------------------------------------
// 1.创建助手 assistant
//---------------------------------------
const assistant = await client.beta.assistants.create({
    name:"数学老师",
    instructions:"你是专业的数学老师,能够分析数学方面的问题,回答问题并给出分析过程.",
    // 1.tools的产数是数组,code_interpreterin 代码解释器,可进行精确计算,retrieval文件分析,function函数调用
    tools:[{"type":"code_interpreter"}],
    // file_ids 参数是数组 feild_id组成. 

    // model 应用的模型 建议最新模型
    model:"gpt-4-1106-preview"
})
console.log(`assistant id:${assistant.id}`)

//---------------------------------------
// 2.创建线程 thread
//---------------------------------------
const thread =await client.beta.threads.create()
console.log(`thread id:${thread.id}`)


// ---------------------------------------
// 3.创建消息 messages
// ---------------------------------------

let message =await client.beta.threads.messages.create(
    thread.id,
    {
        role:"user",
        content:"3x+14 = 29 问x的值是多少"
    }
)
console.log(`message id:${message.id}`)
//---------------------------------------
// 4.创建运行 run
//---------------------------------------
let run =await client.beta.threads.runs.create(
    thread.id,
    {
        assistant_id:assistant.id,
    }
)
console.log(`run id:${run.id}`)
// 定义延时函数
const delay = (time)=>{new Promise(resolve => setTimeout(resolve, time))};
// 等待线程完成
const  wait_on_run =async (run,thread) =>{
        
        while(run.status == "queued" || run.status == "in_progress"){
            run = await client.beta.threads.runs.retrieve(thread.id,run.id)
            delay(500);
        }
        return run
    }

run = await wait_on_run(run,thread)
console.log(`run id: ${run.id} status: ${run.status}`)

//---------------------------------------
// 4.显示消息 
//---------------------------------------

let messages =await client.beta.threads.messages.list(thread.id)


console.log(`-----messages total ${messages.data.length}-------`)
messages.data.reverse().forEach(message=>{
    console.log(`${message.role}:${message.content[0].text.value}`)
})
  


//---------------------------------------
// 5.创建新信息
//---------------------------------------

 message =await client.beta.threads.messages.create(
    thread.id,
    {
        role:"user",
        content:"3(x^2)+5=17 问x的值是多少?"
    }
)

//---------------------------------------
// 6.再次运行线程
//---------------------------------------
run = await client.beta.threads.runs.create(
    thread.id,
    {
        assistant_id:assistant.id,
    }
)
run = await wait_on_run(run,thread)
console.log(`run id: ${run.id} status: ${run.status}`)

//---------------------------------------
// 7.输出所有消息
//---------------------------------------

messages = await client.beta.threads.messages.list(thread.id)
messages.data.reverse().forEach(message=>{
    console.log(`${message.role}:${message.content[0].text.value}`)
})
console.log("Done")