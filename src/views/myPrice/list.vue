<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .purchase-list
        height: 100%
        padding-bottom: 0.2rem
        .status-box
            overflow: hidden
            padding: 0.24rem 0.2rem
            .status-content
                float: left
                img
                    height: 0.28rem
            .status-link
                float: right
                color: #3478f5
            .status-check
                float: right
                img
                    height: 0.32rem
                    vertical-align: middle

        .tip-box
            background-color: #fff2de
            padding: 0.2rem
            border: 1px solid #fff2de
            img
                height: 0.24rem
                vertical-align: middle
            span
                font-size: 0.24rem
                color: #e38c54

        .search-box
            overflow: hidden
            padding: 0.2rem
            border-bottom: 1px solid #e5e6e8
            input
                float: left
                height: 0.72rem
                padding: 0 0.2rem
                box-sizing: border-box
                font-size: $normal
                outline: none
                border: 1px solid #999
                background-color: #ffffff

        .s-spliter
            height: 0.2rem
            background-color: #f6f6f6
            border-top: 1px solid #e5e6e8
            border-bottom: 1px solid #e5e6e8

        .list-box
            background: #f6f6f6
            padding-bottom: 1.2rem
            .list-item
                overflow: hidden
                padding: 0.2rem
                margin-bottom: 0.2rem
                border-top: 1px solid #e5e6e8
                border-bottom: 1px solid #e5e6e8
                background-color: #fff

                .has-down
                    width: .88rem
                    height: .88rem
                .title
                    color: #333
                    padding: 0.1rem 0
                    font-size: $large
                    font-weight: 500
                .content
                    color: #676767
                    overflow: hidden
                    line-height: 0.72rem

                    p
                        width: 50%
                    .borderNum
                        display: inline-block
                        line-height: 0.28rem
                        border: 1px solid #1d8aff
                        color: #1d8aff
                        padding: 0.1rem
                        border-radius: 0.4rem
                .color-999
                    color: #999
            button
                border-radius: 0
    .btn-primary
        float: left
        height: 0.72rem
        padding: 0 .34rem
        border: 0
        color: #fff
        background-color: $primary
        border: none
        line-height: 100%

    .btn-default
        height: 0.72rem
        padding: 0 .38rem
        color: #999
        outline: none
        background-color: #fff
        border: 1px solid #999
        border-radius: 2px

    .text-danger
        color: #ff8d45

    .m-x
        margin: 0 0.2rem

    .icon-iconfontxuanze
        color: #3478f5

    .mint-popup.tip-popup
        width: 3.8rem
        padding: 0.2rem 0.28rem
        z-index: 2003
        background: #333
        color: #fff
        border-radius: 0.2rem !important
        font-size: 0.24rem
        text-align: center
        top: 2.2rem
        left: 2.4rem
        .note-content
            text-align: left
        .note-sure
            margin-top: 0.1rem
            background: #fff
            color: #666
            display: inline-block
            padding: 0.14rem 0.52rem
            border-radius: 0.25rem
            font-size: 0.24rem

    .mint-popup.tip-popup:before
        display: inline-block
        width: 0
        height: 0
        border: solid transparent
        border-width: 10px
        border-bottom-color: #333
        content: ""
        position: absolute
        top: -20px
        right: 58%

</style>

<template>
    <div>
        <div>
            <router-view v-on:freezePaging="freezePaging" v-on:openPaging="openPaging"></router-view>
            <div class="viewports purchase-list">
                <div style="position: fixed; top: 0; overflow: hidden; background-color: #fff; z-index:8; left: 0; width: 100%;">
                    <div class="status-box">
                        <div class="status-content">
                            <span>
                                状态:{{status}}
                            </span>
                            <span class="iconfont icon-wenhao" v-show="status==='待报价'" @click="notePop()" style="color: #999"></span>
                            <span class="m-x" v-show="status!=='待报价' && offer_date">
                                报价时间:{{offer_date | date('YYYY-MM-DD')}}
                            </span>
                        </div>
                        <div class="status-link">
                            <a class="text-link" @click="$router.push({name:'home.priceLog'})">历史单据</a>
                        </div>
                    </div>

                    <div class="s-spliter" ></div>

                    <div class="search-box">
                        <form  @submit.prevent="refreshList" class="border-bottom">
                            <div style="background-color: #ffffff">
                                <input type="text" name="product" v-model="keywords"  :placeholder="placeholder" style="width:4rem;border-radius: 0;">
                                <button type="button" class="btn-primary" style="margin-left: -1px" @click="filter()">搜索</button>
                                <input type="button" class="btn-default pull-right m-x" value="重置" style="padding: 0 0.38rem; margin-right: 0;" @click="filter('clear')"/>
                            </div>
                        </form>
                    </div>

                    <div class="status-box" style="padding: 0.2rem 0.2rem">
                        <div class="status-content">
                            <span>商品种类：{{datas.length}} 种</span>
                        </div>
                        <div class="status-check" v-show="status!=='已完成' || ($route.query.status!=='finish' && this.$route.query.id ===0)">
                            <label @click="handleChangePrice">
                                 <span class="iconfont"
                                       :class="check ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                只看调整了价格的商品
                            </label>
                        </div>
                        <div class="status-check" v-show="status==='已完成' || ($route.query.status==='finish' && this.$route.query.id !==0)">
                            <label @click="handleConfirm">
                                 <span class="iconfont"
                                       :class="checkConfirm ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                最终确认价调整了的商品
                            </label>
                        </div>
                    </div>

                    <div class="s-spliter" ></div>
                </div>

                <div class="list-box" style="position: relative; top: 3.3rem;">
                    <div class="text-center load-more padder"  v-show='!loadall'>
                        <mt-spinner :type="3"></mt-spinner>
                    </div>

                    <div class="list-item" v-for='item in datas'>
                        <p class="title" :class="item.status === 'down'&&'color-999'">{{item.product_name}}</p>
                        <div class="content">
                            <p class="pull-left" :class="item.status === 'down'&&'color-999'">
                                <span>单位：{{item.spec}}</span>
                                <span v-if="item.spec !== item.ud">（约{{item.un + item.ud}}/{{item.spec}}）</span>
                            </p>
                            <p class="pull-right text-right" v-if="item.status === 'down'">
                                <img class="has-down" src="../../assets/has-down.png" alt="已下架">
                            </p>
                            <slot v-else>
                                <p class="pull-right text-right">
                                    <span>{{status==='待报价' ? '价格' : '我的报价' }}：</span>
                                    <input type="number"
                                           :class="{'text-danger': +item.price !== item.in_price}"
                                           v-show="status==='待报价'"
                                           v-model="item.price"
                                           style="width:1rem;outline: none;border: 1px solid #999;padding: 0.2rem;"
                                           required
                                    />
                                    <span :class="{'text-danger': +item.price !== item.in_price}" v-show="status!=='待报价'">{{item.price}}</span>
                                    <span>元/{{item.ud}}</span>
                                </p>
                            </slot>
                            <p class="pull-left" v-show="$route.query.status==='finish'">
                                <span>最终确认价：</span>
                                <span :class="{'text-danger': item.confirm_price !== item.price}">
                                    {{item.confirm_price}}
                                </span>
                                <span>元/{{item.ud}}</span>
                            </p>
                        </div>
                        <div class="text-danger text-right" v-if="status==='待报价' && checkPrice(item)">价格波动太大，请核实</div>
                    </div>

                    <div class="text-center load-more padder" v-show="loadall && !datas.length">
                        暂无数据
                    </div>

                    <button type="button"
                            class="btn btn-primary"
                            style="height: 0.95rem;"
                            v-show="status==='待报价'"
                            @click="save()">完成</button>
                </div>

            </div>
        </div>
        <mt-popup :class="{'tip-popup': true}" v-model="noteShow">
            <div class="note-content">
                <div style="text-align: center">报价提交后需等掌厨网确认后才能生效。在上次报价完成后，可再次发起报价，报价次数没有限制。</div>
            </div>
            <div class="note-sure" @click="noteShow = !noteShow">
                确认
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import { spinner, MessageBox } from 'mint-ui';
    import { vendorPrices, editPrices } from '../../api';
    import _ from 'underscore';

    export default {
        data () {
            return {
                vendor: {},
                data: [],
                datas: [],
                putData: [],
                id: this.$route.query.id || 0,
                status: '',
                offer_date: '',
                keywords: '',
                check: false,
                freezePaging: null,
                openPaging: null,
                checkConfirm: false,
                postStattus: false,
                placeholder: '请输入商品名称', // 搜索placeholder
                loadall: false,
                loading: false,
                loaded: false,
                noteShow: false,
                submitLoading: false,
                total: 0,
                statusS: [
                    {id: 'offer', name: '待报价'},
                    {id: 'confirm', name: '待确认'},
                    {id: 'finish', name: '已完成'}
                ]
            };
        },
        beforeCreate () {

        },
        mounted () {
            this.list();
        },
        methods: {
            handleConfirm () {
                this.checkConfirm = !this.checkConfirm;
                this.filter();
            },
            handleChangePrice () {
                this.check = !this.check;
                this.filter();
            },
            list () {
                this.loaded = false;
                this.data = [];
                vendorPrices(this.id).success(data => {
                    this.status = _.find(this.statusS, {id: data.status}).name;
                    if (data.status === 'offer') {
                        this.data = _.map(data.QuotationItems, function (item) {
                            item.price = item.in_price;
                            return item;
                        });
                    } else {
                        this.data = data.QuotationItems;
                    }
                    this.datas = _.clone(this.data);
                    this.offer_date = data.offer_date;
                    this.total = data.QuotationItems.length;
                    this.loadall = true;
                });
            },
            filter (clear) {
                if (clear) {
                    this.keywords = '';
                }
                let that = this;
                this.datas = _.chain(this.data).filter(function (item) {
                    let flag = true;
                    if (that.keywords) {
                        flag = (item.product_name.indexOf(that.keywords) > -1);
                    }
                    if (that.check) {
                        flag = flag && +item.price !== +item.in_price;
                    }
                    if (that.checkConfirm) {
                        flag = flag && +item.price !== +item.confirm_price;
                    }
                    /* if (that.keywords && that.check) {
                        flag = (item.product_name.indexOf(that.keywords) > -1) && +item.price !== +item.in_price;
                    }
                    if (that.keywords && that.checkConfirm) {
                        flag = (item.product_name.indexOf(that.keywords) > -1) && +item.price !== +item.confirm_price;
                    } */
                    return flag;
                }).value();
            },
            checkPrice (item) {
                return +item.in_price && (item.price / item.in_price > 1.5 || item.in_price / item.price > 1.5);
            },
            save () {
                if (this.submitLoading) return;

                this.keywords = '';
                this.check = false;
                this.checkConfirm = false;
                this.postStattus = false;
                this.filter();
                for (let i in this.datas) {
                    if (this.datas[i].price <= 0) {
                        this.postStattus = true;
                    }

                    this.datas[i].price = +this.datas[i].price;
                    this.putData[i] = _.pick(this.datas[i], 'product_id', 'price');
                }
                if (this.postStattus) {
                    this.$toast('价格必须大于0');
                    return;
                }

                if (_.some(this.datas, this.checkPrice)) {
                    MessageBox.confirm(
                        '有商品报价波动幅度超过50%，请确认是否提交？',
                        '提示',
                        {
                            confirmButtonText: '我再看看',
                            cancelButtonText: '确认提交',
                            confirmButtonClass: 'custom-confirm',
                            cancelButtonClass: 'custom-cancel'
                        }
                    ).catch(() => {
                        this.submitLoading = true;
                        editPrices({items: this.putData})
                            .success(() => {
                                this.submitLoading = false;
                                this.$toast('今日报价已成功，请等待掌厨网确认。');
                                this.status = '待确认';
                            }).error(() => {
                                this.submitLoading = false;
                            });
                    }).then(() => {});
                } else {
                    this.submitLoading = true;

                    editPrices({items: this.putData})
                        .success(() => {
                            this.submitLoading = false;
                            this.$toast('今日报价已成功，请等待掌厨网确认。');
                            this.status = '待确认';
                        }).error(() => {
                            this.submitLoading = false;
                        });
                }
            },
            notePop () {
                // 问号弹出框
                this.noteShow = true;
            }
        },
        components: {
            MtSpinner: spinner,
            MessageBox
        },
        watch: {

        }
    };
</script>
