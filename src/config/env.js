/**
 * 配置编译环境和线上环境之间的切换
 * url: 接口域名地址
 * routerMode: 路由模式
 *
 */
let BASE_URL;
let MKT_BASE_URL;
if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://api.pdabc.com';                 // 生产环境接口url
    MKT_BASE_URL = 'https://mkt.pdabc.com';
} else if (process.env.NODE_ENV === 'test') {
    // BASE_URL = 'http://192.168.10.156:38087';        // 测试环境
    BASE_URL = 'http://192.168.10.155:8087';
    MKT_BASE_URL = 'http://192.168.10.155:7777';
} else if (process.env.NODE_ENV === 'uat') {            // 预发环境
//    BASE_URL = 'http://192.168.10.156:38087';
    BASE_URL = 'http://47.96.231.154:8087';
    MKT_BASE_URL = 'http://47.96.231.154:7777';
} else {                                               // 开发环境(默认)
    BASE_URL = 'http://192.168.10.155:8087';
    MKT_BASE_URL = 'http://192.168.10.155:7777';
}

export {
    BASE_URL,
    MKT_BASE_URL
};
