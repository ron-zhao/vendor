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
        <van-cell title="上架数量">{{ form.count }}{{form.Product.ud}}</van-cell>
        <van-cell title="供货价">{{ form.unit_price }}元/{{form.Product.ud}}</van-cell>
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
import * as upAndDownApplies from '../../api/lib/upAndDownApplies';

export default {
    name: 'HomeUpAndDownProductInfo',
    data () {
        return {
            loading: false,
            form: {
                Product: {}
            }
        };
    },
    created () {
        const { id } = this.$route.params;
        this.loading = true;

        upAndDownApplies.get(id).success(data => {
            this.loading = false;
            this.form = data;
        }).error(() => {
            this.loading = false;
        });
    }
};
</script>

