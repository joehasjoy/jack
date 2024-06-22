<template>
<div class="main flex-column">
    <el-page-header @back="goBack" content="选择构建计划模板">
    </el-page-header>
    <div class="tab_info">构建计划是持续集成的基本单元，在这里你可以快速创建一个构建计划，更多内容可以到构建计划详情中进行配置</div>
    <div class="panel-tab">
        <el-tabs v-model="activeConfigName" @tab-click="hanleClick">
            <el-tab-pane label="全部" name="all">
                <el-row :gutter="10">
                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('java')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/java.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Java
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 Java + Spring 实现-全自动检出代码 -> Java编译 -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>

                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('nodejs')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/nodejs.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Nodejs
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 Nginx 实现-全自动检出代码 -> NodeJS编译 -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>

                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('python')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/python.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Python
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 自定义Dockerfile 实现-全自动检出代码 -> 运行自定义Dockerfile -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('golang')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/golang.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Golang
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 自定义Dockerfile 实现-全自动检出代码 -> 运行自定义Dockerfile -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                </el-row>

            </el-tab-pane>
            <el-tab-pane label="编程语言" name="coding-language">
                <el-row>
                    <span style="font-weight: bold;">可选语言</span>
                    <el-tag v-for="item in useLanguageOptions" style="margin:10px;" type="success" :key="item.label" @click="filerLange(item.label)">
                        <el-link :underline="false"> {{ item.label }}</el-link>
                    </el-tag>

                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('java')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/java.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Java
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 Java + Spring 实现-全自动检出代码 -> Java编译 -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>

                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('nodejs')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/nodejs.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Nodejs
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 Nginx 实现-全自动检出代码 -> NodeJS编译 -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>

                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('python')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/python.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Python
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 自定义Dockerfile 实现-全自动检出代码 -> 运行自定义Dockerfile -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                    <el-col :span="12" style="margin-top:10px;">
                        <el-card shadow="hover">
                            <el-link :underline="false" @click="selectPipelineTemplate('golang')">
                                <div class="panel-item">
                                    <div class="panel-item-left">
                                        <img style="width: 80px; height: 80px" src="@/assets/pipeline/golang.png"></img>
                                    </div>
                                    <div class="panel-item-right">
                                        <div class="panel-item-right-top">
                                            Golang
                                        </div>
                                        <div class="panel-item-right-bottom">
                                            该模板演示基于 自定义Dockerfile 实现-全自动检出代码 -> 运行自定义Dockerfile -> 构建 Docker 镜像 -> 推送到 Docker 制品库
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-divider></el-divider>
        <div class="tab_info">若没有找到合适的模板，可选择自定义构建过程</div>
        <el-row :gutter="10" style="margin-top: 15px">
            <el-col :span="12">
                <el-card shadow="hover">
                    <el-link :underline="false">
                        <div class="panel-item" @click="goDesigin">
                            <div class="panel-item-left">
                                <img style="width: 80px; height: 80px" src="@/assets/pipeline/design.png"></img>
                            </div>
                            <div class="panel-item-right">
                                <div class="panel-item-right-top">
                                    自定义构建过程
                                </div>
                                <div class="panel-item-right-bottom">
                                    允许您根据实际需求来随意定制持续集成流水线过程
                                </div>
                            </div>
                        </div>
                    </el-link>
                </el-card>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import {
    getEnvNameIndex,
    getEnvList
} from "@/utils/pipeline.js";
import Pagination from "./../../components/Pagination/pagination.vue";
export default {
    name: "app-env",
    components: {
        Pagination,
    },
    data() {
        return {
            collapseTab: ["config"],
            appId: "",
            appCode: "",
            groupIdStr: undefined,
            useLanguage: 0,
            envValues: [],
            envObject: {},
            choices: ["全部", "编程语言"],
            activeConfigName: "all",
            envIndex: 1,
            server_tag: "default",
            total: 0,
            page: 1,
            limit: 10,
            historyList: [],
            imageDatas: [],
            useLanguageOptions: [{
                    label: "Java",
                    value: 1
                },
                {
                    label: "Python",
                    value: 2
                },
                {
                    label: "Go",
                    value: 3
                },
                {
                    label: "Nodejs",
                    value: 4
                }
            ],
        };
    },
    mounted() {
        this.appCode = this.common.getUrlKey("appCode");
        this.appId = this.common.getUrlKey("appId");
        this.groupIdStr = this.common.getUrlKey("groupIdStr");
        this.useLanguage = this.common.getUrlKey("useLanguage");

        getEnvList();

    },
    methods: {
        goBack: function () {
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.groupIdStr,
                    useLanguage: this.useLanguage
                },

            });
        },

        hanleClick: function (e) {

        },
      
        handleChangeCollase: function () {
            this.getChangeHistoryList();
        },
        goDesigin: function () {
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config-design",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.groupIdStr,
                    useLanguage: this.useLanguage
                },
            });
        },
        filerLange: function (e) {
            console.log(e)
        },
        selectPipelineTemplate(e) {
            var that = this;
            this.$confirm("是否确认添加当前模板?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {

                    this.axios({
                            url: this.GLOBAL.baseUrl + "/pipeline-design/bindAppPipeline/" + this.appId + "/" + this.appCode + "/" + e,
                            method: "GET"
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                if (res.data.code == 200) {
                                    that.$message({
                                        message: "操作成功",
                                        type: "success"
                                    });
                                    this.$router.push({
                                        path: "/cicd/app/pipline-config",
                                        query: {
                                            appId: that.appId,
                                            appCode: that.appCode,
                                        },
                                    });
                                } else {
                                    this.$message.error("操作失败");
                                }
                            } else {
                                this.$message.error("操作失败");
                            }
                        })
                        .catch((res) => {
                            console.log(res);
                            this.$message.error("操作失败");
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消选择",
                    });
                });
        }

    },
};
</script>

<style scoped>
.main {
    height: calc(100% - 80px);
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.back-box {
    font-size: 14px;
    color: #343a40;
    cursor: pointer;
    margin-bottom: 15px;
}

.back-box .el-icon-arrow-left {
    margin-right: 8px;
    font-size: 16px;
}

.panel-tab {
    flex: 1;
    overflow-y: auto;

}

.footer {
    margin-top: 24px;
}

.env-list {
    margin-top: 38px;
}

.env-list .list-item {
    margin: 18px 0;
}

.env-list .list-item:nth-child(2n) {
    padding: 18px 0;
    background: #f8f9fa;
}

.env-list .list-item .row {
    width: 49%;
}

.env-list .list-item .row .my-input {
    margin-right: 40px;
}

.env-list .list-item .label {
    margin: 0 20px;
    font-size: 14px;
    flex-shrink: 0;
}

.tab_info {
    font-size: 14px;
    text-align: left;
    margin-bottom: 5px;
    color: #76808e;
    font-weight: 400;
    margin-top: 10px;
}

.panel-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100px;
    padding: 5px;
}

.panel-item-left {
    margin-left: 5px;
    height: 80px;
    width: 80px;
}

.panel-item-right {
    margin-left: 15px;
}

.panel-item-right-top {
    margin-top: -5px;
    font-weight: bold;
    font-size: 20px;
    color: #202D40;
}

.panel-item-right-bottom {
    margin-top: 5px;
    font-size: 16px;
    color: #606c80;
}
</style>
