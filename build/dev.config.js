module.exports = {
    entry: {
        app: './src/app.js'
    },
    port: null,                 // 端口号
    host: '127.0.0.1',          // 映射网络
    environment: 'dev',
    proxy_path: '/vendor/api',     // 代理路径
    proxy_rule: '^/vendor/api',    // 代理规则
    // proxy_target: 'https://staging.zhangchuwang.cn'
    proxy_target: 'http://demo.com'
};
