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
        height: 100%;
        background-color: #fff;
    }


    .table {
        th, td {
            text-align: left;
        }
    }
</style>

<template>
    <van-list
        class="list padder"
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
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in data" v-show="data.length" :key="index" @click="linkToInfo(item)">
                <td>{{item.createdAt | date('YYYY/MM/DD')}}</td>
                <td>{{item.Product.name}}</td>
                <td>{{item.status | keyValue(status)}}</td>
                <td>
                    <a @click.stop="linkToInfo(item)" class="text-link">查看</a>
                    <a @click.stop="linkToEdit(item, index)" class="text-link" v-if="['COMMIT', 'REJECT'].includes(item.status)">编辑</a>
                </td>
            </tr>
            </tbody>
        </table>

        <van-button type="info" @click="linkToEdit()" class="btn-bottom">创建申请</van-button>
    </van-list>
</template>

<script>
    import * as promotionApplies from '../../api/lib/promotionApplies';

    export default {
        name: 'HomePromotion',
        data () {
            return {
                query: {
                    limit: 20,
                    offset: 0
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
            this.onLoad();
        },
        methods: {
            onLoad () {
                if (!this.loadall) {
                    this.loading = true;
                    promotionApplies.list(this.query).success(data => {
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
            linkToInfo ({ id }) {
                this.$router.push({
                    name: 'home.promotion.info',
                    params: {id}
                });
            },
            linkToEdit ({ id } = {}, index = 0) {
                // 记录当前页码，删除之后数据，更改finished状态
                this.query.offset = Math.floor((index + 1) / 20) * 20;

                this.$router.push({
                    name: 'home.promotion.edit',
                    params: {id}
                });
            }
        }
    };
</script>

