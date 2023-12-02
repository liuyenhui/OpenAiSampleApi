import os
from openai import OpenAI
from record import listen
#-------------------------------
#  1.录音到文件
#-------------------------------

# init API 
client = OpenAI()

# 开始录音
filename = listen()

# 读录音文件
audio_file = open(filename,"rb")

#-------------------------------
#  2.OpenAI - 语音转文本
#-------------------------------
# transcript 保存转换的文本
response = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file
)
qs = response.text
print(f'Question:{qs}')


#-------------------------------
#  3.OpenAI - 创建对话
#-------------------------------
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role":"user",
            "content":qs
        }
    ],
    # 最大返回的token数
    max_tokens=300,
    # 模型发散想象力, 0~2,float,写做类要数值高,逻辑类数值低
    temperature=0.8,
)
# 获取AI模型返回的消息
result = completion.choices[0].message.content
# total_tokens 消费token的总数
print(f'AI[tokens({completion.usage.total_tokens})]:{result}')

# 可调用OpenAI文本转语音API(会有成本)
# response = client.audio.speech.create(
#   model="tts-1",
#   voice="alloy",
#   input=result
# )
# # 默认mp3格式
# response.stream_to_file(os.path.dirname(__file__)+"/response.mp3")


#-------------------------------
#  4.MacOS - AI回答的文本转语音输出
#-------------------------------
# 调用系统输出语音
os.system(f'say "{result}"')
print("Done.")
