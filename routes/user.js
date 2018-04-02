const router = require("koa-router")();
const sql = require('../sql/connect');
const formidable = require('formidable');
const fs = require("fs");
const userEntity = require("../entity/entity")

let helper = require('../tool/helper');
let useAct = require("../actions/user")

// 添加用户
router.post('/addUser', async (ctx, next) => {
    let result = await useAct.addUser(ctx,next);
    ctx.type = "json";
    ctx.body = result;
})

// 是否新用户
router.post('/isNewUser',async (ctx,next) =>{
    let result = await useAct.isNewUser(ctx,next);
    ctx.type = "json";
    ctx.body = result;
})

// 上传头像
router.post('/headImg', async (ctx, next) => {

    let form = new formidable.IncomingForm();
    let res = helper.responseData,
        dirName = "/img/";

    form.encoding = 'utf-8';
    form.uploadDir = "public" + "/img/";
    form.keepExtensions = true;

    let fn = new Promise((resolve) => {

        form.parse(ctx.req, async function (err, fields, files) {
            // koa的回调函数里 ctx.body 调用不了？？

            if (err) { throw err; return; }
            // 获取后缀名
            let extname = "";
            let type = files.file.type;

            switch (type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }

            if (extName.length == 0) {
                res.code = "3000";
                res.message = "只支持png和jpg格式图片";
                return resolve(res)
            }

            let avatarName = helper.getTimeStamp() + '.' + extName;
            let newPath = form.uploadDir + avatarName,
                exportDir = dirName + avatarName;

            // helper.upLoadQiNiu({
            //     name:"haha.jpg",
            //     stream:files.file._writeStream
            // }); // 上传到七牛

            try {
                await fs.renameSync(files.file.path, newPath);
                res.code = "2000";
                res.data = {
                    imgUrl: helper.initAddress() + exportDir
                }

                return resolve(res)
            } catch (error) {
                throw error;
            }

        });
    })

    let data = await fn;

    ctx.type = "json";
    ctx.body = data;

})

router.post("/upLoadImg",async(ctx,next) => {
    
})

module.exports = router;