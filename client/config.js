/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://imezdcv9.qcloud.la';  //pro
var yjjhost = 'https://app1.efoundation.com.cn';  //pro
// var yjjhost = 'http://192.168.1.211:8088';  // dev
// var yjjhost = 'http://192.168.1.73';  // 73测试环境
// var yjjhost = 'http://192.168.1.76';  // 76测试环境

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

        // 基金详情信息
        fundDetailUrl: `${yjjhost}/mobile/publicfund/getPublicFundDetail`,

        // 详情页净值走势
        fundNavTrade: `${yjjhost}/mobile/publicfund/navTrade`,
        // 详情页万份收益走势
        wanNavTrade: `${yjjhost}/mobile/publicfund/wanTrade`,

        // 详情页净值增长走势
        fundIncreaseTrade: `${yjjhost}/mobile/publicfund/navIncreaseTrade`,

        // 详情页申购费率
        fundShengouRate: `${yjjhost}/mobile/publicfund/shengou`,

        // 详情页赎回费率
        fundShuhuiRate: `${yjjhost}/mobile/publicfund/shuhui`
    },
};

module.exports = config;
