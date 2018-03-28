/**
 * 用于分发路由模块
 */
const fs = require("fs");
const path = require("path");
const router = require('koa-router')();

let dirArr = fs.readdirSync(path.resolve('routes'));

dirArr.forEach((vaule,index) => {

        let pureDirName = '/' + vaule.substring(0, vaule.length - 3);
        let getRouter = require('../routes/'+vaule);
         
        if(pureDirName == '/index') {
            router.use("/", getRouter.routes(), getRouter.allowedMethods())
        }else{
            router.use(pureDirName, getRouter.routes(), getRouter.allowedMethods())
        }

})

module.exports = router;    
