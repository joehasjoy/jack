<template>
    <div class="build-work-place" style="background-color: #f5f5f5">
        <div class="build-work-place-item" v-for="(step, index) in steps" :key="index"
            :style="index == 0 ? 'margin-left:10px' : ''">
            <div class="build-work-place-header">{{ step.title }}</div>
            <div class="build-work-place-container">
                <div class="build-work-place-content-arrow" style="background-color: white" v-if="index === 0"></div>
                <div class="build-work-place-content-arrow" v-if="index > 0"></div>
                <el-card class="build-work-place-content-right-card" shadow="hover">
                    <div class="card-main">
                        <div class="list-card-header">
                            <i class="el-icon-error status-icon" style=color:red;
                                v-show="step.buildStatus == 'FAILURE'"></i>
                            <i class="el-icon-success status-icon" v-show="step.buildStatus == 'SUCCESS'"></i>
                            <i class="el-icon-loading status-icon" v-show="step.buildStatus == 'BUILDING'"></i>
                            <i class="el-icon-time status-icon" style="color:#E6A23C ;"
                                v-show="step.buildStatus == 'UNSTART'"></i>
                            <i class="el-icon-remove-outline" style="color:red ;"
                                v-show="step.buildStatus == 'ABORTED'"></i>
                            <span class="header-title-name">{{ step.name }}</span>
                        </div>
                        <div class="card-content">
                            <div style="color: red;" v-show="step.buildStatus == 'FAILURE'">
                                <i class="el-icon-error"></i> 运行失败
                            </div>
                            <div style="color:#67C23A" v-show="step.buildStatus == 'SUCCESS'">
                                <i class="el-icon-success"></i>
                                <span v-if="step.stepKey != 'extra-quality'"> 运行成功</span>
                                <span v-else> 质量门禁校验通过</span>
                            </div>
                            <div style="color:#67C23A" v-show="step.buildStatus == 'BUILDING'">
                                <i class="el-icon-loading"></i> 运行中
                            </div>
                            <div style="color: #E6A23C;" v-show="step.buildStatus == 'UNSTART'">
                                <i class="el-icon-time"></i> 排队中
                            </div>
                            <div style="color:red;" v-show="step.buildStatus == 'WAITING'">
                                <i class="el-icon-time"></i> 待人工介入
                            </div>
                            <div style="color: #E6A23C;" v-show="step.buildStatus == 'ABORTED'">
                                <i class="el-icon-remove-outline"></i> 取消
                            </div>
                        </div>
                        <div class="card-footer">
                            <template v-if="step.stepKey == 'build-app'">
                                <el-button type="text" size="mini" @click="doOperator('start-build', step, index)"
                                    v-if="step.buildStatus == 'WAITING'">
                                    <i class="el-icon-caret-right"></i> 触发构建
                                </el-button>
                                <el-button type="text" size="mini" @click="doOperator('build-log', step, index)">
                                    <i class="el-icon-collection"></i> 构建日志
                                </el-button>
                                <el-button type="text" size="mini" @click="doOperator('build-history', step, index)">
                                    <i class="el-icon-s-data"></i> 构建历史
                                </el-button>
                                <el-button type="text" size="mini" @click="doOperator('build-param', step, index)">
                                    <i class="el-icon-info"></i> 构建参数
                                </el-button>
                                <el-button v-if="step.buildStatus != 'BUILDING' && step.buildStatus != 'UNSTART'"
                                    type="text" size="mini" @click="doOperator('retry', step, index)">
                                    <i class="el-icon-refresh-left"></i> 重试
                                </el-button>
                            </template>

                            <template v-if="step.stepKey == 'target-upload'">
                                <el-button type="text" size="mini" @click="doOperator('upload', step, index)">
                                    <i class="el-icon-upload"></i> 上传
                                </el-button>
                                <el-button v-if="step.buildStatus != 'BUILDING' && step.buildStatus != 'UNSTART'"
                                    type="text" size="mini" @click="doOperator('retry', step, index)">
                                    <i class="el-icon-refresh-left"></i> 重试
                                </el-button>
                            </template>

                            <template v-if="step.stepKey == 'deploy-app'">
                                <el-button type="text" size="mini" v-if="step.buildStatus == 'WAITING'"
                                    @click="doOperator('deploy', step, index)">
                                    <i class="el-icon-s-promotion"></i> 立即部署 {{ JSON.parse(step.params).env }}
                                </el-button>
                                <el-button v-if="step.buildStatus != 'BUILDING'
                                && step.buildStatus != 'UNSTART'
                                && JSON.parse(step.params).env != 'PROD'
                                && step.buildStatus != 'WAITING'" type="text" size="mini"
                                    @click="doOperator('retry', step, index)">
                                    <i class="el-icon-refresh-left"></i> 重试
                                </el-button>
                            </template>
                            <template v-if="step.stepKey == 'person-check'">
                                <el-button v-if="step.buildStatus == 'WAITING'" type="text" size="mini" @click="doOperator('request-check', step, index)">
                                    <i class="el-icon-s-custom"></i> 发起审批
                                </el-button>

                                <el-button v-if="step.buildStatus == 'BUILDING'"  type="text" size="mini"  @click="doOperator('person-check', step, index)">
                                    <i class="el-icon-s-check"></i> 查看审批
                                </el-button>
                            </template>

                            <template v-if="step.stepKey == 'extra-quality'">
                                <el-button v-if="step.buildStatus != 'UNSTART' && step.buildStatus != 'BUILDING'"
                                    type="text" size="mini" @click="doOperator('report', step, index)">
                                    <i class="el-icon-document"></i> 报告
                                </el-button>
                            </template>

                        </div>
                    </div>
                </el-card>
                <div class="build-work-place-content-arrow" v-if="(index != steps.length - 1)"></div>
                <div class="build-work-place-content-arrow" style="background-color:white;" v-else></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RunningPipeLineStep",
    data() {
        return {
            steps: []
        }
    },
    methods: {
        doOperator(e, info, index) {
            var data = {
                e: e,
                info: info,
                index: index
            }
            console.log(data)
            this.$emit("doStepAction", data);
        }
    }
}
</script>

<style lang="scss" scoped>
.bottomTab {
    /deep/.el-tabs__nav-scroll {
        width: 100px;
    }

    /deep/.el-tabs__active-bar {
        background-color: transparent !important;
        border: none;
    }
}

.build-work-place {
    line-height: 88rpx;
    font-size: 30rpx;
    display: flex;
    overflow-x: auto;
    width: 100%;
}

.build-work-place-item {
    flex-basis: 172rpx;
    flex-shrink: 0;
    width: 380px;
    white-space: nowrap;
    background-color: #ffffff;
    margin-left: 4px;
    height: 50vh;
    margin-bottom: 10px;
    margin-top: 1vh;
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
    margin-top: 25vh;
}

.build-work-place-last-arrow {
    height: 1px;
    flex: 1;
    width: 40px;
    background-color: #e5e5e5;
    display: inline-block;
    margin-top: 25vh;
}

.build-work-place-content-right-card {
    text-align: center;
    margin-top: 25vh;
    height: 160px;
    width: 320px;
}

.list-card-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: -15px;
}

.header-title-name {
    margin-left: 5px;
    font-weight: bold;
    font-size: 14px;
    margin-left: 5px;
}

.status-icon {
    font-size: 15px;
    color: #15ad31;
}

.list-card-header-slot-btn {
    margin-left: auto;
    height: 10px;
    width: 10px;
}

.card-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.card-footer {
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.card-content {
    height: 105px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}
</style>