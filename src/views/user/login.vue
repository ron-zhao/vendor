<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    .login
        position: fixed
        width: 100%
        height: 100%
        left: 0
        right: 0
        background-color: #fff
        box-sizing: border-box

        .login-logo
            margin: 0.8rem auto 0.6rem auto
            font-size: 0.32rem
            text-align: center
            img
                margin-bottom: 0.2rem
                width: 1.88rem
        .login-method
            margin-top: .4rem
            font-size: $small
            a
                text-decoration: none

    .field-icon
        width: 50px
        height: 28px
        font-size: $normal
        margin-right: $space

</style>

<template>
    <div class="login">
        <!--logo-->
        <div class="login-logo">
            <img src="../../assets/logo.png" />
        </div>

        <van-cell-group>
            <van-field
                size="large"
                v-model="phone"
                type="tel"
                placeholder="请输入您的手机号码"
                clearable
            >
                <div class="field-icon" slot="left-icon">账号</div>
            </van-field>

            <van-field
                v-if="method === 'pwd'"
                size="large"
                v-model="pwd"
                type="password"
                placeholder="请输入您的登录密码"
                clearable
            >
                <div class="field-icon" slot="left-icon">密码</div>
            </van-field>

            <van-field
                v-if="method === 'msg'"
                size="large"
                v-model="captcha"
                type="tel"
                placeholder="请输入短信验证码"
                clearable
            >
                <div class="field-icon" slot="left-icon">验证码</div>
                <van-button type="info" size="small" slot="right-icon" :disabled="countDown > 0" @click="sendMsg">
                    <span v-show="countDown === 0">点击获取验证码</span>
                    <p v-show="countDown > 0">
                        <span class="text-warning" v-text="countDown"></span>
                        秒后重发
                    </p>
                </van-button>
            </van-field>
        </van-cell-group>
        <div class="padder">
            <!--登录-->
            <van-button style="width: 100%; margin-top: 30px" type="info" @click="login">登录</van-button>
            <!--切换登录-->
            <div class="login-method text-center">
                <a class="text-primary" v-show="method==='pwd'" @click="method='msg'">使用手机验证码登录</a>
                <a class="text-primary" v-show="method==='msg'" @click="method='pwd'">使用密码登录</a>
            </div>
        </div>
    </div>
</template>

<script>
    import { login as $login, captcha } from '../../api';
    import { tool } from '@root/common/util';
    import { Toast } from 'vant';
    import { mapActions } from 'vuex';

    export default {
        data () {
            return {
                method: 'pwd', // pwd || msg
                phone: '',
                pwd: '',
                captcha: '',
                countDown: 0
            };
        },
        methods: {
            ...mapActions({
                'fetchProfile': 'user/profile'
            }),
            checkData () {
                if (!this.checkMsgData()) {
                    return false;
                }

                if (this.method === 'pwd' && this.pwd.length < 6) {
                    Toast.fail('密码长度应不小于6位');
                    return false;
                }

                if (this.method === 'msg' && this.captcha.length !== 6) {
                    Toast.fail('请输入正确的验证码');
                    return false;
                }

                return true;
            },
            checkMsgData () {
                if (!(/^1\d{10}/.test(this.phone))) {
                    Toast.fail('请输入正确的手机号码');
                    return false;
                }

                return true;
            },
            login () {
                if (!this.checkData()) {
                    return;
                }

                const toast = Toast.loading({
                    duration: 0,
                    forbidClick: true,
                    message: '登录'
                });

                let formData = {
                    phone: this.phone,
                    openid: tool.$local.get('openid')
                };

                if (this.method === 'msg') {
                    formData.captcha = this.captcha;
                } else {
                    formData.pwd = this.pwd;
                }

                $login(formData).success(async ({ token }) => {
                    if (token) { // 如果有Token返回
                        tool.$local.set('vendor_token', token);
                    }

                    toast.message = '获取账号信息';
                    await this.fetchProfile(true);
                    toast.clear();
                    this.$router.replace({name: 'home'});
                }).error(e => {
                    toast.clear();
                });
            },
            sendMsg () {
                if (!this.checkMsgData()) {
                    return;
                }

                if (this.countDown > 0) {
                    return Toast('短信已发送，请稍后再试');
                }

                // 发送验证码
                captcha(this.phone + '').success(() => {
                    Toast('短信发送成功，请稍等');
                    this.countDown = 60;
                    let timer = setInterval(e => {
                        this.countDown--;
                        if (this.countDown < 1) {
                            clearInterval(timer);
                        }
                    }, 1000);
                });
            }
        }
    };
</script>
