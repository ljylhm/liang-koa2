const router = require("koa-router")();
const sql = require("../sql/connect")

let helper = require('../tool/helper');
let borrowRecordAct = require("../actions/borrowRecord")

router.post('/addBorrowRecords',async (ctx,next) => {

   let result = await borrowRecordAct.addBorrowRecords(ctx, next);
   ctx.type = "json";
   ctx.body = result;

})

router.post('/queryBorrowBooks',async (ctx,next) => {
    
   let result = await borrowRecordAct.queryBorrowBooks(ctx, next);
   ctx.type = "json";
   ctx.body = result;
   
})

module.exports = router;