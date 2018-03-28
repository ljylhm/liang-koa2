const router = require("koa-router")();
const sql = require("../sql/connect")

let helper = require('../tool/helper');

router.get('/',async (ctx,next) => {

   console.log("进入了index的界面....."); 
   let result = await sql.query("select * from students");
   
   ctx.response.type = "json";
   ctx.response.body = result;

})

module.exports = router;