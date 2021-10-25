<style lang="less" scoped>
    @import "~style/var";

    .statement-time {
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

    .statement-list {
        .statement-item {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 10px;
            background-color: #fff;
        }

        .statement-first-line {
            display: flex;
            color: #a2a2a2;

            div {
                flex: 1;
            }
        }

        .text-info {
            color: #a2a2a2;
        }

        h3.statement-second-line {
            margin-top: 6px;
            font-size: 13px;
            font-weight: bold;

            span {
                font-size: 15px;
            }

            span.statement-tag {
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
<div class="statement-layout">
    <van-list
        class="list padder"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
        <div class="statement-time">
            <img src="../../assets/calendar.png" alt="calendar" />
            <span class="time-start" @click="openStartDate">{{query.start | date('YYYY-MM-DD')}}</span>
            <span class="time-split">至</span>
            <span class="time-end" @click="openEndDate">{{query.end | date('YYYY-MM-DD')}}</span>
        </div>

        <ul class="statement-list">
            <li class="statement-item" v-for="(item, index) in data" :key="item.id" @click="linkToInfo(item, index)">
                <div class="statement-first-line">
                    <div class="text-left">账单日期：{{item.date | date('YYYY-MM-DD')}}</div>
                    <div class="text-right">账单号：{{item.id}}</div>
                </div>
                <h3 class="statement-second-line">
                    合计：<span class="text-danger">{{item.total_amount | money}}</span>
                </h3>
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
import * as vendorStatement from '../../api/lib/vendorStatement';
import { DatetimePicker } from 'vant';

export default {
    name: 'HomeStatement',
    data () {
        return {
            data: [],
            query: {
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

                vendorStatement.list(this.query).success(data => {
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
        linkToInfo ({ id } = {}, index = 0) {
            // 记录当前页码，删除之后数据，更改finished状态
            this.query.offset = Math.floor((index + 1) / 20) * 20;

            this.$router.push({
                name: 'home.statement.info',
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
    components: {
        'VanDatetimePicker': DatetimePicker
    }
};
</script>