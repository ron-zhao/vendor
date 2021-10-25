/**
 * wap-mall-v2 > model.js
 * 所有带下划线的变量、函数都为私有的
 * @desc      : 浮动实现
 * @author    : yunchen
 * @createdAt : 2017/10/13
 */

let i = 0;

export class FixedHelper {
    constructor () {
        this.doms = [];
        // 初始化
        this._event();
    }
    /**
     * 监听滚动
     */
    _event () {
        let isDown = false; // 该值用于判断滚动纵向方向
        let topHeight = 0; // 用于存储不同位置
        let old = 0;
        window.addEventListener('resize', () => {
            for (i = 0; i < this.doms.length; i++) {
                // if (window.scrollY >= this.doms[i].top) {
                //     topHeight -= this.doms[i].el.offsetHeight;
                // }
                topHeight = 0;
                this.doms[i].el.style.width = '';
                this.doms[i].el.style.height = '';
                this.doms[i].el.style.position = '';
                this.doms[i].ref.style.height = '0';
            }
        });
        document.addEventListener('scroll', () => {
            isDown = window.scrollY - old < 0;
            for (i = 0; i < this.doms.length; i++) {
                let rect = this.doms[i].el.getBoundingClientRect();
                let top = this.doms[i].el.offsetTop || this.doms[i].el.clientTop;
                let t = this.doms[i].topOrBottom ? this.doms[i].value : topHeight;
                let isFixed = this.doms[i].el.style.position === 'fixed';
                // 向下滑动
                if (isDown) {
                    if (isFixed && window.scrollY < this.doms[i].fixed) {
                        this.doms[i].ref.style.height = '0';
                        this.doms[i].el.style.position = '';
                        delete this.doms[i].el.style;
                        // if (!this.doms[i].topOrBottom) {
                        //     topHeight -= rect.height;
                        // }
                        topHeight = 0;
                        this.doms[i].calb && this.doms[i].calb('leave', this.doms[i]);
                    }
                } else {
                    // 判断是否达到fixed
                    if (rect.top < t && top > t) {
                        let styles = {
                            width: `${rect.width}px`,
                            height: `${rect.height}px`,
                            position: 'fixed',
                            top: `${topHeight}px`,
                            left: `${rect.left}px`
                        };
                        this.doms[i].fixed = window.scrollY;
                        styles.zIndex = 1000 + this.doms.length;
                        // 定点和置顶悬浮处理方式
                        if (this.doms[i].topOrBottom) {
                            styles.top = `${this.doms[i].value}px`;
                        } else {
                            // 更新样式
                            this.doms[i].ref.style.height = `${rect.height}px`;
                            topHeight += rect.height;
                        }
                        // 更新样式
                        for (let key in styles) {
                            this.doms[i].el.style[key] = styles[key];
                        }
                        // 回调函数通知
                        this.doms[i].calb && this.doms[i].calb('enter', this.doms[i]);
                    }
                }
            }
            old = window.scrollY;
        });
    }
    /**
     * 向doms添加数据，封装数据
     * @param {} el
     * @param {Object} options
     */
    push (el, options) {
        // 获取el的高宽，上、左距离
        let rect = el.getBoundingClientRect();
        // 创建替身
        let ref = document.createElement('div');
        ref.className = `ref-fixed-${this.doms.length}`;
        ref.style.boxSizing = 'border-box';
        el.parentNode.insertBefore(ref, el);
        // 合并参数
        this.doms.push({
            el,
            top: rect.top,
            left: rect.left,
            ref,
            fixed: rect.top,
            ...options
        });
    }
    /**
     * 更新参数
     * @param {Number} id
     * @param {Object} options
     */
    update (id, options) {
        for (i = 0; i < this.doms.length; i++) {
            if (id === this.doms[i].uid) {
                this.doms[i] = {
                    ...this.doms[i],
                    ...options
                };
                break;
            }
        }
    }
}
