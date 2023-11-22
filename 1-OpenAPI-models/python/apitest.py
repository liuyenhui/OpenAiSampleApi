from openai import OpenAI
# 设置key
client = OpenAI(api_key ='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')
# 获取模块
models = client.models.list()

for model in models:
    print(model.id)



