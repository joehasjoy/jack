<template>
<div class="deploy-main">
    <el-page-header @back="goBack" :content="content"></el-page-header>

    <el-form ref="form" class="form-box" :model="deploy_paramters" label-width="90px" label-position="left" text-align="center" inline>
        <el-card style="margin-top: 15px; width: 100%">
            <div class="title-box flex flex-align-items-center">
                <div class="bar"></div>
                部署配置
            </div>

            <div style="margin-top: 15px">
                <el-form-item label="服务名:" class="item-label">
                    <el-input v-model="appCode" readonly placeholder="请输入服务名" style="width: 200px; border: none"></el-input>
                </el-form-item>

                <el-form-item label="命名空间:">
                    <el-select :disabled="!isCanEdit" v-model="deploy_paramters.namespace" @change="changeNameSpace" placeholder="请选择">
                        <el-option v-for="item in deploy_namespace" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="实例规格:" class="item-label">
                    <el-select :disabled="!isCanEdit" style="width: 200px; border: none" v-model="deploy_paramters.instance_cores" placeholder="请选择实例规格" @change="
                deploy_paramters.instance_mem_gb =
                  deploy_paramters.instance_cores * 2
              ">
                        <el-option label="1cpu-2G" :value="1"></el-option>
                        <el-option label="2cpu-4G" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="实例数量:" class="item-label">
                    <el-input-number :disabled="!isCanEdit" v-model.number="deploy_paramters.instance_num" placeholder="输入实例数量" style="width: 200px; text-align: center" :max="100" :min="1"></el-input-number>
                </el-form-item>
            </div>
        </el-card>

        <el-card style="margin-top: 15px; width: 100%">
            <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
                <div class="bar"></div>
                服务端口 &nbsp;
                <a href="#" @click="AddPort" style="display:none;">
                    <div class="btn-box flex flex-align-items-center">
                        <i class="el-icon-circle-plus-outline"></i>
                        &nbsp;新增
                    </div>
                </a>
                <a href="#" @click="DeletePort" style="display:none;">
                    <div class="btn-box flex flex-align-items-center" style="color: #ff0000; margin-left: 10px">
                        <i class="el-icon-remove-outline"></i>
                        &nbsp;删除
                    </div>
                </a>
            </div>

            <div class="box-wrap">
                <div v-for="item in deploy_paramters.ports" :key="'key-' + item.key" class="flex">
                    <el-form-item label="容器端口" label-width="70px" class="item-label">
                        <el-input type="number" @input="AddPortChange(item)" v-model.number="item.port"></el-input>
                    </el-form-item>
                    <el-form-item label="服务域名" label-width="80px" style="padding-left: 10px" class="item-label">
                        <el-input v-model="item.ingressDomain" style="width: 500px"></el-input>
                        <el-button type="primary" size="mini" :disabled="!item.ingressDomain" style="margin-left: 20px" plain @click="copyDomain(item.ingressDomain)">复制</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-card>

        <el-card style="margin-top: 15px; width: 100%; display: none">
            <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
                <div class="bar"></div>
                服务标签 &nbsp;
                <a href="#" @click="AddGrid">
                    <div class="btn-box flex flex-align-items-center">
                        <i class="el-icon-circle-plus-outline"></i>
                        &nbsp;新增
                    </div>
                </a>

                <a href="#" @click="RemoveGrid">
                    <div class="btn-box flex flex-align-items-center" style="color: #ff0000; margin-left: 10px">
                        <i class="el-icon-delete"></i>
                        &nbsp;销毁
                    </div>
                </a>
            </div>

            <div class="box-wrap" v-show="
            deploy_paramters.grids != undefined && deploy_paramters.grids.length
          " style="padding-bottom: 20px">
                <el-radio v-for="(item, index) in deploy_paramters.grids" :key="index" @change="selectServiceTag(item)" style="width: 110px" v-model="deploy_paramters.color" :label="item.label" border></el-radio>
            </div>
        </el-card>
    </el-form>

    <el-card style="margin-top: 15px; width: 100%">
        <div class="title-box flex flex-align-items-center">
            <div class="bar"></div>
            <span>部署信息</span>
        </div>
        <el-descriptions style="margin-top: 20px" :column="4" direction="vertical" border text-align="center" :colon="false">
            <el-descriptions-item>
                <template slot="label"> 发布分支</template>
                <el-tag>{{ deploy_data.branch }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label"> 部署环境 </template>
                <el-tag type="warning">{{ deploy_data.deployEnv }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label"> 部署模式 </template>
                <el-tag type="warning">灰度发布</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label"> 部署镜像 </template>
                <el-tag type="danger">{{ deploy_data.image }}</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>

    <el-card style="margin-top: 25px" v-if="canDeploy">
        <div class="title-box flex flex-align-items-center">
            <div class="bar"></div>
            <el-tooltip content="当前支持三个批次的灰度发布，可通过滑动修改批次部署比例。默认比例是:10%,50%,100%" placement="right">
                <span>部署权重<i style="fonr-size: 10px" class="el-icon-info"></i></span>
            </el-tooltip>
        </div>

        <el-form :model="deploy_policy" :inline="true" style="margin-top: 25px" label-position="left">
            <div class="block">
                <el-slider :disabled="cannaryDeplouHistory.status == 'running'" v-model="deploy_policy.steps" range :show-stops="true" :max="100">
                </el-slider>
            </div>
        </el-form>

        <div style="
          height: 25px;
          width: 100%;
          margin-top: 40px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        ">
            <el-button-group>
                <el-button size="medium" :disabled="cannaryDeplouHistory.status == 'running'" type="primary" icon="el-icon-s-promotion" :loading="deployBtnLoading" @click="deployApplication">
                    <span>{{
              deployBtnLoading == false ? "立即部署" : "部署中..."
            }}</span>
                </el-button>
                <el-button size="medium" icon="el-icon-refresh" @click="refresh">服务刷新</el-button>
            </el-button-group>
        </div>
    </el-card>

    <el-card style="margin-top: 15px; padding-bottom: 10px" v-if="canDeploy">
        <div class="title-box flex flex-align-items-center">
            <div class="bar"></div>
            部署流程
        </div>

        <el-steps :active="deployStepData.activeStepIndex" align-center style="margin-top: 20px">
            <el-step :title="deployStepData.step1Data.title" :description="deployStepData.step1Data.description" :status="deployStepData.step1Data.status" :icon="deployStepData.step1Data.icon"></el-step>

            <el-step :title="deployStepData.step2Data.title" :description="deployStepData.step2Data.description" :status="deployStepData.step2Data.status" :icon="deployStepData.step2Data.icon"></el-step>

            <el-step :title="deployStepData.step3Data.title" :status="deployStepData.step3Data.status" :icon="deployStepData.step3Data.icon">
                <template slot="description">
                    <div>
                        {{ deployStepData.step3Data.description }}<br />
                        <el-link :underline="false" v-if="deployStepData.activeStepIndex == 3">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link" style="font-size: 10px">
                                    人工介入<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-s-promotion" style="color: #67c23a" @click.native="continueStep2Deploy()">继续部署</el-dropdown-item>

                                    <el-dropdown-item divided icon="el-icon-error" style="color: red" @click.native="stopDeploy()">终止部署</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-link>
                    </div>
                </template>
            </el-step>

            <el-step :title="deployStepData.step4Data.title" :status="deployStepData.step4Data.status" :icon="deployStepData.step4Data.icon">
                <template slot="description">
                    <div>
                        {{ deployStepData.step4Data.description }}<br />
                        <el-link :underline="false" v-if="deployStepData.activeStepIndex == 4">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link" style="font-size: 10px">
                                    人工介入<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-s-promotion" style="color: #67c23a" @click.native="continueStep3Deploy()">继续部署</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-error" divided style="color: red" @click.native="stopDeploy()">终止部署</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-link>
                    </div>
                </template>
            </el-step>

            <el-step :title="deployStepData.step5Data.title" :description="deployStepData.step5Data.description" :status="deployStepData.step5Data.status"></el-step>
        </el-steps>
    </el-card>

    <el-card style="margin-top: 15px">
        <div class="flex flex-align-items-center justify-content-between">
            <div class="title-box flex flex-align-items-center">
                <div class="bar"></div>
                部署状态
            </div>
            <el-button icon="el-icon-video-play" type="text" @click="refloadApp">服务重启</el-button>
            <el-button icon="el-icon-refresh" type="text" @click="loadDeployResult">刷新状态</el-button>
        </div>
        <el-table :data="deployedPods" style="width: 100%; margin-top: 10px" :row-class-name="tableRowClassName">
            <el-table-column type="expand">
                <template>
                    <el-descriptions direction="horizontal" :column="1" border>>
                        <template slot="title">
                            <!-- <div class="title-box flex flex-align-items-center">
                                <div class="bar" style="background-color: #67c23a; font-weight: normal"></div>
                                环境变量
                            </div> -->
                        </template>

                        <el-descriptions-item :label="item.key" v-for="item in envs" :key="item.key">{{ item.value }}</el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-table-column>
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <el-table-column label="镜像版本" prop="image" min-width="230px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="Pod名称" prop="name" min-width="120px" align="center">
            </el-table-column>
            <el-table-column label="Pod IP" prop="ip" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="运行状态" prop="desc" align="center">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="desc" align="center" width="320">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="showK8sLog(scope.row)" plain>
                        查看日志<i class="el-icon-notebook-2"></i>
                    </el-button>
                    <el-button type="text" size="mini" @click="downloadK8sLog(scope.row)" plain>
                        下载日志<i class="el-icon-download"></i>
                    </el-button>
                    <el-button size="mini" type="text" icon="icon-enn-zhongqi" @click="refloadPod(scope.row)">
                        容器重启
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog title="容器日志" :visible.sync="k8sLog" top="80px" width="65%" :before-close="docerlog">
        <div class="message_plain" id="msg_end" style="margin-top: -20px">
            <pre style="
            white-space: pre-wrap;
            word-wrap: break-word;
            background: #333;
            color: white;
          ">{{ k8sLogContent }}</pre>
        </div>
    </el-dialog>

</div>
</template>

<script>
import {
    copyHandle
} from "@/utils/utils.js";
import {
    getPipeLineType,
    getUseLanguageName,
    getEnvNameIndex,
    getEnvList,
} from "@/utils/pipeline.js";
export default {
    name: "app-git-commits",
    data() {
        return {
            canDeploy: true,
            k8sLog: false,
            k8sLogContent: "",
            currentServiceName: "",
            cannaryDeplouHistory: {
                id: 0,
                tenantId: "",
                appCode: "",
                appId: 0,
                envCode: "",
                status: "",
                activeStep: 0,
                stepStatus1: "wait",
                stepStatus2: "wait",
                stepStatus3: "wait",
                stepStatus4: "wait",
                stepStatus5: "wait",
                operatorName: "",
                operatorId: "",
                operateDate: undefined,
                weightSplits: "",
                image: "",
            },
            isCanEdit: true,
            deployBtnLoading: false,
            content: "",
            deployment_envIndex: 1,
            deployment_env: "DEV",
            deploy_namespace: [],
            devIngress: "",
            fatIngress: "",
            uatIngress: "",
            prodIngress: "",
            ingressIndexStr: "",
            deployedPods: [],
            deploy_namespace: [],
            appCode: "",
            appId: 0,
            gitRepo: "",
            branch: "",
            deploy_data: {
                image: "",
                branch: "",
                deployEnv: "",
            },

            loading: false,
            envs: [],
            deploy_policy: {
                steps: [10, 50],
            },

            deployStepData: {
                activeStepIndex: 0,
                step1Data: {
                    title: "创建部署策略",
                    description: "",
                    icon: "",
                    status: "wait",
                },
                step2Data: {
                    title: "堡垒机部署",
                    description: "",
                    icon: "",
                    status: "wait",
                },
                step3Data: {
                    title: "第二批切换流量",
                    description: "",
                    icon: "",
                    status: "wait",
                },
                step4Data: {
                    title: "第三批切换流量",
                    description: "",
                    icon: "",
                    status: "wait",
                },
                step5Data: {
                    title: "部署完成",
                    description: "",
                    icon: "code_title",
                    status: "wait",
                },
            },
            deploy_paramters: {
                service_name: "",
                namespace: "",
                instance_num: 0,
                instance_cores: "",
                productName: "",
                branch: "",
                merge_branch: "",
                color: "",
                ports: [{
                    port: "",
                    ingressDomain: "",
                    key: Date.now(),
                }, ],
                grids: [], //服务网格
            },
        };
    },

    methods: {
        getIngressSuffix() {
            let url = this.GLOBAL.baseUrl + "/cluster/clusterIngress";
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        this.devIngress = res.data.data.devIngressSuffix;
                        this.fatIngress = res.data.data.fatIngressSuffix;
                        this.uatIngress = res.data.data.uatIngressSuffix;
                        this.prodIngress = res.data.data.prodIngressSuffix;
                    }
                })
                .catch((err) => {});
        },
        DeletePort: function () {
            if (this.deploy_paramters.ports.length == 1) {
                this.$message({
                    message: "至少保留一个端口",
                    type: "warning",
                });
                return;
            }

            if (this.deploy_paramters.ports.length > 0) {
                var index = this.deploy_paramters.ports.length - 1;
                if (index !== -1) {
                    this.deploy_paramters.ports.splice(index, 1);
                }
            }
        },
        AddPort: function () {
            try {
                if (this.deploy_paramters.ports == null) {
                    this.deploy_paramters.ports = [];
                }
                this.deploy_paramters.ports.push({
                    port: 0,
                    ingressDomain: "",
                    key: "-" + Date.now(),
                });
                console.log(this.deploy_paramters.ports);
            } catch (e) {
                console.error(e);
            }
        },
        //增加端口填写事件
        AddPortChange: function (item) {
            if (this.deploy_paramters.ports.length == 1) {
                this.ingressIndexStr = "";
            } else {
                this.ingressIndexStr = "-" + (this.deploy_paramters.ports.length - 1);
            }
            item.ingressDomain = this.appCode + this.ingressIndexStr;
            if ("DEV" == this.deployment_env) {
                if (typeof this.devIngress != "undefined") {
                    item.ingressDomain = item.ingressDomain + "." + this.devIngress;
                }
            }
            if ("FAT" == this.deployment_env) {
                if (typeof this.fatIngress != "undefined") {
                    item.ingressDomain = item.ingressDomain + "." + this.fatIngress;
                }
            }
            if ("UAT" == this.deployment_env) {
                if (typeof this.uatIngress != "undefined") {
                    item.ingressDomain = item.ingressDomain + "." + this.uatIngress;
                }
            }
            if ("PROD" == this.deployment_env) {
                if (typeof this.prodIngress != "undefined") {
                    item.ingressDomain = item.ingressDomain + "." + this.prodIngress;
                }
            }
        },
        /**
         * 销毁服务标签
         */
        RemoveGrid: function () {
            if (this.deploy_paramters.color == "default") {
                this.$message({
                    message: "该服务便签禁止销毁",
                    type: "error",
                });
                return;
            }
            this.$confirm(
                    "此操作将永久删除标签为【" +
                    this.deploy_paramters.color +
                    "】的服务, 是否继续?",
                    "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                .then(() => {
                    this.$message({
                        showClose: true,
                        message: "销毁服务进行中,请稍候...",
                        type: "warning",
                    });

                    var postData = {
                        id: Number(this.appId),
                        chart_name: this.appCode,
                        kube_env: getEnvNameIndex(this.deployment_env),
                        namespace: this.deploy_paramters.namespace,
                        values_replica_count: 0,
                        values_repository: this.deploy_data.image,
                        values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
                        values_resources_limit_mem: this.deploy_paramters.instance_mem_gb * 1024,
                        chart_envs: this.deploy_paramters.envs,
                        productName: this.deploy_paramters.productName,
                        branch: this.deploy_paramters.branch,
                        mergeBranch: this.deploy_paramters.merge_branch,
                        color: this.deploy_paramters.color,
                    };
                    this.axios({
                            url: this.GLOBAL.baseUrl + "/appDeploy/add",
                            method: "post",
                            data: postData,
                        })
                        .then((response) => {
                            this.deployment_loading = false;
                            if (response.status == 200) {
                                if (response.data.code === 200) {
                                    this.deleteServiTag();
                                } else {
                                    this.$message({
                                        message: response.data.message + "服务销毁失败,请稍候再重试",
                                        type: "error",
                                    });
                                }
                            } else {
                                this.$message({
                                    message: response.message,
                                    type: "error",
                                });
                            }
                        })
                        .catch((response) => {
                            console.log("fail to deploy", response);
                            this.$message.error(response.data.message);
                        });
                })
                .catch((e) => {
                    console.log(e);
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        AddGrid: function () {
            var addviseTag = this.randomString(false, 6);
            this.$prompt("系统推荐标签[" + addviseTag + "]", "请填写服务标签", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /^([a-z]|[A-Z]|\d){3,10}$/,
                    inputErrorMessage: "标签格式不正确,标签由3-10个字符组成",
                })
                .then(({
                    value
                }) => {
                    this.deploy_paramters.grids.push({
                        label: value,
                        namespace: this.deploy_paramters.namespace,
                        tag: "create",
                    });

                    console.log(this.deploy_paramters.grids);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入",
                    });
                });
        },
        randomString(randomLen, min, max) {
            var str = "",
                range = min,
                arr = [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                ];
            // 随机产生
            if (randomLen) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (var i = 0; i < range; i++) {
                var pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },

        // 复制服务域名
        copyDomain(name) {
            copyHandle(name, this);
        },
        // 跳转到对应gitlab变更详情
        goToGitlab: function (row) {
            if (this.gitRepo.startsWith("git@")) {
                this.gitRepo = this.gitRepo.replace("git@", "http://");
            }
            let url = this.gitRepo.replace(".git", "") + "/commit/" + row.name;
            window.open(url, "_blank");
        },

        changeNameSpace() {
            this.loadDeployResult();
        },

        // 返回上一页
        goBack: function () {
            window.history.back();
        },
        //加载配置信息
        loadDeployParamInfo() {
            this.axios({
                    url: this.GLOBAL.baseUrl +
                        "/appDeploy/query/" +
                        this.appId +
                        "/" +
                        getEnvNameIndex(this.deployment_env) +
                        "/default",
                    method: "get",
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code === 200) {
                        if (data.appDeployInfo != undefined) {
                            var deploymentInfo = JSON.parse(data.appDeployInfo);
                            console.log(deploymentInfo);
                            this.deploy_paramters = {
                                service_name: deploymentInfo.chart_name,
                                namespace: deploymentInfo.namespace,
                                instance_num: deploymentInfo.values_replica_count,
                                instance_cores: Number(
                                    deploymentInfo.values_resources_limit_cpu / 1000
                                ),
                                instance_mem_gb: Number(deploymentInfo.values_resources_limit_cpu / 1000) * 2,
                                productName: deploymentInfo.productName,
                                branch: deploymentInfo.branch,
                                merge_branch: deploymentInfo.mergeBranch,
                                color: deploymentInfo.color,
                                grids: [],
                                ports: [],
                            };

                            if (deploymentInfo.chart_service != undefined) {
                                var ports = deploymentInfo.chart_service.ingress_ports;

                                this.deploy_paramters.ports = [];
                                for (var i = 0; i < ports.length; i++) {
                                    this.deploy_paramters.ports.push({
                                        port: ports[i].port,
                                        ingressDomain: ports[i].domain,
                                        key: Date.now(),
                                    });
                                }
                            }

                            this.loadDeployResult();
                            this.loadCurrentRunningImages();
                        }
                    }
                    this.loadCurrentAppNamespace();
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //加载当前应用所有的namespace
        loadCurrentAppNamespace() {
            var requestUrl = `/cluster/teamns/${getEnvNameIndex(
        this.deployment_env
      )}/${this.appId}/`;
            this.axios({
                    url: this.GLOBAL.baseUrl + requestUrl,
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code === 200) {
                        this.deploy_namespace = data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //负责服务标签
        selectServiceTag(item) {},

        loadDeplouPermissions: function () {
            var that = this;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/control/checkMultiPermission",
                    method: "GET",
                    params: {
                        appCode: this.appCode,
                        envCode: this.deployment_env,
                        banCode: "DEPLOY",
                    },
                })
                .then((result) => {
                    if (result.data.code == 200) {
                        that.canDeploy = result.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //加载部署状态信息
        loadDeployResult() {
            this.deployedPods = [];
            var requestUrl = `/app-grayscale-deploy/canaryStatus`;
            this.axios({
                    url: this.GLOBAL.baseUrl + requestUrl,
                    params: {
                        appId: this.appCode,
                        namespace: this.deploy_paramters.namespace,
                        env_flag: getEnvNameIndex(this.deploy_data.deployEnv),
                    },
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code === 200) {
                        if (data.code === 2000) {
                            this.envs = [];
                            if (data.data != undefined && data.data != null) {
                                this.deployedPods = data.data.pods;
                                this.envs = data.data.env;
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //加载当前正在运行的镜像信息
        loadCurrentRunningImages() {},
        async load() {
            await this.loadDeployParamInfo();
        },
        //刷新部署数据
        refresh() {
            this.load();
            this.$message({
                message: "已刷新数据",
                type: "success",
            });
        },
        //刷新部署步骤
        reloadSteps() {
            this.deployStepData.activeStepIndex = 0;
            this.deployStepData.step1Data.title = "创建部署策略";
            this.deployStepData.step1Data.description = "";
            this.deployStepData.step1Data.icon = "";
            this.deployStepData.step1Data.status = "wait";

            this.deployStepData.step2Data.title = "堡垒机部署";
            this.deployStepData.step2Data.description = "";
            this.deployStepData.step2Data.icon = "";
            this.deployStepData.step2Data.status = "wait";

            this.deployStepData.step3Data.title = "第二批流量切换";
            this.deployStepData.step3Data.description = "";
            this.deployStepData.step3Data.icon = "";
            this.deployStepData.step3Data.status = "wait";

            this.deployStepData.step4Data.title = "第三批流量切换";
            this.deployStepData.step4Data.description = "";
            this.deployStepData.step4Data.icon = "";
            this.deployStepData.step4Data.status = "wait";

            this.deployStepData.step5Data.title = "部署完成";
            this.deployStepData.step5Data.description = "";
            this.deployStepData.step5Data.icon = "";
            this.deployStepData.step5Data.status = "wait";
        },
        refloadApp() {},

        continueStep2Deploy() {
            var _this = this;
            let ingress_ports = [];
            this.deploy_paramters.ports.forEach((element) => {
                ingress_ports.push({
                    port: element.port,
                    domain: element.ingressDomain,
                });
            });
            let url =
                this.GLOBAL.baseUrl +
                "/app-grayscale-deploy/continueDeploy/" +
                this.appId;

            var postData = {
                chart_name: this.appCode,
                kube_env: getEnvNameIndex(this.deployment_env),
                language: "Java",
                namespace: this.deploy_paramters.namespace,
                values_replica_count: Number(this.deploy_paramters.instance_num),
                values_repository: this.deploy_data.image,
                values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
                values_resources_limit_mem: this.deploy_paramters.instance_mem_gb * 1024,
                chart_envs: [],
                chart_service: {
                    ingress_ports: ingress_ports,
                },
                weight: this.deploy_policy.steps[1],
            };
            this.deployStepData.activeStepIndex = 3;
            this.deployStepData.step3Data.status = "finish";
            this.deployStepData.step3Data.icon = "el-icon-loading";
            this.deployStepData.step3Data.description = "正在部署中...";
            this.axios({
                    url: url,
                    method: "post",
                    data: postData,
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        if (response.data.data.code === 2000) {
                            this.$message({
                                message: "流量切换" + this.deploy_policy.steps[1] + "%" + "成功",
                                type: "success",
                            });
                            this.deployStepData.activeStepIndex = 4;
                            this.deployStepData.step3Data.status = "success";
                            this.deployStepData.step3Data.icon = "";
                            this.deployStepData.step3Data.description =
                                "流量切换" + this.deploy_policy.steps[1] + "%" + "成功";

                            this.deployStepData.step4Data.status = "finish";
                            this.deployStepData.step4Data.icon = "el-icon-video-pause";
                            this.deployStepData.step4Data.description = "第二批版本验证通过";
                            this.loadDeployResult();
                            this.cannaryDeplouHistory.stepStatus3 = "success";
                            this.cannaryDeplouHistory.status = "running";
                            this.cannaryDeplouHistory.activeStep = 4;
                            this.updateCanaryDeploy();
                        } else {
                            this.$message({
                                message: data.message + "，本次部署失败,请检查部署配置后再重试",
                                type: "error",
                            });
                            _this.rollbackCanaryDeploy();
                        }
                    } else {
                        this.$message({
                            message: response.message,
                            type: "error",
                        });
                        _this.rollbackCanaryDeploy();
                    }
                    this.load();
                })
                .catch((response) => {
                    console.log("fail to deploy", response);
                    _this.rollbackCanaryDeploy();
                    this.$message.error(response.data.message);
                });
        },
        continueStep3Deploy() {
            let ingress_ports = [];
            var _this = this;
            this.deploy_paramters.ports.forEach((element) => {
                ingress_ports.push({
                    port: element.port,
                    domain: element.ingressDomain,
                });
            });
            let url =
                this.GLOBAL.baseUrl +
                "/app-grayscale-deploy/continueDeploy/" +
                this.appId;

            var postData = {
                chart_name: this.appCode,
                kube_env: getEnvNameIndex(this.deployment_env),
                language: "Java",
                namespace: this.deploy_paramters.namespace,
                values_replica_count: Number(this.deploy_paramters.instance_num),
                values_repository: this.deploy_data.image,
                values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
                values_resources_limit_mem: this.deploy_paramters.instance_mem_gb * 1024,
                chart_envs: [],
                chart_service: {
                    ingress_ports: ingress_ports,
                },
                weight: 100,
            };
            this.deployStepData.activeStepIndex = 4;
            this.deployStepData.step4Data.status = "finish";
            this.deployStepData.step4Data.icon = "el-icon-loading";
            this.deployStepData.step4Data.description = "正在部署中...";
            this.axios({
                    url: url,
                    method: "post",
                    data: postData,
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        if (response.data.data.code === 2000) {
                            this.$message({
                                message: "流量切换" + 100 + "%" + "成功",
                                type: "success",
                            });
                            this.deployStepData.activeStepIndex = 5;
                            this.deployStepData.step4Data.status = "success";
                            this.deployStepData.step4Data.icon = "";
                            this.deployStepData.step4Data.description =
                                "流量切换" + 100 + "%" + "成功";
                            this.deployStepData.step5Data.status = "success";
                            this.deployStepData.step5Data.icon = "";
                            this.deployStepData.step5Data.description = "灰度发布成功";
                            this.deployBtnLoading = false;
                            this.isCanEdit = true;
                            this.loadDeployResult();
                            this.cannaryDeplouHistory.stepStatus4 = "success";
                            this.cannaryDeplouHistory.stepStatus5 = "success";
                            this.cannaryDeplouHistory.status = "finish";
                            this.updateCanaryDeploy();
                        } else {
                            this.$message({
                                message: data.message + "，本次部署失败,请检查部署配置后再重试",
                                type: "error",
                            });
                            _this.rollbackCanaryDeploy();
                        }
                    } else {
                        this.$message({
                            message: response.message,
                            type: "error",
                        });
                        _this.rollbackCanaryDeploy();
                    }
                    this.load();
                })
                .catch((response) => {
                    console.log("fail to deploy", response);
                    this.$message.error(response.data.message);
                });
        },
        stopDeploy() {
            var _this = this;
            this.$confirm("此操作将执行回滚操作,请确定是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.$message({
                        message: "处理中,请稍候....",
                        type: "success",
                    });
                    _this.rollbackCanaryDeploy();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        tableRowClassName({
            row
        }) {
            if (
                row.name != undefined &&
                row.name != null &&
                row.name.indexOf("-canary-") > -1
            ) {
                return "warning-row";
            }
        },

        //灰度发布回滚
        rollbackCanaryDeploy() {
            let url = this.GLOBAL.baseUrl + "/app-grayscale-deploy/canaryRollBack";
            this.axios({
                    method: "get",
                    url: url,
                    params: {
                        appCode: this.appCode,
                        namespace: this.deploy_paramters.namespace,
                        env_flag: getEnvNameIndex(this.deploy_data.deployEnv),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: "灰度发布失败,执行回滚操作成功",
                            type: "success",
                        });
                        this.reloadSteps();
                        this.isCanEdit = true;
                        this.loadDeployResult();
                        this.deployBtnLoading = false;
                        this.cannaryDeplouHistory.stepStatus1 = "wait";
                        this.cannaryDeplouHistory.stepStatus2 = "wait";
                        this.cannaryDeplouHistory.stepStatus3 = "wait";
                        this.cannaryDeplouHistory.stepStatus4 = "wait";
                        this.cannaryDeplouHistory.stepStatus5 = "wait";
                        this.cannaryDeplouHistory.activeStep = 1;
                        this.cannaryDeplouHistory.status = "";
                        this.updateCanaryDeploy();
                    } else {
                        this.$message.error("操作失败，请重试");
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        },
        //获取灰度发布
        getCanaryDeployHistoy() {
            let _this = this;
            this.cannaryDeplouHistory.appCode = this.appCode;
            this.cannaryDeplouHistory.appId = this.appId;
            this.cannaryDeplouHistory.envCode = this.deployment_env;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app-grayscale-deploy/canaryDeployHistory",
                    params: {
                        appId: this.appId,
                        appCode: this.appCode,
                        envCode: this.deployment_env,
                    },
                    method: "GET",
                })
                .then((response) => {
                    if (response.status == 200) {
                        if (response.data.code == 200) {
                            if (response.data.data != undefined) {
                                var historyData = response.data.data;
                                _this.cannaryDeplouHistory.id = historyData.id;
                                _this.cannaryDeplouHistory.status = historyData.status;
                                _this.cannaryDeplouHistory.activeStep = historyData.activeStep;
                                _this.cannaryDeplouHistory.operatorName =
                                    historyData.operatorName;
                                _this.cannaryDeplouHistory.operateDate =
                                    historyData.operateDate;
                                _this.cannaryDeplouHistory.weightSplits =
                                    historyData.weightSplits;

                                if (historyData.status === "running") {
                                    //灰度的镜像版本不一致
                                    if (historyData.image != _this.deploy_data.image) {
                                        _this.$message.error("当前部署镜像信息和创建部署策略时不一致，请重新选择后再重试");
                                        _this.$router.back(-1);
                                        return;
                                    }
                                    _this.cannaryDeplouHistory.stepStatus1 =
                                        historyData.stepStatus1;
                                    _this.deployStepData.step1Data.status =
                                        historyData.stepStatus1;

                                    _this.cannaryDeplouHistory.stepStatus2 =
                                        historyData.stepStatus2;
                                    _this.deployStepData.step2Data.status =
                                        historyData.stepStatus2;

                                    _this.cannaryDeplouHistory.stepStatus3 =
                                        historyData.stepStatus3;
                                    _this.deployStepData.step3Data.status =
                                        historyData.stepStatus3;

                                    _this.cannaryDeplouHistory.stepStatus4 =
                                        historyData.stepStatus4;
                                    _this.deployStepData.step4Data.status =
                                        historyData.stepStatus4;

                                    _this.cannaryDeplouHistory.stepStatus5 =
                                        historyData.stepStatus5;
                                    _this.deployStepData.step5Data.status =
                                        historyData.stepStatus5;

                                    _this.deployStepData.activeStepIndex = historyData.activeStep;
                                    _this.deploy_policy.steps =
                                        historyData.weightSplits.split(",");
                                    _this.cannaryDeplouHistory.image = historyData.image;
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //更新灰度发布
        updateCanaryDeploy() {
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app-grayscale-deploy/saveCanaryDeployHistory",
                    method: "POST",
                    data: this.cannaryDeplouHistory,
                })
                .then((res) => {
                    if (res.code == 200) {
                        console.log(res.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        
        getK8sLog(data, show_model) {
            if (this.deploy_namespace.length == 0) {
                this.$message({
                    showClose: true,
                    message: "获取集群信息失败,无法查看容器日志",
                    type: "error",
                });
                this.k8sLog = false;
                return;
            }
            var currentAppId = this.currentServiceName
            if (data.name.indexOf('-canary-') > -1) {
                currentAppId = this.currentServiceName + "-canary"
            }
            this.axios({
                    method: "get",
                    url: this.GLOBAL.goClientURL + "/pod/logs",
                    params: {
                        clusterId: this.deploy_namespace[0].clusterId,
                        appId: currentAppId,
                        namespace: this.deploy_paramters.namespace,
                        pod: data.name,
                    },
                })
                .then((response) => {
                    if (response.data.code === 2000) {
                        if (response.data.data != null && response.data.data != "") {
                            if (show_model === "page") {
                                this.k8sLogContent = response.data.data;
                            }
                            if (show_model === "file") {
                                var FileSaver = require("file-saver");
                                var blob = new Blob([response.data.data], {
                                    type: "text/plain;charset=utf-8",
                                });
                                FileSaver.saveAs(blob, data.name + ".txt");
                            }
                        } else {
                            clearInterval(this.k8sLogIntervel);
                            this.$message({
                                showClose: true,
                                message: "日志内容为空",
                                type: "error",
                            });
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: "接口异常,无法查看容器日志",
                            type: "error",
                        });
                        this.k8sLog = false;
                        clearInterval(this.k8sLogIntervel);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    clearInterval(this.k8sLogIntervel);
                    this.$message({
                        showClose: true,
                        message: "接口异常,无法查看容器日志",
                        type: "error",
                    });
                    this.k8sLog = false;
                });
        },
        showK8sLog: function (data) {
            var that = this;
            this.$message("日志信息加载中,请稍候");
            this.k8sLogIntervel = setInterval(function () {
                if (that.k8sLogContent != "") {
                    that.k8sLog = true;
                }
                that.getK8sLog(data, "page");
            }, 1000);
        },
        downloadK8sLog: function (data) {
            this.$message("日志信息下载中,请稍候");
            this.getK8sLog(data, "file");
        },
        docerlog: function () {
            this.k8sLog = false;
            clearInterval(this.k8sLogIntervel);
        },
        refloadPod: function (data) {
            var that = this;
            this.$confirm("此操作将重启容器, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.$message("容器重启中,请稍候...");
                    this.axios({
                            url: this.GLOBAL.baseUrl + "/appDeploy/reload",
                            method: "GET",
                            params: {
                                image: data.image,
                                pod: data.name,
                                appId: that.appId,
                                kube_env: getEnvNameIndex(this.deployment_env),
                                namespace: that.deploy_paramters.namespace,
                            },
                        })
                        .then((res) => {
                            if (res.status == 200) {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "重启成功，操作成功",
                                    });
                                    that.loadCurrentRunningImages();
                                    that.loadDeployResult();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: "操作失败，容器重启失败",
                                    });
                                }
                            }
                        })
                        .catch((er) => {
                            this.$message({
                                type: "error",
                                message: "操作失败",
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "操作失败",
                    });
                });
        },
        refloadApp: function () {
            var that = this;
            this.$confirm("此操作将重启服务, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.$message("服务重启中,请稍候...");
                    this.axios({
                            url: this.GLOBAL.baseUrl + "/app/restart",
                            method: "GET",
                            params: {
                                appId: that.appId,
                                kube_env: getEnvNameIndex(this.deployment_env),
                                namespace: that.deploy_paramters.namespace,
                            },
                        })
                        .then((res) => {
                            if (res.status == 200) {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "重启成功，操作成功",
                                    });
                                    that.loadCurrentRunningImages();
                                    that.loadDeployResult();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: "操作失败，容器重启失败",
                                    });
                                }
                            }
                        })
                        .catch((er) => {
                            this.$message({
                                type: "error",
                                message: "操作失败",
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "操作失败",
                    });
                });
        },

        deployApplication() {
            var _this = this;
            if (!this.canDeploy) {
                this.deployBtnLoading = false;
                this.deployStepData.activeStepIndex = 0;
                this.deployStepData.step1Data.description = "非法部署";
                this.deployStepData.step1Data.status = "error";
                this.$message({
                    message: response.data.message,
                    type: "error",
                });
                _this.rollbackCanaryDeploy();
                return;
            }

            try {
                this.deployBtnLoading = true;
                this.isCanEdit = false;
                this.reloadSteps();
                let ingress_ports = [];
                this.deploy_paramters.ports.forEach((element) => {
                    ingress_ports.push({
                        port: element.port,
                        domain: element.ingressDomain,
                    });
                });
                let url =
                    this.GLOBAL.baseUrl +
                    "/app-grayscale-deploy/createCanary/" +
                    this.appId;
                this.deployStepData.activeStepIndex = 2;
                this.deployStepData.step1Data.status = "process";
                this.deployStepData.step1Data.icon = "el-icon-loading";
                this.deployStepData.step1Data.description = "创建金丝雀部署版中...";
                var postData = {
                    chart_name: this.appCode,
                    kube_env: getEnvNameIndex(this.deployment_env),
                    language: "Java",
                    namespace: this.deploy_paramters.namespace,
                    values_replica_count: Number(this.deploy_paramters.instance_num),
                    values_repository: this.deploy_data.image,
                    values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
                    values_resources_limit_mem: this.deploy_paramters.instance_mem_gb * 1024,
                    chart_envs: [],
                    chart_service: {
                        ingress_ports: ingress_ports,
                    },
                    weight: this.deploy_policy.steps[0],
                };
                this.axios({
                        url: url,
                        method: "post",
                        data: postData,
                    })
                    .then((response) => {
                        if (response.data.code == 200) {
                            if (
                                response.data.data != undefined &&
                                response.data.data != null &&
                                response.data.data.code === 2000
                            ) {
                                this.$message({
                                    message: "金丝雀版本创建成功",
                                    type: "success",
                                });

                                this.deployStepData.activeStepIndex = 3;
                                this.deployStepData.step1Data.status = "success";

                                this.deployStepData.step1Data.icon = "";
                                this.deployStepData.step1Data.description =
                                    "金丝雀部署创建成功";

                                this.deployStepData.step2Data.status = "success";

                                this.deployStepData.step2Data.icon = "";
                                this.deployStepData.step2Data.description = "堡垒机部署成功";

                                this.deployStepData.step3Data.icon = "el-icon-video-pause";
                                this.deployStepData.step3Data.status = "finish";
                                this.deployStepData.step3Data.description =
                                    "金丝雀版本验证通过";
                                this.loadDeployResult();
                                this.cannaryDeplouHistory.image = this.deploy_data.image;
                                this.cannaryDeplouHistory.stepStatus1 = "success";
                                this.cannaryDeplouHistory.stepStatus2 = "success";
                                this.cannaryDeplouHistory.stepStatus3 = "wait";
                                this.cannaryDeplouHistory.activeStep = 3;
                                this.cannaryDeplouHistory.weightSplits =
                                    this.deploy_policy.steps.join(",");
                                this.cannaryDeplouHistory.status = "running";
                                this.updateCanaryDeploy();
                            } else {
                                this.deployBtnLoading = false;
                                this.deployStepData.activeStepIndex = 1;
                                this.deployStepData.step1Data.status = "error";
                                this.deployStepData.step1Data.icon = "";

                                this.deployStepData.step1Data.description =
                                    "金丝雀部署创建失败";
                                this.$message({
                                    message: "部署失败," + response.data.data.message,
                                    type: "error",
                                });
                            }
                        } else {
                            this.deployBtnLoading = false;
                            this.deployStepData.activeStepIndex = 0;
                            this.deployStepData.step1Data.description = "金丝雀部署创建失败";
                            this.deployStepData.step1Data.status = "error";
                            this.$message({
                                message: response.data.message,
                                type: "error",
                            });
                            _this.rollbackCanaryDeploy();
                        }
                        this.load();
                    })
                    .catch((response) => {
                        console.log("fail to deploy", response);
                        this.deployment_loading = false;
                        this.$message.error(response.data.message);
                        _this.rollbackCanaryDeploy();
                    });
            } catch (e) {
                console.log("fail to deploy", e);
                _this.rollbackCanaryDeploy();
            }
        },
    },
    mounted() {
        getEnvList();
        this.getIngressSuffix();
        this.appCode = this.common.getUrlKey("appCode");
        this.appId = this.common.getUrlKey("appId");
        this.deploy_data.image =
            this.common.getUrlKey("image") == "" ||
            this.common.getUrlKey("image") == null ?
            "-" :
            this.common.getUrlKey("image");
        this.deploy_data.branch =
            this.common.getUrlKey("branch") == "" ||
            this.common.getUrlKey("branch") == null ?
            "-" :
            this.common.getUrlKey("branch");
        this.deploy_data.deployEnv = this.common.getUrlKey("deployEnv");
        this.deployment_env = this.common.getUrlKey("deployEnv");
        this.content = `app: ${this.appCode} | 环境:${this.deploy_data.deployEnv}`;
        this.currentServiceName = this.appCode;
        this.getCanaryDeployHistoy();
        this.loadDeplouPermissions();
        this.load();
    },
    components: {},
};
</script>

<style lang="scss">
.deploy-main {
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow-y: auto;
}

.title-box {
    width: 100%;
    color: #343a40;
    font-size: 14px;
}

.title-box .bar {
    width: 4px;
    height: 14px;
    background: $primary;
    margin-right: 8px;
}

.box-wrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    padding-bottom: 0;
}

.item-label .el-form-item__label {
    font-weight: normal;
}

.el-table .warning-row {
    background: #67c23a;
}
</style>
