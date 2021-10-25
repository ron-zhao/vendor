/**
 * event
 * @desc      : 路由器信息拦截
 * @author    : yunchen
 * @createdAt : 2017/9/18
 */
import { Toast } from 'vant';
import Vue from 'vue';

export default (router) => {
    // 路由拦截
    router.beforeEach((to, from, next) => {
        Toast.loading({
            duration: 0,
            message: '加载中...',
            forbidClick: true
        });

        if (to.matched.length) {
            next();
            return;
        }

        // 404
        next('404');
    });

    // 路由跳转成功
    router.afterEach((route) => {
        // 更新title
        reTitle(route.meta.title);
        setTimeout(Toast.clear, 300);

        // Fixme ios 白屏 hack
        Vue.nextTick()
            .then(() => {
                window.scrollTo(0, window.scrollY + 1);
                window.scrollTo(0, window.scrollY - 1);

                // 百度统计代码
                if (window._hmt) {
                    if (window.location && window.location.hostname === 'admin.zhangchuwang.cn') {
                        window._hmt.push(['_trackPageview', `${window.location.pathname}${window.location.hash}`]);
                    }
                }
            });
    });
};

/**
 * 更换浏览器title, hack IOS端微信浏览器
 * @param { String } title
 */
function reTitle (title = '供应商系统') {
    document.title = title;
    let mobile = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(mobile)) {
        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        // 替换成站标favicon路径或者任意存在的较小的图片即可
        iframe.setAttribute('src', '/favicon.ico');
        let iframeCallback = function () {
            setTimeout(function () {
                iframe.removeEventListener('load', iframeCallback);
                document.body.removeChild(iframe);
            }, 0);
        };
        iframe.addEventListener('load', iframeCallback);
        document.body.appendChild(iframe);
    }
}

