import Main from '../component/main/main.vue';
import Test from '../component/test/test.vue';
import Login from '../component/login/login.vue';
import Project from '../component/project/project.vue';
import Layout from  '../component/layout/layout.vue';
import ApiContent from '../component/api/content.vue';
import ApiEdit from '../component/api/edit.vue';
import Home from '../component/home/home.vue';
import UserList from '../component/user/list.vue';
import ImList from '../component/im/list.vue';

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
};
export const pageProject = {
    path: '/project',
    name: 'project',
    component: Project
};
export const pageIm = {
    path: '/im',
    name: 'im',
    component: ImList
};

export const pageHome = {
    path: '/home',
    name: 'home',
    component: Layout,
    children: [
        {
            path: '',
            component: Home
        },
        {
            path: 'api/content',
            component: ApiContent
        },
        {
            path: 'api/edit',
            component: ApiEdit
        },
        {
            path: 'user/list',
            component: UserList
        }
    ]
};
export const routers = [
    pageLogin,pageTest,pageMain,pageProject,pageHome,pageIm
];
