<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .order-list
        width: 100%
        height: 100%
        position: fixed
        left: 0
        top: 0
        background-color: #fff
        padding-bottom: 0.2rem
        p
            margin: 0.6rem 2% 0.4rem 2%
        .footer
            padding: 0.2rem
            .bottom
                position: fixed
                top: 0
                left: 0
                top: auto
                bottom: 0
                border-radius: 0
                z-index: 2
            .btn
                border: none
                outline: none
                height: 0.88rem
                width: 100%
                font-size: $normal
                box-sizing: border-box
                border-radius: .04rem

    .table
        th,td
            text-align: left
</style>

<template>
    <div>
        <div class="viewports order-list" v-if="!$route.params.id && $route.params.id !== 0">
            <div v-infinite-scroll="loadmore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10"
                 infinite-scroll-immediate-check="false">
                <table class="table">
                    <thead>
                    <tr>
                        <td>申请时间</td>
                        <td>商品名称</td>
                        <td>状态</td>
                        <td>操作</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-show='loading'>
                        <td colspan="4">
                            <div class="text-center load-more padder" >
                                <mt-spinner :type="3"></mt-spinner>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(item,index) in data" v-show="data.length" :key="index" @click="$router.push({name: 'home.newNotice.detail' , params: {id: item.id}})">
                        <td style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" >{{item.createdAt | date}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.status | keyValue(status)}}</td>
                        <td>
                            <a @click.stop="$router.push({name: 'home.newNotice.detail' , params: {id: item.id}})" class="text-link">查看</a>
                            <a @click.stop="$router.push({name: 'home.newNotice.edit' , params: {id: item.id}})" class="text-link" v-if="['COMMIT', 'REJECT'].includes(item.status)">编辑</a>
                        </td>
                    </tr>
                    <tr v-show="loadall && !data.length" >
                        <td colspan="4">
                            <span>暂无数据</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="footer">
                    <button @click="$router.push({name: 'home.newNotice.add'})" class="bottom btn btn-primary" style="border-radius: 0;margin-right: .2rem" >创建申请</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as supplyProductApplies from '../../api/lib/supplyProductApplies';

export default {
    name: 'HomeNewNotice',
    data () {
        return {
            query: {
                limit: 20,
                offset: 0
            },
            data: [],
            loadall: false,
            loading: false,
            status: [
                {id: 'ACCEPT', name: '已受理'},
                {id: 'COMMIT', name: '已申请'},
                {id: 'REJECT', name: '已驳回'}
            ],
            router: this.$route.params.path
        };
    },
    activated () {
        this.list();
    },
    methods: {
        list () {
            this.query.offset = 0;
            this.loading = true;
            supplyProductApplies.list(this.query)
                .success(data => {
                    this.data = data.meta;
                    this.loading = false;
                    this.loadall = true;
                    // 已经加载全部
                    if (data.meta.length < data.total) {
                        this.loadall = false;
                    }
                }).error(() => {

                });
        },
        loadmore () {
            if (!this.loadall) {
                this.loading = true;
                this.query.offset += this.query.limit;
                supplyProductApplies.list(this.query).success(data => {
                    this.query.offset += this.query.limit;
                    this.loading = false;
                    this.data = this.data.concat(data.meta);
                    this.total = data.total;
                    this.loadall = true;
                    // 已经加载全部
                    if (this.data.length < data.total) {
                        this.loadall = false;
                    }
                }).error(e => {
                    this.loading = false;
                });
            }
        }
    },
    watch: {
        '$route' (route) {
            if (route.name === 'newNotice') this.list();
        }
    }
};
</script>

