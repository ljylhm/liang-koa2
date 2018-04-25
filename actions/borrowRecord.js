// 借阅表的动作方法
const userEntity = require("../entity/entity");
const sql = require("../sql/connect");

let helper = require('../tool/helper');
// 2000 请求数据成功
// 2001 缺少参数
// 2002 插入数据失败
// 2003 请求格式有误

// 添加借书记录 post 请求
/**
 * params1 bookId
 * params2 staffId
 * params3 refid 已取消
 * params4 remark 可空
 * params5 clientIp 
 * params6 openid
 */
let addBorrowRecords = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let borrowRecords = new userEntity.borrowRecords(query.bookId, query.staffId, query.refid, query.remark,
        query.clientIp, query.openid);
    let res = helper.detectIsEmpty(borrowRecords, ["remark", "refid", "openid"]);
    if (!res.flag) {
        let str = "缺少" + res.EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            //插入借阅记录 创建时间默认为服务器当前时间 归还时间创建时为null
            let refid = await sql.query("select Id,Staff_Id from borrowrecord where Book_Id  = ? order by Id desc limit 1", [borrowRecords.bookId])  // 查找当前图书的最近一次的使用人id
            let Id = "",
                Staff_Id = "",
                now = new Date();
            if (refid) {
                Id = refid[0].Id;
                Staff_Id = refid[0].Staff_Id;
            }
            let sqlRes = await sql.query("insert into borrowrecord values (null,?,?,?,?,?,?,?)", [borrowRecords.bookId, borrowRecords.staffId, Staff_Id, borrowRecords.remark, borrowRecords.clientIp, new Date(), null]);
            if (refid) {
                let upDateReturn = await sql.query("update borrowrecord set ReturnTime=? where Id = ?", [now, Id]);
            }
            result = new userEntity.result(2000, "请求数据成功", {
                isAdd: true
            });
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

// 查阅书的借阅记录(倒数后50条) 传openid过来 查询这本书的最后一条记录是否对应查询人的openid post
/**
 * params1 openid
 * params2 bookId
 */

let queryBorrowBooks = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let borrowRecords = new userEntity.borrowRecords(query.bookId, query.staffId, query.refid, query.remark,
        query.clientIp, query.openid);
    let res = helper.detectIsEmpty(borrowRecords, ["remark", "refid", "staffId", "clientIp"]);
    if (!res.flag) {
        let str = "缺少" + res.EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {

            // 查找当前用户是否是这本书的使用用户
            let sqlRes_openid = await sql.query("select OpenId from staff where Id = (SELECT Staff_Id from borrowrecord where Book_Id  = ? order by Id desc LIMIT 1)", [borrowRecords.bookId]);

            let getOpenId = sqlRes_openid.length > 0 ? sqlRes_openid[0]["OpenId"] : null;
            let isOwn = getOpenId == borrowRecords.openid ? true : false;  // true 不能借书 false 可以
            // 查询后50条记录
            let sqlRes_query = await sql.query("SELECT s.JobNum,s.Name,s.NickName,br.ClientIp,date_format(br.CreateAt,'%Y-%c-%d %T') as CreateAt,br.Remark from staff  as s INNER JOIN (SELECT * from borrowrecord where Book_Id  = ? order by Id desc limit 50) as br WHERE s.Id = br.Staff_Id;", [borrowRecords.bookId])
            result = new userEntity.result(2000, "请求数据成功", {
                isOwn: isOwn, // 是否当前用户借阅这本书
                booksRecord: sqlRes_query,
                currentRecord: sqlRes_query.end() || null
            });

        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

module.exports = {
    addBorrowRecords: addBorrowRecords,
    queryBorrowBooks: queryBorrowBooks
}