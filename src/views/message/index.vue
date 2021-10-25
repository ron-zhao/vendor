<style lang="less" scoped>
    .message-page {
        padding-bottom: 50px;
    }

    .dot {
        display: inline-block;
        background-color: #e0614c;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        border-radius: 50%;
    }

    .message-list {
        background-color: #fff;
        margin-bottom: 1px;

        .message-content {
            position: relative;
            color: #999;
            padding: 0 50px 18px 15px;

            .message-content-arrow {
                position: absolute;
                right: 15px;
            }
        }
    }
</style>

<template>
    <div class="message-page" style="width: 100%">
        <van-tabs v-model="active" @change="handleChange" sticky swipeable color="#1989fa">
            <van-tab name="all" title="系统消息">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    :immediate-check="false"
                >
                    <div v-for="(item, index) in data" :key="item.id" class="message-list van-hairline--bottom" @click="linkToInfo(item, index)">
                        <van-cell title-class="van-ellipsis" size="large" :border="false" style="padding-bottom: 8px">
                            <template slot="title">
                                <span class="dot" v-if="item.no_read"></span>
                                <label>{{item.title || '消息通知'}}</label>
                            </template>
                            <div>
                                {{item.createdAt | date('M月D日')}}
                            </div>
                        </van-cell>
                        <div class="message-content van-ellipsis">
                            {{item.content}}
                            <van-icon size="20" class="message-content-arrow" name="arrow"/>
                        </div>
                    </div>
                </van-list>
            </van-tab>
            <van-tab name="document" title="常用文档">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    :immediate-check="false"
                >
                    <div v-for="(item, index) in documentData" :key="item.id" class="message-list van-hairline--bottom"
                         @click="linkToInfo(item, index)">
                        <van-cell size="large" :border="false" style="padding-bottom: 8px">
                            <template slot="title">
                                <span class="dot" v-if="item.no_read"></span>
                                <label>{{item.title}}</label>
                            </template>
                            <div>
                                {{item.createdAt | date('M月D日')}}
                            </div>
                        </van-cell>
                        <div class="message-content van-ellipsis">
                            {{item.content}}
                            <van-icon size="20" class="message-content-arrow" name="arrow"/>
                        </div>
                    </div>
                </van-list>
            </van-tab>
        </van-tabs>

        <app-footer />
    </div>
</template>

<script>
    import AppFooter from '../AppFooter';
    import * as vendorNotice from '../../api/lib/vendorNotice';
    import { mapActions } from 'vuex';

    export default {
        name: 'MessagePage',
        data () {
            return {
                loading: false,
                finished: false,
                data: [],
                documentData: [],
                active: 'all',
                offset: 0 // 分页
            };
        },
        methods: {
            ...mapActions({'fetchCount': 'notice/refresh'}),
            onLoad () {
                this.loading = true;
                vendorNotice.list({
                    is_normal_doc: this.active === 'document',
                    limit: 20,
                    offset: this.offset
                }).success(data => {
                    this.loading = false;
                    if (data.meta.length < 20) {
                        this.finished = true;
                    }

                    if (this.active === 'document') {
                        this.documentData.splice(this.offset, 20, ...data.meta);
                    } else {
                        this.data.splice(this.offset, 20, ...data.meta);
                    }

                    this.offset += 20;
                }).error(() => {
                    this.loading = false;
                    this.finished = true;
                });
            },
            handleChange () {
                this.offset = 0;
                this.loading = true; // 防止重复加载
                this.finished = false;
                this.data = [];
                this.documentData = [];

                this.onLoad();
            },
            linkToInfo ({ id, type, relation_id: relationId }, index = 0) {
                // 记录当前页码，删除之后数据，更改finished状态
                this.offset = Math.floor((index + 1) / 20) * 20;

                if (['VENDOR_STATEMENT', 'VENDOR_BILL', 'UP_ITEM', 'DOWN_ITEM'].includes(type)) {
                    // 更新状态
                    vendorNotice.get(id);
                }

                if (type === 'VENDOR_BILL') {
                    this.$router.push({
                        name: 'home.bill.info',
                        params: {id: relationId}
                    });

                    return;
                }

                if (type === 'VENDOR_STATEMENT') {
                    this.$router.push({
                        name: 'home.statement.info',
                        params: {id: relationId}
                    });

                    return;
                }

                if (type === 'UP_ITEM' && relationId) {
                    this.$router.push({
                        name: 'home.upAndDownProduct.info',
                        params: {id: relationId}
                    });

                    return;
                }

                if (type === 'DOWN_ITEM') {
                    this.$router.push({
                        name: 'home.upAndDownProduct',
                        query: {type: 'DOWN'}
                    });

                    return;
                }
    
                this.$router.push({
                    name: 'message.page.info',
                    params: {id}
                });
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if (from.name !== 'message.page.info') {
                    vm.offset = 0;
                    vm.finished = false;
                    vm.data = [];
                }

                vm.fetchCount();
                vm.onLoad();
            });
        },
        components: {
            AppFooter
        }
    };
</script>

