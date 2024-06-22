<template>
<div class="main flex-column">
    <div class="panel flex-center-between">
        <el-button style="margin-bottom: 20px" @click="appAddClick" type="primary" id="createProject" icon="el-icon-plus">创建新应用</el-button>
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent label-width="100px">
            <el-form-item label="AppCode">
                <el-input v-model.trim="formSearch.appCode" id="appCode" placeholder="请输入AppCode" @keyup.enter.native="GetTableList" clearable></el-input>
            </el-form-item>

            <el-form-item label="所属业务">
                <el-input v-model.trim="formSearch.groupIdStr" placeholder="请输入所属业务" id="groupIdStr" clearable @keyup.enter.native="GetTableList"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="GetTableList" id="appSearch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table-box">
        <!-- 表格 -->
        <el-table stripe id="out-table" v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column label="APPID" prop="code" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column sortable label="开发语言" prop="" align="" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.language}}</span>
            </template>
          </el-table-column> -->
            <el-table-column sortable label="应用名称" prop="">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column sortable label="所属人" prop="">
                <template slot-scope="scope">
                    <span>{{ scope.row.prodMgrName }}</span>
                </template>
            </el-table-column>
            <el-table-column sortable label="业务域" prop="">
                <template slot-scope="scope">
                    <span>{{ scope.row.groupIdStr }}</span>
                </template>
            </el-table-column>
<!--		        <el-table-column label="来源" prop="">
			        <template slot-scope="scope">
				        <span>{{ scope.row.source == 1 ? 'Devops' : scope.row.source == 2 ? '前端平台' : '-' }}</span>
			        </template>
		        </el-table-column>-->
            <el-table-column sortable label="语言/渠道" :formatter="stateLanguage">
            </el-table-column>
            <el-table-column label="操作" align="center" width="400px" fixed="right">
                <template slot-scope="scope">

                    <el-button type="primary" size="mini" @click="buildClick(scope.row)" icon="el-icon-s-promotion">立即构建</el-button>
                    <el-dropdown split-button type="warning" size="mini">
                        运行实例
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item, index in envOptions" @click.native="goRunningPod(scope.row,item)" :key="index"> <i class="el-icon-zoom-in"></i>{{item}} </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-dropdown trigger="click">
                        <el-button type="danger" @click="checkAppOfflineAlreadyApproved(scope.row)" size="mini">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-setting" @click.native="appDetailClick(scope.row)">应用配置</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-circle-plus" @click.native="buildClick2(scope.row)">环境变量</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-info" @click.native="healthyClickPage(scope.row)">健康检查</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-plus" @click.native="addDepend(scope.row)">添加依赖</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-s-operation" @click.native="apolloClick(scope.row)">配置中心</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-connection" @click.native="addGit(scope.row)">仓库授权</el-dropdown-item>
                            <el-dropdown-item @click.native="codeMerge(scope.row)">
		                            <svg-icon icon-class="git-merge" />
		                            代码合并
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-link" @click.native="goSubCribe(scope.row)">通知订阅</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-document-add" @click.native="goPipeLineConfig(scope.row)">流水线配置</el-dropdown-item>
                            <el-dropdown-item style="color: red;" icon="el-icon-remove" v-if="appOfflineAlreadyApproved == true" @click.native="offlineApp(scope.row)" id="appOffline">应用下线</el-dropdown-item>
                            <el-dropdown-item style="color: red;" icon="el-icon-remove" v-else @click.native="offlineAppApproved(scope.row)" id="appOfflineApproved">应用下线</el-dropdown-item>

                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog title="应用下线申请" :visible.sync="AppOfflineDialogVisible" width="708px" id="appoff">
        <iframe :src="appOfflineURL" frameborder="0" width="100%" height="470px"></iframe>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeAppOffline" type="primary">关 闭</el-button>
        </div>
    </el-dialog>

    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetTableList"></pagination>

    <!-- 新建Row -->
    <el-dialog :title="newTitle" :visible.sync="dialognewRowForm" :close-on-click-modal="false">
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" plain="plain" @click="AddNewRow" v-if="!newRow.id">确 定</el-button>
            <el-button type="warning" plain="plain" @click="editRow" v-if="newRow.id">更 新</el-button>
            <el-button @click="dialognewRowForm = false">取 消</el-button>
        </div>
    </el-dialog>

    <el-dialog title="应用创建申请" :visible.sync="AppCreatedPermissiondialogVisible" width="708px" id="appapply">
        <iframe :src="checkPermissionURL" frameborder="0" width="100%" height="770px"></iframe>
        <div slot="footer" class="dialog-footer">
            <el-button id="closeProjectCreate" @click="AppCreatedPermissiondialogVisible = false" type="primary">关 闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import appEnvVariables from "@/views/cicd/app-env";
import {
    GoToPipeline,
    getUseLanguageName
} from "@/utils/pipeline.js";
import app from "@/guide/app.js";
import {
    showGuideInfo
} from "@/utils/guide.js";
import getters from "../../store/getters";
import common from "../../utils/common";
export default {
    name: "app",
    props: {},

    data() {
        return {
            envOptions: [],
            envs: [],
            appOfflineURL: "",
            appOfflineAlreadyApproved: false,
            AppOfflineDialogVisible: false,
            AppCreatedPermissiondialogVisible: false,
            checkPermissionURL: "",
            languages: [],
            users: [],
            formSearch: {
                appCode: ""
            },
            condition: [],
            newRules: {
                // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
            },
            newRow: {
                name: "",
                is_enable: true,
                description: ""
            },
            global_dict: {
                mudule_list: []
            },
            dialognewRowForm: false,
            newTitle: "新增应用",
            options: {
                stripe: true, // 是否为斑马纹 table
                loading: false, // 是否添加表格loading加载动画
                highlightCurrentRow: true, // 是否支持当前行高亮显示
                mutiSelect: true, // 是否支持列表项选中功能
            }, // table 的参数
            tableData: [],
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            cmdb_app_url: this.GLOBAL.baseUrl + "/app/",
            app_url: this.GLOBAL.baseUrl + "/app/list/condition",
        };
    },
    created: function () {
        this.loadDeployOptions();
    },
    watch: {},
    methods: {
        //构建计划
        goPipeLineConfig(row) {
            this.$router.push({
                path: "/cicd/app/pipline-config",
                query: {
                    appId: row.id,
                    appCode: row.code,
                    groupIdStr: row.groupIdStr,
                    useLanguage: row.useLanguage
                },
            });
        },
        goSubCribe(row) {
            this.$router.push({
                path: "/cicd/app/app-notice-subscribe",
                query: {
                    appId: row.id,
                    appCode: row.code,
                    groupIdStr: row.groupIdStr,
                    useLanguage: row.useLanguage
                },
            });
        },

        // 跳转到依赖配置
        addDepend(row) {
            this.$router.push({
                path: "/cicd/app-edit",
                query: {
                    appId: row.id,
                    appCode: row.code,
                    tab: 'third'
                },
            });
        },
        // 跳转到apollo配置
        addApollo(row) {
            this.$router.push({
                path: "/cicd/app-apollo",
                query: {
                    appId: row.id,
                    appCode: row.code,
                },
            });
        },
        addGit(row) {
            this.$router.push({
                path: "/cicd/app-edit",
                query: {
                    appId: row.id,
                    appCode: row.code,
                    tab: 'fourth'
                },
            });
        },
        //check 应用下线是否已经审批
        checkAppOfflineAlreadyApproved: function (row) {
            var originTenantId = localStorage.getItem("originTenantId");

            if (this.GLOBAL.checkTenantIds.indexOf(originTenantId) > -1) {
                this.isCurrentTenantCheck = true;
            } else {
                this.isCurrentTenantCheck = false;
            }
            this.axios({
                    method: "post",
                    url: this.GLOBAL.baseUrl + "/workflow/list/condition",
                    data: JSON.stringify({
                        appId: row.code,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        if (result.data.code === 200) {
                            if (JSON.stringify(result.data.data) != "{}") {
                                console.log(result.data.data.offlineStatus);
                                if (result.data.data.offlineStatus === 1) {
                                    this.appOfflineAlreadyApproved = true;
                                } else if (result.data.data.offlineStatus === 0) {
                                    this.appOfflineAlreadyApproved = false;
                                }
                            } else {
                                this.appOfflineAlreadyApproved = false;
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        closeAppOffline: function () {
            this.AppOfflineDialogVisible = false;
        },
        offlineAppApproved(row) {
            var that = this;
            this.$confirm(
                    "此操作将触发应用下线审批工作流,请确认是否下线当前应用?",
                    "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                .then(() => {
                    that.loading = true;
                    that
                        .axios({
                            url: this.GLOBAL.baseUrl + "/appDeploy/approve/appOffline",
                            method: "POST",
                            data: {
                                appId: row.id,
                                appCode: row.code,
                                processKey: "appOffline",
                                processInstanceName: "应用下线",
                            },
                        })
                        .then((response) => {
                            that.loading = false;
                            if (response.status == 200) {
                                if (response.data.code == 200) {
                                    that.$message({
                                        message: "应用下线审批提交成功",
                                        type: "success",
                                    });
                                    that.updateVersionStatus();
                                } else {
                                    that.$message.error("应用下线审批提交失败");
                                }
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            that.loading = false;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });

            // this.AppOfflineDialogVisible = true;
            // this.appOfflineURL =
            //   this.GLOBAL.taskCenter +
            //   "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=appOffline&processName=appOffline&current=1";
        },
        offlineApp(row) {
            this.axios({
                    method: "GET",
                    url: this.GLOBAL.baseUrl + "/app/offline/" + row.id,
                })
                .then((response) => {
                    if (response.status == 200) {
                        if (response.data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "应用下线成功，操作成功",
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: "操作失败，应用下线失败",
                            });
                        }
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "error",
                        message: "操作失败，应用下线失败",
                    });
                });
        },
        stateLanguage: function (row, column) {
            return getUseLanguageName(row.useLanguage);
        },

        //创建新应用，工作流引擎
        // appAddClick: function () {
        //   this.AppCreatedPermissiondialogVisible = true;
        //   this.checkPermissionURL =
        //     this.GLOBAL.taskCenter +
        //     "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=appAply&processName=appAply&current=1";
        // },

        //创建新应用，自建
        appAddClick: function () {
            this.$router.push({
                path: "/cicd/app-add-workflow",
                query: {
                    appId: 1,
                    appCode: 2,
                },
            });
        },

        // 跳转构建页面
        buildClick: function (row) {
		        //   处理与参与者中心解耦-登录判断，参数 URL 处理
		        let url = this.GLOBAL.baseUrl + "/pipeline-design/loadAppPipeLines/" + row.id
		        let parms = {}  // 默认的
		        if (this.$store.getters.authLoginToken){
				        let resParam = this.common.handleAuthLoginParams(null,`/pipeline-design/loadAppPipeLines/${row.id}`)
				        parms = resParam.parms;
				        url = resParam.url
		        }
						
            var that = this;
            this.axios({
                    url: url,
                    method: "get",
		                params:parms,
                })
                .then((res) => {
                    console.log(res);
                    if (res.data.code == 200 && res.data.data != undefined && res.data.data.length > 1) {
                        that.goPipeLineConfig(row)
                    } else {
                        GoToPipeline(row, this.GLOBAL, this.$router);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    GoToPipeline(row, this.GLOBAL, this.$router);
                });

        },
        buildClick2: function (row) {
            this.$router.push(
                "/cicd/appEnvVariables?appId=" + row.id + "&appCode=" + row.code
            );
        },
        healthyClickPage: function (row) {
            this.$router.push({
                path: "/cicd/app-edit",
                query: {
                    appId: row.id,
                    appCode: row.code,
                    tab: 'five'
                },
            });
        },

        appDetailClick: function (row) {
            if (row.useLanguage >= 6) {
                this.$router.push(
                    "app/mobile-config?appId=" +
                    row.id +
                    "&owner=" +
                    row.prodMgrName +
                    "&app_code=" +
                    row.code
                );
            } else {
                // this.$router.push(
                //   "/cicd/app-detail?appId=" + row.id + "&owner=" + row.prodMgrName+"&app_code="+row.code
                // );
                this.appEditClick(row);
            }
        },
        apolloClick: function (row) {
            this.$router.push(
                "/cicd/apolloConfig?appId=" + row.id + "&appCode=" + row.code
            );
        },
		    // 代码合并
		    codeMerge(row){
				    this.$router.push({
						    path: "/cicd/app-edit",
						    query: {
								    appId: row.id,
								    appCode: row.code,
								    tab: 'six'
						    },
				    });
		    },
        appEditClick: function (row) {
            this.$router.push({
                path: "/cicd/app-edit",
                query: {
                    appId: row.id,
                    appCode: row.code,
                },
            });
            // this.$router.push("/cicd/app-edit?appId=" + row.id + '&appcode=' + row.code);
        },

        GetTableList: function () {
            // console.log("GetTableList3333:", this.page, this.limit, val)
            this.InitGetTableData(this.app_url, this.limit, this.page);
        },

        // 获取表格数据；
        InitGetTableData: function (url, page_size, page_index) {
            // const parms = {"pageSize": page_size, "pageNumber": page_index, 'appCode': this.formSearch.appCode,
            //   'owner': this.formSearch.owner,'language': this.formSearch.language,'name': this.formSearch.name,}
            let parms = {
                pageSize: page_size,
                pageNumber: page_index,
                code: this.formSearch.appCode,
                groupIdStr: this.formSearch.groupIdStr,
                projMgrName: this.formSearch.name,
            };
						// console.log(this.$store.getters.authLoginToken,'store----')
		    
						//   处理与参与者中心解耦-登录判断，参数 URL 处理
		        if (this.$store.getters.authLoginToken){
								let resParam = this.common.handleAuthLoginParams(parms,'/app/list/condition')
				        parms = resParam.parms;
								url = resParam.url
		        }
            this.loading = true;
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        this.tableData = response.data.data.list;
                        this.total = response.data.data.total;
                        // this.users = response.data.users
                        // this.languages = response.data.languages
                    } else {
                        console.log(response.data.error);
                        this.$message.error('加载应用信息失败,请联系平台管理员');
                    }
                    this.loading = false;
                })
                .catch((response) => {
                    this.loading = false;
                    console.log(response.data.error)
                    this.$message.error('加载应用信息失败,请联系平台管理员');
                });
        },

        // 新增数据
        AddNewRow: function () {
            // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
            this.$refs.newRow.validate((valid) => {
                if (valid) {
                    this.Loading.service({
                        background: "rgba(0, 0, 0, 0.7)"
                    });
                    let row = JSON.parse(JSON.stringify(this.newRow));
                    delete row["id"];
                    this.axios({
                            method: "POST",
                            url: this.url,
                            data: this.qs.stringify({
                                row: JSON.stringify(row)
                            }),
                        })
                        .then((response) => {
                            // console.log(response.data);
                            if (response.data.status) {
                                this.dialognewRowForm = false;
                                this.InitGetTableData(this.url, this.limit, this.page);
                                this.$notify.success(response.data.message);
                            } else {
                                console.log("AddNewRow Error: " + response.data.error);
                                this.$message.error('操作失败');
                            }
                        })
                        .catch((response) => {
                            console.log("AddNewRow Error: " + response);
                            this.$message.error('操作失败');
                        });
                    this.Loading.service({
                        background: "rgba(0, 0, 0, 0.7)"
                    }).close();
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        // 编辑选中数据
        editRow: function () {
            // console.log('rowedit:', row, row.roles_id_list.split(','))
            this.$refs.newRow.validate((valid) => {
                if (valid) {
                    this.Loading.service({
                        background: "rgba(0, 0, 0, 0.7)"
                    });
                    const update_list = JSON.parse(JSON.stringify(this.newRow));
                    // console.log("pers_list:", pers_list)
                    this.axios({
                            method: "PUT",
                            url: this.url,
                            data: this.qs.stringify({
                                update_list: JSON.stringify([update_list]),
                                update_ManyToMany: JSON.stringify([]),
                            }),
                        })
                        .then((response) => {
                            // console.log(response.data);
                            if (response.data.status) {
                                this.InitGetTableData(this.url, this.limit, this.page);
                                this.$notify.success(response.data.message);
                                this.dialognewRowForm = false;
                            } else {
                                this.$notify.error("editRow Error: " + response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$notify.error("editRow Error: " + String(response));
                        });
                    this.Loading.service().close();
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        // 删除选中数据
        deleteRow: function (row, index) {
            this.Loading.service({
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.axios({
                    method: "DELETE",
                    url: this.app_url,
                    data: this.qs.stringify({
                        rows: JSON.stringify([row.id])
                    }),
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data.status) {
                        this.InitGetTableData(this.url, this.limit, this.page);
                        this.$notify.success({
                            message: response.data.message
                        });
                    } else {
                        this.$notify.error({
                            message: String(response.data.error)
                        });
                    }
                })
                .catch((response) => {
                    this.$notify.error({
                        message: String(response)
                    });
                });
            this.Loading.service().close();
        },

        // 同步数据
        SyncData: function () {
            // console.log('AddNewRow:',this.newRow, typeof(this.newRow))
            this.axios({
                    method: "POST",
                    url: this.app_url,
                    data: {
                        sync: true
                    },
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data.status) {
                        this.InitGetTableData(this.app_url, this.limit, this.page);
                        this.$message.success(response.data.message);
                    } else {
                        this.$message.error(
                            "SyncData Error: " + String(response.data.error)
                        );
                    }
                })
                .catch((response) => {
                    this.$message.error("SyncData Error: " + String(response));
                });
        },

        //  编辑权限
        editPermission: function () {
            let ret = this.common.hasPermission(this.$store.state.user.roles, [
                "cicd_admin",
                "devops",
            ]);
            console.log("editPermission:", ret);
            return ret;
        },
        goRunningPod(app, env) {
		        let envId = ''
		        this.envs.forEach(item=>{
								if (item.selectValue.toUpperCase() === env){
										envId = item.selectKey
								}
		        })
            this.$router.push({
                path: "/cicd/app/app-deploy-pod",
                query: {
                    appId: app.id,
                    appCode: app.code,
                    image: "",
                    branch: "",
                    deployEnv: env,
		                deployEnvId: envId,
                    language: "default",
                },
            });

        },
        loadDeployOptions: function () {
		       
		        //   处理与参与者中心解耦 - 降级登录判断，参数 URL 处理
		        let url =  this.GLOBAL.baseUrl + "/env/get",parms={}  // 默认的
		        if (this.$store.getters.authLoginToken){
				        let resParam = this.common.handleAuthLoginParams(null,'/env/get')
				        parms = resParam.parms;
				        url = resParam.url
		        }
						
            var that = this;
            this.axios({
                url: url,
		            params: parms,
		            method: "get",
            }).then((res) => {
                if (res.data.code === 200) {
                    if (res.data.data != undefined) {
                        that.envOptions = [];
												this.envs = res.data.data
                        for (var i = 0; i < res.data.data.length; ++i) {
                            var envObj = res.data.data[i]
                            if (envObj != undefined) {
                                that.envOptions.push(envObj.selectValue.toUpperCase())
                            }
                        }
                    }
                }

            }).catch((error) => {
                console.log(error)
            })

        }
    },

    computed: {
        GetLanguages() {
            return getUseLanguageName(scope.row.useLanguage);
        },
    },
    mounted() {
        let appCode = this.common.getUrlKey("appCode");
        if (appCode) {
            this.formSearch.appCode = appCode;
        }
        this.InitGetTableData(this.app_url, this.limit, this.page);
        showGuideInfo(app, "app", this.$driver);
    },
    components: {
        "table-box": Table,
        pagination: pagination,
        appEnvVariables: appEnvVariables,
    },
};
</script>

<style scoped>
.main {
    background: white;
    padding: 24px;
    height: calc(100% - 80px);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.table-box {
    flex: 1;
    overflow-y: auto;
}

.dialog-footer {
    text-align: center;
}
</style>
