<template>
    <el-dialog title="新建版本" :close-on-click-modal="false" :visible.sync="openParam" :lock-scroll="false" width="708px">
        <el-form id="newVesionWindows" label-position="left" label-width="140px" :model="pipeLineConfig"
            style="width: 80%; margin: 0 auto" size="small" ref="pipeLineConfig">
            <el-form-item label="仓库地址" prop="gitlabAddress"
                :rules="[{ required: true, message: '请输入仓库.', trigger: 'blur' }]">
                <el-input v-model="pipeLineConfig.gitlabAddress" type="textarea" readonly></el-input>
            </el-form-item>
            <el-form-item label="构建分支" prop="branch" :rules="[{ required: true, message: '请输入仓库.', trigger: 'blur' }]">
                <el-input v-model="pipeLineConfig.branch" readonly></el-input>
            </el-form-item>

            <el-form-item>
                <div v-if="pipeLineConfig.compileEnv.indexOf('node') > -1">
                    <el-radio v-model="nodeCompileType" label="nodejs-front">node前端</el-radio>
                    <el-radio v-model="nodeCompileType" label="nodejs-service">node后端</el-radio>
                </div>
                <div v-if="pipeLineConfig.compileEnv.indexOf('-java') > -1">
                    <el-radio v-model="javaCompileType" label="jar">jar</el-radio>
                    <el-radio v-model="javaCompileType" label="tomcat-war">tomcat-war</el-radio>
                    <el-radio v-model="javaCompileType" label="resin">resin</el-radio>
                </div>
            </el-form-item>

            <el-form-item label="基础镜像" prop="image" :rules="[
                { required: false, message: '请选择基础镜像.', trigger: 'blur' },
            ]">
                <el-select style="width: 100%" v-model="pipeLineConfig.image" placeholder="请选择" clearable>
                    <el-option v-for="item in imageDatas" v-bind:key="item.image" :label="item.image"
                        :value="item.image"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="代码目录" prop="rootPath">
                <el-input v-model="pipeLineConfig.rootPath"></el-input>
            </el-form-item>

            <el-form-item label="产物路径" prop="compilePackagePath">
                <el-input v-model="pipeLineConfig.compilePackagePath"></el-input>
            </el-form-item>

            <el-form-item label="编译命令" prop="compileCmd">
                <el-input v-model="pipeLineConfig.compileCmd" type="textarea" :rows="4"></el-input>
            </el-form-item>

            <el-form-item label="自动创建Dockerfile" prop="createDockerfile" class="self-label"
                v-show="pipeLineConfig.language != 'java'">
                <el-switch @change="dockerChange" v-model="pipeLineConfig.createDockerfile"></el-switch>
            </el-form-item>


            <el-form-item label="Dockerfile地址" prop="dockerfilePath" class="self-label1"
                v-if="!pipeLineConfig.createDockerfile" v-show="pipeLineConfig.language != 'java'">
                <el-input v-model="pipeLineConfig.dockerfilePath" placeholder="请填写自定义dockerfile地址"></el-input>
            </el-form-item>

            <el-form-item label="Sonar扫描" prop="sonar扫描">
                <el-switch disabled v-model="pipeLineConfig.sonar_scanner"></el-switch>
            </el-form-item>


        </el-form>
        <div class="flex flex-justify-content-center footer">
            <el-button style="margin-right: 16px" type="primary" @click="onStart" :loading="new_version_loading">
                立即创建</el-button>
            <el-button @click="openParam = false">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getUseLanguageName } from "@/utils/pipeline.js";
export default {
    name: "PipeLineLog",
    data() {
        return {
            isTryBuild:false,
            stepIndex: 0,
            app: {},
            groupIdStr: undefined,
            imageDatas: [],
            new_version_loading: false,
            openParam: false,
            nodeCompileType: "nodejs-front",
            javaCompileType: "jar",
            pipeLineConfig: {
                id: 0,
                dockerfilePath: "",
                createDockerfile: true,
                gitlabAddress: "",
                gitType: "",
                commitId: "",
                app_version: "",
                compileEnv: "",
                rootPath: "",
                compilePackagePath: "",
                compileCmd: "",
                sonar_scanner: true,
                sec_scan: true,
                language: "",
                branch: "master",
                image: "",
            },
        };
    },
    mounted() {
        this.groupIdStr = this.common.getUrlKey("groupIdStr")
        this.loadApplicationInfo();
        this.getBuildParam();
        this.getbasicImageList();
    },
    methods: {
        //触发应用构建
        async triggerJenkins() {
            let data;
            var imageBaseURL = "ecr-online.enncloud.cn/devops-jenkins/";
            var buildArgs = {
                PROJECT: "quality",
                ENV: "TEST",
                GIT: this.pipeLineConfig.gitlabAddress,
                BranchName: this.pipeLineConfig.branch,
                PORT: "5000",
                make_args: this.pipeLineConfig.compileCmd,
                ID: parseInt(this.common.getUrlKey("appId")),
                APPID: this.common.getUrlKey("appCode"),
                IMAGE: imageBaseURL +
                    this.groupIdStr +
                    "/" +
                    this.common.getUrlKey("appCode") +
                    ":" +
                    Date.now(),
                TAG: "",
                PACKAGE: this.pipeLineConfig.compilePackagePath,
                base_image: this.pipeLineConfig.image,
                createDockerfile: this.pipeLineConfig.createDockerfile,
                dockerfilePath: this.pipeLineConfig.createDockerfile == true ?
                    "" : this.pipeLineConfig.dockerfilePath,
                compileType: this.pipeLineConfig.language === "java" ?
                    this.javaCompileType : this.pipeLineConfig.language,
                codeRoot: this.pipeLineConfig.rootPath,
                sonar: true
            };
            let url = this.GLOBAL.baseUrl + `/pipeline/startPipeline`
            await this.axios({
                url: url,
                method: "post",
                data: buildArgs,
            })
                .then((res) => {
                    data = res;
                })
                .catch((res) => {
                    console.log(res)
                });
            return data;
        },

        //触发sonar
        triggerSonar(appBuildNum) {
            this.axios({
                url: this.GLOBAL.baseUrl + "/sonar/start-sonar",
                method: "post",
                data: {
                    repoUrl: this.pipeLineConfig.gitlabAddress,
                    branch: this.pipeLineConfig.branch,
                    appCode: this.common.getUrlKey("appCode"),
                    makeArgs: this.pipeLineConfig.compileCmd,
                    pomPath: "./",
                    url: this.pipeLineConfig.gitlabAddress,
                    compileType: "sonar-scanner",
                    appBuildNum: appBuildNum,
                },
            }).then(res => {
                console.log(res)
            })

        },
        onStart() {
            this.new_version_loading = true
            this.triggerJenkins().then(res => {
                this.$emit("triggerBuild", res);
                const { code, data } = res.data
                if (code == 200) {
                    this.triggerSonar(data.buildNum)
                }
            }).catch(err => {
                console.log(err)
                this.new_version_loading = false
                this.openParam = false
            })
        },
        loadApplicationInfo() {
            let AppDataUrl = this.GLOBAL.baseUrl + "/app/detail/" + this.common.getUrlKey("appId");
            this.axios({
                url: AppDataUrl,
                method: "GET",
            }).then((response) => {
                const {
                    code,
                    data
                } = response.data
                if (code == 200) {
                    this.app = data
                    this.pipeLineConfig.language = getUseLanguageName(data.useLanguage)
                    this.pipeLineConfig.gitlabAddress = data.gitRepoUrl
                } else {
                    this.$message.error("应用信息加载失败")
                }
            }).catch(err => {
                this.$message.error("应用信息加载失败")
                console.log(err)
            })
        },
        getBuildParam: function () {
            let url = this.GLOBAL.baseUrl + "/pipeline-conf/conf?appId=" + this.common.getUrlKey("appId");
            this.axios({
                method: "GET",
                url: url
            })
                .then((response) => {
                    if (response.status == 200) {
                        if (response.data.data != null && response.data.data != "") {
                            this.isAlreadyConfig = true;
                            this.pipeLineConfig.id = response.data.data.id;
                            this.pipeLineConfig.gitType = response.data.data.defGitType;
                            this.pipeLineConfig.commitId = "";
                            this.pipeLineConfig.app_version = "";
                            this.pipeLineConfig.compileEnv = response.data.data.compileEnv;
                            this.pipeLineConfig.rootPath = response.data.data.codeRoot;
                            this.pipeLineConfig.compilePackagePath =
                                response.data.data.compilePackagePath;
                            this.pipeLineConfig.compileCmd = response.data.data.compileCmd;

                            if (response.data.data.dockerfilePath == null) {
                                response.data.data.dockerfilePath = "";
                            }
                            this.pipeLineConfig.dockerfilePath =
                                response.data.data.dockerfilePath;
                            if (response.data.data.createDockerfile == 1) {
                                this.pipeLineConfig.createDockerfile = true;
                            } else {
                                this.pipeLineConfig.createDockerfile = false;
                            }
                            this.pipeLineConfig.sec_scan = false;
                            this.pipeLineConfig.image = response.data.data.baseImage;
                        } else {
                            this.isAlreadyConfig = false;
                            if (this.pipeLineConfig.language === "java") {

                                this.pipeLineConfig.compileCmd = `mvn clean package -DskipTests`;
                                this.pipeLineConfig.compilePackagePath = `/target`;
                                this.pipeLineConfig.rootPath = "/";
                                this.pipeLineConfig.compileEnv =
                                    "ecr-online.enncloud.cn/devops/devops-pipeline-executor:mvn3.3.9-java1.8";
                                this.pipeLineConfig.dockerfilePath = "/Dockerfile";
                                this.pipeLineConfig.createDockerfile = true;
                                this.pipeLineConfig.dockerfilePath = "";
                            }
                            if (
                                this.pipeLineConfig.language == "nodeJs" ||
                                this.pipeLineConfig.language.toLowerCase() == "javascript"
                            ) {
                                this.pipeLineConfig.compileCmd =
                                    "npm install --ignore-scripts && npm run build";
                                this.pipeLineConfig.compilePackagePath = `/dist`;
                                this.pipeLineConfig.rootPath = "/";
                                this.pipeLineConfig.compileEnv =
                                    "ecr-online.enncloud.cn/devops/devops-pipeline-executor:node12";
                                this.pipeLineConfig.dockerfilePath = "/Dockerfile";
                                this.pipeLineConfig.createDockerfile = true;
                            }
                        }
                    } else {
                        this.$notify.error("获取默认配置失败");
                    }
                })
                .catch((response) => {
                    console.log(response);
                });
        },
        dockerChange: function () {
            if (this.pipeLineConfig.createDockerfile) {
                this.pipeLineConfig.dockerfilePath = "";
            }
        },
        //获取基础镜像
        getbasicImageList() {
            var _type = 1;
            if (this.pipeLineConfig.language === "java") {
                _type = 1;
            }
            if (this.pipeLineConfig.language === "python") {
                _type = 2;
            }
            if (this.pipeLineConfig.language === "go") {
                _type = 3;
            }
            if (this.pipeLineConfig.language.toLowerCase() === "nodejs") {
                _type = 4;
            }
            if (this.pipeLineConfig.language.toLowerCase() === "javascript") {
                _type = 5;
            }

            let parms = {
                tenantId: localStorage.getItem("originTenantId"),
                type: _type,
            }
            this.axios({
                method: "get",
                url: this.GLOBAL.baseUrl + "/pipeline/base-image/all",
                params: parms,
            })
                .then((response) => {

                    if ((response.data.code == 200)) {
                        if (response.data.data != null) {
                            this.imageDatas = response.data.data;
                        }
                    } else {
                        this.errorMessage = response.data.message
                        this.$message({
                            message: response.data.message,
                            type: 'error'
                        })
                    }
                })
                .catch((response) => {
                    console.log("fail to get account config info", response);
                });
        },

    }
};
</script>

<style lang="scss" scoped>

</style>