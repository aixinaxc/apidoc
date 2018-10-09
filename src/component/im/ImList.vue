<template>
    <div>
        <div class="imbutton" @click="listShow">
            IM界面
        </div>
        <Card class="listStyle"  :style="list_show">
            <div class="userHead">
                <Avatar v-if="from_user.user_icon == '' || from_user.user_icon == undefined" icon="ios-person" />
                <Avatar v-else :src="touser.user_icon" />
                <span >{{from_user.user_username}}</span>
                <Icon type="ios-close" size="36" style="float: right;" @click="listShow"/>
            </div>
            <div class="userBody">
                <Tabs style="height: 400px">
                    <TabPane label="好友" style="height: 330px">
                        <div style="height:100%;overflow-y: auto">
                            <div>
                                <div class="userList" @click="isShow">
                                    <Icon :type="user_style == false ? 'ios-arrow-forward': 'ios-arrow-down' " />
                                    我的好友
                                </div>
                                <div  v-for="(touser,index) in user_list" :class="user_style == false ? 'display': 'show'" @click="openImContent(touser,'p2p')"
                                     onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
                                    <Avatar v-if="touser.user_icon == '' || touser.user_icon == undefined" icon="ios-person" />
                                    <Avatar v-else :src="touser.user_icon" />
                                    <span >{{touser.user_username}}</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="群组" style="height: 330px">
                        <div style="height:100%;overflow-y: auto">
                            <div>
                                <div class="userList" @click="isGroupShow">
                                    <Icon :type="group_style == false ? 'ios-arrow-forward': 'ios-arrow-down' " />
                                    我的群组
                                </div>
                                <div v-for="(group,index) in group_list" :class="group_style == false ? 'display': 'show'" @click="openImContent(group,'group')"
                                     onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
                                    <Avatar v-if="group.group_icon == '' || group.group_icon == undefined" icon="ios-person" />
                                    <Avatar v-else :src="touser.user_icon" />
                                    <span >{{group.group_name}}</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="记录" style="height: 330px">
                        标签三的内容
                    </TabPane>
                </Tabs>
            </div>
            <ImContent ref="ImContent" :im_to_user="to_user" :im_from_user="from_user" :im_base_img_path="base_img_path" :im_ws_url="ws_url" :im_msg_type="msg_type" :im_msg_list="msg_list"></ImContent>
        </Card>
    </div>

</template>

<script>
    import ImContent from './ImContent.vue';
    export default {
        name: "ImList",
        props:['im_user_list','im_from_user','im_group_list','im_base_img_path','im_ws_url'],
        components:{
            ImContent
        },
        data() {
            return {
                from_user: this.im_from_user,
                to_user:'',
                base_img_path: this.im_base_img_path,
                ws_url: this.im_ws_url,
                user_style:false,
                group_style:false,
                user_list:this.im_user_list,
                group_list: this.im_group_list,
                list_show:'display:none',
                msg_type:'p2p',
                msg_list:[],
                to_id:'',
            }
        },
        mounted: function(){

        },
        watch:{
            im_user_list:function (val) {
                this.user_list = val;
                console.log("im");
                console.log(val)
            },
            im_group_list:function (val) {
                this.group_list = val;
                console.log("im");
                console.log(val)
            }

        },
        methods:{
            isShow:function () {
                if(this.user_style == false){
                    this.user_style = true;
                }else{
                    this.user_style = false;
                }
            },
            isGroupShow:function(){
                if(this.group_style == false){
                    this.group_style = true;
                }else{
                    this.group_style = false;
                }
            },
            listShow:function(){
                if(this.list_show == 'display:none'){
                    this.list_show = 'display:block';
                }else{
                    this.list_show = 'display:none';
                }
            },
            openImContent: function (toUser,msgType) {
                console.log(toUser);
                this.msg_type = msgType;
                this.to_user = toUser;
                this.msgList(msgType);
                this.$refs.ImContent.im_modal = true;
            },
            msgList: function(msgType){
                this.msg_list = [];
                if(this.msg_type == 'p2p'){
                    this.to_id = this.to_user.user_id;
                }else if(this.msg_type == 'group'){
                    this.to_id = this.to_user.group_id;
                }
                this.$http.get("/msg_list",{
                    params: {
                        msg_from_id:  this.from_user.user_id,
                        msg_to_id: this.to_id,
                        start_time:0,
                        end_time:0,
                        total:10,
                        msg_type:msgType
                    }
                    })
                    .then(res=>{
                        console.log(res.data);
                        this.msg_list = res.data;
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }
        }
    }
</script>

<style scoped>
    .userHead{
        width: 100%;
        height: 48px;
    }
    .userBody{
        width: 100%;
        height: 100%;
        background: white;
    }
    .listStyle{
        width: 270px;
        height: 450px;
        z-index: 1000;
        position: fixed ! important;
        right: 0;
        bottom: 0;
    }

    .userList {
        height: 24px;
    }

    .show{
        padding: 5px;
        display: block;
    }

    .showBackground{
        padding: 5px;
        display: block;
        background:#DEDEDE;
    }

    .display{
        padding: 5px;
        display: none;
    }

    .imbutton{
        width: 150px;
        height: 48px;
        border: mediumslateblue 1px solid;
        background: lightseagreen;
        text-align: center;
        font-size: 18px;
        line-height:48px;
        z-index: 1000;
        position: fixed ! important;
        right: 20px;
        bottom: 15px;
    }
</style>