<style lang="less" scoped>
    .message-page {
        padding: 15px;
        box-sizing: border-box;

        .message-info {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;

            h2 {
                font-size: 15px;
            }

            > p {
                color: #999;
                margin-top: 15px;
            }

            .message-time {
                font-size: 11px;
                line-height: 1;
            }
        }

        .message-attach {
            display: inline-block;
            margin-top: 15px;
            background-color: #f6f6f6;
            padding: 10px;
            border-radius: 3px;
            width: 100px;
            font-size: 12px;
            color: inherit;

            p {
                word-break: break-all;
                line-height: 1.2;
                margin-bottom: 7px;
            }

            &-size {
                word-break: break-all;
                display: inline-block;
                color: #999;
                line-height: 16px;
                font-size: 11px;
            }

            .message-pdf {
                width: 13px;
                height: 16px;
                vertical-align: sub;
                margin-right: 5px;
            }
        }
    }

</style>

<template>
    <div class="message-page" style="width: 100%">
        <van-skeleton title :row="3" :loading="loading"/>
        <div class="message-info" v-if="!loading">
            <h2>{{data.title || '消息通知'}}</h2>
            <p>{{data.content}}</p>

            <a v-if="data.file" :href="[qiniuUrl, data.file].join('/')" target="_blank" class="message-attach">
                <p class="van-multi-ellipsis--l2">{{data.file}}</p>
                <img class="message-pdf" src="../../assets/pdf.png" alt="pdf"/>
                <span class="message-attach-size">{{size}}</span>
            </a>

            <p class="message-time">
                {{data.createdAt | date('YYYY/MM/DD HH:mm')}}
            </p>
        </div>
    </div>
</template>

<script>
    import * as vendorNotice from '../../api/lib/vendorNotice';

    export default {
        name: 'MessagePageInfo',
        data () {
            return {
                qiniuUrl: 'https://download.zhangchuwang.cn',
                loading: true,
                data: {},
                size: '0KB'
            };
        },
        created () {
            const { id } = this.$route.params;
            this.loading = true;

            vendorNotice.get(id).success(data => {
                this.data = data;

                // 显示文件大小
                const { file_size: fileSize = 0 } = data;
                if (fileSize / 1024 >= 1) {
                    this.size = (fileSize / 1024).toFixed(2) + 'MB';
                } else {
                    this.size = fileSize + 'KB';
                }

                this.loading = false;
            }).error(() => {
                this.loading = false;
            });
        }
    };
</script>

