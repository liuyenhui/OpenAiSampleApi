import {resolve} from "path"
import {OpenAI} from "openai"


import {exec} from "child_process"
import fs from "fs";

// 注意 "openai": "^4.20.0" 中默认没有取系统环境变量中的 baseURL
const client = new OpenAI({
    baseURL:process.env.OPENAI_BASE_URL
});

//-------------------------------
//  1.读语音文件
//-------------------------------
const path = `${resolve('../')}/question.m4a`;
console.log(path);

const fileStream = fs.createReadStream(path)


//-------------------------------
//  2.OpenAI - 语音转文本
//-------------------------------
const respone = await client.audio.transcriptions.create(
    {
        file:fileStream,
        model:"whisper-1",
    }
)
const qs = respone.text
console.log(`Question:${qs}`);

//-------------------------------
//  3.OpenAI - 创建对话
//-------------------------------
const completion = await client.chat.completions.create({
    model : "gpt-3.5-turbo",
    messages: [
        {
            "role":"user",
            "content":qs
        }
    ],
    max_tokens: 300
})
const result = completion.choices[0].message.content;
console.log(`AI[tokens(${completion.usage.total_tokens})]:${result}`);

//-------------------------------
//  4.MacOS - AI回答的文本转语音输出
//-------------------------------
// 调用系统输出语音
exec(`say "${result}"`);
console.log("Done.")

console.log('北京')