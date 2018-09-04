import Main from '../component/main/main.vue';
import Test from '../component/test/test.vue';
import Login from '../component/login/login.vue';
import Project from '../component/project/project.vue';
import Home from  '../component/layout/layout.vue';
import ApiList from '../component/api/list.vue';
import ApiEdit from '../component/api/edit.vue';
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
export const pageHome = {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
        {
            path: '',
            component: ApiList
        },
        {
            path: 'api/list',
            component: ApiList
        },
        {
            path: 'api/edit',
            component: ApiEdit
        }
    ]
};
export const routers = [
    pageLogin,pageTest,pageMain,pageProject,pageHome
];
