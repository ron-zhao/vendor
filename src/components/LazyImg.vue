<template>
    <img v-lazy='imgSrc'>
</template>

<script>
    import { Lazyload } from 'mint-ui';
    import Vue from 'vue';
    import error from '../assets/404.png';
    import loading from '../assets/loading.gif';
    import { qiniuUrl } from '../config/global.config';

    const defaultQuery = '';

    Vue.use(Lazyload, {
        attempt: 0,
        preLoad: 1.3,
        error,
        loading
    });

    export default {
        name: 'lazy-img',
        props: ['src', 'query'],
        computed: {
            imgSrc () {
                let query = this.query || defaultQuery;
                return `${qiniuUrl}/${this.src}?${query}`;
            }
        }
    };
</script>
