<style lang="sass" scoped>
    @import "~style/var"

    .block
        background-color: #fff

    .week-select
        position: absolute
</style>

<template>
    <section style="width: 100%;">
        <div class="block padder">
            <week-select class="mt week-select" ref="weekSelect" v-model="week" @change="handleChange" placeholder="请选择"></week-select>
            <chart class="mt" :options="option" theme="zcw" style="width: 100%; height: 5rem" auto-resize></chart>
        </div>
        <div class="mt padder block">
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th>本周销售额</th>
                    <th>上周销售额</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(week, index) in weeks" :key="week">
                        <td style="color: #999;">{{week}}</td>
                        <td>{{data.week[index] | thousands}}</td>
                        <td>{{data.last_week[index] | thousands}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    import WeekSelect from '@components/WeekSelect';
    import chart, { convert2chart } from '../../mixins/chart';
    import { statisticsList } from '../../api';
    import { Indicator } from 'mint-ui';

    export default {
        name: 'sales',
        mixins: [chart],
        data () {
            const week = moment().week();
            return {
                week,
                weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                query: {
                    start: '',
                    end: '',
                    focus: 'sales_value'
                },
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
                            [0, 0, 0]
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
                },
                data: {
                    week: [],
                    last_week: []
                }
            };
        },
        mounted () {
            const { start, end } = this.$refs.weekSelect.getWeekData();
            this.query.start = start;
            this.query.end = end;

            this.fetchData();
        },
        methods: {
            handleChange (weekData) {
                this.query.start = weekData.start;
                this.query.end = weekData.end;

                this.fetchData();
            },
            fetchData () {
                Indicator.open();
                statisticsList(this.query).success(data => {
                    this.data = data;
                    this.option.dataset.source = convert2chart(
                        data.week.map((value, key) => ({key: key + 1, value})),
                        data.last_week.map((value, key) => ({key: key + 1, value}))
                    );
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
