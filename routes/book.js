const router = require("koa-router")();
const sql = require('../sql/connect');

let helper = require('../tool/helper');
let booksAct = require("../actions/books")

router.post('/addBooks', async (ctx, next) => {

    let result = await booksAct.addBooks(ctx, next);
    ctx.type = "json";
    ctx.body = result;

})

router.get('/queryBooks', async (ctx, next) => {

    let result = await booksAct.queryBooks(ctx, next);
    ctx.type = "json";
    ctx.body = result;
})

router.post('/queryBooksById', async (ctx, next) => {

    let result = await booksAct.queryBooksById(ctx, next);
    ctx.type = "json";
    ctx.body = result;
})

// HR 更新图书的信息
router.post('/upDateBookInfo', async (ctx, next) => {

    let result = await booksAct.upDateBookInfo(ctx, next);
    ctx.type = "json";
    ctx.body = result;
})

// 无效图书
router.post('/unuseBook', async (ctx, next) => {
    let result = await booksAct.modifyStatus(ctx, next);
    ctx.type = "json";
    ctx.body = result;
})

module.exports = router;