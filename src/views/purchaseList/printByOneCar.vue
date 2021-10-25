<style lang="sass" scoped rel="stylesheet/sass">
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
            tr th,tr td
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
</style>

<template>
    <div class="viewports purchase-print">
        <div v-for="(item,index) in printData.data" class="pageNext overflow">
            <div class="header">
                {{ index == 0 ? '汇总单-所有车号' +query.date : item.car_number + '号车'}}
            </div>
            <div v-if="index === 0" style="margin-bottom: 0.2rem">
                <div class="title">
                    商品种类
                </div>
                <div>
                    <span v-for="(item,index) in printData.categories">{{ (+item.car_number === 0 ? '合计：' : item.car_number+'号车：')+item.number+'种' +
                    (index !== printData.categories.length-1?'；':'。')}}</span>
                </div>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th style="width:8%">序号</th>
                    <th>商品名称</th>
                    <th style="width:10%">是否分割</th>
                    <th style="width:14%" v-if="index !== 0">单位</th>
                    <th>采购量</th>
                    <th style="width:10%" v-if="index == 0">实际</th>
                    <th style="width:10%" v-if="index == 0">单价</th>
                    <th style="width:10%" v-if="index == 0">小计</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(td,child_index) in item.items">
                        <td>{{child_index+1}}</td>
                        <td>{{td.name}}</td>
                        <td>{{td.division === 0 ? '否':'是'}}</td>
                        <td v-if="index !== 0">{{td.spec}} <span v-if="td.spec !== td.ud">(约{{td.un}}{{td.ud}}/{{td.spec}})</span></td>
                        <td :class="td.need_quantity === 0 ? 'bg-disable':''" style="word-wrap:break-word;width: 0.5rem">
                            <!-- 采购量为0 -->
                            <span v-if="td.need_quantity === 0"></span>

                            <!-- 无分割量 采购量不为0 -->
                            <span v-if="td.division !== 1 && td.need_quantity !== 0">
                                {{td.need_quantity}}
                            </span>
                            <!-- 无分割量 汇总加双单位 -->
                            <span v-if="td.division !== 1 && td.need_quantity !== 0 && td.spec === td.ud && index == 0">
                                {{td.spec}}
                            </span>
                            <span v-if="td.division !== 1 && td.need_quantity !== 0 && td.spec !== td.ud && index == 0">
                                {{td.spec}} / {{ (td.need_quantity * td.un) + td.ud}}
                            </span>

                            <!--后端返回的是+号拼接的字符串，不能分整个数字换行，所以前端做了处理-->

                            <!-- 有分割量 采购量不为0 汇总加双单位 -->
                            <span v-if="td.division === 1 && td.need_quantity !== 0 && td.spec !== td.ud && index == 0">
                                {{ (td.need_quantity) + td.spec }} /
                            </span>
                            <span v-if="td.division === 1 && td.need_quantity !== 0 && index == 0">
                               {{ (td.need_quantity * td.un) + td.ud}}
                            </span>

                            <!-- 有分割量 采购量不为0 不汇总 -->
                            <span v-if="td.division === 1 && td.need_quantity !== 0 && index !== 0">
                                {{ td.split_detail }}
                            </span>
                        </td>
                        <td v-if="index == 0"></td>
                        <td v-if="index == 0"></td>
                        <td v-if="index == 0"></td>
                    </tr>
                </tbody>
            </table>
            <div v-if="index > 0 && item.note_items" class="special">
                <p>
                    特殊要求：
                    <span v-if="!item.note_items.length">无特殊要求</span>
                </p>
                <p v-for="(note, index) in item.note_items" :key="note.order_note_id">
                    {{index+1}}.
                    商品：{{note.product_name}}；
                    车号：{{note.car_number}}；
                    数量：<span v-if="note.ud!==note.spec">{{note.quantity}}{{note.spec}}</span>{{note.ud_quantity}}{{note.ud}}；
                    <br/>
                    要求：{{note.note}}
                </p>
            </div>
            <div class="header">
                {{ index == 0 ? '汇总单结束': item.car_number + '号车结束' }}
            </div>
        </div>
    </div>
</template>

<script>
    import { purchasePrint, tempListDetail } from '../../api';

    export default {
        name: 'HomePurchaseListPrintByAllCar',
        data () {
            return {
                query: {
                    date: this.$route.query.date,
                    vendor_id: this.$route.query.vendor_id
                },
                service: '',
                printData: ''
            };
        },
        mounted () {
            this.list();
        },
        methods: {
            list () {
                let query = {};
                if (this.$route.query.id) {
                    this.service = tempListDetail;
                    query = {
                        id: this.$route.query.id,
                        format: 'print'
                    };
                } else {
                    this.service = purchasePrint;
                    query = this.query;
                }

                this.service(query)
                    .success(data => {
                        this.printData = data;
                        this.$nextTick(() => {
                            setTimeout(() => {
                                window.print(this.$el.innerHTML);
                            }, 500);
                        });
                    });
            }
        },
        components: {

        },
        watch: {

        }
    };
</script>
