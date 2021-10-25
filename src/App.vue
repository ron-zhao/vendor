<style lang='sass' rel="stylesheet/sass">
    @import 'mint-ui/lib/style.css'
    @import './common/sass/reset.sass'
    @import './common/sass/app.sass'
</style>

<style lang="less" ref="stylesheet/less">
    @import "./common/sass/var.less";
    .van-tabbar {
        box-shadow: 0 0 5px rgba(#999, .15);
    }

    .van-tabbar-item.van-tabbar-item--active {
        background-color: @blue
    }
</style>

<template>
<div id='home'>
    <router-view></router-view>
</div>
</template>

<script>
    import * as tool from './common/util/lib/tool';
    import { getOpenId } from './api';
    import { mapActions } from 'vuex';

    let { $local, $query } = tool;

    export default {
        name: 'App',
        async beforeRouteEnter (to, from, next) {
            if ($query('sid')) {
                await getOpenId({sid: $query('sid')}).success(({ openid, token }) => {
                    openid && $local.set('openid', openid);
                    token && $local.set('vendor_token', token);
                });
            }

            next();
        },
        methods: {
            ...mapActions({
                'fetchProfile': 'user/profile'
            })
        },
        created () {
            if ($local.get('vendor_token')) {
                this.fetchProfile();
            }
        }
    };
</script>
