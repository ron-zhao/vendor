<style lang="sass" scoped>
    @import "~style/var"
    .sku
        background-color: #fff
        .table
            .table-header
                width: 1.2rem
                position: relative
                background-image: url('../../assets/table_line.png')
                font-size: .2rem
            .week
                position: absolute
                top: 0
                right: 0.05rem
            .sku
                position: absolute
                bottom: 0
                left: 0
        .mt
            margin-top: $space
        .mr
            margin-right: $space
        .ml
            margin-left: $space
        .page-btn
            text-align: center
            input
                border: none
                padding: .05rem .1rem
                border-radius: 3px
        .br
            border-right: 1px solid #eee
        .table
            tr th, tr td
                border: 1px solid #eee
</style>
<template>
    <section class="sku" style="width: 100%">
        <div class="block padder">
            <week-select class="mt" v-model="week" ref="weeks" @change="handleChange" placeholder="请选择"></week-select>
        </div>
        <table class="table mt">
            <thead>
            <tr>
                <td class="table-header">
                    <span class="week">星期</span>
                    <span class="sku">商品名</span>
                </td>
                <td v-for="(item, index) in weekDay" :key="index">{{item}}</td>
            </tr>
            </thead>
            <tbody>
                <tr v-for="item in data" :key="item.id">
                    <td>{{item.name}}({{item.spec}})</td>
                    <td v-for="sku in item.sku">
                        <span v-if="+sku > 0" style="word-wrap:break-word">{{sku | thousands}}</span>
                        <span v-if="+sku === 0" style="word-wrap:break-word" class="text-danger">{{sku}}</span>
                    </td>
                </tr>
                <tr v-show="loading">
                    <td colspan="8">
                        <div class="text-center load-more padder" >
                            <mt-spinner :type="3"></mt-spinner>
                        </div>
                    </td>
                </tr>
                <tr v-show='!data.length && !loading'>
                    <td colspan="8">
                        暂无数据
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="page-btn padder">
            <input type="button" class="btn-primary mr" value="首页" @click="handleHomePage">
            <input type="button" class="btn-primary mr" value="上一页" :disabled="currentPage === 1" @click="handlePrev">
            <span>{{currentPage}}/{{total}}</span>
            <input type="button" class="btn-primary ml mr" value="下一页" :disabled="currentPage === total" @click="handleNext">
            <input type="button" class="btn-primary" value="尾页" @click="getEndPage">
        </div>
    </section>
</template>
<script>
import WeekSelect from '@components/WeekSelect';
import { statisticsList } from '@root/api';

const weekDay = ['一', '二', '三', '四', '五', '六', '七'];

export default {
    data () {
        let week = moment().week();

        return {
            data: [],
            loading: false,
            total: 1,
            currentPage: 1,
            query: {
                limit: 5,
                offest: 0
            },
            week,
            weekDay
        };
    },
    mounted () {
        const { start, end } = this.$refs.weeks.getWeekData();
        this.query.start = start;
        this.query.end = end;
        this.list(this.currentPage);
    },
    methods: {
        handleChange (weekData) {
            this.query.start = weekData.start;
            this.query.end = weekData.end;
            this.list(1);
        },
        handleHomePage () {
            this.currentPage = 1;
            this.list(this.currentPage);
        },
        getEndPage () {
            this.currentPage = this.total;
            this.list(this.currentPage);
        },
        handlePrev () {
            this.currentPage--;
            this.list(this.currentPage);
        },
        handleNext () {
            this.currentPage++;
            this.list(this.currentPage);
        },
        list (currentPage) {
            this.loading = true;
            this.data = [];
            this.query.offset = (currentPage - 1) * (this.query.limit);
            statisticsList({
                focus: 'sku',
                ...this.query
            }).success(({ meta, total }) => {
                this.loading = false;
                this.data = meta;
                this.total = Math.ceil(total / this.query.limit);
            }).error(() => {
                this.loading = false;
            });
        }
    },
    components: {
        WeekSelect
    }
};
</script>
