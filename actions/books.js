// 图书表的动作方法
const userEntity = require("../entity/entity");
const sql = require("../sql/connect");

let helper = require('../tool/helper');
// 2000 请求数据成功
// 2001 缺少参数
// 2002 插入数据失败
// 2003 请求格式有误

// 添加图书 post请求
let addBooks = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let books = new userEntity.books(query.name, query.imgSrc, query.desc, query.classId, query.purchaser, query.buylink, query.buydate);
    let res = helper.detectIsEmpty(books, ["openid", "bookId"]);
    if (!res.flag) {
        let str = "缺少" + res.EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            // 默认插入图书的时候默认状态为存在状态 1存在 0不存在 创建时间默认为服务器当前时间
            console.log("")
            let sqlRes = await sql.query("insert into book values (null,?,?,?,?,?,?,?,?,?)", [books.name, books.imgSrc, books.desc, books.classId, books.purchaser, books.buylink, new Date(books.buydate).format("yyyy-MM-dd"), 1, new Date()]);

            let addData = await sql.query("select * from book where Id = (select max(id) from book)");
            result = new userEntity.result(2000, "请求数据成功", {
                isAdd: true,
                data: addData[0]
            });
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

// 查询图书 当前返回全部 get
let queryBooks = async (ctx, next) => {
    let query = ctx.query,
        result;
    let keyWord = query.keyWord,
        sqlRes = null;
    try {
        if (!keyWord && keyWord != 0) { // 返回还在架上的图书
            //sqlRes = await sql.query("select Id,Name,ImgSrc,Description,Class_Id,Purchaser,BuyLink,date_format(BuyDate,'%Y-%c-%d %h:%i') as BuyDate,Status,date_format(CreateAt,'%Y-%c-%d %h:%i') as CreateAt from book where Status = 1")
            sqlRes = await sql.query("select * from book where Status = 1")
        } else {
            keyWord = "%" + keyWord + "%";
            sqlRes = await sql.query("select * from book where Status = 1 and Name like ?", [keyWord])
        }
        result = new userEntity.result(2000, "请求数据成功", {
            data: sqlRes
        });
    } catch (error) {
        console.log(error);
        result = new userEntity.result(2002, "插入数据失败", null);
    }
    return result;
}

let queryBooksById = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let books = new userEntity.books(query.name, query.imgSrc, query.desc, query.classId, query.purchaser, query.buylink, query.buydate, query.openid, query.bookId);
    let res = helper.detectIsEmpty(books, ["name", "imgSrc", "desc", "classId", "purchaser", "buylink", "buydate"])
    if (!res.flag) {
        let str = "缺少" + res.EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            let sqlRes = await sql.query("select * from book where Id = ?", [books.bookId]);

            let sqlId = await sql.query("select id from staff where openId = ?", [books.openid])
            result = new userEntity.result(2000, "请求数据成功", {
                staffId: sqlId[0],
                bookInfo: sqlRes[0]
            });

        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

// 更新图书的信息 
let upDateBookInfo = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let books = new userEntity.books(query.name, query.imgSrc, query.desc, query.classId, query.purchaser, query.buylink, query.buydate, null, query.bookId);
    let res = helper.detectIsEmpty(books, ["openid"]);
    if (!res.flag) {
        let str = "缺少" + res.EmptyItem + "参数";
        result = new userEntity.result(2001, str, null)
    } else {
        try {
            let sqlRes = await sql.query("update book set Name=?,Description=?,ImgSrc=?,Class_Id=?,Purchaser=?,BuyLink=?,BuyDate=? where Id = ?", [books.name, books.desc, books.imgSrc, books.classId, books.purchaser, books.buylink, new Date(books.buydate).format("yyyy-MM-dd"), books.bookId]);
            result = new userEntity.result(2000, "请求数据成功", {
                isUpDate: true
            });
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}

// 无效图书
let modifyStatus = async (ctx, next) => {
    let query = ctx.request.body,
        result;
    let bookId = query.bookId;
    if (!bookId && bookId != 0) result = new userEntity.result(2001, "缺少bookId参数", null);
    else {
        try {
            let sqlRes = await sql.query("update book set Status=0 where Id = ?", [bookId]);
            result = new userEntity.result(2000, "请求数据成功", {
                isDel: true
            });
        } catch (error) {
            console.log(error);
            result = new userEntity.result(2002, "插入数据失败", null);
        }
    }
    return result;
}


module.exports = {
    addBooks: addBooks,
    queryBooks: queryBooks,
    queryBooksById: queryBooksById,
    upDateBookInfo: upDateBookInfo,
    modifyStatus: modifyStatus
}