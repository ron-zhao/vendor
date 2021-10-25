<style lang="sass" scoped>
    @import "~style/var"
    .customer
        .bg-white
            background-color: #fff
        .mt
            margin-top: $space
        .padd-x
            padding: 0 $space
        .br-b
            border-bottom: 1px solid #eee
        .text-gray
            color: #999
        .week-select
            position: absolute
</style>
<template>
    <section class="customer" style="width: 100%">
        <div class="bg-white padder">
            <week-select class="week-select mt" ref="weeks" v-model="week" @change="handleChange" placeholder="请选择"></week-select>
            <chart :options="option" class="mt" theme="zcw" style="width: 100%; height: 5rem" auto-resize></chart>
        </div>
        <div class="bg-white padder mt">
            <table class="table">
                <thead>
                    <tr>
                        <td></td>
                        <td>本周客户数</td>
                        <td>上周客户数</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data" :key="index">
                        <td v-for="(items, i) in item">
                            <span class="text-gray" v-if="i === 0">{{weeks[items-1]}}</span>
                            <span v-else>{{items | thousands}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
<script>
import WeekSelect from '@components/WeekSelect';
import chart from '@root/mixins/chart';
import { statisticsList } from '@root/api';
import { Indicator } from 'mint-ui';

export default {
    mixins: [chart],
    data () {
        let week = moment().week();
        return {
            week,
            data: {},
            loading: false,
            loaded: false,
            query: {},
            weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            option: {
                legend: {
                    data: ['本周', '上周'],
                    align: 'right',
                    top: 5,
                    right: 0
                },
                dataset: {
                    dimensions: ['date', '本周', '上周'],
                    source: [
                        ['1', 0, 0],
                        ['2', 0, 0],
                        ['3', 0, 0],
                        ['4', 0, 0],
                        ['5', 0, 0]
                    ]
                },
                grid: {
                    top: 70
                },
                series: [
                    {
                        type: 'line',
                        smooth: false,
                        areaStyle: {
                            opacity: 0.1
                        }
                    },
                    {
                        type: 'line',
                        smooth: false,
                        areaStyle: {
                            opacity: 0.1
                        }
                    }
                ]
            }
        };
    },
    mounted () {
        const { start, end } = this.$refs.weeks.getWeekData();
        this.query.start = start;
        this.query.end = end;
        this.list();
    },
    methods: {
        handleChange (weekData) {
            this.query.start = weekData.start;
            this.query.end = weekData.end;
            this.list();
        },
        list () {
            Indicator.open();
            statisticsList({
                focus: 'store_count',
                ...this.query
            }).success((data) => {
                this.loading = true;
                let weeksData = [];

                data.week.forEach((item, index) => {
                    weeksData[index] = [index + 1];
                    weeksData[index].push(item);
                });
                data.last_week.forEach((item, index) => {
                    weeksData[index].push(item);
                });
                this.option.dataset.source = weeksData;
                this.data = weeksData;
                Indicator.close();
            }).error(() => {
                Indicator.close();
            });
        }
    },
    components: {
        WeekSelect
    }
};
</script>
