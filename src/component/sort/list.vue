<template>
    <div>
        <div style="margin:  0.5% 0.5% 0.5% 0;width: 100%">
            <Input suffix="ios-search" placeholder="Enter text" style="width: 20%" />
            <div style="float: right;">
                <Button type="primary" @click="openEdit">添加目录</Button>
            </div>
        </div>
        <div>
            <Table height="600" :loading="loadingT" :columns="columns1" :data="data2"></Table>
            <Page :total="Total" :page-size="pageSize"  :current="pageNum" @on-change="pidList"  show-elevator style="float:right;margin: 10px;"/>
        </div>


        <Modal
                v-model="edit_modal"
                title="编辑管理员"
                :loading="loading"
                @on-ok="closeEdit">
            <Form :model="formItem" :label-width="80">
                <input v-model="formItem.id" type="hidden"></input>
                <div style="margin: 5px">
                    <FormItem label="目录名称">
                        <Input v-model="formItem.name" placeholder="请输入目录名称..."></Input>
                    </FormItem>
                    <FormItem label="目录名称">
                        <Input v-model="formItem.seq" placeholder="请输入排序号..." onkeyup="this.value=this.value.replace(/[^0-9-]+/,'')"></Input>
                    </FormItem>
                    <FormItem label="父目录">
                        <Select v-model="formItem.pid" style="width:200px">
                            <Option v-for="item in pid_list" :value="item.sort_id" :key="item.sort_id" v-if="item.sort_pid == 0 && item.sort_id != formItem.id">{{ item.sort_name }}</Option>
                        </Select>
                    </FormItem>
                </div>
            </Form>
        </Modal>


        <Modal
                v-model="delete_model"
                title="删除目录"
                @on-ok="closeDelete"
        >
            <p>您确定要删除该目录吗？</p>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "list",
        inject:["reload"],
        data() {
            return {
                columns1: [
                    {
                        title: '目录名称',
                        key: 'sort_name'
                    },
                    {
                        title: '排序',
                        key: 'sort_seq'
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
                                            console.log(JSON.stringify(params.row));
                                            this.formItem.id = params.row.sort_id;
                                            this.formItem.name = params.row.sort_name;
                                            this.formItem.pid = params.row.sort_pid;
                                            this.formItem.seq = params.row.sort_seq;
                                            this.edit_modal = true;
                                        }
                                    }
                                }, '编辑'),
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
                                            this.formItem.id = params.row.sort_id;
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
                loadingT: true,
                examine:"",
                examine_content:"",
                formItem: {
                    id:'',
                    name: '',
                    pid:'',
                    seq:0
                },
                projectList:[],
                projectChange:[],
                pageNum:1,
                pageSize:10,
                Total:0,
                pid_list:[]

            }
        },
        mounted: function(){
            this.sortList();
            this.pidList();
        },
        methods:{
            sortList: function(ps){
                this.$http.get("/sort/plist",{
                    params: {
                        page_num: ps || 1,
                        page_size: this.pageSize,
                        project_id: this.$route.query.project_id
                    }
                })
                    .then(res=>{
                        this.data2 = res.data;
                        this.Total = res.total;
                        this.loadingT = false
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            pidList: function(){
                this.$http.get("/sort/list",{
                    params: {
                        project_id: this.$route.query.project_id
                    }
                })
                    .then(res=>{
                        this.pid_list = res.data;
                        console.log("=================")
                        console.log(this.pid_list)
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            closeEdit: function(){
                if(this.formItem.name == undefined || this.formItem.name == null || this.formItem.name == ""){
                    this.edit_modal = false;
                    this.$Message.error('分类名称不能为空');
                    return;
                }else if(this.formItem.name.length > 6){
                    this.edit_modal = false;
                    this.$Message.error('不能超过6个字');
                    return;
                }
                this.$http.post("/sort/save",{
                    project_id: this.$route.query.project_id,
                    sort_name: this.formItem.name,
                    sort_id: this.formItem.id,
                    sort_pid: this.formItem.pid,
                    sort_seq: this.formItem.seq
                })
                    .then(res=>{
                        this.edit_modal = false;
                        this.$Message.success('编辑成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            closeDelete: function(){
                this.$http.get("/sort/delete",{
                    params: {
                        sort_id: this.formItem.id
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
            openEdit: function () {
                this.formItem.id = '';
                this.formItem.name = '';
                this.formItem.pid = '';
                this.formItem.seq = 0;
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