<style lang="less" scoped>
@import "~style/var";
.statement-info {
    margin: 10px;
    padding: 0 2px;
    border-radius: 10px;
    background-color: #fff;
    color: #a2a2a2;

    p {
        line-height: 1;
        margin-bottom: 10px;

        span {
            float: right;
        }

        &.clear-margin {
            margin-bottom: 0;
        }
    }

    .info-block {
        padding: 15px 18px;
        border-bottom: 1px solid #f1f1f1;

        &:last-child {
            border-bottom: none;
        }
    }
    

    .text-bold, .text-title {
        font-weight: bold;
        color: @text-color;
    }

    .text-title {
        font-size: 14px;
    }

    .table-wrapper {
        // 原生table无法实现该效果
        border: 1px solid #f1f1f1;
        border-radius: 10px;
        overflow: hidden;
    }

    .table {
        width: 100%;
        margin: 0;
        border: none;
        color: #333;

        th {
            background-color: #f2f2f2;
            font-weight: normal;
        }

        td {
            font-weight: bold;
        }

        .text-left {
            padding-left: 10px;
            text-align: left;
        }

        .text-right {
            padding-right: 10px;
            text-align: right;
        }

        tbody > tr:last-child > td {
            border-bottom: none;
        }
    }

    .button-group {
        margin-top: 15px;
    }
}
</style>

<template>
    <div class="statement-info">
        <div class="text-center padder" v-if="loading">
            <van-loading size="24px">加载中</van-loading>
        </div>

        <div class="info-block">
            <p>结算日期
                <span>{{data.settle_start | date('YYYY-MM-DD')}}到{{data.settle_end | date('YYYY-MM-DD')}}</span>
            </p>
            <p>账单号
                <span>{{data.id}}</span>
            </p>
            <p>账单日期
                <span>{{data.date | date('YYYY-MM-DD')}}</span>
            </p>
            <p class="text-bold clear-margin">
                合计
                <span class="text-danger">{{data.total_amount || 0 | money}}</span>
            </p>
        </div>

        <div class="info-block" v-if="data.note">
            <p class="text-title">备注</p>
            <p class="clear-margin">{{data.note}}</p>
        </div>

        <div class="info-block" style="padding: 10px;">
            <p class="text-title" style="padding: 5px 8px 0;">商品列表</p>
            <div class="table-wrapper" style="padding-bottom: 5px;">
                <table class="table">
                    <thead>
                    <tr>
                        <th class="text-left">明细</th>
                        <th>金额</th>
                        <th class="text-right">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.Items" :key="item.id">
                            <td class="text-left">
                                <slot v-if="item.date">
                                    {{item.date | date('YYYY-MM-DD')}}
                                </slot>
                                <slot v-else>
                                    {{item.label}}
                                </slot>
                            </td>
                            <td>{{(item.confirm_total_amount || item.total_amount) | money}}</td>
                            <td class="text-right">
                                <router-link class="text-primary" v-if="item.date" :to="{name: 'home.statement.bill', params: {id: item.id}}">详情</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import * as vendorStatement from '../../api/lib/vendorStatement';

export default {
    name: 'HomeStatementInfo',
    data () {
        return {
            loading: false,
            stat: {},
            data: {
                Items: []
            }
        };
    },
    created () {
        this.getDetail();
    },
    methods: {
        getDetail () {
            const { id } = this.$route.params;
            this.loading = true;
            vendorStatement.get(id).success(data => {
                this.loading = false;

                const Items = [
                    {
                        id: 'adjustment_money',
                        label: '余额调整金额',
                        total_amount: data.adjustment_money
                    },
                    {
                        id: 'fine_money',
                        label: '违约金',
                        total_amount: data.fine_money
                    },
                    {
                        id: 'market_money',
                        label: '营销费用',
                        total_amount: data.market_money
                    },
                    {
                        id: 'rebate_money',
                        label: '返利金额',
                        total_amount: data.rebate_money
                    },
                    {
                        id: 'prepaid_money',
                        label: '垫付费用',
                        total_amount: data.prepaid_money
                    },
                    {
                        id: 'other_money',
                        label: '其他',
                        total_amount: data.other_money
                    },
                    ...data.Items,
                    {
                        id: 'bill_money',
                        label: '验货单合计',
                        total_amount: data.bill_money
                    }
                ];

                const [ { date: settleEnd } ] = data.Items.reverse();
                const [ { date: settleStart } ] = data.Items.reverse();

                this.data = {
                    ...data,
                    settle_start: settleStart,
                    settle_end: settleEnd,
                    Items
                };
            }).error(() => {
                this.loading = false;
            });
        }
    }
};
</script>