<style lang="less" scoped>
    .app-footer .footer-icon {
        height: 20px;
        margin-bottom: 5px;
    }
</style>

<template>
    <van-tabbar class="app-footer" safe-area-inset-bottom route>
        <van-tabbar-item name="home" :to="{name: 'home.page'}" replace>
            <img class="footer-icon" slot="icon" slot-scope="{ active }" :src="active ? pngHomeFill : pngHome"/>
            订单
        </van-tabbar-item>
        <van-tabbar-item name="message" :info="count" :to="{name: 'message.page'}" replace>
            <img class="footer-icon" slot="icon" slot-scope="{ active }" :src="active ? pngMessageFill : pngMessage"/>
            消息
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    import pngHome from '../assets/footer/home.png';
    import pngHomeFill from '../assets/footer/home_fill.png';
    import pngMessage from '../assets/footer/message.png';
    import pngMessageFill from '../assets/footer/message_fill.png';
    import { mapActions, mapState } from 'vuex';

    export default {
        name: 'AppFooter',
        data () {
            return {
                pngHome,
                pngHomeFill,
                pngMessage,
                pngMessageFill
            };
        },
        created () {
            this.fetchCount();
        },
        methods: {
            ...mapActions({'fetchCount': 'notice/refresh'})
        },
        computed: {
            ...mapState('notice', {
                count ({ count = null }) {
                    return count > 9 ? '9+' : (count || null);
                }
            })
        }
    };
</script>

