<!--
 * @Author: your name
 * @Date: 2021-04-14 14:05:01
 * @LastEditTime: 2021-07-07 17:02:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\layout\components\Navbar.vue
-->
<template>
<el-menu class="navbar flex flex-align-items-center" mode="horizontal" id="devops_remove2" :style="headerColor ? { background: headerColor } : {}">
    <!-- <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb /> -->
    <div class="logo flex flex-align-items-center">
        <img :src="logoImg" class="logo_img" alt="登录系统" @click="toDashboard" style="cursor: pointer" />
        <div class="bar"></div>
        <el-tooltip content="回到首页" position="top">
            <a src="#" @click="toDashboardIndex">
                <span class="logo_text">{{ this.$store.state.settings.title }}</span>
            </a>
        </el-tooltip>
        <Marqueue :notices="notice" class="noticeContainer" /><!-- 公告 -->
    </div>

    <el-dropdown class="avatar-container" trigger="click" id="devops_remove3">
        <div class="avatar-wrapper">
            <img src="@/assets/user.png" class="user-avatar" />
            <span class="user-text">{{ username }}</span>
            <i class="el-icon-caret-bottom" />
            <!--        <span>{{ login_account }}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>-->
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
                <span style="display: block" @click="token">集成IDE</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="teamName != ''" divided>{{
          teamName
        }}</el-dropdown-item>
            <el-dropdown-item divided>
                <span style="display: block" @click="SwitchTenant">切换租户</span>
            </el-dropdown-item>

            <el-dropdown-item divided>
                <span style="display: block" @click="logout">退出</span>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</el-menu>
</template>

<script>
import {
    mapGetters,
    mapMutations
} from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import logoImg from "@/assets/logoenniu@2x.png";
import {
    getEnvList
} from "@/utils/pipeline.js";
import Marqueue from "@/components/Marqueue";
import Vue from "vue";
import {
    Message
} from "element-ui";
export default {
    components: {
        Breadcrumb,
        Hamburger,
        Marqueue,
    },
    props: {
        headerColor: {
            type: String
        },
    },
    data() {
        return {
            teamName: "",
            username: localStorage.getItem("username"),
            logoImg,
            tokenInfoVisible: false, //token信息弹框
            notice: [],
        };
    },
    computed: {
        ...mapGetters(["sidebar", "avatar"]),
    },
    methods: {
        ...mapMutations(['removeStorage']),
        loadNotice: function () {
            var that = this;
            let checkUrl = this.GLOBAL.baseUrl + "/control/notice";
            this.axios({
                    url: checkUrl,
                    method: "get",
                })
                .then(function (res) {
                    if (res.status == 200) {
                        if (res.data.code == 200) {
                            that.notice = [];
                            var message = res.data.message;
                            that.notice.push(message);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        toggleSideBar() {
            this.$store.dispatch("ToggleSideBar");
        },
        logout() {
            try {
                // this.authSdk.logout();

                // 与参与者中心解耦降级登录：在main.js改变了enn-auth-sdk.min.js加载时机，导致无法挂载其方法，挂载的是整个promise
                this.authSdk.then(res => {
                    res.logout()
                });
            } catch (err) {
                if (this.$store.getters.authLoginToken) {
                    //   处理与参与者中心解耦 - 降级登录没有authSdk，退出清空localStorage 并回到登录页
                    this.removeStorage()
                    this.$router.push('/authLogin')
                }
            }
        },
        token() {
            this.$EventBus.$emit("token", "");
        },
        SwitchTenant() {
            try {
                sessionStorage.clear()
                // this.authSdk.selectTenant(window.location.origin)

                // 与参与者中心解耦降级登录：在main.js改变了enn-auth-sdk.min.js加载时机，导致无法挂载其方法，挂载的是整个promise
                this.authSdk.then(res => {
                    res.selectTenant(window.location.origin)
                });
            } catch (err) {
                //   处理与参与者中心解耦 - 降级登录没有authSdk，切换租户时返回登录页
                if (this.$store.getters.authLoginToken) {
                    this.removeStorage()
                    this.$router.push('/authLogin')
                }
            }
        },

        toDashboard() {
            window.open("https://www.ennew.com/");
        },
        toDashboardIndex() {
            this.$router.push("/dashboard");
        },
        loadTenantsInfo() {
            let tenantId = localStorage.getItem("originTenantId");
            let url = this.GLOBAL.baseUrl + "/tenant/detail/" + tenantId;
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status == 200) {
                        if (res.data.code == 200) {
                            if (res.data.data === "") { //   处理与参与者中心解耦 - 降级登录后 接口无法获取，authLoginTenantId
                                this.teamName = this.$store.getters.authLoginTenantId;
                                this.username = this.$store.getters.authLoginUserName;
                            } else {
                                this.teamName = res.data.data.tenantName;
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    mounted() {
        this.loadTenantsInfo();
        getEnvList();
        this.loadNotice();
       /* this.$notify({
            title: '关于加强党的二十大期间安全保障工作的通知（新奥集字〔2022〕20号）',
            dangerouslyUseHTMLString: true,
            message: `<p>在二十大保障期间(2022年10月1日至2022年10月31日)实行封网管理，各单位须提前完成封网准备工作，包括:<br/>
                    1.封网期间关闭所有开发、测试、预发布环境的互联网访问。<br/>
                    2.封网期间暂停所有级别生产变更，包括产品/应用发布、版本升级配置修改、网络变更等可能影响安全、稳定运行的操作。如因关键网络或系统故障需要修复或因外部合规要求等特殊原因确需紧急变更的，需要经本单位一号位、新智云产品群总召集人(陈彦博)、数字安全赋能群总召集人(王静媛)审批后方可进行。</p>
<p style='margin-top:5px;'><a target='_blank'  style='color:#2D8CF0' href="http://ncome.enn.cn/km/smissive/km_smissive_main/kmSmissiveMain.do?method=view&fdId=1837ddf33e0970e34cb1129436d8cbac">点击查看详情<i class="el-icon-right"></i><a/></p>`,
            type: 'warning',
            offset: 100,
            duration:1000*60*5
        });*/
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 48px;
    border-radius: 0px !important;
    border: none;
    // background: #0073bc;
    background: $primary;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

    .hamburger-container {
        padding: 0 10px;
    }

    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }

    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 20px;

        .avatar-wrapper {
            cursor: pointer;
            position: relative;
            line-height: 50px;

            .user-avatar {
                width: 30px;
                height: 30px;
                vertical-align: middle;
                border-radius: 50%;
                margin-right: 12px;
            }

            .user-text {
                font-size: 14px;
                color: white;
            }

            .el-icon-caret-bottom {
                position: relative;
                //right: -20px;
                /*top: 25px;*/
                vertical-align: middle;
                font-size: 12px;
                color: white;
            }
        }
    }

    .logo {
        margin-left: 20px;

        .logo_img {
            width: 50px;
            height: auto;
        }

        .bar {
            width: 2px;
            height: 16px;
            background: white;
            margin-left: 16px;
            margin-right: 16px;
            opacity: 0.24;
        }

        .logo_text {
            font-size: 16px;
            font-weight: 400;
            color: white;
        }
    }
}

.noticeContainer {
    font-size: 13px;
    margin-left: 10px;
    width: 80vw;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
}
</style>
