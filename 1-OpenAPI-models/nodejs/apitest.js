import {OpenAI }  from "openai";



// 创建OpenAPI连接对象
const client = new OpenAI({
    // 注意 "openai": "^4.20.0" 中默认没有取系统环境变量中的 baseURL,此处手动添加
    baseURL:process.env.OPENAI_BASE_URL
});



// 同步请求返回models (同步请求) 异步
const response = await client.models.list();

for(const model of response.data ){
    console.log(model.id);
}


// 异步请求方式
// client.models.list().then(response=>{
//     for(const model of response.data){
//         console.log(model.id);
//     }
// }).catch(error=>{
//     console.log(error)
// })
// // 防止程序退出,设置timeout,等待异步操作完成
// await setTimeout(()=>{},3000);
