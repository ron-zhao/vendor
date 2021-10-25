<style lang="less" scoped>
    @import "../../common/sass/var.less";

    .mr {
        margin-right: 5px;
    }

    .setting-link {
        color: @blue;
    }

    .submit-btn {
        margin-top: 20px;
    }
</style>

<template>
    <van-radio-group v-model="printing">
        <van-cell-group>
            <van-cell size="large" title="所有车的商品在一张纸" clickable @click="printing = 'MERGE'">
                <van-radio class="mr" slot="icon" name="MERGE" />
                <label class="setting-link" slot="right-icon" @click="previewImage('MERGE')">查看示例</label>
            </van-cell>
            <van-cell size="large" title="一个车的商品一张纸" clickable @click="printing = 'DIVISION'">
                <van-radio class="mr" slot="icon" name="DIVISION" />
                <label class="setting-link" slot="right-icon" @click="previewImage('DIVISION')">查看示例</label>
            </van-cell>
        </van-cell-group>

        <div class="padder">
            <van-button class="submit-btn" type="info" style="width: 100%" @click="handleSubmit" :disabled="loading">
                保存设置
            </van-button>
        </div>
    </van-radio-group>
</template>

<script>
    import pngAllCar from '../../assets/demo_all_car.png';
    import pngOneCar2 from '../../assets/demo_one_car2.png';
    import pngOneCar from '../../assets/demo_one_car.png';
    import { ImagePreview, Toast } from 'vant';
    import { printingSetting } from '../../api';
    import { mapGetters, mapActions } from 'vuex';

    let instance;

    export default {
        name: 'HomeSettingPrint',
        data () {
            return {
                loading: false,
                printing: 'DIVISION'
            };
        },
        async created () {
            await this.fetchProfile();
            this.printing = this.printType;
        },
        methods: {
            ...mapActions({
                'fetchProfile': 'user/profile'
            }),
            previewImage (printing) {
                const image = printing === 'DIVISION' ? [pngOneCar2, pngOneCar] : [pngAllCar];
                instance = ImagePreview(image);
            },
            handleSubmit () {
                this.loading = true;

                printingSetting({printing: this.printing}).success(() => {
                    Toast.success('修改设置成功');

                    this.fetchProfile(true);
                    this.loading = false;
                    this.$router.go(-1);
                }).error(() => {
                    this.loading = false;
                });
            }
        },
        computed: {
            ...mapGetters('user', {
                'printType': 'printing'
            })
        },
        beforeDestroy () {
            instance && instance.close();
        }
    };
</script>

