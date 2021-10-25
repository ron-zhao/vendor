<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    .purchase-info
        height: 100%
        padding-bottom: 0.2rem
        .search-box
            height: 0.64rem
            padding: 0.6rem 0 0.4rem 0
            margin: 0 auto
            text-align: center

            .search-content
                height: 100%
                margin: 0 auto
                padding: 0 5px
                .search-tab
                    height: 100%
                    box-sizing: border-box
                    margin-right: 0.1rem
                    float: left
                    width: 2.8rem
                    overflow: hidden
                    position: relative
                .search-text
                    height: 100%
                    width: 100%
                    box-sizing: border-box
                    padding-left: 27px
                    border-radius: 3px
                    border: 1px solid #ccc
                .icon-search
                    position: absolute
                    left: 8px
                    top: 20%
        .title
            margin-left: 2%
            margin-right: 2%
        .bg-count
            background-color: #d8cef2
        .bg-dc
            background-color: #9fcbfa
        .bg-disable
            background-color: #e4e4e4
        .bg-species
            background-color: #08d468
    .btn-search
        float: left
        width: 0.9rem
        height: 100%
        background-color: #dcdcdc
        color: #8a8a8a
        border: 1px solid #dcdcdc
        border-radius: 3px
        font-size: 0.26rem
    .btn-primary
        margin-left: 0.1rem
        margin-right: 2%
        color: #fff
        background-color: $primary
        padding: 0.1rem
        height: 100%
        border: none
        border-radius: 3px
        line-height: 100%
        font-size: 0.26rem

    .special
        margin-top: $space
        padding: $space
        p
            color: #000
            font-weight: normal

    .table
        border: 1px solid #000
        border-bottom: none
        td
            border-right: 1px solid #000
            border-bottom: 1px solid #000
    .date
        display: flex
        align-items: center
        margin-left: 2%
        margin-bottom: .4rem
        .date-value
            margin-left: .4rem
            font-size: .38rem
            font-weight: 600



</style>

<template>
    <div class="viewports purchase-info">
        <div>
            <div class="search-box">
                <div class="search-content">
                    <div class="search-tab">
                        <i class="iconfont icon-sousuo1 icon-search" style="color:#ccc"></i>
                        <input type="text" class="search-text"  v-model="query.keywords" @keyup.enter="search" placeholder="请输入商品名称" >
                    </div>
                    <van-button type="info" size="small" @click="search" class="btn-search">搜索</van-button>
                    <van-button type="info" size="small" class="btn-primary pull-left" style="width:0.9rem" @click="clear">重置</van-button>
                    <van-button size="small" type="info" :disabled="loading" class="btn-primary pull-right" @click="save" v-if="is_weixin">复制采购单链接</van-button>
                    <van-button size="small" type="info" :disabled="loading" class="btn-primary pull-right" @click="print()" v-if="!is_weixin">打印采购单</van-button>
                </div>
            </div>
            <div class="date">
                <div>配送时间</div>
                <div class="text-warning date-value" >{{query.date}}</div>
            </div>
            <div>
                <div v-fixed>
                    <div>
                        <div class="overflow text-center" style="height: 0.48rem;padding:0.2rem 0;background: #fff">
                            <span class="text-primary pull-left"  style="margin-left:35%">共{{total_page}}页,当前第{{page}}页</span>
                            <input type="button" value="下一页" @click="nextPage()" class="btn-primary pull-right" v-if="page !== total_page">
                            <input type="button" value="上一页" @click="lastPage()" class="btn-primary pull-right" v-if="page !== 1">
                        </div>
                        <table class="table">
                            <thead >
                            <tr>
                                <td style="width: 1rem">商品名称</td>
                                <td class="bg-count" style="width: 0.5rem">采购量</td>
                                <td class="bg-dc" v-for="item in dc_array[page-1]" :key="item.car_number" style="width: 0.5rem">{{(item.car_number +'号车')}}</td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <table class="table" style="word-wrap:break-word;" v-if="details.data">
                    <tbody>
                    <tr>
                        <td style="width: 1rem" class="bg-species">商品种数</td>
                        <td style="width: 0.5rem" class="bg-count"></td>
                        <td class="bg-species" v-for="item in dc_array[page-1]" :key="item.car_number" style="width: 0.5rem">{{item.number}}种</td>
                    </tr>    
                    <tr v-for="(item,index) in details.data" :key="index">
                        <td style="width: 1rem">{{item.product_name}}</td>
                        <!--<td>{{item.division === 0 ? '否':'是'}}</td>-->
                        <td style="width: 0.5rem" class="bg-count">
                            {{item.spec === item.ud ? item.total_ud_quantity + item.ud :
                            item.total_spec_quantity + item.spec + '/' + item.total_ud_quantity + item.ud}}
                        </td>
                        <td v-for="(dc_detail, inlineIndex) in detail_array[index][page-1]" :key="'inline_' + inlineIndex" :class="dc_detail.need_quantity === 0 ? 'bg-disable':''" style="word-wrap:break-word;width: 0.5rem">
                            <span v-if="dc_detail.need_quantity === 0"></span>
                            <span v-if="dc_detail.need_quantity !== 0 && item.division !== 1">{{dc_detail.need_quantity}}</span>
                            <!--后端返回的是+号拼接的字符串，不能分整个数字换行，所以前端做了处理-->
                            <slot v-if="dc_detail.need_quantity !== 0 && item.division === 1">
                                {{dc_detail.split_detail}}
                            </slot>
                        </td>
                    </tr>
                    <tr v-if="!details.data.length">
                        <td>
                            暂无数据~
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="special">
                <p>
                    特殊要求：
                    <span v-if="!notes.length">无特殊要求</span>
                </p>
                <p v-for="(note, index) in notes" :key="note.order_item_id">
                    {{index+1}}.
                    商品：{{note.product_name}}；
                    车号：{{note.car_number}}；
                    数量：<span v-if="note.ud!==note.spec">{{note.quantity}}{{note.spec}}</span>{{note.ud_quantity}}{{note.ud}}；
                    <br/>
                    要求：{{note.note}}
                </p>
            </div>

            <div class="text-center" v-if="loading">
                <van-loading size="24px">加载中...</van-loading>
            </div>
        </div>
    </div>
</template>

<script>
    import { Indicator } from 'mint-ui';
    import { purchaseDetail, tempListDetail, wxConfig } from '../../api';
    import * as assets from '../../assets';
    import { tool } from '../../common/util';
    import _ from 'underscore';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'HomePurchaseListInfo',
        data () {
            const { id } = this.$route.params || {};

            return {
                loading: true,
                query: {
                    id,
                    keywords: '',
                    date: this.$route.query.date,
                    csv: false,
                    token: tool.$local.get('vendor_token')
                },
                details: {}, // 采购单详情数据
                total: 0, // 合计
                tds: [],
                is_weixin: '', // 是否为微信登录
                page: 1, // 当前处于第几页
                total_page: 1, // 总页数
                detail_array: [], // 详情列表数组
                dc_array: [], // 营业部（车）数组
                service: '',
                ...assets
            };
        },
        async created () {
            let ua = navigator.userAgent.toLowerCase() || '';
            let matched = ua.match(/MicroMessenger/i) || [];
            if (matched[0] === 'micromessenger') {
                this.is_weixin = true;
            } else {
                this.is_weixin = false;
            }

            await this.fetchProfile();
            this.list();
        },
        methods: {
            ...mapActions({
                'fetchProfile': 'user/profile'
            }),
            search () {
                this.list();
            },
            clear () {
                this.query.keywords = '';
                this.list();
            },
            list () {
                this.loading = true;
                if (this.query.id) {
                    this.service = tempListDetail;
                } else {
                    this.service = purchaseDetail;
                }

                this.query.vendor_id = this.vendor_id;

                this.service(this.query).success(data => {
                    this.loading = false;

                    // 初始化（初始头部，初始页码）
                    this.page = 1;
                    this.dc_array = [];
                    this.total_page = 1;

                    this.details = data;
                    this.tds = this.details.categories.slice(1);
                    let item;
                    this.total = 0;
                    for (item in this.details.categories) {
                        this.total += this.details.categories[item].number; // 算出合计
                    }
                    this.total_page = Math.ceil(this.details.data[0].item.length / 4); // 对车数进行对4整除向上取整来控制页数

                    // ps:xx@@!!**&
                    // 做数据处理，将后端传过来的数据每四条分一页 （使用了二维数组来组处理）
                    for (let index in this.details.data) {
                        this.detail_array[index] = [];
                        if (this.total_page === 1) {
                            this.detail_array[index][0] = this.details.data[index].item;
                            this.dc_array[0] = this.tds;
                        } else {
                            this.detail_array[index][0] = this.details.data[index].item.slice(0, 4);
                            this.dc_array[0] = this.tds.slice(0, 4);
                            for (let times = this.total_page; times > 1; times--) {
                                let key = this.total_page - times + 1;
                                this.detail_array[index][key] = this.details.data[index].item.slice(key * 4, key * 4 + 4);
                                this.dc_array[key] = this.tds.slice(key * 4, key * 4 + 4);
                            }
                        }
                    }
                }).error(() => {
                    this.loading = false;
                });
            },
            nextPage () { // 下一页
                this.page++;
            },
            lastPage () { // 上一页
                this.page--;
            },
            export_url () {
                const { name } = this.$route;
                const printing = this.printing || 'DIVISION';

                // 拼接打印采购单url
                let queryString = '';
                let query = {
                    id: this.$route.params.id,
                    vendor_id: this.vendor_id,
                    date: this.$route.query.date
                };
                for (let item in query) {
                    queryString += query[item] ? ('&' + item + '=' + query[item]) : '';
                }
                queryString = queryString.slice(1);
                let href = window.location.href;
                href = href.substr(0, href.indexOf(name === 'home.purchaseList.info' ? 'purchaseList' : 'tempList'));

                const page = printing === 'DIVISION' ? 'purchaseList/printByOneCar' : 'purchaseList/printByAllCar';
                let url = href + `${page}?` + queryString;
                return url;
            },
            print () { // 跳转打印页面
                const printing = this.printing || 'DIVISION';

                this.$router.push({
                    name: printing === 'DIVISION' ? 'home.purchaseList.printByOneCar' : 'home.purchaseList.printByAllCar',
                    query: {
                        date: this.$route.query.date,
                        id: this.$route.params.id,
                        vendor_id: this.vendor_id
                    }
                });
            },
            save () {
                // 微信配置初始化
                wxConfig({url: location.href.split('#')[0]}).success(data => {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ'
                        ]
                    });
                    this.shareFriend(this.export_url());
                });
            },
            shareFriend (url) {
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage({
                    title: this.$route.query.date + '采购单详情',
                    desc: '在电脑上打开此链接可打印采购单详情',
                    link: url,
                    imgUrl: location.href.split('#')[0] + assets.pngLogo,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //                        alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                // 监听 “分享到QQ”
                wx.onMenuShareQQ({
                    title: this.$route.query.date + '采购单详情',
                    desc: '在电脑上打开此链接可打印采购单详情',
                    link: url,
                    imgUrl: location.href.split('#')[0] + assets.pngLogo,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //                        alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                alert('已复制链接，请在右上角选择发送给朋友');
            }
        },
        computed: {
            ...mapGetters('user', ['vendor_id', 'printing']),
            notes () {
                const [ ids ] = _.chain(this.detail_array).map(item => {
                    return _.pluck(item[this.page - 1], 'car_number');
                }).value();

                const { notes = [] } = this.details || {};
                return notes.filter(item => {
                    return ids.indexOf(item.car_number) > -1;
                });
            }
        },
        components: {
            Indicator
        }
    };
</script>
