<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .purchase-list
        height: 100%
        padding-bottom: 0.2rem
        .search-box
            height: 0.64rem
            margin: 0.6rem auto 0.4rem auto
            .search-content
                height: 100%
                margin: 0 2%
                .date-select
                    height: 100%
                    width: 2.8rem
                    padding-left: 0.2rem
                    border-radius: 3px
                    border: 1px solid #ccc
        .btn-primary
            margin-left: 10px
            margin-right: 2%
            color: #fff
            background-color: $primary
            padding: 10px
            border: none
            border-radius: 3px
            line-height: 100%

</style>

<template>
    <div>
        <router-view v-on:freezePaging="freezePaging" v-on:openPaging="openPaging"></router-view>
        <div class="viewports purchase-list">
            <div class="search-box">
                <div class="search-content">
                    <span>配送时间：</span>
                    <input type="text" v-model="query.date" @click="showPicker" placeholder="请选择" class="date-select" readonly>
                    <mt-datetime-picker
                            ref="picker"
                            v-model="pickerVisible"
                            type="date"
                            year-format="{value} 年"
                            month-format="{value} 月"
                            date-format="{value} 日"
                            :startDate="startDate"
                            :endDate="endDate"
                            @confirm="handleConfirm">
                    </mt-datetime-picker>
                    <input type="button" value="清空配送时间" class="btn-primary" @click="clear">
                </div>
            </div>
            <div v-infinite-scroll="loadmore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10"
                 infinite-scroll-immediate-check="false">
                <table class="table">
                    <thead>
                        <tr>
                            <td>编号</td>
                            <td>配送时间</td>
                            <td>商品种类</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-show='!loadall'>
                        <td colspan="4">
                            <div class="text-center load-more padder" >
                                <mt-spinner :type="3"></mt-spinner>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(item,index) in purchase" v-show="loadall">
                        <td>{{index+1}}</td>
                        <td>{{item.deliver_day}}</td>
                        <td>{{item.count_sku}}</td>
                        <td>
                            <a class="text-link" v-if="$route.query.type === 'order'" @click="$router.push({name:'home.purchaseList.info',query:{date:item.deliver_day}})">查看</a>
                            <a class="text-link" v-else @click="$router.push({name:'home.tempList.info',params:{id: item.id}, query:{date:item.deliver_day}})">查看</a>
                        </td>
                    </tr>
                    <tr v-if="purchase.length && loadall">
                        <td colspan="4">
                            <span v-show='loaded'>已经加载全部~</span>
                            <div class="text-center load-more padder" v-show='!loaded'>
                                <mt-spinner :type="3"></mt-spinner>
                            </div>
                        </td>
                    </tr>
                    <tr v-show='!purchase.length && loadall'>
                        <td colspan="4">
                            暂无数据
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import { DatetimePicker, spinner } from 'mint-ui';
    import { purchases } from '../../api';
    import * as assets from '../../assets';

    export default {
        name: 'HomePurchaseList',
        data () {
            return {
                vendor: {},
                ...assets, // homeCustom, homePrice,homeNew,homeLose,head
                query: {
                    type: this.$route.query.type === 'order' ? 'order' : 'temp',
                    date: this.format(new Date()),
                    limit: 20,
                    offset: 0
                },
                purchase: [],
                pickerVisible: new Date(),
                startDate: new Date('2017/10/21'),
                endDate: this.addDay(new Date()),
                loadall: false,
                loading: false,
                loaded: false
            };
        },
        activated () {
            this.list();
        },
        methods: {
            format (date) {
                return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
                '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
            },
            showPicker () {
                this.$refs.picker.open();
            },
            handleConfirm (date) {
                this.loadall = false;
                this.query.date = this.format(date);
                this.list();
            },
            list () {
                this.query.offset = 0;
                this.loaded = false;
                purchases(this.query).success(data => {
                    this.purchase = data.meta;
                    this.loadall = true;
                    // 已经加载全部
                    if (data.meta.length < this.query.limit) {
                        this.loaded = true;
                    }
                    this.query.offset += this.query.limit;
                });
            },
            loadmore () {
                if (this.loadall) {
                    this.loading = true;
                    purchases(this.query).success(data => {
                        this.query.offset += this.query.limit;
                        this.loading = data.meta.length !== this.query.limit;
                        this.total = data.total;
                        // 已经加载全部
                        if (data.meta.length < this.query.limit) {
                            this.loaded = true;
                        }
                        this.purchase = this.purchase.concat(data.meta);
                    }).error(e => {
                        this.loading = false;
                    });
                }
            },
            clear () {
                this.loadall = false;
                this.query.date = '';
                this.list();
            },
            addDay (date) {
                return new Date(date.setDate(date.getDate() + 1));
            },
            freezePaging () {
                this.loading = true;
            },
            openPaging () {
                this.loading = false;
            }
        },
        components: {
            MtDatetimePicker: DatetimePicker,
            MtSpinner: spinner
        }
    };
</script>
