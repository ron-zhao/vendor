<style lang="less" scoped>
    @import "~style/var";

    .bill-time {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
        background-color: #fff;
        text-align: center;
        line-height: 16px;

        img {
            width: 16px;
            vertical-align: middle;
            margin-right: 10px;
            margin-top: -2px;
        }

        .time-start, .time-end {
            color: #a2a2a2;
        }

        .time-split {
            margin: 0 10px;
        }
    }

    .bill-list {
        .bill-item {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 10px;
            background-color: #fff;
        }

        .bill-first-line {
            display: flex;
            color: #a2a2a2;

            div {
                flex: 1;
            }
        }

        .text-info {
            color: #a2a2a2;
        }

        h3.bill-second-line {
            margin-top: 6px;
            font-size: 13px;
            font-weight: bold;

            span {
                font-size: 15px;
            }

            span.bill-tag {
                width: 40px;
                height: 19px;
                background-color: #fff0f0;
                color: #ed0a24;
                font-size: 10px;
                border-radius: 3px;
                text-align: center;
                float: right;
                font-weight: 400;

                &.primary {
                    background-color: #f1f7ff;
                    color: @blue;
                }
            }
        }

        .button-group {
            margin-top: 10px;
            padding: 10px 10px 0;
            border-top: 1px solid #f1f1f1;
        }
    }
</style>

<template>
<div class="bill-layout">
    <mt-navbar v-model="query.status">
        <mt-tab-item id="ALL">全部</mt-tab-item>
        <mt-tab-item v-for="status in BILL_STATUS" :key="status.id" :id="status.id">{{status.name}}</mt-tab-item>
    </mt-navbar>

    <van-list
        class="list padder"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
        <div class="bill-time">
            <img src="../../assets/calendar.png" alt="calendar" />
            <span class="time-start" @click="openStartDate">{{query.start | date('YYYY-MM-DD')}}</span>
            <span class="time-split">至</span>
            <span class="time-end" @click="openEndDate">{{query.end | date('YYYY-MM-DD')}}</span>
        </div>

        <ul class="bill-list">
            <li class="bill-item" v-for="(item, index) in data" :key="item.id" @click="linkToInfo(item, index)">
                <div class="bill-first-line">
                    <div class="text-left">验货日期：{{item.date | date('YYYY-MM-DD')}}</div>
                    <div class="text-right">验货单号：{{item.id}}（{{item.type | keyValue(BILL_TYPE)}}）</div>
                </div>
                <h3 class="bill-second-line">
                    合计：<span class="text-danger">{{(item.status === 'CONFIRM' ? item.confirm_total_amount : item.total_amount) | money}}</span>
                    <span v-if="item.status === 'CONFIRM'" class="bill-tag primary">{{item.status | keyValue(BILL_STATUS)}}</span>
                    <span v-if="['OBJECTION', 'CHECK'].includes(item.status)" class="bill-tag">{{item.status | keyValue(BILL_FULL_STATUS)}}</span>
                </h3>
                <div v-if="item.status === 'CREATE'" class="button-group text-right" @click.stop>
                    <van-button @click="linkToBill(item, index)" size="small" style="margin-right: 6px" plain round>异议</van-button>
                    <van-button @click="handleConfirm(item.id, index)" size="small" type="info" plain round>确认</van-button>
                </div>
            </li>
        </ul>
    </van-list>

    <van-popup v-model="dateVisible" position="bottom">
        <van-datetime-picker
            title="开始时间"
            v-if="dateType === 'start'"
            key="start"
            v-model="date"
            type="date"
            :max-date="maxDate"
            @confirm="handleDateConfirm"
            @cancel="dateVisible = false"
        />
        <van-datetime-picker
            title="结束时间"
            v-if="dateType === 'end'"
            key="end"
            v-model="date"
            type="date"
            :min-date="minDate"
            @confirm="handleDateConfirm"
            @cancel="dateVisible = false"
        />
    </van-popup>
</div>
</template>

<script>
import * as vendorBill from '../../api/lib/vendorBill';
import { Dialog, Toast, DatetimePicker } from 'vant';

const BILL_STATUS = [
    {id: 'CREATE', name: '待确认'},
    {id: 'OBJECTION', name: '有异议'},
    {id: 'CONFIRM', name: '已确认'}
];

const BILL_FULL_STATUS = [
    ...BILL_STATUS,
    {id: 'CHECK', name: '审核中'} // 此状态不用做筛选
];

const BILL_TYPE = [
    {id: 'ORDER', name: '集采'},
    {id: 'INV', name: '库存'}
];

let instance;

export default {
    name: 'HomeBill',
    data () {
        return {
            BILL_TYPE,
            BILL_STATUS,
            BILL_FULL_STATUS,
            data: [],
            query: {
                status: 'ALL',
                start: moment().subtract(1, 'month')._d,
                end: new Date(),
                limit: 20,
                offset: 0
            },
            finished: false,
            loading: false,
            dateVisible: false,
            minDate: null,
            maxDate: null,
            date: null,
            dateType: ''
        };
    },
    activated () {
        this.onLoad();
    },
    methods: {
        onLoad () {
            if (!this.loadall) {
                this.loading = true;

                instance = vendorBill.list({
                    ...this.query,
                    status: this.query.status === 'ALL' ? '' : this.query.status
                }).success(data => {
                    this.loading = false;
                    if (data.meta.length < 20) {
                        this.finished = true;
                    }

                    this.data.splice(this.query.offset, 20, ...data.meta);
                    this.query.offset += this.query.limit;
                }).error(() => {
                    this.loading = false;
                    this.finished = true;
                });
            }
        },
        handleConfirm (id, index) {
            Dialog.confirm({
                title: '提示',
                message: '我已确认该验货单没有异议'
            }).then(() => {
                // 请求
                vendorBill.update({
                    id,
                    status: 'CONFIRM'
                }).success(() => {
                    Toast('操作成功');

                    // 刷新数据
                    this.query.offset = Math.floor((index + 1) / 20) * 20;
                    this.finished = false;
                    this.onLoad();
                }).error(() => {
                    // nothing
                });
            }).catch(() => {
                // nothing
            });
        },
        linkToBill ({ id } = {}, index = 0) {
            // 记录当前页码，删除之后数据，更改finished状态
            this.query.offset = Math.floor((index + 1) / 20) * 20;
            // 异议界面

            this.$router.push({
                name: 'home.bill.edit',
                params: {id}
            });
        },
        linkToInfo ({ id } = {}, index = 0) {
            // 记录当前页码，删除之后数据，更改finished状态
            this.query.offset = Math.floor((index + 1) / 20) * 20;

            this.$router.push({
                name: 'home.bill.info',
                params: {id}
            });
        },
        openStartDate () {
            this.minDate = null;
            this.maxDate = this.query.end;
            this.date = this.query.start || moment()._d;
            this.dateVisible = true;
            this.dateType = 'start';
        },
        openEndDate () {
            this.minDate = this.query.start;
            this.maxDate = null;
            this.date = this.query.end || moment()._d;
            this.dateVisible = true;
            this.dateType = 'end';
        },
        handleDateConfirm () {
            if (this.dateType === 'start') {
                this.query.start = this.date;
            } else {
                this.query.end = this.date;
            }

            this.dateVisible = false;

            this.query.offset = 0;
            this.data = [];
            this.finished = false;

            this.onLoad();
        }
    },
    watch: {
        'query.status' () {
            instance && instance.cancel && instance.cancel();

            this.query.offset = 0;
            this.data = [];
            this.finished = false;

            this.onLoad();
        }
    },
    components: {
        'VanDatetimePicker': DatetimePicker
    }
};
</script>