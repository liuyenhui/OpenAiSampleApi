from openai import OpenAI
import time

client = OpenAI()

#---------------------------------------
# 1.创建助手 assistant
#---------------------------------------
assistant= client.beta.assistants.create(
    name="数学老师",
    instructions="你是专业的数学老师,能够分析数学方面的问题,回答问题并给出分析过程.",
    #1.tools的产数是数组,code_interpreterin 代码解释器,可进行精确计算,retrieval文件分析,function函数调用
    tools=[{"type":"code_interpreter"}],
    # file_ids 参数是数组 feild_id组成. 

    #model 应用的模型 建议最新模型
    model="gpt-4-1106-preview"
)
# 列出用户所有的助手
# client.beta.assistants.list()

print(f'assisent id:{assistant.id}')


#---------------------------------------
# 2.创建线程 thread
#---------------------------------------
thread = client.beta.threads.create()
print(f'thread id:{thread.id}')

#---------------------------------------
# 3.创建消息 messages
#---------------------------------------
message = client.beta.threads.messages.create(
    role="user",
    content="3x+14 = 29 问x的值是多少",
    thread_id=thread.id
)

#---------------------------------------
# 4.创建运行 run
#---------------------------------------
run = client.beta.threads.runs.create(
    assistant_id=assistant.id,
    thread_id=thread.id
)
print(f'run id:{run.id}')

# 等待线程完成
def wait_on_run(run,thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )        
        time.sleep(0.5)
    return run

run = wait_on_run(run,thread)
print(f'run: id {run.id} status {run.status}')

#---------------------------------------
# 4.显示消息 
#---------------------------------------

messages = client.beta.threads.messages.list(thread_id=thread.id)


print(f'-----messages total {messages.data.count}-------')
for message in reversed(messages.data):
    print(f'{message.role}:{message.content[0].text.value}')


#---------------------------------------
# 5.创建新信息
#---------------------------------------

message = client.beta.threads.messages.create(
    thread_id=thread.id,
    content="3(x^2)+5=17 问x的值是多少?",
    role="user"
)

#---------------------------------------
# 6.再次运行线程
#---------------------------------------
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id='asst_rZua52PliLFNBHUNhkKHAe3O'
)
wait_on_run(run,thread)

#---------------------------------------
# 4.输出所有消息
#---------------------------------------

messages = client.beta.threads.messages.list(thread_id=thread.id)
for message in reversed(messages.data):
    print(f'{message.role}:{message.content[0].text.value}')

print("Done")