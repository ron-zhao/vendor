<template>
  <section class="stock">
      <div class="block padder">
          <week-select
              class="mt"
              ref="weekSelect"
              v-model="currentWeek"
              placeholder="请选择"
              @change="handleChange"
          ></week-select>
          <chart class="mt" :options="option" theme="zcw" style="width: 100%; height: 5rem" auto-resize></chart>
      </div>
      <div class="mt block padder">
          <table class="table">
              <thead >
              <tr>
                  <td style="width: 2rem">缺货SKU名称</td>
                  <td style="width: 1.5rem;" class="bg-count">缺货量</td>
                  <td style="width: 1.5rem;" class="bg-dc">缺货金额</td>
                  <td class="bg-dc">日期</td>
              </tr>
              </thead>
              <tbody>
              <tr v-if="tableData.length === 0">
                  <td colspan="4">本周无缺货记录</td>
              </tr>
              <tr v-else v-for="item in tableData">
                  <!--缺货SKU名-->
                  <td>{{item.name}}</td>
                  <!--缺货量-->
                  <td>{{item.lack_spec}}{{item.spec}}</td>
                  <!--缺货金额-->
                  <td>{{item.lack_price}}</td>
                  <!--日期-->
                  <td>{{item.recheck_time}}</td>
              </tr>
              </tbody>
          </table>
      </div>
      <div class="page-btn padder">
          <input type="button" class="btn-primary" value="首页" @click="toHomePage">
          <input type="button" class="btn-primary" value="上一页" @click="toPreviousPage">
          <span>{{page.current}}/{{page.total}}</span>
          <input type="button" class="btn-primary" value="下一页" @click="toNextPage">
          <input type="button" class="btn-primary" value="尾页" @click="toEndPage">
      </div>
  </section>
</template>

<script>
  import { getLack } from '@root/api';
  import WeekSelect from '@components/WeekSelect';
  import chart, { convert2chart } from '@root/mixins/chart.js';
  import { Indicator } from 'mint-ui';

  export default {
      name: 'stock',
      mixins: [chart],
      data () {
          let currentWeek = moment().week();
          return {
              currentWeek,
              tableData: [],
              query: {
                  start: '',
                  end: ''
              },
              page: {
                  total: 0,
                  current: 1,
                  limit: 10,
                  offset: 0
              },
              option: {
                  legend: {
                      data: ['缺货金额'],
                      align: 'right',
                      top: 5,
                      right: 0
                  },
                  dataset: {
                      dimensions: ['date', '缺货金额'],
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
          renderPageTotal (listCount) {
              if (listCount === 0) {
                  return 1;
              } else {
                  return Math.ceil(listCount / this.page.limit);
              }
          },
          initPage () {
              this.page.current = 1;
              this.page.offset = 0;
          },
          toHomePage () {
              if (this.page.current === 1) return;
              this.initPage();
              this.getLackData();
          },
          toEndPage () {
              if (this.page.current === this.page.total) return;
              this.page.current = this.page.total;
              this.page.offset = this.page.current * this.page.limit;
              this.getLackData();
          },
          toPreviousPage () {
              if (this.page.current <= 1) return;
              this.page.current--;
              this.page.offset = (this.page.current - 1) * this.page.limit;
              this.getLackData();
          },
          toNextPage () {
              if (this.page.current === this.page.total) return;
              this.page.current++;
              this.page.offset = (this.page.current - 1) * this.page.limit;
              this.getLackData();
          },
          handleChange (weekData) {
              ({
                  start: this.query.start,
                  end: this.query.end
              } = weekData);
              this.getLackData();
          },
          getLackData () {
              Indicator.open();
              let { offset, limit } = this.page;
              getLack({
                  ...this.query,
                  offset,
                  limit
              }).success(data => {
                  this.page.total = this.renderPageTotal(data.total);
                  this.tableData = data.meta;
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
          this.getLackData();
      }
  };
</script>

<style scoped lang="sass">
.stock
    width: 100%
    .week-select
        position: absolute
    .padder
        background-color: #fff
    .page-btn
        display: flex
        justify-content: space-around
        input
            border: none
            padding: .05rem .1rem
            border-radius: 3px
</style>
