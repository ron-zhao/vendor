<style lang="less" scoped>
    .van-cell__title {
        width: 90px;
        flex: none;
    }

    .van-cell__value {
        text-align: left;
    }
</style>

<template>
    <van-cell-group>
        <div class="text-center" v-if="loading">
            <van-loading size="24px">加载中...</van-loading>
        </div>
        <van-cell title="商品名称">{{ form.Product.name }}</van-cell>
        <van-cell title="单位">{{ form.Product.ud }}</van-cell>
        <van-cell title="促销方式">{{ form.promotion_type | keyValue(PROMOTION_TYPE) }}</van-cell>
        <van-cell title="促销供货价">{{ form.unit_price || 0 | money }}</van-cell>
        <van-cell title="建议促销售价">{{ form.promotion_price || 0 | money }}</van-cell>
        <van-cell title="促销时间">{{ form.start | date('YYYY-MM-DD') }}到{{ form.end | date('YYYY-MM-DD') }}</van-cell>
        <van-cell title="促销计划总量">{{ form.promotion_quantity }}{{form.Product.ud}}</van-cell>
        <van-cell title="驳回理由" v-if="form.Logs && form.Logs.length">
            <ul>
                <li v-for="log in form.Logs" :key="log.createdAt" class="van-ellipsis">
                    {{log.createdAt | date('MM-DD')}}:
                    {{log.note}}
                </li>
            </ul>
        </van-cell>
    </van-cell-group>
</template>

<script>
import * as promotionApplies from '../../api/lib/promotionApplies';

const PROMOTION_TYPE = [
    {id: 'SECKILL', name: '秒杀'},
    {id: 'SPECIAL', name: '特价'}
];

export default {
    name: 'HomePromotionInfo',
    data () {
        return {
            PROMOTION_TYPE,
            loading: false,
            form: {
                Product: {}
            }

        };
    },
    created () {
        const { id } = this.$route.params;
        this.loading = true;

        promotionApplies.get(id).success(data => {
            this.loading = false;
            this.form = data;
        }).error(() => {
            this.loading = false;
        });
    }
};
</script>

