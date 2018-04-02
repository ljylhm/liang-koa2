// 用户表的动作方法
const userEntity = require("../entity/entity");
const sql = require("../sql/connect");

let helper = require('../tool/helper');
// 2000 请求数据成功
// 2001 缺少参数
// 2002 插入数据失败
// 2003 请求格式有误
// 2004 该用户已存在

// 插入用户的信息 post
let addUser = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let user = new userEntity.user(query.name, query.jobNum, query.openid, query.nickName, query.photo);
    // 检测user中是否有空对象
    if (!helper.detectIsEmpty(user).flag) {
        let str = "缺少" + helper.detectIsEmpty(user).EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            // 默认插入用户的时候状态为存在状态 1存在 0不存在 创建时间默认为服务器当前时间 
            // 并且返回插入用户的信息
            let sqlRes_openid = await sql.query("select * from staff WHERE OpenId = ?", [user.openid]);
            let isNew = sqlRes_openid ? true : false;
            if (!isNew) {
                result = new userEntity.result(2004, "该用户已存在",{
                    isAdd: false
                });
            } else {
                let sqlRes = await sql.query("insert into staff values (null,?,?,?,?,?,?,?)", [user.name, user.jobNum, user.openid, user.nickName, user.photo, 1, new Date()]);
                result = new userEntity.result(2000, "请求数据成功", {
                    isAdd: true
                });
            }
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

// 是否已经登录过 post
let isNewUser = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let user = new userEntity.user(query.name, query.jobNum, query.openid, query.nickName, query.photo);
    if (!user.openid) {
        let str = "缺少" + openid + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            // 默认插入用户的时候状态为存在状态 1存在 0不存在 创建时间默认为服务器当前时间
            let sqlRes = await sql.query("select * from staff WHERE OpenId = ?", [user.openid]);
            let isNew = sqlRes.length ? true : false;
            result = new userEntity.result(2000, "请求数据成功", {
                isNew: isNew
            });
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

module.exports = {
    addUser: addUser,
    isNewUser: isNewUser
}