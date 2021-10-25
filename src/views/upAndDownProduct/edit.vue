<style lang="less" scoped>
    .van-cell__title {
        width: 90px;
        flex: none;
    }

    .van-cell__value {
        text-align: left;
    }

    .form-tip {
        padding-left: 105px;
        color: #ccc;
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 5px;
    }

    .mr {
        margin-right: 10px;
    }

    .form-radio > .form-radio-text, .form-text {
        color: #333;
    }
</style>

<template>
    <div>
        <van-cell-group :disabled="submitLoading">
            <div class="text-center" v-if="loading">
                <van-loading size="24px">加载中</van-loading>
            </div>

            <van-cell title="商品名称">
                <span class="form-text">{{data.Product.name}}</span>
            </van-cell>
            <van-field
                v-model="data.count"
                type="number"
                label="上架数量"
                placeholder="请输入上架数量"
                required
            >
                <span slot="right-icon">{{data.Product.ud}}</span>
            </van-field>
            <van-field
                v-model="data.unit_price"
                type="number"
                label="供货价"
                placeholder="请输入供货价"
                required
            >
                <span slot="right-icon">元/{{data.Product.ud}}</span>
            </van-field>
        </van-cell-group>

        <div class="padder" style="margin-top: 20px">
            <van-button :disabled="submitLoading || loading" type="info" style="width: 100%" @click="submit">
                {{data.status === 'REJECT' ? '再次提交': '提 交'}}
            </van-button>
        </div>
    </div>
</template>

<script>
    import * as upAndDownApplies from '../../api/lib/upAndDownApplies';
    import * as product from '../../api/lib/product';
    import { Toast } from 'vant';

    export default {
        name: 'HomeUpAndDownProductEdit',
        data () {
            return {
                loading: false,
                submitLoading: false,
                data: {
                    Product: {},
                    product_id: null
                }
            };
        },
        created () {
            const { id } = this.$route.params;
            if (id) {
                this.loading = true;
                upAndDownApplies.get(id).success(data => {
                    this.data = data;
                    this.loading = false;
                }).error(() => {
                    this.loading = false;
                });
            }

            const { product_id: productId } = this.$route.query;
            if (productId) {
                this.loading = true;
                product.get(productId).success(data => {
                    this.loading = false;
                    Object.assign(this.data, {Product: data, product_id: data.id});
                }).error(() => {
                    this.loading = false;
                });
            }
        },
        methods: {
            submit () {
                if (!(+this.data.count > 0)) {
                    Toast.fail('上架数量必须大于0');
                    return;
                }

                if (!(+this.data.unit_price > 0)) {
                    Toast.fail('促销供货价必须大于0');
                    return;
                }

                this.submitLoading = true;
                const instance = !this.data.id ? upAndDownApplies.add : this.data.status === 'REJECT' ? upAndDownApplies.reapply : upAndDownApplies.update;

                instance(Object.assign({type: 'UP'}, _.omit(this.data, 'Logs', 'vendor_id', 'commit_time', 'createdAt', 'updatedAt', 'Product'))).success(() => {
                    this.submitLoading = false;
                    Toast.success('提交成功');

                    this.$router.go(-1);
                }).error(() => {
                    this.submitLoading = false;
                });
            }
        }
    };
</script>

