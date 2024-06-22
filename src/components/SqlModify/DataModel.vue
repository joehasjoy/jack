<template>
    <div class="main">
        <iframe
            class="model-frame"
            :src= "getSrc()"
            frameborder="0"
            width="100%"
            height="100%"
        >
        </iframe>
    </div>
</template>
<script>
export default {
    name: "DataModel",
    data : function() {
        return {};
    },
    methods:{
        getSrc:function(){
            let tenantId = localStorage.getItem("originTenantId");
            let authCode = localStorage.getItem("originGrantCode");
            return window._env_.dataModelUrl+"?authTenantId="+tenantId+"&authCode="+authCode;
        }
    },
    mounted : function(){
        window.addEventListener('message', e => {
           if(e.data =="close"){
               this.$router.push("/taskCenter");
           }
           //ignore other message
       });
    },
}
</script>
<style lang="scss" scoped>
.main {
    background-color: #f4f4f4;
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}
</style>
