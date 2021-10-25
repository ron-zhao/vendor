<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .order-list
        width: 100%
        height: 100%
        position: fixed
        left: 0
        top: 0
        background-color: #fff
        padding-bottom: 0.2rem
        p
            margin: 0.6rem 2% 0.4rem 2%
        .subBtn
            width: 2rem
            padding: .2rem .6rem
            border-radius: .1rem
        .title
            &::before
                content: "*"
                color: #f56c6c
                margin-right: .02rem
        .iconfont
            font-style: normal
        .select-icon
            width: 0
            height: 0
            border-width: .1rem .1rem 0
            border-style: solid
            border-color: #333 transparent transparent
            top: 0.34rem

    .van-cell__title
        font-weight: bold
        width: 90px
        flex: none

    .van-field
        /deep/
            .van-field__label
                font-weight: bold

            textarea
                background-color: #fafafa
                height: 150px
                border-radius: 5px
                padding: 10px
    .form-box
        .van-cell
            margin-bottom: 5px

    .form-tip
        padding-left: 105px
        color: #333
        font-size: 13px
        font-weight: 400

    div.form-tip
        padding: $space 0 $space 105px

    .submit-button
        width: 100%
        margin-top: 20px
</style>

<template>
    <div>
        <van-cell-group class="form-box" :border="false">
            <van-field
                v-model="form.name"
                maxlength="32"
                label="商品名称"
                placeholder="请输入"
                :readonly="id"
                border
                required
            />
            <p class="form-tip">品牌+品名+销售规格</p>

            <van-field
                class="van-hairline--top mt"
                v-model="form.spec"
                label="出售单位"
                placeholder="请选择"
                @click="showPicker = true"
                border
                disabled
                required
                is-link
            />
        </van-cell-group>

        <van-cell-group class="mt" :border="false">
            <van-field
                v-model="form.unit_price"
                type="number"
                label="供货价"
                placeholder="请输入"
                required
                border
            />
            <van-field
                v-model="form.suggest_price"
                type="number"
                label="建议售价"
                placeholder="请输入"
                required
                border
            />
        </van-cell-group>

        <van-cell-group class="mt" :border="false">
             <van-cell title="商品图片" required :border="false">
                <img-upload multiple v-model="form.image" :limit="9" />
            </van-cell>
            <p class="form-tip">1、最多上传9张，每张大小不超过5M</p>
            <p class="form-tip">2、图片均为白底照片</p>
            <p class="form-tip" style="padding-bottom: 10px">3、有包装箱的必须包含外箱正面图、外箱侧面图、+内箱实物正面图、内箱实物侧面图</p>
        </van-cell-group>

        <van-cell-group class="mt" :border="false">
            <van-field
                v-model="form.desc"
                type="textarea"
                label="商品描述"
                placeholder=""
                :border="false"
                required
            />
            <p class="form-tip">描述需要包含如下信息</p>
            <p class="form-tip">1、品牌</p>
            <p class="form-tip">2、规格：重量（整箱/单个），数量</p>
            <p class="form-tip">3、适合门类：例如火锅、串串、中式快餐、面馆等</p>
            <p class="form-tip">4、产品卖点、保质期、原厂地、使用方式</p>
            <p class="form-tip" style="padding-bottom: 10px">5、冻品需标明大致含冰率、解冻方式、解冻后的净重量、运输过程中出水问题需提示、箱内个数</p>
        </van-cell-group>

        <div class="padder">
            <van-button class="submit-button" type="info" @click="submit()" :disabled="submitLoading">
                {{form.status === 'REJECT' ? '重新提交' : '提交'}}
            </van-button>
        </div>

        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="units"
                @cancel="showPicker = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import ImgUpload from '@components/ImgUpload';
import * as supplyProductApplies from '../../api/lib/supplyProductApplies';
import LazyImg from '@components/LazyImg';
import { Toast } from 'mint-ui';

const units = ['斤', '箱', '个', '捆', '桶', '件', '把', '其他'];

export default {
    data () {
        const { id } = this.$route.params;

        return {
            id,
            units,
            showPicker: false,
            submitLoading: false,
            form: {
                name: '',
                spec: units[0],
                desc: '',
                image: []
            }
        };
    },
    created () {
        if (this.id) this.getDetail(this.id);
    },
    methods: {
        submit () {
            if (this.checkData()) {
                this.submitLoading = true;

                let instance = supplyProductApplies.add;
                if (this.form.id) {
                    instance = this.form.status === 'REJECT' ? supplyProductApplies.reapply : supplyProductApplies.update;
                }

                instance(this.form).success(data => {
                    this.$router.back();
                    this.submitLoading = false;
                }).error(() => {
                    this.submitLoading = false;
                });
            }
        },
        getDetail (id) {
            supplyProductApplies.get(id)
                .success(data => {
                    this.form = data;
                    this.form.unitPrice = data.unit_price;
                });
        },
        onConfirm (value) {
            this.form.spec = value;
            this.showPicker = false;
        },
        checkData () {
            if (this.isNullValue()) {
                let productName = this.form.name.length > 32;
                // 下面单词目的是局部禁用eslint
                // eslint-disable-next-line no-control-regex
                const regexRule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                let unitPrice = regexRule.test(this.form.unit_price);
                let suggestPrice = regexRule.test(this.form.suggest_price);
                let desc = this.form.desc.length < 500;
                if (productName) {
                    Toast('商品名称必须少于32个汉字');
                    return false;
                }
                if (!unitPrice) {
                    Toast('供货价只能为数字，且小数位只保留两位');
                    return false;
                }
                if (!suggestPrice) {
                    Toast('建议售价只能为数字，且小数位只保留两位');
                    return false;
                }
                if (!desc) {
                    Toast('描述不能大于500字');
                    return false;
                }
                return true;
            }
        },
        isNullValue () {
            if (!this.form.name) {
                Toast('商品名称不能为空！');
                return false;
            }
            if (!this.form.unit_price) {
                Toast('出售价格不能为空！');
                return false;
            }
            if (!this.form.suggest_price) {
                Toast('出售价格不能为空！');
                return false;
            }
            if (!this.form.desc) {
                Toast('商品描述不能为空！');
                return false;
            }
            if (_.isEmpty(this.form.image)) {
                Toast('商品图片不能为空！');
                return false;
            }
            return true;
        }
    },
    components: {
        ImgUpload,
        LazyImg
    },
    computed: {}
};
</script>

