<style lang="sass" scoped rel="stylesheet/sass">
    .van-cell__title
        width: 90px
        flex: none

    .van-cell__value
        text-align: left
</style>

<template>
    <van-cell-group>
        <van-cell title="商品名称">{{ form.name }}</van-cell>
        <van-cell title="出售单位">{{ form.spec }}</van-cell>
        <van-cell title="供货价">{{ form.unit_price | money }}</van-cell>
        <van-cell title="建议售价">{{ form.suggest_price | money }}</van-cell>
        <van-cell title="商品描述">{{ form.desc }}</van-cell>
        <van-cell title="商品图片">
            <lazy-img :src="item" v-for="(item, index) in form.image" :key="index"
                      @click.native="previewImage(index)"
                      style="width: 1.4rem; height: 1.4rem; margin-right: .2rem;margin-top: .2rem;">
            </lazy-img>
        </van-cell>
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
    import * as supplyProductApplies from '../../api/lib/supplyProductApplies';
    import LazyImg from '@components/LazyImg';
    import { qiniuUrl } from '../../config/global.config';
    import { ImagePreview } from 'vant';

    const unit = ['斤', '箱', '个', '捆', '桶', '件', '把', '其他'];
    export default {
        data () {
            const { id } = this.$route.params;

            return {
                loadall: false,
                form: {
                    name: '',
                    spec: '',
                    unit_price: 0,
                    desc: '',
                    image: []
                },
                images: [],
                units: unit,
                id
            };
        },
        created () {
            if (this.id) this.getDetail(this.id);
        },
        methods: {
            previewImage (index = 0) {
                ImagePreview({
                    images: this.images,
                    startPosition: index
                });
            },
            getDetail (id) {
                supplyProductApplies.get(id).success(data => {
                    this.form = data;
                    this.images = data.image.map(image => [qiniuUrl, image].join('/'));
                });
            }
        },
        components: {
            LazyImg
        }
    };
</script>

