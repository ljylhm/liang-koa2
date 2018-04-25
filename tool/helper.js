let HOST = "";
const path = require("path");
let qiniu = require("qiniu");
let helper = {

    // 初始化服务器域名
    initAddress: function (host) {
        HOST = arguments.length > 0 ? host : HOST;
        return HOST;
    },

    // 返回参数的模板
    responseData: {
        code: 2000,
        message: null,
        data: null
    },

    // 获取数据类型
    getDataType: function (obj) {
        if (!obj && obj != 0) return;
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
    exchangeStr: function (str, original, now) {
        let reg = new RegExp(original)
    },

    // 检测对象中是否有空对象
    detectIsEmpty: function (obj, arr) {
        let flag = true,
            EmptyItem = null;
        if (!arr) arr = [];
        if (this.getDataType(obj) != "Object" || this.getDataType(arr) != "Array") flag = false;
        else {
            for (var i in obj) {
                if (arr.indexOf(i) >= 0) continue; // 如果有省略的对象,忽略
                if (!obj[i] && obj[i] != 0) {
                    flag = false;
                    EmptyItem = i;
                    break;
                }
            }
        }
        let objRes = {
            flag: flag,
            EmptyItem: EmptyItem
        }

        return objRes;
    },

    // 登陆七牛云的凭证
    qiuNiuOpt: function (opt) {
        let returnBody = JSON.stringify({
            "key": "$(key)",
            "hash": "$(etag)",
            "fsize": "$(fsize)",
            "bucket": "$(bucket)",
            "name": "$(x:name)"
        })
        let options = {
            scope: "liang-img", // scope 是你七牛云的仓库名 这里默认我的
            returnBody: returnBody
        }
        options = Object.assign(options, opt);
        // 上传的凭证 下面是我的七牛云账号
        let accessKey = "kmfsyyVNEuUPI-1C6ImRhEw8MxYYWJoIMyjTK9W5";
        let secretKey = "li7XydI7IZH19W1_4inYa32qikWtY2sekhDwOJ50";

        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);

        return uploadToken;
    },

    // 上传到七牛云
    upLoadQiNiu: function (opt) {

        let localFile = path.resolve(__dirname, "../public/img/1522650964.jpg");

        let config = new qiniu.conf.Config();
        config.zone = opt.zone || qiniu.zone.Zone_z0; // 默认华东的区域
        let putExtra = new qiniu.form_up.PutExtra();
        let key = opt.name;
        let token = this.qiuNiuOpt();

        let formUploader = new qiniu.form_up.FormUploader(config);

        formUploader.putStream(token, key, opt.stream, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                console.log(respBody);
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        })
    },
}

module.exports = helper;