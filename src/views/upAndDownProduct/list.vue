<style lang="less" scoped rel="stylesheet/less">
    .btn-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .list {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: calc(100% - 50px);
        background-color: #fff;
    }

    .table {
        th, td {
            text-align: left;
        }
    }

</style>

<template>
    <div>
        <mt-navbar v-model="query.type">
            <mt-tab-item id="UP">上架</mt-tab-item>
            <mt-tab-item id="DOWN">下架</mt-tab-item>
        </mt-navbar>

        <van-list
            class="list padder mt"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
            <table class="table">
                <thead>
                <tr>
                    <th>申请时间</th>
                    <th>商品名称</th>
                    <th>状态</th>
                    <th v-if="query.type === 'UP'">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in data" v-show="data.length" :key="index" @click="linkToInfo(item)">
                    <td>{{item.createdAt | date('YYYY/MM/DD')}}</td>
                    <td>{{item.product_name}}</td>
                    <td>{{item.status | keyValue(status)}}</td>
                    <td v-if="query.type === 'UP'">
                        <a @click.stop="linkToInfo(item)" class="text-link">查看</a>
                        <a @click.stop="linkToEdit(item, index)" class="text-link" v-if="['COMMIT', 'REJECT'].includes(item.status)">编辑</a>
                    </td>
                </tr>
                </tbody>
            </table>

            <van-button type="info" @click="linkToProduct()" class="btn-bottom">新 增</van-button>
        </van-list>

        <van-popup :overlay="false" v-model="productVisible" ref="container" position="right" style="height: 100%; width: 100%; padding-bottom: 44px; box-sizing: border-box;">
            <select-product v-if="productVisible" :product-id="downProductId" hide-price status="up" @handle-sure="handleProductSure"/>

            <div class="btn-bottom" style="display: flex">
                <van-button style="width: 50%" :disabled="productLoading" @click="productVisible = false;">取消</van-button>
                <van-button style="width: 50%" :disabled="productLoading" type="info" @click="handleDown">下架</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import * as upAndDownApplies from '../../api/lib/upAndDownApplies';
    import SelectProduct from '../promotion/SelectProduct';
    import { Toast } from 'vant';

    let instance;

    export default {
        name: 'HomeUpAndDownProduct',
        data () {
            const { type = 'UP' } = this.$route.query;

            return {
                productVisible: false,
                productLoading: false,
                downProductId: null,
                query: {
                    limit: 20,
                    offset: 0,
                    type
                },
                data: [],
                finished: false,
                loading: false,
                status: [
                    {id: 'ACCEPT', name: '已受理'},
                    {id: 'COMMIT', name: '已申请'},
                    {id: 'REJECT', name: '已驳回'}
                ]
            };
        },
        activated () {
            this.finished = false;
            this.onLoad();
        },
        methods: {
            onLoad () {
                if (!this.finished) {
                    this.loading = true;

                    instance = upAndDownApplies.list(this.query).success(data => {
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
            linkToInfo ({id}) {
                if (this.query.type === 'UP') {
                    this.$router.push({
                        name: 'home.upAndDownProduct.info',
                        params: {id}
                    });
                }
            },
            linkToEdit ({id} = {}, index = 0) {
                // 记录当前页码
                this.query.offset = Math.floor((index + 1) / 20) * 20;

                this.$router.push({
                    name: 'home.upAndDownProduct.edit',
                    params: {id}
                });
            },
            linkToProduct () {
                if (this.query.type === 'UP') {
                    this.query.offset = 0;
                    this.data = [];
    
                    this.$router.push({
                        name: 'home.upAndDownProduct.product'
                    });
                } else {
                    // 跳下架页面
                    this.downProductId = null;
                    this.productVisible = true;
                }
            },
            handleProductSure (product = {}) {
                this.downProductId = product.id;
            },
            handleDown () {
                if (!this.downProductId) {
                    Toast.fail('请选择一个商品');
                    return;
                }

                this.productLoading = true;

                upAndDownApplies.add({
                    product_id: this.downProductId,
                    type: 'DOWN'
                }).success(() => {
                    this.productLoading = false;
    
                    this.reload();
                    Toast.success('下架商品申请成功');

                    this.productVisible = false;
                }).error(() => {
                    this.productLoading = false;
                });
            },
            reload () {
                this.query.offset = 0;
                this.data = [];
                this.finished = false;

                this.onLoad();
            }
        },
        watch: {
            'query.type' (type) {
                instance && instance.cancel && instance.cancel();
                this.reload();
            }
        },
        components: {
            SelectProduct
        }
    };
</script>

