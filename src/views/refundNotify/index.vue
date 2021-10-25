<style lang="less" scoped>
    .refund-header {
        overflow: hidden;
        background-color: #fff;
        margin-bottom: 1px;
    }

    .refund-arrow {
        vertical-align: sub;
        color: #999;
    }

    .refund-search {
        margin-bottom: 10px;
    }

    .list {
        background-color: #fff;
    }

    .table {
        td, th {
            text-align: left;
        }
    }
</style>

<template>
    <div class="refund-page">
        <van-search class="refund-search" placeholder="商品搜索" v-model="query.keywords" @search="search"/>

        <van-list
            class="list padder"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
            <van-sticky>
                <table class="table">
                    <thead>
                    <tr>
                        <th width="100">日期</th>
                        <th>商品名称</th>
                        <th width="80">数量</th>
                        <th width="40"></th>
                    </tr>
                    </thead>
                </table>
            </van-sticky>
            <table class="table">
                <tbody>
                <tr v-for="(item, index) in data" :key="item.id" @click="linkToInfo(item, index)">
                    <td width="100">
                        {{item.createdAt | date('YYYY-MM-DD')}}
                    </td>
                    <td>{{item.product_name}}</td>
                    <td width="80">
                        {{item.spec_quantity}}{{item.spec}}
                        <slot v-if="item.spec !== item.ud">{{item.ud_quantity}}{{item.ud}}</slot>
                    </td>
                    <td width="40" style="text-align: right">
                        <van-icon :dot="item.status === 'NOTICED'" size="18" name="arrow" style="vertical-align: sub" />
                    </td>
                </tr>
                </tbody>
            </table>
        </van-list>

    </div>
</template>

<script>
    import {
        Search,
        Popup,
        DatetimePicker
    } from 'vant';
    import * as vendorReturnNotice from '../../api/lib/vendorReturnNotice';

    export default {
        name: 'HomeRefundNotify',
        data () {
            return {
                query: {},
                dateVisible: false,
                date: null,
                dateType: '',
                loading: false,
                finished: false,
                offset: 0,
                data: []
            };
        },
        activated () {
            this.onLoad();
        },
        methods: {
            search () {
                this.offset = 0;
                this.data = [];
                this.loading = false;
                this.finished = false;

                this.onLoad();
            },
            onLoad () {
                this.loading = true;
                const { keywords } = this.query;

                vendorReturnNotice.list({
                    keywords,
                    limit: 20,
                    offset: this.offset
                }).success(data => {
                    this.loading = false;
                    if (data.meta.length < 20) {
                        this.finished = true;
                    }

                    this.data.splice(this.offset, 20, ...data.meta);
                    this.offset += 20;
                }).error(() => {
                    this.loading = false;
                    this.finished = true;
                });
            },
            linkToInfo ({ id }, index) {
                this.offset = Math.floor((index + 1) / 20) * 20;

                this.$router.push({
                    name: 'home.refundNotify.info',
                    params: {id}
                });
            }
        },
        components: {
            'VanDatetimePicker': DatetimePicker,
            'VanPopup': Popup,
            'VanSearch': Search
        }
    };
</script>

