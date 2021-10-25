<style lang="sass" scoped>
    @import '../common/sass/var'
    @import '../common/sass/reset'
    .upload-wrapper
        overflow: hidden
        user-select: none
        color: #bbbbbb
        line-height: 1.2

        input
            display: none

        .upload-viewer,.upload-handler
            float: left
            width: 1.5rem
            height: 1.5rem
            border-radius: .1rem
            text-align: center
            border: 1px dashed #e7e7e7
            margin-right: .17rem // 莫名的间距占了一部分
            margin-top: .19rem

            p
                z-index: 0
                font-size: inherit
                color: inherit
                margin: 0
                line-height: 1.2

        .upload-handler
            font-size: $small
            position: relative
            &:after
                content: ''
                display: block
                position: absolute
                width: 100%
                height: 100%
                top: 0
                left: 0
                z-index: 1

            p
                font-size: 13px

            img
                width: 26px
                margin-top: 18px
                z-index: 0

        .upload-viewer
            position: relative
            border-color: transparent
            display: flex
            align-items: center
            justify-content: center

            .upload-img-viewer
                width: 100%
                height: 100%
                overflow: hidden
                border-radius: .1rem

            img
                height: 100%

            .upload-close-btn
                width: .4rem
                height: .4rem
                background: url("../assets/close_btn.png") center no-repeat
                background-size: 90%
                outline: none
                border: none
                position: absolute
                right: -.2rem
                top: -.2rem
</style>
<template>
    <div class="upload-wrapper">
        <div class="upload-viewer" v-for="(item, index) in hash" :key="item + index">
            <div class="upload-img-viewer" v-if="item">
                <lazy-img :src="item" @click.native="handleImgView(index)"></lazy-img>
            </div>
            <div class="upload-loading" v-else>
                <p>正在上传</p>
                <p v-if="uploadProgress[index]">{{uploadProgress[index] | number}}%</p>
            </div>
            <button class="upload-close-btn" v-if="item" @click="handleRemove(index)"></button>
        </div>

        <label class="upload-handler" v-show="hash.length < limit">
            <input type="file" :accept="acceptTypes" ref="file" @change="handleUpload" :multiple="multiple" :disabled="uploadBtn"/>
            <img src="@root/assets/camera.png" alt="camera" />
            <p v-show="hash.length">{{hash.length}}/{{limit}}</p>
            <p v-show="!hash.length">上传图片</p>
        </label>
    </div>
</template>
<script>
    import LazyImg from '@components/LazyImg';
    import { Toast } from 'vant';
    import * as Qiniu from 'qiniu-js';
    import * as resource from '@root/api/index';
    import { qiniu } from '@root/filters/filter';
    import _ from 'underscore';

    export default {
        props: {
            limit: {
                default: 3,
                type: Number
            },
            accept: {
                default () {
                    return ['image/*'];
                },
                type: Array
            },
            value: {
                default () {
                    return [];
                },
                type: Array,
                required: true
            },
            showImg: {
                default () {
                    return false;
                },
                type: Boolean
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                uploadProgress: [],
                uploadBtn: false
            };
        },
        created () {
            const arr = [];
            arr.length = this.limit;
            this.uploadProgress = arr;
        },
        methods: {
            handleImgView (index) {
                if (this.showImg) {
                    const urls = this.hash.map(item => qiniu(item));

                    wx.previewImage({
                        current: urls[index],
                        urls
                    });
                }
            },
            handleRemove (index) {
                this.hash.splice(index, 1);
            },
            handleUpload () {
                // TODO 文件大小限制
                const { files = [] } = this.$refs.file;
                if (_.isEmpty(files)) {
                    return;
                }
                this.uploadBtn = true;
                // 上传文件数限制
                let size = this.limit - this.hash.length;
                if (files.length > size) {
                    Toast.fail(`最多可上传${this.limit}张图片，超出的部分将不会上传`);
                }

                for (const file of files) {
                    (size-- > 0) && this.upload(file);
                }
            },
            async upload (file) {
                const index = this.hash.length; // 保存本次上传
                this.hash.push('');

                const { token } = await resource.qiniuToken().catch(() => {
                    this.hash.splice(index, 1);
                });

                if (token) {
                    const config = {
                        useCdnDomain: true,
                        disableStatisticsReport: false,
                        retryCount: 5,
                        region: Qiniu.region.z2
                    };
                    const putExtra = {
                        fname: '',
                        params: {},
                        mimeType: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg']
                    };

                    const observable = Qiniu.upload(file, null, token, putExtra, config);

                    observable.subscribe({
                        next: ({ total }) => {
                            this.$refs.file.value = '';
                            this.$set(this.uploadProgress, index, total.percent);
                        },
                        error: () => {
                            Toast.fail('上传出错，请重试');
                            this.hash.splice(index, 1);
                            this.uploadBtn = false;
                        },
                        complete: (resp) => {
                            this.hash.splice(index, 1, resp.hash);
                            this.uploadBtn = false;
                        }
                    });
                }
            }
        },
        computed: {
            acceptTypes () {
                return this.accept.join(';');
            },
            hash: {
                get () {
                    return this.value || [];
                },
                set (value) {
                    this.$emit('input', value);
                }
            }
        },
        components: {
            LazyImg
        }
    };
</script>

