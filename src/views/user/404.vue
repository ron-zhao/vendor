<style lang="sass" rel="stylesheet/sass" scoped>
    @import '../../common/sass/var.sass'
    #p404
        text-align: center
        img
            margin-top: 4rem
            width: 3.72rem
</style>

<template>
    <div id='p404' v-once>
        <img :src="png404" >
    </div>
</template>


<script>import { png404 } from '../../assets';

    export default {
        data () {
            return {
                png404
            };
        },
        beforeCreate () {},
        mounted () {},
        methods: {},
        components: {}
    };
</script>
