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

    let result = await booksAct.queryBooks(ctx,next);
    ctx.type = "json";
    ctx.body = result;
})

router.post('/queryBooksById', async (ctx, next) => {
    
    let result = await booksAct.queryBooksById(ctx, next);
    ctx.type = "json";
    ctx.body = result;
})

module.exports = router;