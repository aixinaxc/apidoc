import Main from '../component/main/main.vue';
import Test from '../component/test/test.vue';
export const pageIndex = {
    path: '/',
    name: 'index',
    component: Main
}
export const pageTest = {
    path: '/test',
    name: 'test',
    component: Test
}
export const routers = [
    pageIndex,pageTest
];
