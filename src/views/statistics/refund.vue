<template>
  <section class="refund">
      <div class="block padder">
          <week-select
              class="mt"
              ref="weekSelect"
              v-model="currentWeek"
              @change="handleChange"
              placeholder="请选择"
          ></week-select>
          <chart class="mt" :options="option" theme="zcw" style="width: 100%; height: 5rem" auto-resize></chart>
      </div>
      <div class="bg-white padder mt">
          <table class="table">
              <thead>
              <tr>
                  <td></td>
                  <td>金额</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in weeks">
                  <td style="color: #999;">{{item}}</td>
                  <td>{{tableData[i]}}</td>
              </tr>
              </tbody>
          </table>
      </div>
  </section>
</template>

<script>
  import { getReturn } from '@root/api';
  import WeekSelect from '@components/WeekSelect';
  import chart, { convert2chart } from '@root/mixins/chart';
  import { Indicator } from 'mint-ui';

  export default {
      name: 'refund',
      mixins: [chart],
      data () {
          let currentWeek = moment().week();
          return {
              currentWeek,
              query: {
                  start: '',
                  end: ''
              },
              tableData: [],
              weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
              option: {
                  legend: {
                      data: ['退货金额'],
                      align: 'right',
                      top: 5,
                      right: 0
                  },
                  dataset: {
                      dimensions: ['date', '退货金额'],
                      source: [
                          [0, 0]
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
                      }
                  ]
              }
          };
      },
      methods: {
          handleChange (weekData) {
              ({
                  start: this.query.start,
                  end: this.query.end
              } = weekData);
              this.getReturnData();
          },
          getReturnData () {
              Indicator.open();
              getReturn({
                  ...this.query
              }).success(data => {
                  this.tableData = data.week;
                  this.option.dataset.source = convert2chart(
                      data.week.map((value, key) => ({key: key + 1, value}))
                  );
                  Indicator.close();
              }).error(() => {
                  Indicator.close();
              });
          }
      },
      components: {
          WeekSelect
      },
      mounted () {
          const { start, end } = this.$refs.weekSelect.getWeekData();
          this.query.start = start;
          this.query.end = end;
          this.getReturnData();
      }
  };
</script>

<style scoped lang="sass">
.refund
    width: 100%
    .block
        background-color: #fff
    .week-select
        position: absolute
    .bg-white
        background-color: #fff
</style>
