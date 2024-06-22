<template>
    <!--创建步骤-->
    <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false">
        <el-row style="margin-top: 15px">
            <el-col :span="12">
                <span style="font-size: 14px; margin-left: 5px; font-weight: 500">选择任务组</span>
            </el-col>
            <div style="float: right; margin-right: 7px">
                <el-link :underline="false" @click="clodeCreatePanel">
                    <i class="el-icon-close"></i>
                </el-link>
            </div>
        </el-row>
        <div style="width: 100%;height: 1px;border-top: 1px dashed #efefef; margin-top: 10px;"></div>
        <el-tabs tab-position="left" style="height: 90vh;">
            <el-tab-pane label="构建打包">
                <el-row :gutter="8" style="margin-right: 10px">
                    <el-col :span="12" v-for="build in buildSteps.optionalSteps" :key="build.key">
                        <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                            <el-link :underline="false" @click="AddStep(build, buildSteps.name)">
                                <div class="step-container">
                                    <div class="select-step-logo-container">
                                        <img style="width: 30px; height: 30px" :src="build.logo" />
                                    </div>

                                    <div class="select-step-container">
                                        <div class="select-step-container-top">
                                            {{ build.name }}
                                        </div>
                                        <div class="select-step-container-bottom">
                                            {{ build.desc }}
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="集成测试">
                <el-row :gutter="8" style="margin-right: 10px">
                    <el-col :span="12" v-for="deploy in extraWork.optionalSteps" :key="deploy.key">
                        <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                            <el-link :underline="false" @click="AddStep(deploy, extraWork.name)">
                                <div class="step-container">
                                    <div class="select-step-logo-container">
                                        <img style="width: 30px; height: 30px" :src="deploy.logo" />
                                    </div>

                                    <div class="select-step-container">
                                        <div class="select-step-container-top">
                                            {{ deploy.name }}
                                        </div>
                                        <div class="select-step-container-bottom">
                                            {{ deploy.desc }}
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="其他工具">
                <el-row :gutter="8" style="margin-right: 10px">
                    <el-col :span="12" v-for="deploy in toolWork.optionalSteps" :key="deploy.key">
                        <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                            <el-link :underline="false" @click="AddStep(deploy, toolWork.name)">
                                <div class="step-container">
                                    <div class="select-step-logo-container">
                                        <img style="width: 30px; height: 30px" :src="deploy.logo" />
                                    </div>

                                    <div class="select-step-container">
                                        <div class="select-step-container-top">
                                            {{ deploy.name }}
                                        </div>
                                        <div class="select-step-container-bottom">
                                            {{ deploy.desc }}
                                        </div>
                                    </div>
                                </div>
                            </el-link>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script>
export default {
    name: "PipelineOption",
    data() {
        return {
            show: false,
            buildSteps: {
                name: "构建部署",
                stepKey: "build",
                optionalSteps: [{
                    name: "应用构建",
                    desc: "应用构建集成打包生成镜像",
                    logo: require("@/assets/design-pipeline/docker.png"),
                    stepKey: "build-app",
                    params: {
                        branch: "",
                        env: "",
                    },
                },
                {
                    name: "部署发布",
                    desc: "应用发布到指定环境",
                    logo: require("@/assets/design-pipeline/deploy.png"),
                    stepKey: "deploy-app",
                    params: {
                        env: ""
                    },
                },

                ],
            },
            toolWork: {
                name: "其他工具",
                stepKey: "toolWork",
                optionalSteps: [{
                    name: "人工卡点",
                    desc: "卡点审批",
                    logo: require("@/assets/design-pipeline/check.png"),
                    stepKey: "person-check",
                    pipline_name: "scan-make-pipeline",
                    params: {},
                },
                {
                    name: "文件上传",
                    desc: "指定上传相关内容文件",
                    logo: require("@/assets/design-pipeline/upload.png"),
                    stepKey: "target-upload",
                    params: {},
                },
                {
                    name: "钉钉通知",
                    desc: "通知相关业务信息",
                    logo: require("@/assets/design-pipeline/dingtalk.png"),
                    stepKey: "dingtalk-notice",
                    pipline_name: "testing",
                    params: {},
                },
                ],
            },
            extraWork: {
                name: "集成测试",
                stepKey: "extra",
                optionalSteps: [{
                    name: "Sonar扫描",
                    desc: "集成代码质量测试",
                    logo: require("@/assets/design-pipeline/icon-a-sonar.png"),
                    stepKey: "extra-sonar",
                    params: {},
                },
                {
                    name: "安全扫描",
                    desc: "集成代码安全管控测试",
                    logo: require("@/assets/design-pipeline/code-scanner.png"),
                    stepKey: "extra-safe",
                    params: {},
                },
                {
                    name: "自动化测试",
                    desc: "集成自动化测试工具平台",
                    logo: require("@/assets/design-pipeline/biz-test-o.png"),
                    stepKey: "extra-testing",
                    params: {},
                },
                {
                    name: "单元测试",
                    desc: "Junit单元测试",
                    logo: require("@/assets/design-pipeline/junit.png"),
                    stepKey: "extra-junit",
                    params: {},
                },
                {
                    name: "测试覆盖率",
                    desc: "JaCOCO测试覆盖率",
                    logo: require("@/assets/design-pipeline/code.png"),
                    stepKey: "extra-jacco",
                    params: {},
                },
                {
                    name: "质量卡控",
                    desc: "全链路一站式质量卡控",
                    logo: require("@/assets/design-pipeline/quality.png"),
                    stepKey: "extra-quality",
                    params: {
                        env: "",
                    },
                },
                ],
            },
        };
    },
    methods: {
        clodeCreatePanel() {
            this.show = false;
        },
        AddStep(step, title) {
            var stepInfo = {
                stepName: title,
                step: step
            }
            this.$emit("AddNewStepOption", stepInfo);
        }
    },
    mounted() { },
};
</script>

<style lang="scss" scoped>
.step-container {
    display: flex;
    flex-direction: row;
    justify-self: center;
    align-items: center;
}

.select-step-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 5px;
    width: 180px;
    height: 40px;
}

.select-step-container-top {
    font-size: 14px;
    color: #262626;
    margin-top: 6px;
}

.select-step-container-bottom {
    margin-top: 3px;
    font-size: 12px;
    color: #8c8c8c;
}

.select-step-logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    padding: 5px;
    margin-left: -10px;
    border: #e5e5e5 1px solid;
    border-radius: 2px;
}
</style>
