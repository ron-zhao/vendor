<style lang="less" scoped>
    .van-cell__title {
        width: 90px;
        flex: none;
        margin-right: 10px;
    }

    .van-field {
        /deep/
        .van-field__label {
            margin-right: 10px;
        }
    }


    .van-cell__value {
        text-align: left;
    }

    .form-tip {
        padding: 10px 0 10px 105px;
        color: #333;
        font-size: 13px;
        font-weight: 400;
    }

    .mr {
        margin-right: 10px;
    }

    .form-radio {
        line-height: 16px;

        &:nth-child(1) {
            margin-right: 40px;
        }

        > .form-radio-text {
            color: #333;
            vertical-align: text-top;
        }
    }

    .form-text {
        color: #333;
    }

</style>

<template>
    <div>
        <div class="text-center" v-if="loading">
            <van-loading size="24px">加载中</van-loading>
        </div>

        <van-cell-group :disabled="submitLoading" :border="false">
            <van-cell title="选择商品" @click="!loading && !data.id && (productVisible = true)" required is-link>
                <span class="form-text" v-if="data.product_id">{{data.Product.name}}</span>
                <slot v-else>请选择</slot>
            </van-cell>
            <van-cell title="促销方式" required>
                <label class="form-radio" v-for="type in PROMOTION_TYPE" :key="type.id" @click="data.promotion_type = type.id">
                    <i v-if="type.id === data.promotion_type" class="iconfont icon-iconfontxuanze text-primary"></i>
                    <i v-else class="iconfont icon-xuanze1"></i>
                    <span class="form-radio-text">{{type.name}}</span>
                </label>
            </van-cell>
        </van-cell-group>

        <van-cell-group class="mt" :disabled="submitLoading" :border="false">
            <van-field
                v-model="data.unit_price"
                type="number"
                label="促销供货价"
                placeholder="请输入"
                required
            />
            <van-field
                v-model="data.promotion_price"
                type="number"
                label="建议促销售价"
                placeholder="请输入"
                required
            />
        </van-cell-group>

        <van-cell-group class="mt" :disabled="submitLoading" :border="false">
            <van-cell title="促销开始时间" required is-link @click="openStartDate">
                <span class="form-text" v-if="data.start">{{data.start | date('YYYY-MM-DD')}}</span>
                <slot v-else>请选择</slot>
            </van-cell>
            <van-cell title="促销结束时间" required is-link @click="openEndDate">
                <span class="form-text" v-if="data.end">{{data.end | date('YYYY-MM-DD')}}</span>
                <slot v-else>请选择</slot>
            </van-cell>
        </van-cell-group>

        <van-cell-group class="mt" :disabled="submitLoading" :border="false">
            <van-field
                v-model="data.promotion_quantity"
                type="number"
                label="促销计划总量"
                placeholder="请输入"
                required
            >
                <span slot="right-icon">{{data.Product.ud}}</span>
            </van-field>
        </van-cell-group>

        <div class="padder" style="margin-top: 20px">
            <van-button :disabled="loading && submitLoading" type="info" style="width: 100%" @click="submit">
                {{data.status === 'REJECT' ? '再次提交': '提 交'}}
            </van-button>
        </div>

        <van-popup :overlay="false" v-model="productVisible" ref="container" position="right" style="height: 100%; width: 100%">
            <select-product :product-id="data.product_id" @handle-sure="handleProductSure"/>
        </van-popup>

        <van-popup v-model="dateVisible" position="bottom">
            <van-datetime-picker
                v-if="dateType === 'start'"
                key="start"
                v-model="date"
                type="date"
                :max-date="maxDate"
                @confirm="handleConfirm"
                @cancel="dateVisible = false"
            />
            <van-datetime-picker
                v-if="dateType === 'end'"
                key="end"
                v-model="date"
                type="date"
                :min-date="minDate"
                @confirm="handleConfirm"
                @cancel="dateVisible = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import * as promotionApplies from '../../api/lib/promotionApplies';
    import SelectProduct from './SelectProduct';
    import { Toast, DatetimePicker } from 'vant';

    const PROMOTION_TYPE = [
        {id: 'SECKILL', name: '秒杀'},
        {id: 'SPECIAL', name: '特价'}
    ];

    export default {
        name: 'HomePromotionEdit',
        data () {
            return {
                PROMOTION_TYPE,
                productVisible: false,
                loading: false,
                submitLoading: false,
                dateVisible: false,
                minDate: null,
                maxDate: null,
                date: null,
                dateType: '',
                data: {
                    Product: {},
                    product_id: null,
                    promotion_type: 'SECKILL'
                }
            };
        },
        created () {
            const { id } = this.$route.params;
            if (id) {
                this.loading = true;
                promotionApplies.get(id).success(data => {
                    this.data = {
                        ...data,
                        start: moment(data.start)._d,
                        end: moment(data.end)._d
                    };
                    this.loading = false;
                }).error(() => {
                    this.loading = false;
                });
            }
        },
        methods: {
            handleProductSure (product = {}) {
                Object.assign(this.data, {Product: product, product_id: product.id});
                this.productVisible = false;
            },
            handleValidate () {
                let flag = true;
                if (!this.data.product_id) {
                    Toast.fail('请选择促销商品');
                    flag = false;
                    return;
                }

                if (!(+this.data.unit_price > 0)) {
                    Toast.fail('促销供货价必须大于0');
                    flag = false;
                    return;
                }

                if (!(+this.data.promotion_price > 0)) {
                    Toast.fail('促销销售价必须大于0');
                    flag = false;
                    return;
                }

                if (!this.data.start) {
                    Toast.fail('请选择促销开始时间');
                    flag = false;
                    return;
                }

                if (!this.data.end) {
                    Toast.fail('请选择促销结束时间');
                    flag = false;
                    return;
                }

                if (+this.data.unit_price > +this.data.promotion_price) {
                    Toast.fail('促销建议售价必须大于供货价');
                    flag = false;
                    return;
                }
                return flag;
            },
            submit () {
                // 验证
                let isValidate = this.handleValidate();
                if (isValidate) {
                    this.submitLoading = true;
                    const instance = !this.data.id ? promotionApplies.add : this.data.status === 'REJECT' ? promotionApplies.reapply : promotionApplies.update;

                    instance({
                        ..._.omit(this.data, 'Logs', 'vendor_id', 'commit_time', 'createdAt', 'updatedAt', 'Product')
                    }).success(() => {
                        this.submitLoading = false;
                        Toast.success('提交成功');
                        this.$router.go(-1);
                    }).error(() => {
                        this.submitLoading = false;
                    });
                }
            },
            openStartDate () {
                this.minDate = null;
                this.maxDate = this.data.end;
                this.date = this.data.start || moment()._d;
                this.dateVisible = true;
                this.dateType = 'start';
            },
            openEndDate () {
                this.minDate = this.data.start;
                this.maxDate = null;
                this.date = this.data.end || moment()._d;
                this.dateVisible = true;
                this.dateType = 'end';
            },
            handleConfirm () {
                if (this.dateType === 'start') {
                    this.data.start = this.date;
                } else {
                    this.data.end = this.date;
                }

                this.dateVisible = false;
            }
        },
        beforeDestroy () {
            this.productVisible = false;
        },
        components: {
            'VanDatetimePicker': DatetimePicker,
            SelectProduct
        }
    };
</script>

