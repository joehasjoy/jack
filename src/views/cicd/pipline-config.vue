<template>
    <div style="padding: 10px 10px 0 10px">
        <el-page-header @back="goBack" content="构建计划"> </el-page-header>
        <el-card style="margin: 10px;">
            <el-card style="margin: 5px 0">
                <!-- 搜索 -->
                <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                    <el-form-item label="构建计划名">
                        <el-input v-model="formSearch.name" placeholder="构建计划名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="GetTableList">查询</el-button>
                    </el-form-item>
                    <el-button icon="el-icon-plus" style="float: right" @click="createTemplate">创建构建计划</el-button>
                </el-form>
            </el-card>

            <div style="width: 100%;overflow: auto;height:65vh;">
                <el-table :data="tableData">
                    <el-table-column label="序号" type="index" align="center"></el-table-column>
                    <el-table-column label="流水线名称" prop="name" align="center"></el-table-column>
                    <el-table-column label="创建人" prop="create_by"></el-table-column>
                    <el-table-column label="创建时间" prop="create_time" :formatter="dateFormat" sortable></el-table-column>
                    <el-table-column label="流水线类型" prop="mode" align="center">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.mode == 'template'">
                                默认
                            </el-tag>
                            <el-tag type="danger" v-if="scope.row.mode == 'dynamic'">
                                自定义
                            </el-tag>
                            <el-tag type="danger" v-if="scope.row.mode == 'custom'">
                                平台门禁
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="320" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="goPipelineBuild(scope.row)"
                                icon="el-icon-s-promotion">立即构建</el-button>

                            <el-dropdown trigger="click">
                                <el-button type="success" size="mini">
                                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-view" @click.native="viewPipeline(scope.row)">查看流水线
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete" style=" color:red;"
                                        @click.native="removePipeline(scope.row)">删除流水线</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

    </div>
</template>

<script>
import moment from "moment";
import pinyin from 'js-pinyin'
import {
    GoToPipeline
} from "@/utils/pipeline.js";
import Table from "@/components/tableTemp";
export default {
    name: "user_manage",
    props: {},

    data() {
        return {
            appId: null,
            appCode: null,
            groupIdStr: undefined,
            useLanguage: 0,
            loading: false,
            formSearch: {},
            condition: [],
            newRules: {
                // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
            },
            newRow: {
                name: "",
                is_enable: true,
                description: "",
            },
            global_dict: {
                mudule_list: [],
            },
            dialognewRowForm: false,
            newTitle: "",
            options: {
                stripe: true, // 是否为斑马纹 table
                loading: false, // 是否添加表格loading加载动画
                highlightCurrentRow: true, // 是否支持当前行高亮显示
                mutiSelect: true, // 是否支持列表项选中功能
            }, // table 的参数
            tableData: [],
            tableKey: [{
                // hide: true,
                name: "构建计划名",
                value: "name",
                // width: 150,
                hasSort: true,
                align: "center",
                operate: true,
                resizable: true, // 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）默认 true
                ShowOverflowTooltip: false, // 当内容过长被隐藏时显示 tooltip 默认 false
            },
            {
                name: "描述",
                value: "description",
            },
            {
                name: "启用",
                value: "is_enable",
                ShowOverflowTooltip: false,
                formatter: function (row, column, cellValue, index) {
                    if (row.is_enable) {
                        var tag = "是";
                    } else {
                        tag = "否";
                    }
                    return tag;
                },
            },
            {
                name: "操作",
                value: "",
                align: "center",
                hide: false,
                formatter: function (row, column) {
                    // console.log("row:", row, column, cellValue, index)
                    var tag_edit =
                        '<el-button class="el-button el-button--mini el-button--primary"  @click="btn_click()">编辑</el-button>';
                    var tag_del =
                        '<el-button class="el-button el-button--mini el-button--danger" icon="el-icon-delete">删除</el-button>';
                    return tag_edit + tag_del;
                },
            },
            ],
            operates: {
                width: 200,
                fixed: "right",
                label: "操作",
                align: "center",
                list: [{
                    id: "1",
                    label: "编辑",
                    type: "warning",
                    show: true,
                    icon: "el-icon-edit",
                    size: "mini",
                    plain: true,
                    disabled: false,
                    method: (row, index) => {
                        // console.log('edit0::::', row)
                        // this.handleEdit(index, row)
                        this.dialognewRowForm = true;
                        this.newTitle = "编辑";
                        this.newRow.id = row.id;
                        this.newRow.name = row.name;
                        this.newRow.description = row.description;
                        this.newRow.is_enable = row.is_enable;
                    },
                },
                {
                    id: "2",
                    label: "删除",
                    type: "danger",
                    size: "mini",
                    icon: "el-icon-delete",
                    show: true,
                    plain: true,
                    disabled: false,
                    method: (row, index) => {
                        // console.log('delete::::')
                        // this.deleteRow(row,index)
                        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                this.deleteRow(row, index);
                                // this.$message({
                                //   type: 'success',
                                //   message: '删除成功!'
                                // });
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消删除",
                                });
                            });
                    },
                },
                ],
            }, // 列操作按钮
            total: 0,
            page: 1,
            limit: 10,
            url: this.GLOBAL.service_tag + "/api/cicd/env/",
            isControl: null,
            pipelineList: [],
        };
    },
    created: function () { },
    watch: {},
    mounted() {
        this.appId = this.common.getUrlKey("appId");
        this.appCode = this.common.getUrlKey("appCode");
        this.groupIdStr = this.common.getUrlKey("groupIdStr");
        this.useLanguage = this.common.getUrlKey("useLanguage");
        this.GetTableList();
    },
    methods: {
        // 应用门禁流水线列表查询
        queryPipelineList() {
            let requestUrl = this.GLOBAL.baseUrl + "/access_control/app/pipeline_list"
            this.axios({
                url: requestUrl,
                method: "post",
                data: {
                    appId: Number(this.appId)
                }
            }).then(response => {
                if (response.data.code === 200) {
                    response.data.data = response.data.data.map(item => {
                        return {
                            app_id: 2541,
                            create_by: item.createrName,
                            create_time: item.createTime,
                            id: 1,
                            mode: "custom",
                            name: item.pipelineName,
                            pipline_language: "-",
                            pipline_uuid: item.pipelineId,
                            tenant_id: item.tenantId,
                        }
                    })
                    this.pipelineList = response.data.data
                    // 合并数组
                    let one = this.tableData[0]
                    delete this.tableData[0]
                    console.log(one, 'one-----------')
                    this.tableData = [one].concat(this.pipelineList).concat(this.tableData)
                    console.log(this.tableData, '111-----------')

                }
            }).catch(err => {
                console.log(err)
                this.$message.error("应用门禁流水线列表查询失败")
            })
        },

        dateFormat: function (row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        },
        viewPipeline(e) {
            if (e.mode == "template") {
                this.$message({
                    message: "默认流水线暂不可查看",
                    type: "warning",
                })
                return;
            }
            if (e.mode == "custom") {
                this.$message({
                    message: "暂不支持查看",
                    type: "warning",
                })
                return;
            }
            var pipeline = e.pipline_uuid;
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config-design",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.groupIdStr,
                    useLanguage: this.useLanguage,
                    pipline_uuid: pipeline,
                },
            });
        },
        removePipeline(e) {

            if (e.mode == "template") {
                this.$message({
                    message: "默认流水线数据禁止删除",
                    type: "warning",
                })
                return;
            }
            if (e.mode == "custom") {
                this.$message({
                    message: "暂不支持删除",
                    type: "warning",
                })
                return;
            }
            var that = this;
            var pipelineuid = e.pipline_uuid;
            var requestUrl = this.GLOBAL.baseUrl + "/pipeline-design/deleteBuildPipeline/" + pipelineuid + "/" + this.appId
            this.$confirm("此操作将删除当前流水线, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    that.axios({
                        url: requestUrl,
                        method: "GET",
                    }).then(response => {
                        const {
                            code,
                            data
                        } = response.data
                        if (code == 200) {
                            that.$message({
                                message: "删除成功",
                                type: "success",
                            })
                            that.GetTableList();
                        } else {
                            that.$message.error("删除失败，请检查后重试")
                        }
                    }).catch(err => {
                        console.log(err)
                        that.$message.error("删除失败，请检查后重试")

                    })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        goPipelineBuild(e) {
            var that = this;
            pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
            if (e.mode == "template") {
                var row = {
                    code: this.appCode,
                    id: this.appId,
                    groupIdStr: this.groupIdStr,
                    useLanguage: this.useLanguage
                };
                GoToPipeline(row, this.GLOBAL, this.$router);
            }
            else if (e.mode == "custom") {
                this.$router.push({
                    path: "/basic/quality-control-pipeline",
                    query: {
                        appId: that.appId,
                        appCode: that.appCode,
                        groupIdStr: pinyin.getCamelChars(this.groupIdStr).toLowerCase(),
                        groupIdStrName: this.groupIdStr,
                        useLanguage: this.useLanguage,
                        pipline_uuid: e.pipline_uuid,
                        pipline_name: e.name,
                        mode: e.mode
                    },
                });
            }
            else {
                this.$router.push({
                    path: "/cicd/app/design-pipeline-build",
                    query: {
                        appId: that.appId,
                        appCode: that.appCode,
                        groupIdStr: this.groupIdStr,
                        useLanguage: this.useLanguage,
                        pipline_uuid: e.pipline_uuid,
                        pipline_name: e.name,
                        mode: e.mode
                    },
                });
            }

        },
        goBack: function () {
            this.$router.push({
                path: "/cicd/app",
            });
        },
        GetTableList: function (val) {
            //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
            let url = this.GLOBAL.baseUrl + "/pipeline-design/loadAppPipeLines/" + this.appId,
                parms = {} // 默认的
            //   处理与参与者中心解耦- 降级判断
            if (this.$store.getters.authLoginToken) {
                let resParam = this.common.handleAuthLoginParams(parms, `/pipeline-design/loadAppPipeLines/${this.appId}`)
                parms = resParam.parms;
                url = resParam.url
            }
            this.axios({
                url: url,
                params: parms,
                method: "get",
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.code == 200) {
                        this.tableData = res.data.data;
                        this.tableData = this.tableData.filter(u => u.name != undefined)
                    }
                }).then(() => {
                    this.queryPipelineList()
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        createTemplate: function () {
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config-template",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.groupIdStr,
                    useLanguage: this.useLanguage
                },
            });
        },

    },

    computed: {},
    components: {
        "table-box": Table,
    },
};
</script>

<style scoped>

</style>
