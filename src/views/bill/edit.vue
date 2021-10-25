<style lang="less" scoped>
@import "~style/var";
.bill-info {
    margin: 10px;
    border-radius: 10px;
    background-color: #fff;
    color: #a2a2a2;
    padding-bottom: 30px;

    .btn-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }

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

        .tr-warning {
            background-color: rgba(@orange-dark, 0.2);
        }

        tbody > tr:last-child > td {
            border-bottom: none;
        }

        tbody > tr:nth-last-child(2) > td[rowspan] {
            border-bottom: none;
        }
    }

    .button-group {
        margin-top: 15px;
    }

    .info-textarea {
      outline: none;
      border: none;
      width: 100%;
      height: 100px;
      background-color: #fafafa;
      padding: 15px 10px;
      border-radius: 10px;
      box-sizing: border-box;
    }

    .table-input {
      width: 50px;
      height: 30px;
      outline: none;
      border: 0.5px solid #3e8bf7;
      border-radius: 3px;
      text-align: center;
      font-weight: normal;
    }

    .quantity-input {
      width: 40%;
      margin: auto;
      overflow: hidden;
      padding: 10px;
      line-height: 28px;
    }

    .fixed-wrapper {
        max-width: 736px;
        margin: auto;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .quick-note {
        position: absolute;
        text-align: center;
        line-height: 15px;
        color: #fff;
        right: 0;
        background-color: rgba(@blue, .7);
        padding: 10px;
        border-radius: 25px 0 0 25px;

        i {
            vertical-align: middle;
        }
    }
    .tips {
        padding-left: 20px;
        color: #ff7979;
        font-size: 12px;
    }
}
</style>

<template>
    <div class="bill-info">
        <div class="text-center" v-if="loading">
            <van-loading size="24px">加载中</van-loading>
        </div>

        <div class="info-block">
            <p>验货单号
                <span>{{data.id}}</span>
            </p>
            <p>验货日期
                <span>{{data.date | date('YYYY-MM-DD')}}</span>
            </p>
            <p>送货
                <span>{{stat.purchase_money || 0 | money}}</span>
            </p>
            <p>退货
                <span>{{-stat.return_money || 0 | money}}</span>
            </p>
            <p>退押金
                <span>{{-stat.deposit_money || 0 | money}}</span>
            </p>
            <p class="text-bold clear-margin">
                合计
                <span class="text-danger">{{data.total_amount || 0 | money}}</span>
            </p>
        </div>

        <van-sticky :offset-top="80" :container="$refs.container">
            <transition name="van-slide-right">
                <div class="fixed-wrapper" style="padding: 0 10px;" v-show="isFixed">
                    <div class="quick-note" @click="toBottom">
                        <van-icon name="edit" /> 异议备注
                    </div>
                </div>
            </transition>
        </van-sticky>

        <div class="info-block" style="padding: 10px;">
            <div class="table-wrapper">
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
                        <slot v-for="item in data.Items" >
                            <tr :key="item.id" :class="{'tr-warning': item.purchase_abnormal}">
                                <td :rowspan="item.spec !== item.ud ? 2 : 1" class="text-left">
                                    {{item.type | keyValue(BILL_TYPE)}}
                                </td>
                                <td :rowspan="item.spec !== item.ud ? 2 : 1">{{item.relation_name}}</td>
                                <td :rowspan="item.spec !== item.ud ? 2 : 1">
                                    <input min="0" v-model="item.abnormal_unit_price" class="table-input" :placeholder="item.unit_price | money" type="number" />
                                </td>
                                <td>
                                    <input min="0" v-model="item.abnormal_quantity" class="table-input" :placeholder="item.quantity + item.spec" type="number" />
                                </td>
                                <td :rowspan="item.spec !== item.ud ? 2 : 1" class="text-right" style="overflow: auto;">
                                    {{countMoney(item) | money}}
                                </td>
                            </tr>
                            <tr v-if="item.spec !== item.ud" :key="'_' + item.id" :class="{'tr-warning': item.purchase_abnormal}">
                                <td>
                                    <input min="0" v-model="item.abnormal_ud_quantity" class="table-input" :placeholder="item.ud_quantity + item.ud" type="number" />
                                </td>
                            </tr>
                        </slot>

                    </tbody>
                </table>
            </div>
        </div>
        <p class="tips">提示：若对单价或数量有异议，请您直接在上面修改后提交。</p>
        <div class="info-block" style="padding: 10px;">
            <p class="text-title" style="padding: 0 10px">异议备注</p>
            <textarea v-model="form.note" class="info-textarea" name="note" cols="30" maxlength="50" placeholder="最多50个字，可不填" rows="10"></textarea>
        </div>

        <van-button :disabled="loading" type="info" class="btn-bottom" @click="handleConfirm">提交</van-button>
    </div>
</template>

<script>
import * as vendorBill from '../../api/lib/vendorBill';
import { Toast, Stepper } from 'vant';

const BILL_TYPE = [
    {id: 'PURCHASE', name: '进货'},
    {id: 'RETURN', name: '退货'},
    {id: 'DEPOSIT', name: '退押金'}
];

export default {
    name: 'HomeBillEdit',
    data () {
        const { id } = this.$route.params;

        return {
            BILL_TYPE,
            testA: 0,
            quantityVisible: true,
            loading: false,
            stat: {},
            form: {
                id,
                note: ''
            },
            data: {
                Items: []
            },
            dissent: [],
            isFixed: false
        };
    },
    created () {
        this.getDetail();
    },
    methods: {
        handleScroll ({ isFixed }) {
            this.isFixed = isFixed;
        },
        toBottom () {
            window.scrollBy(0, 99999);
        },
        getDetail () {
            const { id } = this.$route.params;
            this.loading = true;
            vendorBill.get(id).success(data => {
                this.stat = data.stat;
                this.data = {
                    ...data.data,
                    Items: data.data.Items.map(item => {
                        return Object.assign(item, {
                            abnormal_quantity: '',
                            abnormal_ud_quantity: '',
                            abnormal_unit_price: ''
                        });
                    })
                };

                this.loading = false;
            }).error(() => {
                this.loading = false;
            });
        },
        handleConfirm () {
            const { Items } = this.data;

            // 验证数据
            const priceAllRight = _.every(Items, item => {
                return +item.abnormal_unit_price >= 0 && !_.isNaN(+item.abnormal_unit_price);
            });
            const quantityAllRight = _.every(Items, item => {
                return +item.abnormal_quantity >= 0 && !_.isNaN(+item.abnormal_quantity) &&
                  +item.abnormal_ud_quantity >= 0 && !_.isNaN(+item.abnormal_ud_quantity);
            });

            if (!priceAllRight) {
                Toast.fail('价格是不能小于0的数字');
                return;
            }

            if (!quantityAllRight) {
                Toast.fail('数量是不能小于0的数字');
                return;
            }

            // 数据处理，如果用户没填，处理为默认值
            this.form.items = Items.map(item => {
                // 处理不同单位的情况
                item.abnormal_ud_quantity = (item.spec === item.ud) ? item.abnormal_quantity : item.abnormal_ud_quantity;

                let p = {};

                if (item.abnormal_unit_price !== '') {
                    p.abnormal_unit_price = +(+item.abnormal_unit_price).toFixed(2);
                }

                if (item.abnormal_quantity !== '') {
                    p.abnormal_quantity = +(+item.abnormal_quantity).toFixed(2);
                }

                if (item.abnormal_ud_quantity !== '') {
                    p.abnormal_ud_quantity = +(+item.abnormal_ud_quantity).toFixed(2);
                }

                if (!_.isEmpty(p)) {
                    p = Object.assign({
                        id: item.id,
                        abnormal_unit_price: item.unit_price,
                        abnormal_quantity: item.quantity,
                        abnormal_ud_quantity: item.ud_quantity
                    }, p);
                }

                return p;
            }).filter(item => !_.isEmpty(item));

            this.loading = true;

            // 请求
            vendorBill.update({
                ...this.form,
                status: _.isEmpty(this.form.items) ? 'CONFIRM' : 'OBJECTION'
            }).success(() => {
                Toast('操作成功');
                this.loading = false;

                // 刷新数据
                this.$router.go(-1);
            }).error(() => {
                this.loading = false;
            });
        },
        countMoney (item) {
            const {
                unit_price: unitPrice,
                ud_quantity: udQuantity,
                quantity
            } = item;

            let {
                abnormal_unit_price: abnormalUnitPrice,
                abnormal_ud_quantity: abnormalUdQuantity,
                abnormal_quantity: abnormalQuantity
            } = item;

            if (abnormalUnitPrice === '') {
                abnormalUnitPrice = unitPrice;
            }

            if (abnormalUdQuantity === '') {
                abnormalUdQuantity = udQuantity;
            }

            if (abnormalQuantity === '') {
                abnormalQuantity = quantity;
            }

            if (item.spec === item.ud) {
                abnormalUdQuantity = abnormalQuantity;
            }

            return abnormalUnitPrice * abnormalUdQuantity + abnormalQuantity * item.deposit;
        }
    },
    components: {
        'VanStepper': Stepper
    }
};
</script>
