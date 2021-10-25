<style lang="less" scoped>
</style>

<template>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
        <van-cell-group>
            <van-cell v-for="item in data" :title="item.name" :key="item.id" is-link @click="linkToEdit(item)">
                <span slot="label">单位：{{item.ud}}</span>
            </van-cell>
        </van-cell-group>
    </van-list>
</template>

<script>
    import * as product from '../../api/lib/product';

    export default {
        name: 'product',
        data () {
            return {
                finished: false,
                loading: false,
                data: [],
                query: {
                    status: 'down',
                    limit: 20,
                    offset: 0
                }
            };
        },
        created () {
            this.onLoad();
        },
        methods: {
            onLoad () {
                this.loading = true;

                product.list(this.query).success(data => {
                    this.loading = false;
                    if (data.meta.length < 20) {
                        this.finished = true;
                    }

                    this.data.splice(this.query.offset, 20, ...data.meta);
                    this.query.offset += this.query.limit;
                }).error(() => {
                    this.finished = true;
                    this.loading = false;
                });
            },
            linkToEdit ({ id } = {}) {
                this.$router.replace({
                    name: 'home.upAndDownProduct.edit',
                    query: {product_id: id}
                });
            }
        }
    };
</script>

