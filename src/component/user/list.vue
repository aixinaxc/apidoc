<template>
    <div>
        <div style="margin:  0.5% 0.5% 0.5% 0;width: 100%">
            <Input suffix="ios-search" placeholder="Enter text" style="width: 20%" />
            <div style="float: right;">
                <Button type="primary" @click="openEdit">添加管理员</Button>
            </div>
        </div>
        <div>
            <Table height="600" :columns="columns1" :data="data2"></Table>
            <Page :total="Total" :page-size="pageSize"  :current="pageNum" @on-change="userList"  show-elevator style="float:right;margin: 10px;"/>
        </div>

        <Modal
                v-model="project_modal"
                title="编辑关联项目"
                :loading="loading"
                @on-ok="closeProject">
                <div style="margin: 5px">
                    <CheckboxGroup v-model="projectChange">
                        <Checkbox v-for="(p,index) in projectList" :label="p.project_id">
                            <Icon type="logo-twitter"></Icon>
                            <span>{{p.project_name}}</span>
                        </Checkbox>

                    </CheckboxGroup>
                </div>
        </Modal>


        <Modal
                v-model="edit_modal"
                title="编辑管理员"
                :loading="loading"
                @on-ok="closeFeature">
            <Form :model="formItem" :label-width="80">
                <div style="margin: 5px">
                    <FormItem label="管理员名称">
                        <Input v-model="formItem.name" placeholder="请输入管理员名称..."></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" v-model="formItem.password" placeholder="请输入密码..."></Input>
                    </FormItem>
                </div>
            </Form>
        </Modal>


        <Modal
                v-model="delete_model"
                title="删除管理员"
                @on-ok="closeDelete"
        >
            <p>您确定要删除该管理员吗？</p>
        </Modal>

    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        name: "list",
        inject:["reload"],
        data() {
            return {
                columns1: [
                    {
                        title: '用户ID',
                        key: 'user_id'
                    },
                    {
                        title: '名称',
                        key: 'user_username'
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        render: (h, params) => {
                            const row = params.row;
                            return h('div', [
                                h('span', {}, this.formatDateTime(row.created_at)),
                            ]);
                        }
                    },{
                        title: '操作',
                        key: '',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row);
                                            this.formItem.userId = params.row.user_id;
                                            this.formItem.name = params.row.user_username;
                                            this.edit_modal = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.formItem.userId = params.row.user_id;
                                            this.project_modal = true;
                                        }
                                    }
                                }, '项目关联'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.formItem.userId = params.row.user_id;
                                            this.delete_model = true;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                data2:[],
                edit_modal: false,
                delete_model: false,
                project_modal:false,
                loading: true,
                examine:"",
                examine_content:"",
                formItem: {
                    userId:'',
                    name: '',
                    password: ''
                },
                projectList:[],
                projectChange:[],
                pageNum:1,
                pageSize:10,
                Total:0

            }
        },
        mounted: function(){
            this.userList();
            this.projectLists();
        },
        methods:{
            userList: function(){
                this.$http.get("/user/list",{
                    params: {
                        page_num: this.pageNum,
                        page_size: this.pageSize
                    }
                    })
                    .then(res=>{
                        this.data2 = res.data;
                        this.Total = res.total;
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            projectLists: function(){
                this.$http.get("/project/list")
                    .then(res=>{
                        console.log("projectlist");
                        this.projectList = res.data;
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            closeFeature: function(){
                if(this.formItem.name == undefined || this.formItem.name == null || this.formItem.name == ""){
                    this.$Message.error('登录名称不能为空');
                    return;
                }else if(this.formItem.password == undefined || this.formItem.password == null || this.formItem.password == ""){
                    this.$Message.error('密码不能为空');
                    return;
                }
                this.formItem.password = md5(this.formItem.password);
                this.$http.post("/user/save",{
                    userId : this.formItem.userId,
                    username: this.formItem.name,
                    password: this.formItem.password
                })
                    .then(res=>{
                        this.edit_modal = false;
                        this.$Message.success('编辑成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            closeDelete: function(){
                this.$http.get("/user/delete",{
                    params: {
                        userId: this.formItem.userId
                    }
                    })
                    .then(res=>{
                        this.delete_model = false;
                        this.$Message.success('删除成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    });

            },
            closeProject: function(){
                if (this.projectChange.length == 0) {
                    this.$Message.warning('请选项关联项目');
                    this.loading = false;
                    return;
                }
                let projectIds = '';
                for(let i=0;i<this.projectChange.length;i++){
                    if(i==0){
                        projectIds = this.projectChange[i];
                    }else {
                        projectIds = projectIds +","+ this.projectChange[i];
                    }
                }
                this.$http.post("/user/user_project_save",{
                    userId: this.formItem.userId,
                    project_ids: projectIds
                })
                    .then(res=>{
                        this.delete_model = false;
                        this.$Message.success('项目关系添加成功');
                        this.projectChange = [];
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            openEdit: function () {
                this.formItem.userId = '';
                this.formItem.name = '';
                this.formItem.password = '';
                this.edit_modal = true;
            },
            formatDateTime: function (timeStamp) {
                let date = new Date();
                date.setTime(timeStamp * 1000);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute = date.getMinutes();
                let second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
            }
            /*test: function () {
                console.log(this.$mockdata.expertList.list)
            }*/
        }
    }


</script>

<style scoped>

</style>