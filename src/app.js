import Vue from 'vue';
import router from './routers';
import store from './store';
import directives from './directives';
import MintUI from 'mint-ui';
import moment from 'moment';
// filter 自动注册
import filters from './filters';
import {
    Button,
    Tabs,
    Tab,
    Tabbar,
    TabbarItem,
    Grid,
    GridItem,
    Image,
    Cell,
    List,
    Icon,
    Field,
    CellGroup,
    Radio,
    RadioGroup,
    Row,
    Col,
    Sticky,
    Skeleton,
    Loading,
    Popup,
    Picker
} from 'vant';
import 'vant/lib/index.less';
import '@vant/touch-emulator'; // 将mouse事件转换成对应的touch事件，使得组件能够在桌面端使用。
import _ from 'underscore';

window._ = _;

// vant init，由于vant功能全面，此项目只使用少部分
Vue.use(Button);
Vue.use(Tabs);
Vue.use(Tab);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Image);
Vue.use(List);
Vue.use(Cell);
Vue.use(Icon);
Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Sticky);
Vue.use(Skeleton);
Vue.use(Loading);
Vue.use(Popup);
Vue.use(Picker);

Vue.use(MintUI);
// 设计尺寸
const DESIGN_STANGARD = 375;
// 计算比例 1:50
const CONVERT_NUM = 50;
const MAX_CLIENT = 414;

window.moment = moment;
window.onresize = function () {
    // FIXED 勿直接赋值style,safair 浏览器下回报错
    if (MAX_CLIENT < document.body.clientWidth) {
        return;
    }
    let size = (document.body.clientWidth / DESIGN_STANGARD) * CONVERT_NUM;
    document.getElementsByTagName('html')[0].style.fontSize = size + 'px';
};

window.onresize();

// 生产环境
if (process.env.NODE_ENV) {
    // 关闭Vue dev提示
    Vue.config.productionTip = false;
}

// 初始化
new Vue({
    router,
    store,
    beforeCreate () {
        // 初始化
        filters();
        directives();
    }
}).$mount('#app');




