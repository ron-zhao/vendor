/**
 * chart
 * @author    : yunchen
 * @createdAt : 02/08/2018
 */
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from './ChartTheme';
import { money } from '../filters/filter';
import * as helper from '../common/util/lib/helper';

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

ECharts.registerTheme('zcw', theme);

export default {
    data () {
        return {
            // 默认配置
            option: {
                legend: {},
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    axisLabel: {
                        margin: 20
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitNumber: 3,
                    type: 'value'
                },
                tooltip: {
                    formatter: tooltipFormatter
                }
            }
        };
    },
    created () {},
    methods: {},
    components: {
        'chart': ECharts
    }
};

/**
 * 协助echart格式化
 * @param params
 * @return {*}
 */
export const tooltipFormatter = (params) => {
    return params.map(item => {
        return `${!item.seriesIndex ? item.name : ''}<br/> ${item.marker}${item.seriesName}: ${money(item.value[item.seriesIndex + 1])}`;
    }).join('');
};

export const convert2chart = helper.convert2chart;
