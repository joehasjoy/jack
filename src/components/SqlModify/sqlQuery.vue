<template>
<div class="main">
		<el-row>
				<el-col :span="activeIndex === 2? 18 : 24">
						<el-tabs v-if="activeIndex === 2" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="handleTabClick">
								<el-tab-pane
									v-for="(item, index) in editableTabs"
									:key="item.name"
									:label="item.title+ (index+1)"
									:name="item.name"
								>
								</el-tab-pane>
						</el-tabs>
						
						<el-steps :active="activeIndex" align-center style="margin-top: 20px">
								<el-step title="数据选择"></el-step>
								<el-step title="数据查询" :icon="checkStatusIcon"></el-step>
						</el-steps>
						
						<el-form ref="sql_modify" :model="sql_modify" label-position="left" label-width="120px" style="max-width: 700px; margin: 25px auto 0" :rules="rules">
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
										<el-button type="text" icon="el-icon-document-checked" @click="beautySql">美化SQL</el-button>
										<el-input prop="sql" type="textarea" rows="10" clearable v-model="sql_modify.sql" placeholder="请输入SQL脚本"></el-input>
								</el-form-item>
								
								<el-form-item style="margin-top: 30px">
										<el-button v-if="activeIndex === 1" @click="next()">下一步</el-button>
										<el-button v-if="activeIndex === 2" @click="pre()">上一步</el-button>
										<el-button v-if="activeIndex === 2" :loading="checkBtnStatus" type="primary" icon="el-icon-video-play" @click="querySql()">数据查询</el-button>
										<el-button v-if="activeIndex === 2"  type="primary" icon="el-icon-plus" @click="addTab(editableTabsValue)">新增查询</el-button>
								</el-form-item>
						</el-form>
				</el-col>
				<el-col :span="6"  v-if="activeIndex === 2">
						<el-card class="box-card" shadow="never">
								<div slot="header">
										<span><i class="el-icon-coin" style="color: rgba(77,129,255,0.86)"></i> {{ sql_modify.dbName}}</span>
								</div>
								<div v-for="(item,i) in libraryTables" :key="i">
										<svg t="1651833859364" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1561" width="20" height="18"><path d="M102.4 128v768h819.2V128H102.4z m555.8784 192h204.8v132.9152h-204.8V320zM365.7216 836.9152h-204.8v-135.8592h204.8v135.8592z m0-194.944h-204.8V512h204.8v129.9712z m0-189.056h-204.8V320h204.8v132.9152z m234.0608 384H424.192v-135.8592h175.5648v135.8592z m0-194.944H424.192V512h175.5648v129.9712z m0-189.056H424.192V320h175.5648v132.9152z m263.296 384h-204.8v-135.8592h204.8v135.8592z m0-194.944h-204.8V512h204.8v129.9712z" fill="#5D7092" p-id="1562"></path><path d="M102.4 128v204.8h819.2V128z" fill="#0B69E6" p-id="1563"></path></svg>
										<span>{{item }}</span>
								</div>
						</el-card>
				</el-col>
		</el-row>
		
		<div class="title-box flex flex-align-items-center" v-if="activeIndex === 2">
				<div class="bar" style="font-size: 30px"></div>
				检索结果
		</div>
		<el-table
			:header-cell-style="{background:'#f5f7fa'}"
			v-loading="loading"
			v-if="activeIndex === 2"
			:data="bySqlTables"
			stripe
			border
			max-height="800"
			style="width: 100%">
				<el-table-column v-for="item in bySqlColumn"
				                 :prop="item"
				                 :label="item"
                                 :key="item"
				                 :align="item==='node_ip' ? 'left' : 'center'"
				                 :width="item==='node_ip' ? 500 : 180"
				>
				</el-table-column>
		</el-table>
	
	
  
</div>
</template>

<script>
import sqlFormatter from "sql-formatter";
import { queryLibraryTables, queryDataBySql } from "@/api/SqlModify"
import JSONbig from 'json-bigint'
export default {
    name: "sqlModify",
    data() {
        return {
		        editableTabsValue: '1',
		        editableTabs: [{
				        title: '数据查询',
				        name: '1',
				        sql:''
						      
		        }],
		        tabIndex: 1,
            rules: {
                appId: [{
                    required: true,
                    message: "请选择应用",
                    trigger: "change"
                }],
                host: [{
                    required: true,
                    message: "请选择host",
                    trigger: "change"
                }],
                dbName: [{
                    required: true,
                    message: "请选择应用名称",
                    trigger: "change"
                }, ],
                envFlag: [{
                    required: true,
                    message: "请选择关联环境",
                    trigger: "change"
                }, ],
                sql: [{
                    required: false,
                    message: "请输入需要执行SQL",
                    trigger: "blur"
                }, ],
            },
            searchTable: [],
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
		        libraryTables:[],
		        bySqlColumn:[],
		        bySqlTables:[],
		        loading: false,
        };
    },
    methods: {
		    handleTabClick(tab,index) {
						this.sql_modify.sql = ""
				    this.bySqlTables = []
				    this.bySqlColumn = []
				    if (tab ==='r'){
						    this.sql_modify.sql = this.editableTabs[this.editableTabsValue-1].sql
				    }else{
						    this.sql_modify.sql = this.editableTabs[tab.index].sql
				    }
				    this.querySql()
		    },
		    addTab(targetName) {
				    this.editableTabs.push({
						    title: `数据查询`,
						    sql: ""
					    });
						this.sql_modify.sql = ""
				    this.editableTabs.forEach((item,i)=>{
						    item.name = i+1 +'' // 使用下标作为tab的name
				    })
				    this.editableTabsValue = this.editableTabs[this.editableTabs.length-1].name;
		    },
		    removeTab(targetName) {
						if (this.editableTabs.length === 1){
								this.$message({
										message: '至少保留一条查询',
										type: 'warning'
								});
								return false
						}
				
				    this.editableTabs.splice(targetName-1,1) // 移除数组中的一个
				    this.editableTabs.forEach((item,i)=>{
						    item.name = i+1 +''  // // 重置作为tab的name
				    })
				
				    if (targetName === '1'){
						    this.editableTabsValue = targetName;
				    }else{
						    this.editableTabsValue = targetName - 1 + '';
				    }
				    this.handleTabClick('r',this.editableTabsValue)
				
		    },
	    
        reSqlExecute() {
            this.activeIndex = 1;
            this.sql_modify.appId = "";
            this.sql_modify.envFlag = "";
            this.sql_modify.dbName = "";
            this.sql_modify.host = "";
            this.sql_modify.sql = "";
        },
		    /* 下一步 */
        next() {
		        this.$refs["sql_modify"].validate((valid) => {
				        if (valid) {
						        this.activeIndex = this.activeIndex + 1;
						        // 查询库名
						        queryLibraryTables({
								        "cluster_ip": this.sql_modify.host,
								        "dbname": this.sql_modify.dbName,
								        "appId": this.sql_modify.appId
						        }).then(res => {
								        if (res.success){
										        this.libraryTables = res.data
								        }
						        })
						        this.rules.sql[0].required = true
				        } else {
						        return false;
				        }
		        })
          
        },
		    /* 上一步 */
        pre() {
            this.activeIndex = this.activeIndex - 1;
		        this.rules.sql[0].required = false
        },
		    /* 根据 sql 查询列表数据*/
		    querySql(f){
						// 在这里存储文本sql的值
				    this.editableTabs[this.editableTabsValue-1].sql = this.sql_modify.sql
				
				    this.$refs["sql_modify"].validate((valid) => {
						    if (valid) {
								    this.loading = true
								    this.checkBtnStatus = true;
								    this.checkStatusIcon = "el-icon-loading";
										// 查询列表数据
								    queryDataBySql({
										    "cluster_ip": this.sql_modify.host,
										    "dbname": this.sql_modify.dbName,
										    "appId": this.sql_modify.appId,
										    "sql": this.sql_modify.sql,
										    "env": this.sql_modify.envFlag
								    }).then(res =>{
										    this.checkBtnStatus = false
										    this.loading = false
										    this.bySqlColumn = res.data.column
										    res.data.value.forEach(item =>{
												    for (const key in item) {
														    if (Object.hasOwnProperty.call(item, key)) {
																    item[key] = String(item[key]);
														    }
												    }
										    })
										    console.log(res.data,'----')
										    this.bySqlTables = res.data.value
										    this.checkStatusIcon = "el-icon-success";
								    }).catch(()=>{
										    this.checkStatusIcon = "el-icon-error";
								    })
						    } else {
								    return false;
						    }
				    })
				    
		    },
        querySql_() {
            this.canRequest = false;
            this.checkMsg = "";
            this.searchTable = [];
            this.sql_modify.sql = this.sql_modify.sql.replaceAll('"', "'");
            this.$refs["sql_modify"].validate((valid) => {
                if (valid) {
                    this.checkBtnStatus = true;
                    this.checkStatusIcon = "el-icon-loading";
                    this.axios({
                            method: "get",
                            url: this.GLOBAL.baseUrl +
                                `/middleware/middlewares/dms/${this.sql_modify.host}/${
                this.sql_modify.dbName
              }/${this.sql_modify.sql.replace(/;/g, "")}/${this.sql_modify.appId}`,
                        })
                        .then((response) => {
                            this.checkBtnStatus = false;
                            if (response.data.code === 200) {
                                try {
                                    var table = JSONbig.parse(response.data.data);
                                    if (response.data.data.indexOf("查询") > -1) {
                                        this.checkStatusIcon = "el-icon-error";
                                        this.$message.error("输入不合法");
                                        return;
                                    }

                                    this.searchTable = table;
                                    this.checkStatusIcon = "el-icon-success";
                                } catch (e) {
                                    if (response.data.data.split(",").length >= 2) {
                                        var message = response.data.data
                                            .split(",")[1]
                                            .replace(")", "");
                                        this.checkMsg = message;
                                        this.checkStatusIcon = "el-icon-error";
                                    }
                                }
                            } else {
                                this.checkMsg = response.data.message;
                                this.checkStatusIcon = "el-icon-error";
                            }
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
            if (this.sql_modify.sql !== "" && this.sql_modify.sql !== undefined) {
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
            this.sql_modify.envFlag ="";
            this.last.envFlag = "";
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
            if (this.sql_modify.appId === "" || this.sql_modify.envFlag === "") {
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
            if (this.sql_modify.appId === "" || this.sql_modify.envFlag === "") {
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
/deep/ .el-card__header{
		padding: 6px 20px;
}
/deep/ .el-card{
		font-size: large;
}
/deep/ .el-card__body{
		//max-height: 680px;
		max-height: 446px;
		overflow: auto;
		//overflow-x: hidden;
}
/deep/ .el-form-item__content{
		margin-left: auto !important;
}
.main {
    background-color: #f4f4f4;
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: auto;
}

.bar {
    width: 4px;
    height: 14px;
    background: $primary;
    margin-right: 8px;
}

.table {
    border: 1 solid teal;
    overflow-x: auto;
}
</style>
