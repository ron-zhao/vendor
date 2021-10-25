<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'

    .field-icon
        width: 65px
        height: 28px
        font-size: $normal
        margin-right: $space
</style>

<template>
    <div class="change-password">
        <van-cell-group>
            <van-field
                v-model="phone"
                placeholder="请输入手机号"
                maxlength="11"
                size="large"
                readonly
            >
                <div class="field-icon" slot="left-icon">账号</div>
            </van-field>
            <van-field
                v-model="pwd"
                type="password"
                placeholder="请输入新密码"
                size="large"
            >
                <div class="field-icon" slot="left-icon">新密码</div>
            </van-field>
            <van-field
                v-model="repeat_pwd"
                type="password"
                placeholder="再次输入密码"
                size="large"
            >
                <div class="field-icon" slot="left-icon">确认密码</div>
            </van-field>
        </van-cell-group>
        <div class="padder">
            <van-button style="width: 100%;margin-top: 20px;" type="info" @click="change">确认修改</van-button>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { changePwd, logout as $logout } from '../../api';
    import { mapGetters } from 'vuex';

    export default {
        data () {
            return {
                method: 'pwd', // msg
                pwd: '',
                repeat_pwd: ''
            };
        },
        methods: {
            checkData () {
                if (this.pwd.length < 6) {
                    Toast('密码长度应不小于6位');
                    return false;
                }

                if (this.repeat_pwd !== this.pwd) {
                    Toast('两次密码输入不一致');
                    return false;
                }

                return true;
            },
            logout () {
                // 退出登录
                $logout().success(() => {
                    Toast('请重新登录');
                    Indicator.close();
                    // 退出到登录页面
                    this.$router.push({
                        name: 'login'
                    });
                }).error(() => {
                    Indicator.close();
                });
            },
            change () {
                if (!this.checkData()) {
                    return;
                }

                Indicator.open();

                changePwd({
                    pwd: this.pwd
                }).success(() => {
                    this.logout();
                }).error(() => {
                    Indicator.close();
                });
            }
        },
        computed: {
            ...mapGetters('user', ['phone'])
        }
    };
</script>
