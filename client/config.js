/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://669512587.junkwok.club';  //pro
var yjjhost = 'http://app1.efoundation.com.cn';  //pro
// var yjjhost = 'http://192.168.1.73/'  // dev

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        yjjhost,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 首页信息
        indexDataUrl: `${yjjhost}/mobile/nativeIndex`,

        // 基金列表接口
        hqbDataUrl: `${yjjhost}/mobile/publicfund/hqbInfo`,

        // 基金列表接口
        publicFundListUrl: `${yjjhost}/mobile/publicfund/getPublicFundList`,

        // 资讯列表接口
        jrktUrl: `${yjjhost}/mobile/about/getJrktList`,
        newsAjaxUrl: `${yjjhost}/mobile/news/newsAjax`,  //财富头条和投基策略的请求链接
    },
};

module.exports = config;
