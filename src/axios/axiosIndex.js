import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL = 'http://192.168.2.223:9000';
axios.defaults.withCredentials = false;
axios.defaults.timeout = 100000;

// // axios拦截器
axios.interceptors.request.use(config => {
    console.log("config:");
    let user = sessionStorage.getItem("user");
    if (user !== undefined && user !== null && user !== "") {
        console.log("user:");
        console.log(user);
        let juser = JSON.parse(user);
        console.log("juser:");
        console.log(juser);
        if(config.method === "get"){
            if(config.params === undefined){
                config.params = {};
            }
            config.params.user_id = juser.UserId;
            config.params.token = juser.Token;

            console.log("config.params:");
            console.log(user);
        }else if(config.method === "post"){
            if(config.data === undefined){
                config.data = {};
            }
            config.data.user_id = juser.UserId;
            config.data.token = juser.Token;
            config.data = qs.stringify(config.data);
            console.log("config.data:");
            console.log(user);
        }
    }

    //config.params = qs.stringify(config.params);
    /*config.headers={
        "Content-Type":"application/x-www-form-urlencoded"
    }*/

    return config
});

axios.interceptors.response.use(response => {
    // 在这里你可以判断后台返回数据携带的请求码
    if (response.data.code === 200 || response.data.code === '200') {
        console.log("return:");
        console.log(response.data.data);
        return response.data.data
    } else {
        this.$Message.warning('This is a warning tip');
    }

});


export default axios