<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .purchase-list
        height: 100%
        padding-bottom: 0.2rem
        .search-box
            height: 0.64rem
            margin: 0.2rem auto 0.4rem auto
            .search-content
                height: 100%
                margin: 0 2%
                .date-select
                    height: 100%
                    width: 50%
                    padding-left: 0.2rem
                    border-radius: 3px
                    border: 1px solid #ccc
        .btn-primary
            float: right
            margin-left: 10px
            color: #fff
            background-color: $primary
            padding: 10px
            border: none
            border-radius: 3px
            line-height: 100%
        select
            color: #3478f5
            font-weight: 700
            background-color: #e5ebf5
            border: none
            outline: none
        table
            border: 1px solid #c7c7c7
            thead
                tr
                    color: #3478f5
                    background-color: #e5ebf5
        table tr th, table tr td
            border: 0
            border-bottom: 1px solid #c7c7c7


</style>

<template>
    <div>
        <router-view v-on:freezePaging="freezePaging" v-on:openPaging="openPaging"></router-view>
        <div class="viewports purchase-list">
            <div class="search-box">
                <div class="search-content">
                    <span>采购时间：</span>
                    <input type="text" v-model="query.purchase_date" @click="showPicker"  placeholder="请选择采购时间" class="date-select" readonly>
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
                    <input type="button" value="清空时间" class="btn-primary" @click="clear">
                </div>
            </div>
            <div v-infinite-scroll="loadmore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10"
                 infinite-scroll-immediate-check="false">
                <table class="table" border="0">
                    <thead>
                        <tr>
                            <th width="10%">编号</th>
                            <th width="20%">采购时间</th>
                            <th width="15%">商品种类</th>
                            <th width="24%">
                                <select class="select" name='status' v-model='query.status' @change='list()'>
                                    <option value="">状态</option>
                                    <option v-for='(item, index) in status'  :value='item.id' v-text='item.name '></option>
                                </select>
                                <i class="iconfont icon-right icon-xiajiantou"></i>
                            </th>
                            <th width="10%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-show='!loadall'>
                            <td colspan="5">
                                <div class="text-center load-more padder" >
                                    <mt-spinner :type="3"></mt-spinner>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="item in data" v-show="loadall">
                            <td>{{item.id}}</td>
                            <td>{{item.purchase_date | date('YYYY.MM.DD')}}</td>
                            <td>{{item.product_count}}</td>
                            <td>
                                {{item.status==="pending" ?
                                "待录入" : item.status==="entryprice" ?
                                    "待确认价格" : item.status==="entryquantity" ?
                                        "待确认数量" : "已完成"}}</td>
                            <td>
                                <a class="text-link"
                                   v-if="item.status === 'commit'"
                                   @click="$router.push({name:'home.onlineIn',query:{id: item.id}})">
                                    录入
                                </a>
                                <a class="text-link"
                                   v-if="item.status !== 'commit'"
                                   @click="$router.push({name:'home.onlineIn',query:{id: item.id}})">
                                    查看
                                </a>
                            </td>
                        </tr>
                        <tr v-if="data.length && loadall">
                            <td colspan="5">
                                <span v-show='loaded'>已经加载全部~</span>
                                <div class="text-center load-more padder" v-show='!loaded'>
                                    <mt-spinner :type="3"></mt-spinner>
                                </div>
                            </td>
                        </tr>
                        <tr v-show='!data.length && loadall'>
                            <td colspan="5">
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
    import { onlineInLog } from '../../api';
    import * as assets from '../../assets';

    export default {
        data () {
            return {
                vendor: {},
                ...assets, // homeCustom, homePrice,homeNew,homeLose,head
                query: {
                    purchase_date: '',
                    status: '',
                    limit: 20,
                    offset: 0
                },
                data: [],
                startDate: new Date('2017/10/21'),
                pickerVisible: new Date(),
                endDate: this.addDay(new Date()),
                loadall: false,
                loading: false,
                loaded: false,
                status: [
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
            format (date) {
                return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
                '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
            },
            showPicker () {
                this.$refs.picker.open();
            },
            handleConfirm (date) {
                this.loadall = false;
                this.query.date = this.query.purchase_date = this.format(date);
                this.list();
            },
            list () {
                this.query.offset = 0;
                this.loaded = false;
                onlineInLog(this.query).success(data => {
                    this.data = data.meta;
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
                    onlineInLog(this.query).success(data => {
                        this.query.offset += this.query.limit;
                        this.loading = data.meta.length !== this.query.limit;
                        this.total = data.total;
                        // 已经加载全部
                        if (data.meta.length < this.query.limit) {
                            this.loaded = true;
                        }
                        this.data = this.data.concat(data.meta);
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
        },
        watch: {

        }
    };
</script>
