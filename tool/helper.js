let HOST = "";
var helper = {
    
    // 初始化服务器域名
    initAddress:function(host) {
        HOST = arguments.length > 0 ? host : HOST;
        return HOST;
    },

    // 返回参数的模板
    responseData:{
       code:2000,
       message:null,
       data:null
    },

    // 获取数据类型
    getDataType: function (obj) {
        if (!obj) return;
        var _type = '',
            _type_str = '';
    
        _type = Object.prototype.toString.call(obj);
        _type_str = _type.substring(8, _type.length - 1);
    
        return _type_str;
    },

    // 获取时间戳
    getTimeStamp: function (time) {
        if (!time) return Math.round(new Date().getTime() / 1000);
        else {
            if (this.getDataType(time) != 'Date') {
                return Math.round(new Date(time).getTime() / 1000);
            }
            return Math.round(time.getTime() / 1000)
        }
    },

    // 置换字符串中的某个字符
    exchangeStr:function (str, original,now) {
        let reg = new RegExp(original)
    },

    // sql
    sqlHelper:function(method,queryList1,table,queryList2) {
        let str = '';
        
    }
 
}

module.exports = helper;
