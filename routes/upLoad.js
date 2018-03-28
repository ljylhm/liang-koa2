const router = require("koa-router")();
const sql = require("../sql/connect")

let helper = require('../tool/helper');

router.get('/',async (ctx,next) => {

   console.log("进入了upload的界面....."); 
   
   console.log(ctx.request);

   ctx.response.type = "json";

})

module.exports = router;