// 返回的结果对象实体
let result = function(code,message,result){
    this.code = code;
    this.message = message;
    this.result = result;
} 
// 借阅人信息的对应实体
let user = function(name,jobNum,openid,nickname,photo){
    this.name = name || null;
    this.jobNum = jobNum || null;
    this.openid = openid || null;
    this.nickName = nickname || null;
    this.photo = photo || null;
}

// 书籍信息对应的实体
let books = function(name,imgSrc,desc,classId,purchaser,buylink,buydate,openid,bookId){
    this.name = name || null;
    this.imgSrc = imgSrc || null;
    this.desc = desc || null;
    this.classId = classId || null;
    this.purchaser = purchaser || null;
    this.buylink = buylink || null;
    this.buydate = buydate || null;
    this.openid = openid || null;
    this.bookId = bookId || null;
}

// 借阅记录对应的实体
let borrowRecords = function(bookId,staffId,refid,remark,clientIp,openid){
    this.bookId = bookId || null;
    this.staffId = staffId || null;
    this.refid = refid || null;
    this.remark = remark || null;
    this.clientIp = clientIp || null;
    this.openid = openid || null;
}

module.exports = {
    result:result,
    user:user,
    books:books,
    borrowRecords:borrowRecords
}