<style lang="less" scoped>
@import "~style/var";
.bill-info {
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

    .fixed-wrapper {
        max-width: 736px;
        margin: auto;
        padding: 0 20px;
        box-sizing: border-box;
    }
}
</style>

<template>
    <div class="bill-info">
        <div class="text-center padder" v-if="loading">
            <van-loading size="24px">加载中</van-loading>
        </div>

        <div class="info-block">
            <p>验货单号
                <span>{{data.id}}</span>
            </p>
            <p>验货日期
                <span>{{data.date | date('YYYY-MM-DD')}}</span>
            </p>
            <p>进货
                <span>{{stat.purchase_money || 0 | money}}</span>
            </p>
            <p>退货
                <span>{{-(isFromStatement ? stat.confirm_return_money : stat.return_money) || 0 | money}}</span>
            </p>
            <p>退押金
                <span>{{-(isFromStatement ? stat.confirm_deposit_money : stat.deposit_money) || 0 | money}}</span>
            </p>
            <p class="text-bold">
                合计
                <span class="text-danger">{{data.total_amount || 0 | money}}</span>
            </p>
            <p v-if="data.status === 'CONFIRM'" class="text-bold clear-margin">
                复核金额
                <span class="text-danger">{{data.confirm_total_amount || 0 | money}}</span>
            </p>
        </div>

        <div class="info-block" v-if="data.note">
            <p class="text-title">异议备注</p>
            <p class="clear-margin">{{data.note}}</p>
        </div>

        <div class="info-block" v-if="dissent.length && !isFromStatement" style="padding: 10px;">
            <p class="text-title" style="padding: 5px 8px 0;">异议商品</p>

            <div class="table-wrapper" style="padding-bottom: 5px;">
                <table class="table">
                    <thead>
                    <tr>
                        <th class="text-left">类型</th>
                        <th>商品名称</th>
                        <th>单价</th>
                        <th>数量</th>
                        <th class="text-right">金额</th>
                    </tr>
                    </thead>
                    <tbody>
                        <slot v-for="item in dissent" >
                            <tr :key="item.id">
                                <td :rowspan="data.status === 'CONFIRM' ? 2 : 1" class="text-left">{{item.type | keyValue(BILL_TYPE)}}</td>
                                <td :rowspan="data.status === 'CONFIRM' ? 2 : 1">{{item.relation_name}}</td>
                                <td>{{item.abnormal_unit_price | money}}</td>
                                <td>
                                    {{item.abnormal_quantity}}{{item.spec}}
                                    <slot v-if="item.spec !== item.ud">{{item.abnormal_ud_quantity}}{{item.ud}}</slot>
                                </td>
                                <td class="text-right">{{item.abnormal_money | money}}</td>
                            </tr>
                            <tr v-if="data.status === 'CONFIRM'" :key="'_' + item.id">
                                <td>
                                    <span v-if="item.confirm_unit_price !== item.abnormal_unit_price">
                                        {{item.confirm_unit_price | money}}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span v-if="(item.confirm_quantity !== item.abnormal_quantity) || (item.confirm_ud_quantity !== item.abnormal_ud_quantity)">
                                        {{item.confirm_quantity}}{{item.spec}}
                                        <slot v-if="item.spec !== item.ud">{{item.confirm_ud_quantity}}{{item.ud}}</slot>
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td class="text-right">
                                    <span v-if="item.confirm_money !== item.abnormal_money">
                                        {{item.confirm_money | money}}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                            </tr>
                        </slot>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="info-block" style="padding: 10px;">
            <p class="text-title" style="padding: 5px 8px 0;">商品列表</p>
            <div class="table-wrapper" style="padding-bottom: 5px;">
                <van-sticky :container="$refs.container" @scroll="handleScroll">
                    <div class="fixed-wrapper">
                        <table class="table" v-show="isFixed">
                            <thead>
                            <tr>
                                <th class="text-left">类型</th>
                                <th>商品名称</th>
                                <th>单价</th>
                                <th>数量</th>
                                <th class="text-right">金额</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </van-sticky>

                <table class="table" ref="container">
                    <thead>
                    <tr>
                        <th class="text-left">类型</th>
                        <th>商品名称</th>
                        <th>单价</th>
                        <th>数量</th>
                        <th class="text-right">金额</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.Items" :key="item.id">
                            <td class="text-left">{{item.type | keyValue(BILL_TYPE)}}</td>
                            <td>{{item.relation_name}}</td>

                            <slot v-if="isFromStatement">
                                <td>
                                    {{item.confirm_unit_price | money}}
                                </td>
                                <td>
                                    {{item.confirm_quantity}}{{item.spec}}
                                    <slot v-if="item.spec !== item.ud">{{item.confirm_ud_quantity}}{{item.ud}}</slot>
                                </td>
                            </slot>
                            <slot v-else>
                                <td>
                                    {{item.unit_price | money}}
                                </td>
                                <td>
                                    {{item.quantity}}{{item.spec}}
                                    <slot v-if="item.spec !== item.ud">{{item.ud_quantity}}{{item.ud}}</slot>
                                </td>
                            </slot>

                            <td class="text-right">
                                {{(isFromStatement ? item.confirm_money : item.money) | money}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="button-group text-right" v-if="!isFromStatement && data.status === 'CREATE'">
                <van-button @click="linkToBill" size="small" style="margin-right: 6px" plain round>异议</van-button>
                <van-button @click="handleConfirm" size="small" type="info" plain round>确认</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import * as vendorBill from '../../api/lib/vendorBill';
import { Dialog, Toast } from 'vant';

const BILL_TYPE = [
    {id: 'PURCHASE', name: '进货'},
    {id: 'RETURN', name: '退货'},
    {id: 'DEPOSIT', name: '退押金'}
];

export default {
    name: 'HomeBillInfo',
    data () {
        const { name } = this.$route;

        return {
            BILL_TYPE,
            isFromStatement: name === 'home.statement.bill',
            loading: false,
            isFixed: false,
            stat: {},
            data: {
                Items: []
            },
            dissent: []
        };
    },
    created () {
        this.getDetail();
    },
    methods: {
        handleScroll ({ isFixed }) {
            this.isFixed = isFixed;
        },
        getDetail () {
            const { id } = this.$route.params;
            this.loading = true;
            vendorBill.get(id).success(data => {
                this.loading = false;

                this.stat = data.stat;
                const Items = data.data.Items.map(item => {
                    if (['RETURN', 'DEPOSIT'].includes(item.type)) {
                        item.quantity = -item.quantity;
                        item.abnormal_quantity = -item.abnormal_quantity;
                        item.ud_quantity = -item.ud_quantity;
                        item.abnormal_ud_quantity = -item.abnormal_ud_quantity;
                        item.money = -item.money;
                        item.abnormal_money = -item.abnormal_money;
                    }

                    return item;
                });

                this.data = {
                    ...data.data,
                    Items
                };

                this.dissent = Items.filter(item => item.is_abnormal);
            }).error(() => {
                this.loading = false;
            });
        },
        handleConfirm () {
            const { id } = this.$route.params;

            Dialog.confirm({
                title: '提示',
                message: '我已确认该验货单没有异议'
            }).then(() => {
                this.loading = true;
                // 请求
                vendorBill.update({
                    id,
                    status: 'CONFIRM'
                }).success(() => {
                    Toast('操作成功');

                    // 刷新数据
                    this.getDetail();
                }).error(() => {
                    this.loading = false;
                });
            }).catch(() => {
                // nothing
            });
        },
        linkToBill () {
            const { id } = this.$route.params;

            this.$router.push({
                name: 'home.bill.edit',
                params: {id}
            });
        }
    }
};
</script>
