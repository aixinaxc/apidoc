<template>
    <div>
        <mavon-editor :ishljs = "true" v-model="value" @change="c"/>
        <Button v-on:click="showHtml()">
            查看
        </Button>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "edit",
        data() {
            return {
                text: this.$store.state.text,
                split1: 0.5,
                value:'欢迎'
            }
        },
        components: {
            mavonEditor
            // or 'mavon-editor': mavonEditor
        },
        methods: {
            showHtml: function () {
                console.log("开始")
                console.log(this.value)
                this.$http.get("http://api.douban.com/v2/movie/top250")
                    .then(res=>{
                        console.log(res)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                //data contains html string for render
            },
            c: function(value,render) {
                console.log(value)
                console.log(render)
            }
        }
    }
</script>

<style scoped>

</style>