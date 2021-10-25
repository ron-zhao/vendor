<style lang="sass" scoped rel="stylesheet/sass">
    @import '~style/var.sass'
    .submitOrderSuc
        background-color: #fff
        height: 100%
        width: 100%
        position: fixed
        left: 0
        top: 0
        z-index: 999
        .box
            margin-top: 0.8rem
            text-align: center
            .btn-box
                margin: 0 0.2rem
                margin-top: 1rem
            .icon-success
                font-size: 1.3rem
                color: $primary
            .btn-left
                width: 2.1rem
                height: 0.86rem
                border: 0.02rem solid #acacac
                color: #666
                font-size: 0.3rem
                background-color: #fff
            .btn-right
                width: 2.1rem
                height: 0.86rem
                border: 0.02rem solid $primary
                color: $primary
                font-size: 0.3rem
                background-color: #fff
            .desc
                font-size: 0.32rem
                color: #999999
                text-align: center
                margin-top: 0.2rem
            .btn-center
                margin: 0 0.2rem
</style>
<template>
    <div class="load-failed">
        <div class="noData-box" style="border:none">
            <div style="margin-top: 3.1rem">
                <div style="width: 2.4rem;height: 2.4rem;margin: 0 auto">
                    <img src="../../assets/load-failed.png" style="width: 100%" alt="">
                </div>
                <p style="color: #cacacc;margin: 0.2rem 0">
                    网络连接失败，请检查您的网络~
                </p>
                <p class="text-primary" >
                    <button class="btn btn-primary" style="width: 1.5rem;height: 0.6rem" @touchstart="back">刷新</button>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            back () {
                this.$router.go(-1);
            }
        },
        components: {}
    };
</script>

