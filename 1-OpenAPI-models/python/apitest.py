from openai import OpenAI
# 设置key
client = OpenAI(api_key ='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')
# 获取模块
models = client.models.list()

for model in models:
    print(model.id)



