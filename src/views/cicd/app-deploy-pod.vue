<template>
<div class="deploy-main">
    <el-page-header @back="goBack" :content="content"></el-page-header>
    <el-form ref="form" class="form-box" :model="deploy_paramters" label-width="90px" label-position="left" text-align="center" inline>
        <el-card style="margin-top: 15px; width: 100%">
            <div class="title-box flex flex-align-items-center">
                <div class="bar"></div>
                <span>部署配置 </span>
            </div>

            <div style="margin-top: 15px">
                <el-form-item label="服务名:" class="item-label">
                    <el-input v-model="appCode" readonly placeholder="请输入服务名" style="width: 200px; border: none"></el-input>
                </el-form-item>

                <el-form-item label="命名空间:">
                    <el-select v-model="deploy_paramters.namespace" @change="changeNameSpace" placeholder="请选择" disabled>
                        <el-option v-for="item in deploy_namespace" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
		            <el-form-item label="实例规格:" class="item-label">
				            <!--
											10-28注：原逻辑 deploy_paramters.instance_cores 绑定是 value
												增加了自定义申请实例规格，不做差异化处理后，将绑定值改为 Object
										-->
				            <el-select value-key="valueKey" style="width: 200px; border: none" disabled v-model="deploy_paramters.instance_cores" placeholder="请选择实例规格">
						            <el-option :key="index" v-for="(cpuOptionin, index) in cpuOptions"
						                       :label="cpuOptionin.label+cpuOptionin.memUnit"
						                       :value="cpuOptionin"
						            >
		                        <span>
				                        {{ cpuOptionin.label}}{{cpuOptionin.memUnit}}
				                        <i style="color:#11e351c9;font-style: normal;" v-if="(language.toLowerCase() == 'java' && cpuOptionin.value==2 && cpuOptionin.memUnit == 'GB') || ((language.toLowerCase() == 'nodejs'||language.toLowerCase() == 'javascript') && cpuOptionin.value==0.3)" >(推荐)</i>
		                        </span>
						            </el-option>
						
						            <!--		                    <el-option :key="cpuOptions.length+i" v-for="(item, i) in applyMemoryTypeData" :label="item.label" :value="item.value">
																								</el-option>-->
						
						            <el-option label="更多配置" value="config" style="color: #40a9ff;cursor: pointer"></el-option>
						            <!-- <el-option label="1cpu-2G" :value="1"></el-option>
							<el-option label="2cpu-4G" :value="2"></el-option> -->
				            </el-select>
		            </el-form-item>

                <el-form-item label="实例数量:" class="item-label">
                    <el-input-number disabled v-model.number="deploy_paramters.instance_num" placeholder="输入实例数量" style="width: 200px; text-align: center" :max="100" :min="0"></el-input-number>
                </el-form-item>
            </div>
        </el-card>

        <el-card style="margin-top: 15px; width: 100%">
            <div v-if="nodePortType">
                <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
                    <div class="bar"></div>
                    NodePort端口 &nbsp;

                </div>
                <div class="box-wrap">
                    <div class="flex" v-for="(item, index) in deploy_paramters.nodeports" :key="'key-' + item.key + '-' + index.toString()">
                        <el-form-item label="容器端口" label-width="80px" class="item-label">
                            <el-input type="number" readonly v-model.number="item.port" style="width: 200px"></el-input>
                        </el-form-item>
                        <el-form-item label="NodePort" label-width="80px" class="item-label">
                            <el-input type="number" readonly v-model.number="item.nodeport" style="width: 200px"></el-input>
                        </el-form-item>
                        <el-form-item label="内网域名" label-width="80px" class="item-label">
                            <el-input type="text" readonly v-model="item.domain" style="min-width: 280px"></el-input>
                        </el-form-item>

                        <el-form-item v-if="item.outDomain!=undefined" label="公网域名" label-width="80px" class="item-label">
                            <el-input type="text" readonly v-model="item.outDomain" style="min-width: 280px"></el-input>
                        </el-form-item>

                    </div>
                </div>
            </div>

            <div v-else>
                <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
                    <div class="bar"></div>
                    服务端口 &nbsp;

                </div>
                <div class="box-wrap">
                    <div v-for="(item, index) in deploy_paramters.ports" :key="'key-' + item.key + '-' + index.toString()" class="flex">
                        <el-form-item label="容器端口" label-width="70px" class="item-label">
                            <el-input type="number" readonly v-model.number="item.port"></el-input>
                        </el-form-item>
                        <el-form-item label="服务域名" label-width="80px" style="padding-left: 10px" class="item-label">
                            <el-input readonly v-model="item.ingressDomain" style="width: 500px"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card style="margin-top: 15px; width: 100%" v-if="deploy_data.deployEnv == 'DEV' && showColorDeploy">
            <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
                <div class="bar"></div>
                服务标签&nbsp;
                <el-tooltip placement="top-start">
                    <div slot="content">
                        适用场景：同一个分布式架构项目下的有多个并行的开发/测试/调优的项目，或者有独立发布/隔离测试需求的项目；普通项目使用默认标签发布即可<br />使用限制：目前只支持基于Dubbo的分布式服务；目前支持的RDFA框架版本为1.7.1-RELEASE及以上版本
                    </div>
                    <i class="el-icon-info"></i>
                </el-tooltip>
                &nbsp;
            </div>

            <div class="box-wrap" v-show="
            deploy_paramters.grids != undefined && deploy_paramters.grids.length
          " style="padding-bottom: 20px">
                <el-radio v-for="(item, index) in deploy_paramters.grids" :key="index" @change="selectServiceTag(item)" style="width: 110px" v-model="deploy_paramters.color" :label="item.label" border></el-radio>
            </div>
        </el-card>
    </el-form>
    <el-card style="margin-top: 15px; width: 100%" v-if="healthCheckConfig.enable">
        <div class="title-box flex flex-align-items-center" style="margin-top: 10px">
            <div class="bar"></div>
            健康检查 &nbsp;
        </div>

        <div class="box-wrap">
            <div>
                <el-form ref="form" class="form-box" :model="deploy_paramters" label-width="90px" label-position="right" text-align="center" inline>
                    <el-form-item label="开启健康检查" prop="check_health" label-width="100px">
                        <el-switch disabled v-model="healthCheckConfig.enable" active-color="#13ce66">
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="开启健康检查需升级rdfa至1.7.1及以上版本且添加rdfa-actuator依赖" class="redItem" label-width="700px" prop="health_port" v-if="!deploy_paramters.check_health"></el-form-item>

                    <el-form-item label="端口:" prop="health_port">
                        <el-input readonly v-model.number="healthCheckConfig.port" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="URL:">
                        <el-input readonly v-model="healthCheckConfig.url"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </el-card>

    <el-card style="margin-top: 15px">
        <div class="flex flex-align-items-center justify-content-between">
            <div class="title-box flex flex-align-items-center">
                <div class="bar"></div>
                部署状态
            </div>
        </div>
        <el-table :data="deployedPods" style="width: 100%; margin-top: 10px">
            <el-table-column type="expand">
                <template>
                    <el-descriptions direction="horizontal" :column="1" border>>
                        <template slot="title">
                            <div class="title-box flex flex-align-items-center">
                                <div class="bar" style="background-color: #67c23a; font-weight: normal"></div>
                                环境变量
                            </div>
                        </template>

                        <el-descriptions-item :label="item.key" v-for="item in envs" :key="item.key">{{ item.value }}</el-descriptions-item>
                    </el-descriptions>
                </template>
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
            <el-table-column label="服务标签" prop="tag" align="center">
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" width="380" />
            <el-table-column label="重启次数" prop="restartCount" align="center" />
            <el-table-column label="操作" prop="desc" align="center" width="280">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="showK8sLog(scope.row)">
                        查看日志<i class="el-icon-notebook-2"></i>
                    </el-button>

                    <el-button size="mini" type="text" @click="downloadK8sLog(scope.row)">
                        下载日志<i class="el-icon-download"></i>
                    </el-button>
                    <el-button type="text" size="mini" @click="showEventLog(scope.row)" plain>
                        查看事件<i class="el-icon-news"></i>
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
    <el-dialog title="事件日志" :visible.sync="showEvent" top="80px" width="45%" style="height:300px;">
        <div class="message_plain" id="msg_end" style="margin-top: -20px;">
            <pre style="
            white-space: pre-wrap;
            word-wrap: break-word;
            padding: 5px;
            overflow: auto;
            background: #333;
            height:140px;
            color: white;
          ">{{ eventLogContent }}</pre>
        </div>
    </el-dialog>
</div>
</template>

<script>
var _showType = "deploy"
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
            eventLogContent: "",
            showEvent: false,
            k8sVisorType: {},
            //是否启用nodeport部署
            nodePortType: false,
            healthCheckConfig: {
                enable: false,
                port: 0,
                url: ""
            },
            showType: _showType,
            showColorDeploy: false,
            currentServiceName: "",
            currentTag: "default",
            language: "",
            cpuOptions: [],
            deployBtnLoading: false,
            k8sLog: false,
            content: "",
            k8sLogContent: "",
            deployment_envIndex: 1,
            deployment_env: "DEV",
            deploy_namespace: [],
            canDeploy: true,
            canIngressUpdate: true,
            deployParamsHistory: [],
            deployedPods: [],
            appCode: "",
            appId: 0,
            gitRepo: "",
            branch: "",
            deploy_data: {
                image: "",
                branch: "",
                deployEnv: "",
		            deployEnvId: "",
            },

            loading: false,
            envs: [],
            deploy_paramters: {
                service_name: "",
                namespace: "",
                instance_num: 0,
                instance_cores: "",
                productName: "",
                branch: "",
                merge_branch: "",
                color: "default",
                ports: [],
                grids: [], //服务网格
                check_health: false, //是否开启健康检查
                health_port: 0, //健康检查端口
                nodeports: [],
            },
            deploy_state: {
                active: 0,
                move_status: "",
                deploy_status: "",
                merge_status: "",
                move_icon: "",
                deploy_icon: "",
                merge_icon: "",
            },
        };
    },
    beforeRouteEnter(to, from, next) {
        var fromPath = from.path;
        if (fromPath == undefined || fromPath == "/cicd/app/build-jenkins/") {
            _showType = "deploy"
        } else {
            _showType = "show"
        }
        next();
    },
    methods: {
        //加载灰度发布部署状态
        LoadCanaryImages() {
            let that = this;
            that
                .axios({
                    url: this.GLOBAL.baseUrl + "/app-grayscale-deploy/canaryDeployHistory",
                    method: "GET",
                    params: {
                        appId: this.appId,
                        appCode: this.appCode,
                        envCode: "PROD",
                    },
                })
                .then((response) => {
                    if (response.status == 200) {
                        if (response.data.code == 200) {
                            if (response.data.data != undefined) {
                                if (response.data.data.status === "running") {
                                    that.$message.error("当前部署存在未完成的灰度发布，请完成灰度发布后再选择常规发布");
                                    that.$router.back(-1);
                                    return;
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        changeCheckHealth() {
            this.deploy_paramters.health_port = "";
        },
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

        //删除服务标签
        deleteServiTag: function () {
            this.axios({
                    url: this.GLOBAL.baseUrl +
                        "/appDeploy/deleteColor/" +
                        this.appId +
                        "/" +
                        this.deploy_paramters.color +
                        "/DEV",
                    method: "post",
                })
                .then((res) => {
                    this.$message({
                        message: "服务销毁成功",
                        type: "success",
                    });
                    this.currentTag = "default";
                    this.deploy_paramters.color = "default";
                    this.load();
                })
                .catch((err) => {
                    console.log(err);
                });
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
            var title = "系统推荐标签[" + addviseTag + "]";
            this.$prompt(title, "请填写服务标签", {
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
                    this.currentTag = value;
                    this.deploy_paramters.color = this.currentTag;
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
                        "/" +
                        this.currentTag,
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
                            this.deploy_paramters = {
                                service_name: deploymentInfo.chart_name,
                                namespace: deploymentInfo.namespace,
                                instance_num: deploymentInfo.values_replica_count,
                                instance_cores: parseFloat(
                                    deploymentInfo.values_resources_limit_cpu / 1000
                                ),
                                instance_mem_gb: Number(deploymentInfo.values_resources_limit_cpu / 1000) * 2,
                                productName: deploymentInfo.productName,
                                branch: deploymentInfo.branch,
                                merge_branch: deploymentInfo.mergeBranch,
                                color: this.currentTag,
                                grids: [],
                                ports: [],
                                nodeports: [],
                                check_health: deploymentInfo.healthCheck == undefined ||
                                    deploymentInfo.healthCheck.enable == undefined ?
                                    false : deploymentInfo.healthCheck.enable,
                                health_port: deploymentInfo.healthCheck == undefined ||
                                    deploymentInfo.healthCheck.port == undefined ?
                                    0 : deploymentInfo.healthCheck.port,
                            };

                            if (this.deploy_paramters.instance_cores.toString() == "NaN") {
                                this.deploy_paramters.instance_cores = 1;
                            }
                            if (deploymentInfo.values_replica_count == undefined) {
                                this.deploy_paramters.instance_num = 1;
                            }
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
                            var ports = deploymentInfo.nodeports;
                            if (ports != undefined) {
                                this.deploy_paramters.nodeports = [];
                                for (var i = 0; i < ports.length; i++) {
                                    this.deploy_paramters.nodeports.push({
                                        port: ports[i].port,
                                        domain: ports[i].domain,
                                        nodeport: ports[i].nodeport,
                                        key: Date.now(),
                                        outDomain: ports[i].outDomain,
                                    });
                                }
                            }
                            this.loadDeployResult();
                            this.loadCurrentRunningImages();
                        }
                    }
                    this.loadCurrentAppNamespace();
                    if (this.deployment_env === "DEV") {
                        this.loadGrids();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //负责服务标签
        selectServiceTag(item) {
            if (item.serviceName != undefined) {
                this.currentServiceName = item.serviceName;
                this.currentTag = item.label;
                //this.loadDeployResult();
                this.load();
            }
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

        //加载部署状态信息
        loadDeployResult() {
            var serviceName = this.currentServiceName;
            var tag = this.currentTag;
            if (serviceName == undefined) {
                serviceName = this.appCode;
            }
            if (tag == undefined || tag == "") {
                tag = "default";
            }
            this.deployedPods = [];
            var requestUrl = `/app/k8s/appdetail/${getEnvNameIndex(
        this.deployment_env
      )}/${this.deploy_paramters.namespace}/${serviceName}`;
            this.axios({
                    url: this.GLOBAL.baseUrl + requestUrl,
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    this.$message({
                        showClose: true,
                        message: "数据加载成功",
                        type: "success",
                    });
                    if (code === 200) {
                        if (data.code === 2000) {
														
                            this.envs = [];
                            if (data.data != undefined && data.data != null) {
		                            if (data.data.pods){
				                            this.deployedPods = data.data.pods;
				                            for (let i = 0; i < this.deployedPods.length; ++i) {
						                            this.deployedPods[i].tag = tag;
				                            }
		                            }
                                this.envs = data.data.env;
                                if (this.deploy_paramters.ports.length == 0) {
                                    if (
                                        data.data.services != undefined &&
                                        data.data.services.ingressServices != null &&
                                        data.data.services.ingressServices != undefined
                                    ) {
                                        this.deploy_paramters.ports =
                                            data.data.services.ingressServices;
                                    }
                                }
                                if (data.data.replicas != undefined) {
                                    this.deploy_paramters.instance_num = data.data.replicas;
                                }
                                if (
                                    data.data.resourcesLimit != undefined &&
                                    data.data.resourcesLimit.cpu != undefined
                                ) {
                                    if (data.data.resourcesLimit.cpu != undefined) {
                                        if (data.data.resourcesLimit.cpu.indexOf("m") > -1) {
                                            this.deploy_paramters.instance_cores =
                                                parseInt(data.data.resourcesLimit.cpu) / 1000;
		
		                                        // 不改变原逻辑 处理为Object，见70注释
		                                        this.deploy_paramters.instance_cores = {
				                                        value: this.deploy_paramters.instance_cores,
		                                        }
		                                        this.deploy_paramters.instance_cores.valueKey = `${this.deploy_paramters.instance_cores.value}cpu-${(data.data.resourcesLimit.mem)}`
		
                                        } else {
                                            this.deploy_paramters.instance_cores = parseFloat(
                                                data.data.resourcesLimit.cpu
                                            );
		
		                                        // 不改变原逻辑 处理为Object，见70注释
		                                        this.deploy_paramters.instance_cores = {
				                                        value: this.deploy_paramters.instance_cores,
		                                        }
		                                        this.deploy_paramters.instance_cores.valueKey = `${parseInt(this.deploy_paramters.instance_cores.value)}cpu-${(data.data.resourcesLimit.mem)}`
		
                                        }
		                                    console.log(this.deploy_paramters.instance_cores,'-------')
                                    }
                                }
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
            if (this.deployment_env === "DEV") {
                this.loadGrids();
            }
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
            this.deploy_state.active = 0;
            this.deploy_state.move_status = "";
            this.deploy_state.deploy_status = "";
            this.deploy_state.merge_status = "";
            this.deploy_state.move_icon = "";
            this.deploy_state.deploy_icon = "";
            this.deploy_state.merge_icon = "";
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

        goDeploy() {
            var that = this;
            if (Number(this.deploy_paramters.instance_num) === 0) {
                this.$confirm("当前的部署数量为0,请确认是否继续部署?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        that.deployApplication();
                    })
                    .catch(() => {});
            } else {
                that.deployApplication();
            }
        },

        deployApplication() {
            try {
                let ingress_ports = [];
                this.deploy_paramters.ports.forEach((element) => {
                    ingress_ports.push({
                        port: element.port,
                        domain: element.ingressDomain,
                    });
                });
                this.deployment_loading = true;
                let url = this.GLOBAL.baseUrl + "/appDeploy/add";
                this.deploy_state.active = 2;
                this.deploy_state.deploy_status = "wait";
                this.deploy_state.deploy_icon = "el-icon-loading";

                if (!this.canDeploy) {
                    this.$message({
                        message: "非法部署，已终止!",
                        type: "error",
                    });
                    this.deploy_state.active = 0;
                    this.deploy_state.deploy_status = "";
                    this.deploy_state.deploy_icon = "";
                    return;
                }
                var postData = {
                    id: Number(this.appId),
                    chart_name: this.appCode,
                    kube_env: getEnvNameIndex(this.deployment_env),
                    namespace: this.deploy_paramters.namespace,
                    values_replica_count: Number(this.deploy_paramters.instance_num),
                    values_repository: this.deploy_data.image,
                    values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
                    values_resources_limit_mem: this.deploy_paramters.instance_mem_gb * 1024,
                    chart_envs: this.deploy_paramters.envs,
                    chart_service: {
                        ingress_ports: ingress_ports,
                    },
                    productName: this.deploy_data.image,
                    branch: this.deploy_paramters.branch,
                    mergeBranch: this.deploy_paramters.merge_branch,
                    color: this.deploy_paramters.color,
                    env: this.deployment_env,
                    healthCheck: {
                        enable: this.deploy_paramters.check_health,
                        port: Number(this.deploy_paramters.health_port),
                    },
                };

                //差异化处理cpu容量小于1的情况
                if (this.deploy_paramters.instance_cores < 1) {
                    if (this.deploy_paramters.instance_cores == 0.1) {
                        postData.values_resources_limit_mem = 50;
                    }
                    if (this.deploy_paramters.instance_cores == 0.2) {
                        postData.values_resources_limit_mem = 100;
                    }
                    if (this.deploy_paramters.instance_cores == 0.3) {
                        postData.values_resources_limit_mem = 150;
                    }
                }

                this.axios({
                        url: url,
                        method: "post",
                        data: postData,
                    })
                    .then((response) => {
                        this.deployment_loading = false;
                        if (response.status == 200) {
                            if (response.data.code === 200) {
                                this.deploy_state.active = 3;
                                this.deploy_state.deploy_icon = "";
                                this.deploy_state.deploy_status = "success";
                                this.$message({
                                    message: "应用部署成功",
                                    type: "success",
                                });
                            } else {
                                this.deploy_state.active = 3;
                                this.deploy_state.merge_status = "error";
                                this.deploy_state.deploy_status = "error";
                                this.deploy_state.deploy_icon = "";
                                this.deploy_state.merge_icon = "";
                                this.$message({
                                    message: response.data.message +
                                        "，本次部署失败,请检查部署配置后再重试",
                                    type: "error",
                                });
                            }
                        } else {
                            this.$message({
                                message: response.message,
                                type: "error",
                            });
                        }
                        this.load();
                    })
                    .catch((response) => {
                        console.log("fail to deploy", response);
                        this.deployment_loading = false;
                        this.$message.error(response.data.message);
                    });
            } catch (e) {
                console.log("fail to deploy", e);
            }
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
            this.axios({
                    method: "get",
                    url: this.GLOBAL.goClientURL + "/pod/logs",
                    params: {
                        clusterId: this.deploy_namespace[0].clusterId,
                        appId: this.currentServiceName,
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
        loadIngressPermission: function () {
            var that = this;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/control/checkMultiPermission",
                    method: "GET",
                    params: {
                        appCode: this.appCode,
                        envCode: this.deployment_env,
                        banCode: "INGRESS",
                    },
                })
                .then((result) => {
                    if (result.data.code == 200) {
                        that.canIngressUpdate = result.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //加载部署流量染色标签权限
        loadColorDeployPermission: function () {
            let allowTenants = ["1385072775085289473", "1371750490517663745", "1369923265280311297"];
            var tenantId = localStorage.getItem("originTenantId");
            if (allowTenants.indexOf(tenantId) > -1) {
                this.showColorDeploy = true;
            }
        },
        //加载服务网格应用
        loadGrids() {
            var requestUrl =
                this.GLOBAL.baseUrl +
                "/appDeploy/servicenames/" +
                getEnvNameIndex(this.deployment_env) +
                "/" +
                this.appId +
                "/";

            this.axios({
                    url: requestUrl,
                    method: "get",
                })
                .then((res) => {
                    if (res.status === 200 && res.data.code == 200) {
                        this.deploy_paramters.grids = [];
                        if (res.data.data != undefined) {
                            res.data.data.forEach((gridItem) => {
                                var color = gridItem.color;
                                if (color == undefined || color == null || color == "") {
                                    color = "default";
                                }
                                var colorObject = {
                                    namespace: gridItem.appDeployK8s.namespace,
                                    label: gridItem.color,
                                    serviceName: gridItem.appDeployK8s.serviceName,
                                };
                                if (
                                    gridItem.color != undefined &&
                                    gridItem.color != null &&
                                    gridItem.color != ""
                                ) {
                                    this.deploy_paramters.grids.push(colorObject);
                                }
                            });
                        }
                        if (this.deploy_paramters.grids.length == 0) {
                            this.deploy_paramters.grids.push({
                                label: "default",
                                namespace: this.deploy_paramters.namespace,
                            });
                        }
                    } else {
                        console.log(err);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        loadHealthyCheckConfig() {
            var that = this;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app/healthy/check/loadHealthy/" + this.appId,
                    method: "GET",
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        var healthCheckConfigs = response.data.data
                        if (healthCheckConfigs != undefined && healthCheckConfigs.length > 0) {
                            that.healthCheckConfig.url = healthCheckConfigs[0].url
                            that.healthCheckConfig.enable = true
                            that.healthCheckConfig.port = Number(healthCheckConfigs[0].port)
                        } else {
                            that.healthCheckConfig.enable = false
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //加载当前的集群的基本情况
        loadClusterDetails() {
            var requestUrl =
                this.GLOBAL.baseUrl +
                "/cluster/envFlag/" +
                getEnvNameIndex(this.deployment_env);
            this.axios({
                    url: requestUrl,
                    method: "GET",
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        this.k8sVisorType = response.data.data;
                        if (this.k8sVisorType != undefined && this.k8sVisorType.type == 2) {
                            this.nodePortType = true;
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        showEventLog(e) {
            this.eventLogContent = "";
            this.getDeployEventLog(e.name)
        },
        getDeployEventLog(podName) {
            var that = this;
            var requestUrl = this.GLOBAL.baseUrl +
                "/appDeploy/getDeployEventLog";
            this.axios({
                url: requestUrl,
                method: "post",
                data: {
                    envFlag: getEnvNameIndex(this.deployment_env),
                    namespace: this.deploy_paramters.namespace,
                    podName: podName,
                }
            }).then(res => {
                const {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    if (data.length == 0) {
                        this.$message({
                            message: "当前pod无事件日志",
                            type: "warning",
                        });
                    } else {
                        that.showEvent = true;
                        data.forEach(s => {
                            that.eventLogContent += s + "\n"
                        })
                    }
                }

            }).catch(err => {
                that.showEvent = false;
                console.log(err)
            })

        },
		    LoadApplyMemoryTypeData(){
				    this.axios({
						    url: `${this.GLOBAL.baseUrl}/appDeploy/list_instance_specs?appCode=${this.appCode}&env=${this.deploy_data.deployEnv}&envId=${this.deploy_data.deployEnvId}` ,
						    method: "get",
				    })
					    .then((response) => {
							    if (response.status == 200) {
									    if (response.data.code == 200) {
											    this.applyMemoryTypeData = response.data.data.map(item =>{
													    return {
															    valueKey:`${item.cpu}cpu-${item.memUnit == 'GB'? item.mem+'Gi' : item.mem+'Mi'}`,
															    label:`${item.cpu}cpu-${item.mem}`,
															    value: item.cpu,
															    id: item.id,
															    cpu: item.cpu,
															    mem: item.mem,
															    memUnit: item.memUnit,
													    }
											    })
											    this.cpuOptions = this.cpuOptions.concat(this.applyMemoryTypeData)
									    }
							    }
					    })
					    .catch((error) => {
							    console.log(error);
					    });
		    },
		
		
		    loadCpuOptions() {
            this.cpuOptions = [{
				            label: "0.1cpu-50",
				            valueKey: "0.1cpu-50Mi",
				            value: 0.1,
				            memUnit: 'MB',
                },
                {
		                label: "0.2cpu-100",
		                valueKey: "0.2cpu-100Mi",
		                value: 0.2,
		                memUnit: 'MB',
                },
                {
		                label: "0.3cpu-150",
		                valueKey: "0.3cpu-150Mi",
		                value: 0.3,
		                memUnit: 'MB',
                },
                {
		                label: "1cpu-2",
		                valueKey: "1cpu-2Gi",
		                value: 1,
		                memUnit: 'GB',
                },
                {
		                label: "1cpu-3",
		                valueKey: "1cpu-3Gi",
		                value: 1.03,
		                memUnit: 'GB',
                },
                {
		                label: "1cpu-4",
		                valueKey: "1cpu-4Gi",
		                value: 1.04,
		                memUnit: 'GB',
                },
                {
		                label: "2cpu-4",
		                valueKey: "2cpu-4Gi",
		                value: 2,
		                memUnit: 'GB',
                },
            ];

        },
    },
    mounted() {
        getEnvList();
        this.getIngressSuffix();
        this.appCode = this.common.getUrlKey("appCode");
        this.appId = this.common.getUrlKey("appId");
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
        this.deploy_data.deployEnvId = this.common.getUrlKey("deployEnvId");
        this.deployment_env = this.common.getUrlKey("deployEnv");
        this.language = this.common.getUrlKey("language");
        this.content = `app: ${this.appCode} | 环境:${this.deploy_data.deployEnv}`;
        this.currentServiceName = this.appCode;
        this.currentTag = "default";
        this.loadClusterDetails();
        this.LoadCanaryImages();
        this.load();
        this.loadCpuOptions();
        this.loadDeplouPermissions();
        this.loadIngressPermission();
        this.loadColorDeployPermission();
        this.loadHealthyCheckConfig()
		    this.LoadApplyMemoryTypeData()
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

.redItem .el-form-item__label {
    color: red;
}
</style>
