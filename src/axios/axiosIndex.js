import axios from 'axios'



axios.defaults.baseURL = 'xxx'
axios.defaults.withCredentials = true
axios.defaults.timeout = 100000
// // axios拦截器
axios.interceptors.request.use(config => {

    return config
})

axios.interceptors.response.use(response => {
    // 在这里你可以判断后台返回数据携带的请求码
    if (response.data.retcode === 200 || response.data.retcode === '200') {
        return response.data.data || response.data
    } else {
        this.$Message.warning('This is a warning tip');
    }

})


export default axios