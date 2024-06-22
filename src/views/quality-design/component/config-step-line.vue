<template>
    <div>
        <!-- 右边折叠窗 -->
        <!-- 0、 步骤定义-->
        <ConfigStepOption ref="stepOption" @AddNewStepOption="addNewStepOption" class="bottomTab"></ConfigStepOption>

        <!-- 1、构建步骤 -->
        <StepBuildItem ref="buildItem" @RemoveStep="removeStep"></StepBuildItem>

        <!--2、文件上传 -->
        <StepUploadItem ref="uploadItem" @RemoveStep="removeStep"></StepUploadItem>

        <!-- 3、部署 -->
        <StepDeployItem ref="deployItem" @RemoveStep="removeStep" @UpdateStep="updateStep"></StepDeployItem>

        <!--4、人工卡点 -->
        <StepPeronCheckItem ref="personCheckItem" @RemoveStep="removeStep"></StepPeronCheckItem>

        <!-- 5、sonar扫描 -->
        <StepSonarTestItem ref="sonarItem" @RemoveStep="removeStep"></StepSonarTestItem>

        <!-- 6、自动化扫描 -->
        <StepAutoTestItem ref="autoTestItem" @RemoveStep="removeStep"></StepAutoTestItem>

        <!-- 7、覆盖率扫描 -->
        <StepJaccoTestItem ref="jaccoTestItem" @RemoveStep="removeStep"></StepJaccoTestItem>

        <!-- 8、单元测试 -->
        <StepJunitTestItem ref="junitTestItem" @RemoveStep="removeStep"></StepJunitTestItem>

        <!-- 9、安全扫描 -->
        <StepSafeTestItem ref="safeTestItem" @RemoveStep="removeStep"></StepSafeTestItem>

        <!-- 10、质量管控 -->
        <QualityCheckItem ref="qualityCheckItem" @RemoveStep="removeStep" @UpdateStep="updateStep"></QualityCheckItem>

        <!-- 11、钉钉通知 -->
        <StepDingTalkNoticeItem ref="dingtalkItem" @RemoveStep="removeStep"></StepDingTalkNoticeItem>
        <div class="build-work-place" style="background-color: #f5f5f5">
            <div class="build-work-place-item" v-for="(step, index) in steps" :key="index"
                :style="index == 0 ? 'margin-left:10px' : ''">
                <div class="build-work-place-header">{{ step.title }}</div>
                <div class="build-work-place-container">
                    <div class="build-work-place-content-arrow" style="background-color: white" v-if="index === 0">
                    </div>
                    <div class="build-work-place-content-arrow" v-if="index > 0"></div>

                    <el-button class="build-work-place-content-right-btn" round @click="editStep(step, index)">
                        {{ step.name }}</el-button>
                    <div class="build-work-place-content-arrow"></div>
                </div>
            </div>
            <div class="build-work-place-item" style="border-right: 0; margin-left: 10px">
                <div class="build-work-place-header">新阶段</div>
                <div class="build-work-place-container">
                    <div class="build-work-place-last-arrow"></div>
                    <el-button icon="el-icon-circle-plus-outline" @click="crateNewStep"
                        class="build-work-place-content-right-btn" round>新的任务</el-button>
                    <div class="build-work-place-content-arrow" style="background-color: white"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConfigStepOption from '../component/step-config/config-step-option.vue';
import StepBuildItem from "../component/step-config/build-item.vue";
import StepUploadItem from "../component/step-config/upload-file.vue"
import StepDeployItem from "../component/step-config/deploy-item.vue"
import StepPeronCheckItem from "../component/step-config/person-check-item.vue"
import StepSonarTestItem from "../component/step-config/sonar-test-item.vue"
import StepAutoTestItem from "../component/step-config/auto-test-item.vue"
import StepJaccoTestItem from "../component/step-config/jacco-test-item.vue"
import StepJunitTestItem from "../component/step-config/junit-test-item.vue"
import StepSafeTestItem from "../component/step-config/safe-test-item.vue"
import StepDingTalkNoticeItem from "../component/step-config/dingtalk-notice-item.vue"
import QualityCheckItem from "../component/step-config/quality-check-item.vue"
export default {
    name: "PipelineStepLine",
    components: {
        ConfigStepOption,
        StepBuildItem,
        StepUploadItem,
        StepDeployItem,
        StepPeronCheckItem,
        StepSonarTestItem,
        StepAutoTestItem,
        StepJaccoTestItem,
        StepJunitTestItem,
        StepSafeTestItem,
        StepDingTalkNoticeItem,
        QualityCheckItem
    },
    data() {
        return {
            steps: []
        }
    },
    methods: {

        //新增步骤
        addNewStepOption(Info) {
            var step = Info.step
            var title = Info.stepName
            step.title = title
            console.log(step)
            this.$confirm("确定添加流程【" + step.name + "】?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "关闭",
            })
                .then(() => {
                    var newStep = JSON.parse(JSON.stringify(step));
                    this.steps.push(newStep)
                })
                .catch((action) => { });
        },
        crateNewStep() {
            this.$refs.stepOption.show = true
        },
        removeStep(info) {
            var index = info.index;
            var step = info.step
            this.$confirm("确定移除流程【" + step.name + "】?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "关闭",
            })
                .then(() => {
                    this.steps.splice(index, 1)
                })
                .catch((action) => { });
        },
        updateStep(e) {
            var step = e.step
            var index = e.index
            if (step.params.env != undefined) {
                this.steps[index].name = this.steps[index].name + "|" + step.params.env;
            }
        },
        editStep(stepInfo, index) {
            var stepKey = stepInfo.stepKey;
            if (typeof (stepInfo.params) != 'object') {
                stepInfo.params = JSON.parse(stepInfo.params)
            }
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
                this.$refs.personCheckItem.index = index
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
    }
}
</script>

<style lang="scss" scoped>
.build-work-place {
    line-height: 88rpx;
    font-size: 30rpx;
    display: flex;
    overflow-x: auto;
    width: 100%;
    height: 80vh;
}

.build-work-place-item {
    flex-basis: 172rpx;
    flex-shrink: 0;
    width: 300px;
    white-space: nowrap;
    background-color: #ffffff;
    margin-left: 4px;
    height: 78vh;
    margin-bottom: 10px;
    margin-top: 15px;
    border-radius: 4px;
}

.build-work-place-header {
    font-size: 15px;
    margin-left: 12px;
    margin-top: 10px;
    color: #8c8c8c;
    font-weight: bold;
}

.build-card-item {
    width: 180px;
    margin-top: 20px;
    height: 190px;
}

.build-work-place-container {
    display: flex;
    flex-direction: row;
    height: 200px;
    width: 240x;
    justify-content: center;
    align-items: center;
}

.build-work-place-content-arrow {
    flex: 1;
    height: 1px;
    background-color: #e5e5e5;
    display: inline-block;
    margin-top: 40vh;
}

.build-work-place-last-arrow {
    height: 1px;
    flex: 1;
    width: 40px;
    background-color: #e5e5e5;
    display: inline-block;
    margin-top: 40vh;
}

.build-work-place-content-right-btn {
    text-align: center;
    margin-top: 40vh;
}

.bottomTab {
    /deep/.el-tabs__nav-scroll {
        width: 100px !important;
        margin: 0 auto;
    }
}
</style>