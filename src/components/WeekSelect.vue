<style lang="sass" scoped>
    @import "~style/var"

    .week-select
        position: relative
        background-color: #fff
        box-shadow: 0 0 .1rem rgba($primary, .15)
        height: .7rem
        width: 3.4rem
        border-radius: .08rem
        display: inline-block

        select
            background-color: transparent
            width: 100%
            height: 100%
            outline: none
            border: none
            padding: 0 $space
            color: #666
            -webkit-appearance: none
            font-size: $small
            z-index: 1
            position: relative

        &:after
            content: ""
            position: absolute
            background: url("../assets/select_right.png") center no-repeat
            background-size: 100%
            width: .26rem
            height: .18rem
            right: $space
            top: 0
            bottom: 0
            margin: auto
            z-index: 0

</style>

<template>
    <label class="week-select">
        <select v-model="weekModel">
            <option v-for="week in weekSelection" :key="week.week" :value="week.week">
                第{{week.week}}周({{week.start | date(format)}}{{split}}{{week.end | date(format)}})
            </option>
        </select>
    </label>
</template>

<script>
    import moment from 'moment';
    import _ from 'underscore';

    export function getDays (week) {
        let start = moment().week(week).days(1);
        return [
            start.format('YYYY-MM-DD'),
            moment().week(week).days(7).format('YYYY-MM-DD'),
            start.week() // 实际week
        ];
    }

    export function getWeeks (date = new Date(), limit = 12) {
        let week = moment(date).week();
        let weeks = [];

        // 去年的周数
        if (week < limit) {
            let lastYearWeeks = limit - week;
            for (let i = -lastYearWeeks; i < 0; i++) {
                weeks.push(i + 1);
            }
        }

        // 今年的周数
        let i = week < limit ? 0 : week - limit;
        for (i; i < week; i++) {
            weeks.push(i + 1);
        }

        return weeks;
    }

    export default {
        name: 'WeekSelect',
        props: {
            format: {
                default: 'M.D'
            },
            value: {
                required: true, // week
                type: Number
            },
            split: {
                default: '-'
            },
            weeks: {
                type: Array,
                default () {
                    return getWeeks();
                }
            }
        },
        methods: {
            getWeekData () {
                return _.find(this.weekSelection, {week: this.value});
            }
        },
        computed: {
            weekModel: {
                get () {
                    return this.value;
                },
                set (value) {
                    this.$emit('input', value);
                    this.$emit('change', _.find(this.weekSelection, {week: value}));
                }
            },
            weekSelection () {
                return this.weeks.map(_week => {
                    const [ start, end, week ] = getDays(_week);

                    return {
                        week,
                        start,
                        end
                    };
                }).reverse();
            }
        }
    };
</script>
