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
                    height: 0.32rem
                    vertical-align: middle
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
                height: 0.28rem
                vertical-align: middle

            span
                font-size: 0.24rem
                color: #e38c54
                font-weight: 700

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
            position: relative
            top: 4.14rem
            background: #f6f6f6
            padding-bottom: 1.2rem

            .list-item
                overflow: hidden
                padding: 0.2rem
                margin-bottom: 0.2rem
                border-top: 1px solid #e5e6e8
                border-bottom: 1px solid #e5e6e8
                background-color: #fff
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
        .list-box.top
            top: 5.04rem

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

    .mint-popup.tip-popup:before,
    .mint-popup.tip-popup-num:before,
    .mint-popup.tip-popup-price:before
        display: inline-block
        width: 0
        height: 0
        border: solid transparent
        border-width: 10px
        border-bottom-color: #333
        content: ""
        position: absolute
        top: -20px
        right: 42%
    .mint-popup.tip-popup-num:before,
    .mint-popup.tip-popup-price:before
        right: 16%

    .mint-popup.tip-popup,
    .mint-popup.tip-popup-num,
    .mint-popup.tip-popup-price
        width: 2.8rem
        padding: 0.2rem 0.28rem
        z-index: 2003
        background: #333
        color: #fff
        border-radius: 0.2rem !important
        font-size: 0.24rem
        text-align: center
        top: 2.2rem
        left: 1.8rem
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

    .mint-popup.tip-popup-num
        top: 6.4rem
        left: 5.5rem

    .mint-popup.tip-popup-price
        top: 5.2rem
        left: 5.5rem

</style>

<template>
    <div>
        <div>
            <div class="viewports purchase-list">
                <div style="position: fixed; top: 0; overflow: hidden; background-color: #fff; z-index:8; left: 0; width: 100%;">
                    <div class="status-box">
                        <div class="status-content">
                            <span>状态:{{status}}</span>
                            <span class="iconfont icon-wenhao" @click="notePop()" style="color: #999"></span>
                            <span class="m-x" v-show="status!=='待录入' && purchase_date">
                                采购时间:{{purchase_date | date('YYYY.MM.DD')}}
                            </span>
                        </div>
                        <div class="status-link">
                            <a class="text-link" @click="$router.push({name:'home.historyLog'})">历史单据</a>
                        </div>
                    </div>

                    <div class="tip-box">
                        <img src="../../assets/tishi.png">
                        <span>提示:请在每天9:00前完成录单，如录错请联系我们。</span>
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
                        <div class="status-check" v-show="status==='待录入' || status==='待确认价格'">
                            <label @click=" check = !check; filter();">
                                <span class="iconfont"
                                      :class="check ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                只看调整了价格的商品
                            </label>
                        </div>
                        <div class="status-check" v-show="status==='待确认数量'">
                            <label @click=" checkPrice = !checkPrice; filter();">
                               <span class="iconfont"
                                     :class="checkPrice ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                确认价调整了的商品
                            </label>
                            <span class="iconfont icon-wenhao" @click="notePopPrice()" style="color: #999"></span>
                        </div>
                    </div>
                    <div class="status-box" style="padding: 0.2rem 0.2rem; border-top: 1px solid #e5e6e8" v-show="status==='已完成'">
                        <div class="status-content">
                            <label @click=" checkPrice = !checkPrice; filter();">
                                <span class="iconfont"
                                      :class="checkPrice ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                确认价调整了的商品
                            </label>
                        </div>
                        <div class="status-check">
                            <label @click=" checkNum = !checkNum; filter();">
                               <span class="iconfont"
                                     :class="checkNum ? 'icon-iconfontxuanze' : 'icon-xuanze1'"></span>
                                确认量调整了的商品
                            </label>
                            <span class="iconfont icon-wenhao" @click="notePopNum()" style="color: #999"></span>
                        </div>
                    </div>

                    <div class="s-spliter" ></div>
                </div>

                <div class="list-box" :class="{'top' : status==='已完成'}">
                    <div class="text-center load-more padder"  v-show='!loadall'>
                        <mt-spinner :type="3"></mt-spinner>
                    </div>

                    <div class="list-item" v-for='item in datas'>
                        <p class="title">{{item.product_name}}</p>
                        <div class="content">
                            <div style="overflow: hidden">
                                <p class="pull-left">
                                    <span>单位：{{item.spec}}</span>
                                    <span v-if="item.spec !== item.ud">（约{{item.un + item.ud}}/{{item.spec}}）</span>
                                </p>
                                <p class="pull-right" style="text-align: right">
                                    <span>我的报价：</span>
                                    <input type="number"
                                           :class="{'text-danger': +item.price !== item.in_price}"
                                           v-show="status==='待录入'"
                                           v-model="item.price"
                                           style="width:0.8rem;outline: none;border: 1px solid #999;padding: 0.2rem;"
                                           required
                                    />
                                    <span :class="{'text-danger': +item.price !== item.in_price}"
                                          v-show="status!=='待录入'">
                                    {{item.price ? item.price : '无'}}
                                </span>
                                    <span v-if="status==='待录入' || item.price">元/{{item.ud}}</span>
                                </p>
                            </div>

                            <div style="overflow: hidden">
                                <p class="pull-left" v-if="item.confirm_price !== item.price && (status==='待确认数量' || status==='已完成')">
                                    <span class="borderNum">确认价：{{item.confirm_price}}元/{{item.ud}}</span>
                                </p>
                                <p class="pull-right" v-if="item.confirm_quantity !== item.reserve_quantity && status==='已完成'" style="text-align: right">
                                    <span class="borderNum">确认量：<span v-if="item.ud !== item.spec">{{item.confirm_quantity}}{{item.spec}}</span>{{item.confirm_ud_quantity}}{{item.ud}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="text-danger text-right" v-if="status==='待录入' && priceChange(item)">价格波动太大，请核实</div>
                    </div>

                    <div class="text-center load-more padder" v-show="loadall && !total">
                        当日无采购单
                    </div>
                </div>

                <button type="button"
                        class="btn btn-primary bottom"
                        style="height: 0.95rem;"
                        v-show="status==='待录入'"
                        @click="save()"
                >完成</button>
            </div>
        </div>
        <mt-popup :class="{'tip-popup': true}" v-model="noteShow">
            <div class="note-content">
                <div>整个流程有四种状态：待录入；待确认价格；待确认数量；已完成。</div>
            </div>
            <div class="note-sure" @click="noteShow = !noteShow">
                确认
            </div>
        </mt-popup>

        <mt-popup :class="{'tip-popup-num': true}" v-model="noteShowNum">
            <div class="note-content">
                <div>1、未显示确认价表示确认价与你提报的一致。2、未显示确认量表示与采购单的量一致。</div>
            </div>
            <div class="note-sure" @click="noteShowNum = !noteShowNum">
                确认
            </div>
        </mt-popup>

        <mt-popup :class="{'tip-popup-price': true}" v-model="noteShowPrice">
            <div class="note-content">
                <div>未显示确认价表示确认价与你提报的一致。</div>
            </div>
            <div class="note-sure" @click="noteShowPrice = !noteShowPrice">
                确认
            </div>
        </mt-popup>
    </div>

</template>

<script>
    import { spinner, MessageBox } from 'mint-ui';
    import { onlineInList, editonlineIn } from '../../api';
    import _ from 'underscore';

    export default {
        data () {
            return {
                vendor: {},
                id: this.$route.query.id || 0,
                data: {},
                datas: [],
                putData: [],
                postId: '',
                status: '',
                keywords: '',
                check: false,
                checkPrice: false,
                checkNum: false,
                postStattus: false,
                placeholder: '请输入商品名称', // 搜索placeholder
                loadall: false,
                loading: false,
                loaded: false,
                noteShow: false,
                noteShowNum: false,
                noteShowPrice: false,
                purchase_date: '',
                total: 0,
                statusS: [
                    {id: 'pending', name: '待录入'},
                    {id: 'entryprice', name: '待确认价格'},
                    {id: 'entryquantity', name: '待确认数量'},
                    {id: 'confirmquantity', name: '已完成'}
                ]
            };
        },
        beforeCreate () {

        },
        mounted () {
            this.list();
        },
        methods: {
            list () {
                this.loaded = false;
                this.data = [];
                onlineInList(this.id).success((data = {}) => {
                    if (data.status === 'pending') {
                        this.data = _.map(data.Items, function (item) {
                            item.price = item.in_price;
                            return item;
                        });
                    } else {
                        this.data = data.Items;
                    }
                    this.loadall = true;
                    this.datas = _.clone(this.data);
                    this.status = _.find(this.statusS, {id: data.status}).name || '无';
                    this.purchase_date = data.purchase_date;
                    this.total = data.Items.length;
                    this.postId = data.id;
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
                        flag = +item.price !== item.in_price;
                    }
                    if (that.checkNum) {
                        flag = item.reserve_quantity !== item.confirm_quantity;
                    }
                    if (that.checkPrice) {
                        flag = +item.price !== item.confirm_price;
                    }
                    if (that.keywords && that.check) {
                        flag = (item.product_name.indexOf(that.keywords) > -1) && +item.price !== item.in_price;
                    }
                    if (that.keywords && that.checkNum) {
                        flag = (item.product_name.indexOf(that.keywords) > -1) && item.reserve_quantity !== item.confirm_ud_quantity;
                    }
                    if (that.keywords && that.checkPrice) {
                        flag = (item.product_name.indexOf(that.keywords) > -1) && +item.price !== item.confirm_price;
                    }
                    return flag;
                }).value();
            },
            priceChange (item) {
                return +item.in_price && (item.price / item.in_price > 1.5 || item.in_price / item.price > 1.5);
            },
            save () {
                this.keywords = '';
                this.check = false;
                this.checkNum = false;
                this.checkPrice = false;
                this.postStattus = false;
                this.filter();
                for (let i in this.datas) {
                    if (this.datas[i].price <= 0) {
                        this.postStattus = true;
                    }
                    this.datas[i].price = +this.datas[i].price;
                    this.putData[i] = _.pick(this.datas[i], 'id', 'price', 'in_price');
                }
                if (this.postStattus) {
                    this.$toast('价格必须大于0');
                    return false;
                }

                if (_.some(this.datas, this.priceChange)) {
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
                        editonlineIn({id: this.postId, items: this.putData})
                            .success(() => {
                                this.$toast('今日报价已成功，请等待掌厨网确认。');
                                this.status = '待确认价格';
                            });
                    }).then(() => {});
                } else {
                    MessageBox.confirm('确定提交今日单据吗？', '').then(action => {
                        editonlineIn({id: this.postId, items: this.putData})
                            .success(() => {
                                this.$toast('今日报价已成功，请等待掌厨网确认。');
                                this.status = '待确认价格';
                            });
                    });
                }
            },
            notePop () {
                // 问号弹出框
                this.noteShow = true;
            },
            notePopNum () {
                // 问号弹出框
                this.noteShowNum = true;
            },
            notePopPrice () {
                // 问号弹出框
                this.noteShowPrice = true;
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
