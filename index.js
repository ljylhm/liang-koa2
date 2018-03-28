const Koa = require('koa');
const path = require("path");
const cors = require("koa2-cors");
const serve = require("koa-static");
const fs = require("fs");
const app = new Koa();

let getRouter = require('./routes/'+'index');
let router = require('./tool/dispenseRoutes');
let helper = require('./tool/helper');

// 启用静态资源
app.use(serve(__dirname+"/public"));

// 初始化服务器地址
app.use(async (ctx,next) => {
    let host = ctx.header.host;
    helper.initAddress(host);
    await next();
})

// 利用cors跨域
app.use(cors({
    origin:function(ctx) {
       // 返回指定允许的ip地址 
       return "http://10.101.70.31:8086";
    }
}));

app.use(router.routes())
   .use(router.allowedMethods())  

app.listen(3000);
