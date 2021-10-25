<style lang="less" scoped rel="stylesheet/less">
    .setting-page {
        box-sizing: border-box;
    }
</style>

<template>
    <div class="setting-page">
        <van-cell-group>
            <van-cell title="供应商编号" :label="vendor_id" size="large"></van-cell>
            <van-cell title="修改密码" size="large" :to="{name: 'home.setting.pwd'}" is-link></van-cell>
            <van-cell title="打印设置" size="large" :to="{name: 'home.setting.print'}" is-link></van-cell>
        </van-cell-group>
        <van-button style="margin-top: 10px; width: 100%" @click="logout" block plain>退出登录</van-button>
    </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui';
import { logout as $logout } from '../../api';
import { tool } from '../../common/util';
import { Divider } from 'vant';
import { mapGetters } from 'vuex';

export default {
    name: 'HomeSetting',
    data () {
        return {};
    },
    methods: {
        logout () {
            Indicator.open();
            // 退出登录
            $logout().success(() => {
                tool.$local.rm('vendor_token');

                Toast('退出成功');
                Indicator.close();

                // 退出到登录页面
                this.$router.push({
                    name: 'login'
                });
            }).error(() => {
                Indicator.close();
            });
        }
    },
    components: {
        'van-divider': Divider
    },
    computed: {
        ...mapGetters('user', ['vendor_id'])
    }
};
</script>
