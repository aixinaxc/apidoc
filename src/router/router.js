import Main from '../component/main/main.vue';
import Test from '../component/test/test.vue';
import Login from '../component/login/login.vue';
export const pageLogin = {
    path: '/',
    name: 'Login',
    component: Login
};
export const pageTest = {
    path: '/test',
    name: 'test',
    component: Test
};
export const pageMain = {
    path: '/main',
    name: 'main',
    component: Main
}
export const routers = [
    pageLogin,pageTest,pageMain
];
