<template>
    <div class="main flex-column">
        <div class="table-box" v-if="canView">
            <div class="panel">
                <el-button style="float: left;" icon="el-icon-plus" size="small" @click="addServerDialog">新建</el-button>
                <!-- 搜索 -->
                <div style="float: right">
                    <el-form :inline="true" :model="formSearch" size="small" class="demo-form-inline"
                        @submit.native.prevent label-width="100px">

                        <el-form-item label="名称">
                            <el-input v-model.trim="formSearch.appCode" id="appCode" placeholder="请输入名称"
                                @keyup.enter.native="GetTableList" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="GetTableList" id="appSearch">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- 表格 -->
            <el-table :key="1" stripe id="out-table" v-loading="loading" :data="tableData" style="width: 100%"
                height="calc(100% - 80px)">
                <el-table-column label="名称" align="center" prop="pipelineName"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="创建人" align="center" prop="createrName">
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime">
                </el-table-column>
                <el-table-column label="状态" prop="pipelineStatus" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pipelineStatus == 0" style="color:red">
                            <el-tag size="mini" type="danger">
                                待完善
                                <el-tooltip content="未配置具体流水线信息" placement="top">
                                    <i class="el-icon-error"></i>
                                </el-tooltip>
                            </el-tag>
                        </span>
                        <el-switch v-else @change="changeWorkStatus(scope.row)" inactive-value="1" active-value="2"
                            v-model="scope.row.pipelineStatus"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="60px" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-dropdown size="mini">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"
                                    style="-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="tickDetail(scope.row, 'template-config')"
                                    icon="el-icon-connection">模板配置</el-dropdown-item>
                                <el-dropdown-item @click.native="tickDetail(scope.row, 'app-config')"
                                    icon="el-icon-setting">应用接入</el-dropdown-item>
                                <el-dropdown-item @click.native="tickDetail(scope.row, 'remove-config')"
                                    icon="el-icon-delete">删除配置</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-empty v-else style="margin-top:20vh;" description="暂无权限">
        </el-empty>
        <el-dialog :title="addNewTemplate.title" :visible.sync="addNewTemplate.open" width="600px">
            <el-form ref="form" :model="form" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="pipelineName" :rules="[{ required: true, message: '必填项不能为空' }]">
                            <el-input type="textarea" rows="2" v-model="form.pipelineName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">提交审批</el-button>
                    <el-button @click="(addNewTemplate.open = false)">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import {
    getUseLanguageName
} from "@/utils/pipeline.js";
import {
    v4 as uuidv4
} from 'uuid';
export default {
    name: "app",
    props: {},

    data() {
        return {
            canView: false,
            tab: "template-config",
            formSearch: {
                appCode: ""
            },
            tableData: [],
            loading: false,
            form: {
                pipelineStatus: 0,
                pipelineName: "",
                pipelineId: uuidv4(),
                currentAddServer: false,
                currentConfigApp: false,
            },
            addNewTemplate: {
                title: "新增配置",
                open: false,
            }
        };
    },
    watch: {},
    methods: {
        checkVViewPermission() {
            var roles = localStorage.getItem("roles");
            if (roles) {
                roles = JSON.parse(roles);
                var isSuperAdmin = roles.some((item) => {
                    return item.roleName === "super-admin";
                });
                if(isSuperAdmin){
                    this.canView = true;
                }
            }
        },
        tickDetail(row, rowType) {
            if ("app-config" == rowType) {
                this.$router.push({
                    path: "/basic/quality-control-app-config",
                    query: {
                        templateName: row.pipelineName,
                        uuid: row.pipelineId,
                        id: row.id,
                        status: row.pipelineStatus
                    },
                });
            }
            if ("remove-config" == rowType) {
                this.deleteById(row.pipelineId)
            }
            if ("template-config" == rowType) {
                this.$router.push({
                    path: "/basic/quality-control-template-config",
                    query: {
                        uuid: row.pipelineId,
                        id: row.id
                    },
                });
            }
        },
        changeWorkStatus(row) {
            var message = undefined
            if (row.pipelineStatus == 2) {
                message = "确定启用当前规则？"
            }
            if (row.pipelineStatus == 1) {
                message = "确定停用当前规则？"
            }
            this.$confirm(message, "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "关闭",
            })
                .then(() => {
                    this.axios({
                        method: "POST",
                        url: this.GLOBAL.baseUrl + "/access_control/pipeline/update",
                        data: {
                            id: row.id,
                            status: row.pipelineStatus,
                            allowAll: row.allowAll,
                            appIds: row.appIds
                        }
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success("操作成功")
                            this.GetTableList();
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })
                .catch((action) => {
                    if (row.pipelineStatus == 1) {
                        row.pipelineStatus = 2
                    }
                    if (row.pipelineStatus == 2) {
                        row.pipelineStatus = 1
                    }
                });
        },
        addServerDialog() {
            this.addNewTemplate.open = true;
            this.addNewTemplate.status = 0;
            this.addNewTemplate.name = "";
        },
        //保存
        save() {
            console.log(this.form, '------')
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let url = this.GLOBAL.baseUrl + "/access_control/pipeline/add";
                    this.axios({
                        method: "post",
                        url: url,
                        data: this.form
                    })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: `新增成功`
                                })
                                this.addNewTemplate.open = false;
                                this.GetTableList();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })
                            }
                        })
                }
            });
        },
        GetTableList() {
            let url = this.GLOBAL.baseUrl + "/access_control/pipeline/list";
            this.axios({
                method: "post",
                url: url,
            })
                .then((res) => {
                    if (res.data.code === 200) {
                        console.log(res.data, '----res')
                        this.tableData = res.data.data
                        this.$message({
                            type: 'success',
                            message: `加载完毕`
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        })
                    }
                })
        },
        deleteById(pipelineId) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let url = this.GLOBAL.baseUrl + "/access_control/pipeline/remove";
                    this.axios({
                        method: "post",
                        url: url,
                        data: {
                            pipelineId: pipelineId,
                        }
                    })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: `删除成功`
                                })
                                this.GetTableList();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

    },

    computed: {
        GetLanguages() {
            return getUseLanguageName(scope.row.useLanguage);
        },
    },
    mounted() {
        this.GetTableList();
        this.checkVViewPermission();

    },

    components: {
        "table-box": Table,
        pagination: pagination
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
    height: calc(100% - 80px);
    flex: 1;
    overflow-y: auto;
}

.flex-center-between {
    justify-content: flex-end;
}
</style>
    