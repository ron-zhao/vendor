<style lang="less" scoped>
    .list-wrapper {
        display: flex;
        flex-flow: column;
        height: 100%;

        .list {
            overflow-y: auto;
        }
    }

    .mr {
        margin-right: 10px;
    }
</style>

<template>
    <div class="list-wrapper">
        <van-search
            class="list-search"
            v-model="query.keywords"
            placeholder="请输入商品名称"
            shape="round"
            @search="refreshList"
            @cancel="refreshList"
        />

        <van-list
            class="list"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
            <van-radio-group v-model="id">
                <van-cell-group>
                    <van-cell v-for="item in data" :key="item.id" :title="item.name" clickable
                              @click="handleSure(item)">
                        <van-radio class="mr" slot="icon" :name="item.id"/>
                        <span slot="label">
                            <slot v-if="hidePrice">
                                单位：{{item.ud}}
                            </slot>
                            <slot v-else>
                                我的报价：{{item.in_price}}元/{{item.ud}}
                            </slot>
                        </span>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </van-list>
    </div>
</template>

<script>
    import { Search } from 'vant';
    import * as product from '../../api/lib/product';

    export default {
        name: 'SelectProduct',
        props: {
            productId: {
                type: Number
            },
            hidePrice: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                id: '',
                finished: false,
                loading: false,
                data: [],
                query: {
                    status: this.status,
                    limit: 20,
                    offset: 0
                }
            };
        },
        created () {
            this.id = this.productId;
            this.onLoad();
        },
        methods: {
            refreshList () {
                this.loading = false;
                this.finished = false;
                this.query.offset = 0;
                this.data = [];

                this.onLoad();
            },
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
                    this.loading = false;
                    this.finished = true;
                });
            },
            handleSure (row) {
                this.id = row.id;
                this.$emit('handle-sure', row);
            }
        },
        watch: {
            'productId' (id) {
                this.id = id;
            }
        },
        components: {
            'van-search': Search
        }
    };
</script>

