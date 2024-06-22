<template>
    <div class="main">
        <el-page-header @back="goBack" content="自定义平台门禁流程">
        </el-page-header>
        <!-- 右边按钮 -->
        <div class="right-button">
            <el-button size="mini" icon="el-icon-upload2" :loading="loading" @click="saveAllStep">保存</el-button>
        </div>

        <el-tabs stretc class="topTab" v-model="showTab">
            <el-tab-pane name="basic" label="基础信息">
                <el-card>
                    <el-tabs tab-position="left" class="bottomTab">
                        <el-tab-pane name="info" label="流水线信息"></el-tab-pane>
                        <el-tab-pane name="vip" label="管控信息"></el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-tab-pane>
            <el-tab-pane name="step" label="步骤流程">
                <ConfigStepLine ref="stepLine" @AddNewStep="addNewStep" @EditStep="editStep" @UpdateStep="updateStep">
                </ConfigStepLine>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ConfigStepLine from '../component/config-step-line.vue';


export default {
    name: "QulityDesign",
    components: {
        ConfigStepLine
    },
    data() {
        return {
            showTab: "step",
            uuid: undefined,
            pipleine_id: undefined,
            loading: false,
            pipelineObj: {}
        };
    },
    created() {
        this.uuid = this.common.getUrlKey("uuid")
        this.pipleine_id = this.common.getUrlKey("id")
        this.loadStepDetail(this.uuid)
        this.loadPipelineDetail();
    },
    methods: {
        loadPipelineDetail() {
            let url = this.GLOBAL.baseUrl + "/access_control/pipeline/" + this.uuid;
            this.axios({
                method: "get",
                url: url
            }).then(res => {
                if (res.data.code == 200) {
                    this.pipelineObj = res.data.data
                } else {
                    this.$message.error("加载失败");
                }
            }).catch(err => {
                console.log(err)
            })
        },
        loadStepDetail(uuid) {
            var that = this;
            this.axios({
                method: "GET",
                url: this.GLOBAL.baseUrl + "/access_control/pipeline_steps/list/" + uuid,
            })
                .then((response) => {
                    if (response.status == 200) {
                        const { code, data } = response.data
                        if (code == 200) {
                            if (data.length > 0) {
                                that.$refs.stepLine.steps = []
                                data.forEach(stepRow => {
                                    var step = {
                                        title: stepRow.name,
                                        name: stepRow.name,
                                        stepKey: stepRow.nameCode,
                                        params: stepRow.params,
                                    }
                                    that.$refs.stepLine.steps.push(step)
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log("加载pipline detail失败", error);
                });
        },
        goBack: function () {
            window.history.back();
        },
        // 点击新的任务按钮
        addNewStep() {
            this.$refs.stepLine.show = true
        },
        updateStep(data) {
            var index = data.index;
            var stepInfo = data.step;
            this.steps[index] = stepInfo
        },
        //点击任务信息按钮
        editStep(stepInfo, index) {
            var stepKey = stepInfo.stepKey;
            if ("build-app" === stepKey) {
                this.$refs.buildItem.show = true;
                this.$refs.buildItem.form = stepInfo;
                this.$refs.buildItem.index = index
            }
            if ("target-upload" === stepKey) {
                this.$refs.uploadItem.index = index
                this.$refs.uploadItem.form = stepInfo
                this.$refs.uploadItem.show = true;
            }
            if ("deploy-app" === stepKey) {

                this.$refs.deployItem.show = true;
                this.$refs.deployItem.form = stepInfo;
                this.$refs.deployItem.index = index
            }
            if ("person-check" === stepKey) {

                this.$refs.personCheckItem.show = true;
                this.$refs.personCheckItem.form = stepInfo;
                this.$refs.personCheckItem.index = index;
                this.$refs.personCheckItem.mode = 'request';

            }
            if ("extra-sonar" === stepKey) {

                this.$refs.sonarItem.show = true;
                this.$refs.sonarItem.form = stepInfo;
                this.$refs.sonarItem.index = index
            }
            if ("extra-testing" === stepKey) {

                this.$refs.autoTestItem.show = true;
                this.$refs.autoTestItem.form = stepInfo;
                this.$refs.autoTestItem.index = index
            }
            if ("extra-jacco" === stepKey) {

                this.$refs.jaccoTestItem.show = true;
                this.$refs.jaccoTestItem.form = stepInfo;
                this.$refs.jaccoTestItem.index = index
            }
            if ("extra-junit" === stepKey) {

                this.$refs.junitTestItem.show = true;
                this.$refs.junitTestItem.form = stepInfo;
                this.$refs.junitTestItem.index = index
            }
            if ("extra-safe" === stepKey) {

                this.$refs.safeTestItem.show = true;
                this.$refs.safeTestItem.form = stepInfo;
                this.$refs.safeTestItem.index = index
            }
            if ("dingtalk-notice" === stepKey) {

                this.$refs.dingtalkItem.show = true;
                this.$refs.dingtalkItem.form = stepInfo;
                this.$refs.dingtalkItem.index = index
            }
            if ("extra-quality" === stepKey) {
                this.$refs.qualityCheckItem.show = true;
                this.$refs.qualityCheckItem.form = stepInfo;
                this.$refs.qualityCheckItem.index = index
            }
        },

        async doSaveProgress(steps, uuid) {
            var newSteps = []
            steps.forEach(u => {
                if (typeof (u.params) == 'object') {
                    u.params = JSON.stringify(u.params)
                }
                newSteps.push(u)
            })
            var result
            await this.axios({
                method: "POST",
                url: this.GLOBAL.baseUrl + "/pipeline-design/savePipelineStep/" + uuid,
                data: newSteps,
            }).then(res => {
                result = res;
            }).catch(err => {
                console.log(err)
            })
            return result;
        },

        async doSynTempalteUpdate() {
            var result
            await this.axios({
                method: "POST",
                url: this.GLOBAL.baseUrl + "/access_control/pipeline/update",
                data: {
                    id: this.pipleine_id,
                    status: 1,
                    allowAll: this.pipelineObj.allowAll,
                    appIds: this.pipelineObj.appIds
                }
            }).then(res => {
                result = res;
            }).catch(err => {
                console.log(err)
            })
            return result;
        },
        saveAllStep() {
            var that = this;
            this.$confirm("确定保存质量步骤编排数据?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "关闭",
            })
                .then(() => {
                    that.loading = true
                    that.doSaveProgress(
                        that.$refs.stepLine.steps,
                        that.uuid).then(res => {
                            that.doSynTempalteUpdate()
                            that.goBack()
                            that.loading = false
                            that.$message({ message: "保存成功", type: "success" });
                        }).catch(err => {
                            console.log(err)
                            that.loading = false
                        })
                })
                .catch((action) => { });
        }
    },
    mounted() {
        console.log(this.$refs.stepLine.steps)
    },
    activated() {

    }
};
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
        width: 250px;
        margin: 0 auto;
    }

    /deep/.el-tabs__active-bar {
        background-color: transparent !important;
        border: none;
    }
}

.bottomTab {
    /deep/.el-tabs__nav-scroll {
        width: 100px;
    }

    /deep/.el-tabs__active-bar {
        background-color: transparent !important;
        border: none;
    }
}

.right-button {
    position: absolute;
    right: 40px;
    top: 28px;
    font-weight: 600;
    font-size: 14px;
}
</style>

