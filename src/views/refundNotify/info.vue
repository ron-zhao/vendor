<style lang="less" scoped>
    .refund-page {
        padding: 15px;
        box-sizing: border-box;

        .refund-block {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;

            p {
                line-height: 1;
                margin-bottom: 15px;
            }

            label {
                display: inline-block;
                width: 60px;
                margin-right: 20px;
                color: #999;
            }
        }

        .mr {
            margin-right: 10px;
        }
    }
</style>

<template>
    <div class="refund-page">
        <div class="text-center" v-if="loading">
            <van-loading size="24px">加载中...</van-loading>
        </div>
        <div v-else class="refund-block">
            <p>
                <label>退货日期</label>
                {{data.createdAt | date('YYYY-MM-DD HH:mm')}}
            </p>
            <p>
                <label>商品名称</label>
                {{data.product_name}}
            </p>
            <p>
                <label>商品数量</label>
                {{data.spec_quantity}}{{data.spec}}
                <slot v-if="data.spec !== data.ud">{{data.ud_quantity}}{{data.ud}}</slot>
            </p>
            <p>
                <label>退货原因</label>
                {{data.reason}}
            </p>

            <van-image class="mr" v-for="(image, index) in images" @click.native="previewImage(0)" radius="5" width="75" height="75" :key="index" :src="image"/>
        </div>

        <van-button v-if="data.status === 'NOTICED'" type="info" style="width: 100%; margin-top: 15px" @click="handleSure" :disabled="submitLoading">收到通知</van-button>
    </div>
</template>

<script>
    import { ImagePreview, Toast } from 'vant';
    import * as vendorReturnNotice from '../../api/lib/vendorReturnNotice';
    import { qiniuUrl } from '../../config/global.config';

    export default {
        name: 'HomeRefundNotifyInfo',
        data () {
            return {
                loading: false,
                data: {},
                images: [],
                submitLoading: false
            };
        },
        methods: {
            previewImage (index = 0) {
                ImagePreview({
                    images: this.images,
                    startPosition: index
                });
            },
            handleSure () {
                const { id } = this.$route.params;
                this.submitLoading = true;

                // 供货商这边的数据初始状态为：NOTICED，当点击收到后：CONFIRMED
                vendorReturnNotice.makeAsRead(id).success(() => {
                    this.submitLoading = false;
                    Toast.success('已收到');
                    this.data.status = 'CONFIRMED';
                }).error(() => {
                    this.submitLoading = false;
                });
            }
        },
        created () {
            const { id } = this.$route.params;
            this.loading = true;

            vendorReturnNotice.get(id).success(data => {
                this.loading = false;
                this.data = data;
                this.images = data.image.map(image => [qiniuUrl, image].join('/'));
            }).error(() => {
                this.loading = false;
            });
        }
    };
</script>

