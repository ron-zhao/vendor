<style lang="sass" scoped>
    @import '../../common/sass/var.sass'
    .purchase-print
        padding: 0 0.2rem

        .header
            font-size: 0.36rem
            font-weight: bold
            text-align: center
            padding: 0.6rem 0

        .title
            font-weight: bold

        .table
            margin: 0
            border: 1px solid #000
            border-bottom: none

            tr th, tr td
                word-break: break-all
                height: auto
                padding: 0.1rem 0
                border-right: 1px solid #000
                border-bottom: 1px solid #000

        .pageNext
            page-break-after: always


    .special
        margin-top: $space
        padding: $space

        p
            color: #000
            font-weight: normal

    td.table-split
        padding: 0 !important

    table.table
        width: 100%
</style>

<template>
    <div class="purchase-print">
        <div v-if="loading" class="text-center">
            <van-loading size="24px">加载中...</van-loading>
        </div>

        <slot v-else>
            <p>
                <span>打印时间：{{today}}</span>
                <span class="pull-right">配送时间：{{query.date}}</span>
            </p>
            <p>SKU合计：{{total}}</p>
            <table class="table mt">
                <thead>
                <tr>
                    <th>商品名称</th>
                    <th>采购量</th>
                    <th colspan="7">分车采购量</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data">
                    <td v-if="item.rowspan" :rowspan="item.rowspan" style="padding: .1rem">{{item.product_name}}</td>
                    <td v-if="item.rowspan" :rowspan="item.rowspan">
                        {{item.total_spec_quantity}}{{item.spec}}
                        <slot v-if="item.spec !== item.ud">{{item.total_ud_quantity}}{{item.ud}}</slot>
                    </td>
                    <td v-for="cols in item.items" rowspan="1" colspan="1" class="table-split">
                        <slot v-if="cols && cols.row % 2 === 0">{{cols.need_quantity || ''}}</slot>
                        <slot v-else-if="cols">
                            {{cols.split_detail || (cols.car_number + '号车')}}
                        </slot>
                    </td>
                </tr>
                </tbody>
            </table>
        </slot>
    </div>
</template>

<script>
    import { purchaseDetail, tempListDetail } from '../../api';
    import { tool } from '../../common/util';

    export default {
        name: 'HomePurchaseListPrintByAllCar',
        data () {
            const { id, vendor_id: vendorId } = this.$route.query;

            return {
                loading: false,
                today: moment().format('YYYY/MM/DD HH:mm'),
                query: {
                    id,
                    type: this.$route.query.type === 'order' ? 'order' : 'temp',
                    date: this.$route.query.date,
                    csv: false,
                    token: tool.$local.get('vendor_token'),
                    vendor_id: vendorId
                },
                data: [],
                total: 0
            };
        },
        created () {
            const { id } = this.$route.query;
            const instance = id ? tempListDetail : purchaseDetail;
            this.loading = true;

            instance(Object.assign({
                id,
                vendor_id: this.vendor_id
            }, this.query)).success(({ data = [] } = {}) => {
                this.total = data.length;
                const col = 7;
                const result = [[], ...data].reduce((current, next) => {
                    // 将数据分行
                    const items = _.chain([[], ...next.item])
                        .map((item, index) => {
                            if (_.isArray(item)) {
                                return item;
                            } else {
                                return Object.assign(
                                    {row: Math.ceil(index / col)},
                                    item
                                );
                            }
                        })
                        .reduce((c, n) => {
                            if (n.row > 1) {
                                // 1/3/5... 为车号，2/4/6为采购量
                                n.row = n.row * 2 - 1;
                            }
                            const newRow = Object.assign({row: n.row + 1}, _.omit(n, 'row'));

                            // 在车号后插入采购量
                            return c.concat(n, newRow);
                        })
                        .groupBy('row')
                        .values()
                        .filter(items => {
                            // 过滤一行都为空的数据
                            return _.some(items, item => (item.split_detail || item.need_quantity > 0));
                        })
                        .value();

                    return current.concat(...items.map((item, index) => {
                        item.length = 7;
                        return Object.assign(
                            { items: item, rowspan: index > 0 ? 0 : items.length },
                            _.omit(next, 'item')
                        );
                    }));
                });

                this.data = result;
                this.loading = false;

                this.$nextTick(() => {
                    setTimeout(() => {
                        window.print(this.$el.innerHTML);
                    }, 500);
                });
            }).error(() => {
                this.loading = false;
            });
        }
    };
</script>

