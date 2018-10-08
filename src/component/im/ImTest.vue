<template>
    <div>
        <ImList :im_user_list="user_list" :im_from_user="user" :im_group_list="group_list" :im_base_img_path="base_img_path" :im_ws_url="ws_url"></ImList>
        <!--<ImContent  ></ImContent>-->
    </div>
</template>

<script>
    import ImList from './ImList.vue'
    export default {
        name: "ImTest",
        components:{
            ImList
        },
        data() {
            return {
                user_list:[],
                group_list:[],
                user: new Object(),
                base_img_path:'http://192.168.2.223:9001/img/',
                ws_url:'ws://192.168.2.223:9001/ws',
            }
        },
        mounted: function(){
            let usernew = JSON.parse(localStorage.getItem("user"));
            this.user.user_id = usernew.UserId;
            this.user.user_username = usernew.UserUsername;
            this.userList();
            this.groupList();
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
                        this.user_list = res.data
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            groupList: function () {
                this.$http.get("/group/list",{
                    params: {
                        page_num: this.pageNum,
                        page_size: this.pageSize
                    }
                     })
                    .then(res=>{
                        this.group_list = res.data
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            }
        }
    }
</script>

<style scoped>

</style>