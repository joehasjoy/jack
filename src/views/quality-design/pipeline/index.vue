<template>
    <div class="main">
        <el-page-header @back="goBack" :content="content">
        </el-page-header>
        <!-- 右边按钮 -->
        <div class="right-button">
            <el-button size="mini" v-show="showTab == 'last'" @click="startBuild"
                icon="el-icon-caret-right">启动流程</el-button>
            <el-button size="mini" v-show="showTab == 'basic'" icon="el-icon-plus">更新配置</el-button>
        </div>
        <LogStepDialog ref="log"></LogStepDialog>
        <TestReport ref="report"></TestReport>
        <UploadFile ref="upload"></UploadFile>
        <PersonCheck ref="check"></PersonCheck>
        <el-tabs stretch class="topTab" v-model="showTab" @tab-click="changTab">
            <!-- <el-tab-pane name="basic" label="流程信息">
                <div class="bottomTab">
                    <ConfigStepLine></ConfigStepLine>
                </div>
            </el-tab-pane> -->
            <el-tab-pane name="last" label="最近集成">
                <el-empty v-if="showLastEmpty" description="当前流水线尚未运行" style="margin-top: 20vh;">
                    <el-button type="primary" @click="startBuild">立即运行</el-button>
                </el-empty>
                <template v-else>
                    <el-card style="width:100%;margin-top: 10px;margin-bottom: 10px;">
                        <div slot="header">
                            <div class="list-card-header">
                                <div class="list-card-header-slot"></div>
                                <span style="margin-left: 5px">流程信息</span>
                                <el-button class="list-card-header-slot-btn" icon="el-icon-refresh"></el-button>
                            </div>
                        </div>
                        <el-descriptions class="margin-top" :column="4">
                            <el-descriptions-item label="应用名称">{{ last_build_row.appCode }}</el-descriptions-item>
                            <el-descriptions-item label="业 务 域">{{ groupIdStrName }}</el-descriptions-item>
                            <el-descriptions-item label="构建用时">{{ last_build_row.duration }}</el-descriptions-item>
                            <el-descriptions-item label="部署分支">{{ cur_build_row.branch }}</el-descriptions-item>
                            <el-descriptions-item label="流程状态">
                                <div style="color: red;" v-show="cur_build_row.status == 'FAILURE'">
                                    运行失败 <i class="el-icon-error"></i>
                                </div>
                                <div style="color:#67C23A" v-show="cur_build_row.status == 'SUCCESS'">
                                    运行成功 <i class="el-icon-success"></i>
                                </div>
                                <div style="color:#67C23A" v-show="cur_build_row.status == 'BUILDING'">
                                    运行中 <i class="el-icon-loading"></i>
                                </div>
                                <div style="color:#E6A23C;" v-show="cur_build_row.status == 'UNSTART'">
                                    排队中 <i class="el-icon-time"></i>
                                </div>
                                <div v-show="cur_build_row.status == '-'">
                                    -
                                </div>
                            </el-descriptions-item>
                            <el-descriptions-item label="质量信息">{{ content }}</el-descriptions-item>
                            <el-descriptions-item label="变更人员">{{ last_build_row.createBy }}</el-descriptions-item>
                            <el-descriptions-item label="操作时间">{{ last_build_row.createTime }}</el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                    <RunningPipeLineSteps ref="runningPipeline" @doStepAction="doStepAction"></RunningPipeLineSteps>
                </template>
            </el-tab-pane>
            <el-tab-pane name="histroy" label="集成历史">
                <PipeLineHistory ref="buildHistory" @lookBuildDetail="viewBuildDetail"></PipeLineHistory>
            </el-tab-pane>
        </el-tabs>
        <BuildParamter ref="buildParam" @triggerBuild="start"></BuildParamter>
    </div>
</template>

<script>
import RunningPipeLineSteps from "../component/running-pipeline-steps.vue"
import LogStepDialog from "../component/step-running/log-step-item.vue"
import PersonCheck from "../component/step-running/person-check-item.vue"
import TestReport from "../component/step-running/report-step-item.vue"
import UploadFile from "../component/step-running/upload-step-item.vue"
import PipeLineHistory from "../component/running-pipeline-history.vue"
import ConfigStepLine from '../component/config-step-line.vue';
import BuildParamter from "../component/step-running/build-paramter.vue"
export default {
    name: "QulityPipeLine",
    components: {
        RunningPipeLineSteps,
        LogStepDialog,
        PersonCheck,
        TestReport,
        UploadFile,
        PipeLineHistory,
        ConfigStepLine,
        BuildParamter
    },
    data() {
        return {
            buildResult: {
                pipelineName: "",
                buildImage: "",
                buildNum: "",
            },
            last_build_row: {},
            cur_build_row: {
                buildUUID: undefined,
                pipline_uuid: undefined,
                status: "-",
                activeIndex: 0,
                logs: [],
                steps: [],
                branch: ""
            },
            appId: undefined,
            appCode: undefined,
            groupIdStr: undefined,
            groupIdStrName: undefined,
            showTab: "last",
            content: "",
            pipeLineConfig: {},
            version_timer: null,
            showLastEmpty: false,
        }
    },
    mounted() {
        this.content = this.common.getUrlKey("pipline_name")
        this.groupIdStr = this.common.getUrlKey("groupIdStr")
        this.groupIdStrName = this.common.getUrlKey("groupIdStrName")
        this.appId = this.common.getUrlKey("appId")
        this.appCode = this.common.getUrlKey("appCode")
        this.cur_build_row.pipline_uuid = this.common.getUrlKey("pipline_uuid")
        this.checkShowLast();
        this.loadInitStep();
    },
    watch: {
        "cur_build_row.status": function () {
            if (this.cur_build_row.status === 'BUILDING'
                || this.cur_build_row.status == 'UNSTART') {
                clearInterval(this.version_timer);
                this.version_timer = window.setInterval(this.queryVersionStatus, 10000);
            } else if (this.cur_build_row.status === 'SUCCESS' || this.cur_build_row.status == 'ABORTED'
                || this.cur_build_row.status == 'FAILURE') {
                clearInterval(this.version_timer);
            } else {
                clearInterval(this.version_timer);
            }
        },
    },
    methods: {
        async getLastBuild() {
            var res;
            await this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline_instance/list`,
                method: "post",
                data: {
                    appId: this.appId,
                    pipelineUuid: this.cur_build_row.pipline_uuid,
                    pageSize: 1,
                    pageNum: 1,
                },
            }).then((response) => {
                res = response.data
            }).catch(err => {
                this.$message.error("获取最新构建失败")
                console.log(err)
            })
            return res;
        },
        checkShowLast() {
            this.getLastBuild().then((response) => {
                const {
                    data,
                    code
                } = response
                if (code === 200) {
                    if (data.list != undefined && data.list.length > 0) {
                        this.showLastEmpty = false
                        this.cur_build_row.buildUUID = data.list[0].buildUuid
                        this.last_build_row = data.list[0];
                        this.queryVersionStatus();
                    } else {
                        this.showLastEmpty = true;
                    }
                }
            }).catch(err => {
                this.$message.error("加载构建历史失败")
                console.log(err)
            })
        },
        loadInitStep() {
            var that = this;
            this.axios({
                method: "GET",
                url: this.GLOBAL.baseUrl + "/access_control/pipeline_steps/list/" + this.common.getUrlKey("pipline_uuid")
            })
                .then((response) => {
                    if (response.status == 200) {
                        const { code, data } = response.data
                        if (code == 200) {
                            this.cur_build_row.steps = []
                            console.log(that.$refs.runningPipeline)
                            if (that.$refs.runningPipeline != undefined) {
                                that.$refs.runningPipeline.steps = []
                            }
                            if (data.length > 0) {
                                data.forEach(stepRow => {
                                    var step = {
                                        title: stepRow.name,
                                        name: stepRow.name,
                                        stepKey: stepRow.nameCode,
                                        buildStatus: "UNSTART",
                                        params: stepRow.params,
                                    }
                                    this.cur_build_row.steps.push(step)
                                    if (that.$refs.runningPipeline != undefined) {
                                        that.$refs.runningPipeline.steps.push(step)
                                    }
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log("加载pipline detail失败", error);
                });
        },
        //触发自定义流水线
        async triggerPipeline(param) {
            let result;
            await this.axios({
                url: this.GLOBAL.baseUrl + "/pipeline-build/start",
                method: "POST",
                data: param
            }).then(res => {
                result = res;
                this.openParam = false
            }).catch(err => {
                this.openParam = false
                console.log(err)
            })
            return result;
        },
        startBuild() {
            var buildSteps = this.cur_build_row.steps.filter(u => u.stepKey == "build-app")
            if (buildSteps == undefined || buildSteps.length == 0) {
                this.$message.error("当前流水线未包含构建部分，无法启动流程");
                return;
            }
            this.$refs.buildParam.openParam = true;
            this.$refs.buildParam.stepIndex = 0;

            var step = this.cur_build_row.steps[this.$refs.buildParam.stepIndex]
            this.$refs.buildParam.pipeLineConfig.branch = JSON.parse(step.params).branch
        },
        goBack() {
            this.$router.go(-1)
        },
        dealWithDeploy(info) {
            console.log(info)
            try {
                var env = JSON.parse(info.params).env
                var image = JSON.parse(info.params).buildImage
                var commitId = JSON.parse(info.params).commitId
                var buildSteps = this.$refs.runningPipeline.steps.filter(u => u.stepKey == "build-app")
                if (buildSteps == undefined || buildSteps.length == 0) {
                    this.$message.error("当前流水线未包含构建部分，无法部署");
                    return;
                }
                var deployEnvId = 1;
                if (env == "DEV") {
                    deployEnvId = 1;
                }
                if (env == "FAT") {
                    deployEnvId = 2;
                }
                if (env == "UAT") {
                    deployEnvId = 3;
                }
                if (env == "PROD") {
                    deployEnvId = 4;
                }
                this.$confirm("即将前往" + env + "部署页面,请确认?", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "关闭",
                })
                    .then(() => {
                        this.$router.push({
                            path: "/cicd/app/app-deploy",
                            query: {
                                buildUuid: info.buildUuid,
                                stepId: info.stepId,
                                appId: this.appId,
                                commitId: commitId,
                                appCode: this.appCode,
                                image: image,
                                branch: this.$refs.buildParam.pipeLineConfig.branch,
                                deployEnv: env,
                                deployEnvId: deployEnvId,
                                language: "java",
                            },
                        });
                    })
                    .catch((action) => { });
            } catch (err) {
                console.log(err)
            }
        },

        //重试步骤
        doTry(data) {
            var stepKey = data.info.stepKey;
            var info = data.info
            var index = data.index
            if ("build-app" == stepKey) {
                this.$refs.buildParam.isTryBuild = true
                this.$refs.buildParam.openParam = true;
                this.$refs.buildParam.stepIndex = index;
                var step = this.$refs.runningPipeline.steps[this.$refs.buildParam.stepIndex]
                this.$refs.buildParam.pipeLineConfig.branch = JSON.parse(step.params).branch
            }
            else if ("deploy-app" == stepKey) {
                this.dealWithDeploy(info)
            } else {
                this.$message.warning("暂不支持");
            }
        },
        doStepAction(data) {
            var e = data.e;
            var info = data.info
            var index = data.index
            if ("start-build" == e) {
                this.$refs.buildParam.openParam = true;
                this.$refs.buildParam.stepIndex = index;
                var step = this.$refs.runningPipeline.steps[this.$refs.buildParam.stepIndex]
                this.$refs.buildParam.pipeLineConfig.branch = JSON.parse(step.params).branch
            }
            if ("build-log" == e) {
                console.log(this.cur_build_row.logs)
                this.$refs.log.dialogVisible = true
                if (info.buildStatus != "UNSTART" && info.buildStatus != "WAITING") {
                    this.$refs.log.logContent = this.cur_build_row.logs[index].logTxt
                } else {
                    this.$refs.log.logContent = "暂无内容"
                }
            }
            if ("build-history" == e) {
                var path = `/cicd/app/build-jenkins/?appId=${this.appId}&appCode=${this.appCode}&groupIdStr=${this.groupIdStr}`
                this.$router.push(path);
            }
            if ("report" == e) {
                this.$confirm("即将跳转到质量平台，相关数据由质量平台提供，是否继续?", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "继续",
                    cancelButtonText: "关闭",
                    type: "warning"
                })
                    .then(() => {
                        var result = JSON.parse(info.result)
                        var reportUrl = result.reportURL;
                        window.open(reportUrl, "_blank");
                    })
                    .catch((action) => { });

            }
            if ("upload" == e) {
                this.$refs.upload.show = true
            }
            if ("person-check" == e) {
                this.$refs.check.show = true
                this.$refs.check.mode = 'check';
                data.info.appId=this.appId 
                this.$refs.check.dataInfo = data;
            }
            if ("request-check" === e) {
                this.$refs.check.show = true
                this.$refs.check.mode = 'request';
                data.info.appId=this.appId 
                this.$refs.check.dataInfo = data;
            }
            if ("retry" == e) {
                this.$confirm("确定重试当前步骤?", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "关闭",
                })
                    .then(() => {
                        this.doTry(data);
                    })
                    .catch((action) => { });
            }
            if ("deploy" == e) {

                this.$confirm("确定部署当前?", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "关闭",
                })
                    .then(() => {
                        this.dealWithDeploy(info)
                    })
                    .catch((action) => { });
            }
        },
        //处理构建中的状态
        detailWithBuildDetail(e) {
            const { code, data } = e
            if (code == 200) {
                const { activeIndex, log, detail, history } = data
                this.cur_build_row.logs = log
                this.cur_build_row.status = history.status
                this.cur_build_row.activeIndex = activeIndex
                this.$refs.runningPipeline.steps = []
                detail.forEach(stepRow => {
                    console.log(stepRow)
                    var step = {
                        title: stepRow.stepName,
                        name: stepRow.stepName,
                        stepKey: stepRow.stepKey,
                        buildStatus: stepRow.stepStatus,
                        params: stepRow.stepParamters,
                        stepId: stepRow.id,
                        buildUuid: stepRow.buildUuid
                    }
                    if (stepRow.stepResult != undefined) {
                        step.result = stepRow.stepResult
                    }
                    this.$refs.runningPipeline.steps.push(step)
                })
            } else {
                this.$message.error("加载构建信息失败")
            }
        },
        //获取构建信息
        queryVersionStatus() {
            const requestUrl = this.GLOBAL.baseUrl + "/pipeline-build/getBuildDetail/" + this.cur_build_row.buildUUID
            this.axios({
                url: requestUrl,
                method: "GET"
            }).then(res => {
                this.detailWithBuildDetail(res.data)
            }).catch(err => {
                console.log(err)
            })
        },

        //更新非第一步构建参数
        updateBuildAppStatus() {
            var params = {
                buildUUID: this.cur_build_row.buildUUID,
                image: this.buildResult.image,
                buildNum: this.buildResult.buildNum,
                pipelineName: this.buildResult.pipelineName,
                stepIndex: this.$refs.buildParam.stepIndex,
                isTryBuild: this.$refs.buildParam.isTryBuild
            }
            this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline/update_params`,
                method: "post",
                data: params,
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code === 200) {
                    this.$message({
                        type: 'success',
                        message: '执行成功!'
                    });
                    this.queryVersionStatus()
                    this.$refs.buildParam.new_version_loading = false;
                    this.$refs.buildParam.openParam = false
                    this.$refs.runningPipeline.steps[this.$refs.buildParam.stepIndex].buildStatus = "BUILDING"

                }
            }).catch(err => {
                this.$message.error("执行失败")
                this.$refs.buildParam.new_version_loading = false;
                this.$refs.buildParam.openParam = false
                console.log(err)
            })


        },
        start(e) {
            const { code, data, message } = e.data
            if (code != 200) {
                this.$message.error(message)
                return
            }
            //更新本次出发产生的流水线
            this.buildResult.image = data.image;
            this.buildResult.pipelineName = data.pipelineName
            this.buildResult.buildNum = data.buildNum;
            //组装启动流水线参数
            var param = {
                pipelineUuid: this.cur_build_row.pipline_uuid,
                repositoryUrl: this.$refs.buildParam.app.gitRepoUrl,
                appId: this.appId,
                appCode: this.appCode,
                tenantId: "",
                createBy: "",
                buildImage: data.image,
                buildNum: data.buildNum,
                pipelineName: data.pipelineName,
                branch: this.$refs.buildParam.pipeLineConfig.branch
            }
            //只有点击启动流程才出发流水线
            if (this.$refs.buildParam.stepIndex == 0 && !this.$refs.buildParam.isTryBuild) {
                this.triggerPipeline(param).then(result => {
                    this.cur_build_row.status = 'UNSTART'
                    this.$refs.buildParam.new_version_loading = false;
                    this.$refs.buildParam.openParam = false
                    const { code, message, data } = result.data;
                    if (code == 200) {
                        this.$message.success(message)
                        this.cur_build_row.buildUUID = data
                        this.showLastEmpty = false
                        this.loadInitStep();
                        this.getLastBuild().then(res => {
                            if (res.code == 200) {
                                this.last_build_row = res.data.list[0]
                            }
                        });
                    } else {
                        this.$message.error(message)
                    }
                }).catch(err => {
                    console.log(err)
                    this.$refs.buildParam.new_version_loading = false;
                    this.$refs.buildParam.openParam = false
                })
            } else {
                //跟新后续的构建的状态
                this.updateBuildAppStatus();
            }
        },
        //切换tab
        changTab(e, name) {
            if (this.showTab == "histroy") {
                this.$refs.buildHistory.pipline_uuid = this.cur_build_row.pipline_uuid
                this.$refs.buildHistory.appId = this.appId;
                this.$refs.buildHistory.loadBuildHistory();
            }
        },
        viewBuildDetail(e) {
            this.cur_build_row.buildUUID = e.buildUuid
            this.last_build_row = e;
            this.queryVersionStatus();
            this.showTab = "last";
        }
    }
}
</script>


<style lang="scss" scoped>
.main {
    background-color: #ffffff;
    box-sizing: border-box;
    height: calc(100% - 80px);
    padding: 20px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: auto;
}

.topTab {
    /deep/.el-tabs__nav-scroll {
        width: 350px;
        margin: 0 auto;
    }
}

.right-button {
    position: absolute;
    right: 40px;
    top: 28px;
    font-weight: 600;
    font-size: 14px;
}

.list-card-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.list-card-header-slot {
    height: 14px;
    width: 5px;
    background: #1989fa;
}

.list-card-header-slot-btn {
    margin-left: auto;
    padding: 3px 0;
    height: 20px;
    width: 20px;
    border-radius: 20px;
}
</style>

