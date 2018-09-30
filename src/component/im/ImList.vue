<template>
    <div>
        <div class="imbutton" @click="listShow">
            IM界面
        </div>
        <Card class="listStyle"  :style="list_show">
            <div class="userHead">
                <Avatar icon="ios-person" />
                <span >{{from_user.user_username}}</span>
                <Icon type="ios-close" size="36" style="float: right;" @click="listShow"/>
            </div>
            <div class="userBody">
                <Tabs style="height: 400px">
                    <TabPane label="好友" >
                        <div>
                            <div class="userList" @click="isShow">
                                <Icon :type="userStyle == false ? 'ios-arrow-forward': 'ios-arrow-down' " />
                                我的好友
                            </div>
                            <div v-for="(touser,index) in user_list" :class="userStyle == false ? 'userDisplay': 'userShow'" @click="openImContent(touser)">
                                <Avatar icon="ios-person" />
                                <span >{{touser.user_username}}</span>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="群组" >标签二的内容</TabPane>
                    <TabPane label="记录" >标签三的内容</TabPane>
                </Tabs>
            </div>
            <ImContent ref="ImContent" :im_to_user="to_user" :im_from_user="from_user" ></ImContent>
        </Card>
    </div>

</template>

<script>
    import ImContent from './ImContent.vue';
    export default {
        name: "ImList",
        props:['im_user_list','im_from_user'],
        components:{
            ImContent
        },
        data() {
            return {
                from_user: this.im_from_user,
                to_user:'',
                userStyle:false,
                user_list:this.im_user_list,
                list_show:'display:none'
            }
        },
        mounted: function(){

        },
        watch:{
          im_user_list:function (val) {
              this.user_list = val;
              console.log("im");
              console.log(val)
          }
        },
        methods:{
            isShow:function () {
                if(this.userStyle == false){
                    this.userStyle = true;
                }else{
                    this.userStyle = false;
                }
            },
            listShow:function(){
                if(this.list_show == 'display:none'){
                    this.list_show = 'display:block';
                }else{
                    this.list_show = 'display:none';
                }
            },
            openImContent: function (toUser) {
                console.log(toUser);
                this.to_user = toUser;
                this.$refs.ImContent.im_modal = true;
            },

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
        z-index: 9999;
        position: fixed ! important;
        right: 0;
        bottom: 0;
    }

    .userList {
        height: 24px;
    }

    .userShow{
        padding: 5px;
        display: block;
    }

    .userDisplay{
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
        z-index: 9999;
        position: fixed ! important;
        right: 20px;
        bottom: 15px;
    }
</style>