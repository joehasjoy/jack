<template>
<div class="main">
    <el-steps :active="activeIndex" align-center style="margin-top: 20px">
        <el-step title="基本信息"></el-step>
        <el-step title="校验SQL" :icon="checkStatusIcon"></el-step>
        <el-step title="发起"></el-step>
    </el-steps>

    <el-form ref="sql_modify" :model="sql_modify" label-position="left" label-width="120px" style="max-width: 700px; margin: 40px auto 0" :rules="rules">
        <el-form-item v-show="activeIndex === 1" label="应用名称:" prop="appId">
            <el-select v-model="sql_modify.appId" placeholder="请选择" style="width: 385px" @change="appIdChange">
                <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="activeIndex === 1" label="所属环境:" prop="envFlag">
            <el-select v-model="sql_modify.envFlag" placeholder="请选择" style="width: 385px" @change="envFlagChange">
                <el-option v-for="item in envFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="activeIndex === 1" label="数据库IP:" prop="host">
            <el-select v-model="sql_modify.host" placeholder="请选择" style="width: 385px" @change="hostChange">
                <el-option v-for="item in hostOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="activeIndex === 1" label="数据库名称:" prop="dbName">
            <el-select v-model="sql_modify.dbName" placeholder="请选择" style="width: 385px" @change="dbNameChange">
                <el-option v-for="item in dbNameOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="activeIndex === 2" prop="sql">
            <template slot="label">
                <span>执行SQL</span>
            </template>

            <el-input type="textarea" rows="10" clearable v-model="sql_modify.sql" placeholder="请输入SQL脚本"></el-input>
            <el-button type="text" icon="el-icon-document-checked" @click="beautySql">美化SQL</el-button>
        </el-form-item>

        <el-alert v-if="checkMsg != '' && activeIndex == 2" :title="checkMsg" type="error">
        </el-alert>

        <el-result v-if="activeIndex == 3" icon="success" title="提交成功" subTitle="SQL审批数据提交成功,请关注后续审批结果">
            <template slot="extra">
                <el-button type="primary" @click="reSqlExecute" size="medium">再来一次</el-button>
                <el-button type="danger" @click="goTaskCenter" size="medium">查看审批</el-button>
            </template>
        </el-result>

        <el-form-item style="margin-top: 30px">
            <el-button v-if="activeIndex == 1" @click="next()">下一步</el-button>
            <el-button v-if="activeIndex == 2" @click="pre()">上一步</el-button>
            <el-button v-if="activeIndex == 2" :loading="checkBtnStatus" type="primary" @click="preCheckSql()">校验SQL</el-button>
            <el-button type="danger" :disabled="!canRequest" v-show="activeIndex == 2" @click="exec()">发起审批</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import sqlFormatter from "sql-formatter";
import {
		getEnvNameIndex,
} from "@/utils/pipeline.js";
export default {
    name: "sqlModify",
    data() {
        return {
            canExecute: false,
            rules: {
                appId: [{
                    required: true,
                    message: "请选择应用",
                    trigger: "change",
                }, ],
                host: [{
                    required: true,
                    message: "请选择host",
                    trigger: "change",
                }, ],
                dbName: [{
                    required: true,
                    message: "请选择应用名称",
                    trigger: "change",
                }, ],
                envFlag: [{
                    required: true,
                    message: "请选择关联环境",
                    trigger: "change",
                }, ],
                sql: [{
                    required: true,
                    message: "请输入需要执行SQL",
                    trigger: "blur",
                }, ],
            },
            checkMsg: "",
            canRequest: false,
            activeIndex: 1,
            checkStatusIcon: "",
            checkBtnStatus: false,
            sql_modify: {
                appId: "",
                envFlag: "",
                dbName: "",
                host: "",
                sql: "",
            },
            last: {
                appId: "",
                envFlag: "",
                dbName: "",
                host: "",
            },
            appIdOptions: [],
            envFlagOptions: [],
            dbNameOptions: [],
            hostOptions: [],
		        deployment_envId: '',
		        isBlocked: false,
        };
    },
    methods: {
		    // 获取该应用是否被限制执行校验
		    queryIsBlocked(){
				    let url = this.GLOBAL.baseUrl + "/access_control/app/is_blocked";
				    this.axios({
						    method: "post",
						    url: url,
						    data:{
								    appId: Number(this.sql_modify.appId),
								    envCode: this.deployment_envId,
								    image : ""
						    }
				    })
					    .then((res) => {
							    if (res.data.code === 200) {
									    this.isBlocked = res.data.data
									    this.canRequest = !res.data.data
							    } else {
									    this.$message({
											    type: 'error',
											    message: res.data.message
									    })
							    }
					    })
		    },
        goTaskCenter() {
            this.$router.push("/taskCenter");
        },
        reSqlExecute() {
            this.activeIndex = 1;
            this.sql_modify.appId = "";
            this.sql_modify.envFlag = "";
            this.sql_modify.dbName = "";
            this.sql_modify.host = "";
            this.sql_modify.sql = "";
        },
        next() {
						if (this.sql_modify.appId && this.sql_modify.envFlag){
								this.queryIsBlocked();
						}
            this.canExecute = false;
            var checkAppNames = this.appIdOptions.filter(u => u.value == this.sql_modify.appId).map(u => u.label)
            if (checkAppNames.length == 0) {
                onerror("应用信息获取数据失败：未知错误");
                return
            }
            var parms = {
                appCode: checkAppNames[0],
                envCode: this.sql_modify.envFlag.toUpperCase(),
                banCode: "DEPLOY",
            }
            var that = this;
            var url = this.GLOBAL.baseUrl + `/control/checkMultiPermission`
            this.axios({
                    url: url,
                    method: "GET",
                    params: parms,
                })
                .then((result) => {
                    var {
                        code,
                        data
                    } = result.data
                    if (code == 200 && data) {
                        that.canExecute = true;
                        that.activeIndex = that.activeIndex + 1;
                    } else {
                        that.$message({
                            type: "error",
                            message: "没有权限发起SQL变更",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    that.$message({
                        type: "error",
                        message: "没有权限发起SQL变更",
                    });
                });

        },
        pre() {
            this.activeIndex = this.activeIndex - 1;
        },
        preCheckSql() {
            this.canRequest = false;
            this.$refs["sql_modify"].validate((valid) => {
                if (valid) {
                    this.checkBtnStatus = true;
                    this.checkStatusIcon = "el-icon-loading";
                    this.axios({
                            method: "post",
                            url: this.GLOBAL.baseUrl + "/dms/check/sql/simple",
                            data: {
                                BIZ_db_name: this.sql_modify.dbName,
                                BIZ_host: this.sql_modify.host,
                                BIZ_sql: this.sql_modify.sql,
                            },
                        })
                        .then((response) => {
                            this.checkBtnStatus = false;
                            this.checkStatusIcon = "";
                            if (response.status != 200) {
                                onerror("校验SQL错误：服务器错误");
                                return;
                            }
                            if (response.data.code != 200) {
                                onerror("校验SQL错误：" + response.data.message);
                                return;
                            }
                            if (
                                response.data.code == 200 &&
                                response.data.data.flag > 0

                            ) {
                                this.$message({
                                    type: "error",
                                    message: "SQL校验失败,请根据错误提示后重试",
                                });
                                this.checkMsg = response.data.data.message.join(',');
                                this.checkMsg = this.checkMsg.replace("inception_magic_commit", "")

                                return;
                            }
                            this.$message({
                                message: "SQL校验成功,请点击发起审批",
                                type: "success",
                            });
                            this.checkMsg = "";
                            this.canRequest = true;
                        })
                        .catch((response) => {
                            onerror("校验SQL错误：未知错误");
                            this.checkBtnStatus = false;
                            this.checkStatusIcon = "";
                        });
                }
            });
        },
        beautySql() {
            if (this.sql_modify.sql != "" && this.sql_modify.sql != undefined) {
                this.sql_modify.sql = sqlFormatter.format(this.sql_modify.sql);
                this.$message({
                    message: "SQL美化成功",
                    type: "success",
                });
            }
        },
        getAppIdList(onerror, ondata) {
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/dms/user/account",
                    data: {},
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("获取数据失败：服务器错误");
                        return;
                    }
                    if (response.data.code != "0") {
                        onerror("获取数据失败：" + response.data.message);
                        return;
                    }
                    if (response.data.data == null) {
                        ondata({});
                        return;
                    }
                    ondata(response.data.data);
                })
                .catch((response) => {
                    onerror("获取数据失败：未知错误");
                });
        },
        getHostList(appId, envFlag, onerror, ondata) {
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/dms/dbschema/ip",
                    data: {
                        BIZ_appId: [appId],
                        BIZ_envFlag: envFlag,
                    },
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("获取数据失败：服务器错误");
                        return;
                    }
                    if (response.data.code != "0") {
                        onerror("获取数据失败：" + response.data.message);
                        return;
                    }
                    if (response.data.data == null) {
                        ondata({});
                        return;
                    }
                    ondata(response.data.data);
                })
                .catch((response) => {
                    onerror("获取数据失败：未知错误");
                });
        },
        getDbNameList(appId, envFlag, onerror, ondata) {
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/dms/dbschema/name",
                    data: {
                        BIZ_appId: [appId],
                        BIZ_envFlag: envFlag,
                    },
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("获取数据失败：服务器错误");
                        return;
                    }
                    if (response.data.code != "0") {
                        onerror("获取数据失败：" + response.data.message);
                        return;
                    }
                    if (response.data.data == null) {
                        ondata({});
                        return;
                    }
                    ondata(response.data.data);
                })
                .catch((response) => {
                    onerror("获取数据失败：未知错误");
                });
        },
        getEnvFlagList(onerror, ondata) {
            this.axios({
                    method: "get",
                    url: this.GLOBAL.baseUrl + "/env/get",
                    data: {},
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("获取数据失败：服务器错误");
                        return;
                    }
                    if (response.data.code != 200) {
                        onerror("获取数据失败：" + response.data.message);
                        return;
                    }
                    if (response.data.data == null) {
                        ondata([]);
                        return;
                    }
                    ondata(response.data.data);
                })
                .catch((response) => {
                    onerror("获取数据失败：未知错误");
                });
        },
        getCheckResult(dbName, host, sql, onerror, onresult) {
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/dms/check/sql/simple",
                    data: {
                        BIZ_db_name: [dbName],
                        BIZ_host: [host],
                        BIZ_sql: sql,
                    },
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("校验SQL错误：服务器错误");
                        return;
                    }
                    if (response.data.code != "0") {
                        onerror("校验SQL错误：" + response.data.message);
                        return;
                    }
                    onresult(response.data.data);
                })
                .catch((response) => {
                    onerror("校验SQL错误：未知错误");
                });
        },
        getExecuteSql(appId, envFlag, dbName, host, sql, onerror, onresult) {
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/dms/approve/execute/sql",
                    data: {
                        appId: appId,
                        envFlag: envFlag,
                        dbName: dbName,
                        host: host,
                        sql: sql,
                        processKey: "sqlConfirmSimple_com",
                        processInstanceName: "SQL修改审批",
                    },
                })
                .then((response) => {
                    if (response.status != 200) {
                        onerror("发起失败：服务器错误");
                        return;
                    }
                    if (response.data.code != 200) {
                        onerror("发起失败：" + response.data.message);
                        return;
                    }
                    onresult(response.data.data);
                })
                .catch((response) => {
                    onerror("发起失败：未知错误");
                });
        },
        exec() {
            if (!this.canExecute) {
                this.$message({
                    type: "error",
                    message: "没有权限发起SQL变更",
                });
                return;
            }
		
		        if (this.isBlocked){
				        this.$message({
						        type: "error",
						        message: "请通过平台门禁执行此操作",
				        });
				       return false;
		        }
						
            this.$refs["sql_modify"].validate((valid) => {
                if (valid) {
                    this.getExecuteSql(
                        this.sql_modify.appId,
                        this.sql_modify.envFlag,
                        this.sql_modify.dbName,
                        this.sql_modify.host,
                        this.sql_modify.sql,
                        (message) => {
                            this.$message({
                                type: "error",
                                message: "发起失败：" + message,
                            });
                        },
                        (result) => {
                            this.activeIndex = 3;
                            this.$message({
                                type: "success",
                                message: "发起成功",
                            });
                        }
                    );
                }
            });
        },
        appIdChange() {
            if (this.sql_modify.appId == this.last.appId) {
                return;
            }
            this.last.appId = this.sql_modify.appId;
            this.updateHost();
            this.updateDbName();
        },
        envFlagChange() {
            if (this.sql_modify.envFlag == this.last.envFlag) {
                return;
            }
            this.last.envFlag = this.sql_modify.envFlag;
            this.updateHost();
            this.updateDbName();
		        this.envFlagOptions.forEach(item => {
				        if (item.value == this.sql_modify.envFlag) {
						        this.deployment_envId = item.envId
				        }
		        })
        },
        hostChange() {
            if (this.sql_modify.host == this.last.host) {
                return;
            }
            this.last.host = this.sql_modify.host;
        },
        dbNameChange() {
            if (this.sql_modify.dbName == this.last.dbName) {
                return;
            }
            this.last.dbName = this.sql_modify.dbName;
        },
        updateEnvFlag() {
            this.sql_modify.envFlag == "";
            this.last.envFlag == "";
            this.getEnvFlagList(
                (message) => {
                    this.$message({
                        type: "error",
                        message: message,
                    });
                },
                (data) => {
                    this.envFlagOptions.splice(0, this.envFlagOptions.length);
                    for (let value in data) {
                        this.envFlagOptions.push({
                            value: data[value].selectValue,
                            label: data[value].selectValue,
		                        envId: data[value].selectKey,
                        });
                    }
                }
            );
        },
        updateAppId() {
            this.last.appId = "";
            this.sql_modify.appId = "";
            this.getAppIdList(
                (message) => {
                    this.$message({
                        type: "error",
                        message: message,
                    });
                },
                (data) => {
                    this.replaceOptions(this.appIdOptions, data);
                }
            );
        },
        updateHost() {
            this.last.host = "";
            this.sql_modify.host = "";
            if (this.sql_modify.appId == "" || this.sql_modify.envFlag == "") {
                return;
            }
            this.getHostList(
                this.sql_modify.appId,
                this.sql_modify.envFlag,
                (message) => {
                    this.$message({
                        type: "error",
                        message: message,
                    });
                },
                (data) => {
                    this.replaceOptions(this.hostOptions, data);
                }
            );
        },
        updateDbName() {
            this.last.dbName = "";
            this.sql_modify.dbName = "";
            if (this.sql_modify.appId == "" || this.sql_modify.envFlag == "") {
                return;
            }
            this.getDbNameList(
                this.sql_modify.appId,
                this.sql_modify.envFlag,
                (message) => {
                    this.$message({
                        type: "error",
                        message: message,
                    });
                },
                (data) => {
                    this.replaceOptions(this.dbNameOptions, data);
                }
            );
        },
        replaceOptions(options, data) {
            options.splice(0, options.length);
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    options.push({
                        value: key,
                        label: data[key],
                    });
                }
            }
        },
    },
    mounted() {
        this.updateAppId();
        this.updateEnvFlag();
    },
};
</script>

<style lang="scss" scoped>
.main {
    background-color: #f4f4f4;
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}
</style>
