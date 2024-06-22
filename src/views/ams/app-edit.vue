<template>
<div class="card-panel flex-column">
    <div slot="header" class="flex flex-align-items-center header" @click="goBack" style="cursor: pointer">
        <i class="el-icon-arrow-left"></i>
        <span>返回</span>
    </div>
    <el-tabs v-model="activeName" class="my-tab flex-column" @tab-click="handleClick">
        <el-tab-pane label="基础信息修改" name="first" class="flex-column my-pane">
            <el-form class="edit-form" ref="appBasicDetailForm" :model="form" :rules="rules" label-width="120px" size="small" label-position="left">
                <el-input v-model="form.id" type="hidden"></el-input>

                <el-form-item label="租户ID" hidden>
                    <el-input v-model="form.tenantId" readonly></el-input>
                </el-form-item>

                <el-form-item label="AppId" prop="code">
                    <el-input v-model="form.code" readonly></el-input>
                </el-form-item>
                <el-form-item label="应用编号" prop="code">
                    <el-input v-model="appIdCode" readonly></el-input>
                </el-form-item>
                <el-form-item label="业务域">
<!--                    <el-input v-model="form.groupIdStr" readonly></el-input>-->
                     <el-select v-model="form.groupId" placeholder="请选择业务域" filterable clearable>
                        <el-option v-for="item in teamOptions" :key="item.groupId" :label="item.groupIdStr"
                                   :value="item.groupId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="优先级:" prop="priority">
                    <el-select v-model="form.priority" placeholder="请选择是否核心应用">
                        <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="是否核心应用:" prop="isCore">
                    <el-select v-model="form.isCore" placeholder="请选择是否核心应用">
                        <el-option v-for="item in isCoreOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
		            
		            <el-form-item label="所属产品:">
				            <el-select v-model="form.prodId" filterable clearable placeholder="请选择所属产品（非必选）">
						            <el-option v-for="item in optionsInfos" :key="item.value" :label="item.label" :value="item.value" />
				            </el-select>
		            </el-form-item>
		            
                <el-form-item label="产品负责人:" prop="prodMgrId">
                    <el-select v-model="form.prodMgrId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="项目负责人:" prop="projMgrId">
                    <el-select v-model="form.projMgrId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="质量负责人:" prop="qualityMgrId">
                    <el-select v-model="form.qualityMgrId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开发负责人:" prop="devMgrId">
                    <el-select v-model="form.devMgrId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开发人员:" prop="devlopers">
                    <el-select v-model="form.devlopers" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions" multiple>
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="测试人员:" prop="testers">
                    <el-select v-model="form.testers" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions" multiple>
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="业务负责人:" prop="bizMgrIds">
                    <el-select v-model="form.bizMgrIds" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions" multiple>
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所用语言:" prop="useLanguage">
                    <el-select v-model="form.useLanguage" placeholder="请选择所用语言">
                        <el-option v-for="item in useLanguageOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="功能说明:" prop="description">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                <el-form-item label="业务标签:" prop="labels">
                    <el-input type="textarea" v-model="form.labels"></el-input>
                </el-form-item>

                <el-form-item label="代码仓库类型:" prop="repoType">
                    <el-select v-model="form.repoType" placeholder="请选择代码仓库类型">
                        <el-option v-for="item in repoTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="仓库地址:" prop="gitRepoUrl">
                    <el-input v-model="form.gitRepoUrl"></el-input>
                </el-form-item>

                <el-form-item label="仓库账号:" prop="repoUsername">
                    <el-input v-model="form.repoUsername"></el-input>
                </el-form-item>

                <el-form-item label="仓库密码:" prop="repoPassword">
                    <el-input type="password" v-model="form.repoPassword"></el-input>
                </el-form-item>
		            
				            <el-button type="text" @click="jumpChangeReord">查看变更记录</el-button>
            </el-form>
            <div class="footer flex">
                <el-button type="primary" @click="UpdateApp()">更 新</el-button>
            </div>
        </el-tab-pane>
        <el-tab-pane name="second" class="flex-column my-pane">
            <div slot="label">
                动态扩缩容(HPA)
                <el-tooltip class="item" effect="dark" content="HPA会根据当前配置的指标数值(资源类型、阈值)，在节点数范围以内动态加载对应的相应的节点：即当前资源类型利用率超过预设的阈值，实行扩容策略；当前资源类型利用率低于预设的阈值，实行缩容策略" placement="top-start">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>
            <el-button size="small" style="margin-top: 5px; margin-bottom: 20px; width: 60px" @click="openDialog">新增</el-button>
            <div class="table-box">
                <enn-table :tableColumn="tableColumn" :tableData="tableData" @handleOperationClick="handleOperationClick"></enn-table>
            </div>
            <!-- <pagination
          :small="false"
          :total="HpaTotal"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="getHpaList()"
        ></pagination> -->
        </el-tab-pane>
        <el-tab-pane label="依赖配置" name="third" class="flex-column my-pane">
            <el-button size="small" style="margin-top: 5px; margin-bottom: 20px; width: 80px" @click="openDialog">新增依赖</el-button>
            <div class="table-box">
                <enn-table :tableColumn="dependTableColumn" :tableData="dependTable" @handleOperationClick="handleOperationClick"></enn-table>
            </div>
            <!-- <pagination
          :small="false"
          :total="dependTotal"
          :page.sync="dependPage"
          :limit.sync="dependLimit"
          @pagination="getDependList()"
        ></pagination> -->
        </el-tab-pane>

        <el-tab-pane label="GitLab授权" name="fourth" v-if="showGitTab" class="flex-column my-pane">
            <div class="panel flex-center-between">
                <el-button style="margin-bottom: 20px" @click="bindGitGrand" type="primary" id="createProject" icon="el-icon-plus">关联Gitlab权限</el-button>
                <!-- 搜索 -->
                <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model.trim="formSearch.appCode" id="appCode" placeholder="请输入UserCode" @keyup.enter.native="GetTableList" clearable></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" id="appSearch" @click="loadGitGrantInfo">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table stripe id="out-table" v-loading="loading" :data="gitGrabtTableData" style="width: 100%; overflow: auto">
                <el-table-column label="UserCode" prop="grantGitUserCode"></el-table-column>
                <el-table-column label="创建时间" prop="createDate" align="center"></el-table-column>
                <el-table-column label="角色信息" prop="grantGitRole" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.grantGitRole == '10'" type="primary">Guest</el-tag>
                        <el-tag v-if="scope.row.grantGitRole == '20'" type="primary">Reporter</el-tag>
                        <el-tag v-if="scope.row.grantGitRole == '30'" type="primary">Developer</el-tag>
                        <el-tag v-if="scope.row.grantGitRole == '40'" type="warning">Maintainer</el-tag>
                        <el-tag v-if="scope.row.grantGitRole == '50'" type="danger">Owner</el-tag>
                        <el-tag v-if="scope.row.grantGitRole == '60'" type="danger">Admin</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.flowStatus == '0'" icon="el-icon-loading" type="text">审批中</el-button>
                        <el-button v-if="scope.row.flowStatus == '0'" type="text" style="color: red" @click="goTaskCenter">查看审批</el-button>

                        <el-button v-if="scope.row.flowStatus == '1'" size="mini" plain icon="el-icon-edit" @click="changeGitGrant(scope.row)">更改授权</el-button>
                        <el-button v-if="scope.row.flowStatus == '1'" size="mini" plain icon="el-icon-remove" type="danger" @click="deleteGitGrant(scope.row)">删除授权</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>

        <el-tab-pane label="健康检查配置" name="five" class="flex-column my-pane">
            <div class="panel flex-center-between">
                <el-button style="margin-bottom: 20px" :disabled="!(healthyConfigTableData.length==0)" @click="bindHealthyCheck" id="createProject" icon="el-icon-plus">新增健康检查配置</el-button>
            </div>
            <el-table stripe id="out-table" v-loading="loading" :data="healthyConfigTableData" style="width: 100%; overflow: auto">
                <el-table-column label="端口" prop="port"></el-table-column>
                <el-table-column label="URL" prop="url"></el-table-column>
                <el-table-column label="创建人" prop="createBy" align="center"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="changeHealthCheck(scope.row)">更改</el-button>
                        <el-button size="mini" @click="deleteHealthCheck(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        变更记录<i class="header-icon el-icon-info"></i>
                    </template>
                    <el-table stripe id="out-table" v-loading="loading" :data="healthyCheckLogList" style="width: 100%; overflow: auto">
                        <el-table-column label="参数名" prop="changeAttribute"></el-table-column>
                        <el-table-column label="当前值" prop="currentValue" align="center"></el-table-column>
                        <el-table-column label="原始值" prop="oldValue" align="center"></el-table-column>
                        <el-table-column label="操作人" prop="createBy" align="center"></el-table-column>
                        <el-table-column label="变更类型" prop="changeType" align="center"></el-table-column>
                        <el-table-column label="变更时间" prop="createTime" align="center"></el-table-column>
                    </el-table>
                    <div class="page" v-show="healthyCheckLogList.length">
                        <pagination :small="false" :total="logTotal" :page.sync="logPage" :limit.sync="loglimit" @pagination="loadHealthyPage()"></pagination>
                    </div>
                </el-collapse-item>
            </el-collapse>

        </el-tab-pane>
		
		    <el-tab-pane label="部署后代码合并配置" name="six" class="flex-column my-pane">
				  <messageNotification v-if="activeName==='six'"></messageNotification>
		    </el-tab-pane>

    </el-tabs>

    <!-- 新增、修改hpa弹框 -->
    <hpa-dialog :appId="appId" :type="hpaType" :appCode="hpaAppCode" :hpaFormData="hpaFormData" :dialogVisible="hpaVisable" @handleClose="handleClose" @handleSure="handleSure"></hpa-dialog>

    <!-- 新增依赖 -->
    <depend-dialog :appId="appId" :dialogVisible="dependVisbale" :appCode="hpaAppCode" @handleClose="handleClose" @handleSure="handleSure"></depend-dialog>

    <!-- gitlab 用户授权 -->

    <el-dialog :title="gitFormtitle" :visible.sync="showGitForm" width="500px">
        <el-form :model="gitGrantForm" label-width="80px" label-position="right" style="max-width: 650px; margin-left: 60px">
            <el-form-item label="Git User">
                <el-select v-model="gitGrantForm.gitUserId" filterable clearable remote reserve-keyword placeholder="请输入Icode" :remote-method="searchGitUser">
                    <el-option v-for="item in searchGitUserOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="授权角色">
                <el-select v-model="gitGrantForm.roleNumber" placeholder="请选择授权角色" filterable>
                    <el-option v-for="item in gitRoleOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: 25px">
                <el-button type="primary" @click="onSubmitGitGrant">提交审批</el-button>
                <el-button @click="showGitForm = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 健康检查 -->
    <el-dialog :title="healthyFormtitle" :visible.sync="showHeathyForm" width="500px">
        <el-form :model="healthyForm" label-width="80px" label-position="right" style="max-width: 650px; margin-left: 4px">
            <el-form-item label="端口">
                <el-input v-model.trim="healthyForm.port" type="number" placeholder="请输入端口名" clearable></el-input>
            </el-form-item>
            <el-form-item label="URL">
                <el-input v-model.trim="healthyForm.url" placeholder="请输入URL" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-alert show-icon title="调整配置将于部署过程中生效" type="warning">
                </el-alert>
            </el-form-item>

            <el-form-item style="margin-top: 25px">
                <el-button type="primary" @click="onHealthyCheckSubmit">提交</el-button>
                <el-button @click="showHeathyForm = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</div>
</template>

<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import EnnTable from "@/components/EnnTable/index";
import HpaDialog from "./components/HpaDialog.vue";
import DependDialog from "./components/dependDialog.vue";
import YAML from "yaml";
import messageNotification from "./components/codeMerge/message"
import {
    hpaListApi,
    deleteHpaAPi,
    getDependAPi,
    deleteDependAPi,
} from "../../api/api";
export default {
    name: "app-edit",
    props: ["appBasicDetailVisible"],
    data() {
        return {
            appIdCode: '',
            healthyCheckLogList: [],
            logTotal: 0,
            logPage: 1,
            loglimit: 20,
            showGitTab: false,
            gitFormtitle: "",
            healthyFormtitle: "增加健康检查配置",
            showGitForm: false,
            showHeathyForm: false,
            gitGrantForm: {
                roleNumber: 0,
                gitUserId: 0,
            },
            healthyForm: {

            },
            searchGitUserOptions: [],
            healthyConfigTableData: [],
            gitRoleOptions: [{
                    value: 10,
                    label: "Guest",
                },
                {
                    value: 20,
                    label: "Reporter",
                },
                {
                    value: 30,
                    label: "Developer",
                },
                {
                    value: 40,
                    label: "Maintainer",
                },
                {
                    value: 50,
                    label: "Owner",
                },
                {
                    value: 60,
                    label: "Admin",
                },
            ],
            formSearch: {},
            gitGrabtTableData: [],
            activeName: this.$route.query.tab || "first",
            HpaTotal: 0,
            page: 1,
            limit: 20,
            tableColumn: [{
                    label: "APPID",
                    prop: "appId"
                },
                {
                    label: "环境",
                    prop: "envName"
                },
                {
                    label: "命名空间",
                    prop: "namespace"
                },
                {
                    label: "最大节点数",
                    prop: "maxReplicas"
                },
                {
                    label: "最小节点数",
                    prop: "minReplicas"
                },
                {
                    label: "资源",
                    prop: "resourceName"
                },
                {
                    label: "阈值",
                    prop: "targetAverageUtilization"
                },
                {
                    label: "创建人",
                    prop: "creatorName"
                },
                {
                    label: "创建时间",
                    prop: "createTime"
                },
                {
                    label: "更新人",
                    prop: "updateName"
                },
                {
                    label: "更新时间",
                    prop: "updateTime"
                },
                {
                    label: "操作",
                    prop: "operationList",
                    width: "150px"
                },
            ],
            tableData: [],
            hpaType: "",
            hpaVisable: false,
            hpaFormData: {
                appId: "",
                envId: "",
                namespace: "",
                minReplicas: null,
                maxReplicas: "",
                resourceName: "",
                targetAverageUtilization: null,
            },
            hpaAppCode: "",
            dependVisbale: false,
            dependTableColumn: [{
                    label: "应用名",
                    prop: "service_name"
                },
                {
                    label: "环境",
                    prop: "env_code"
                },
                {
                    label: "数据库",
                    prop: "db_name"
                },
                {
                    label: "数据库集群IP",
                    prop: "middleware_cluster_ip"
                },
                {
                    label: "创建人",
                    prop: "creator"
                },
                {
                    label: "操作",
                    prop: "operationList"
                },
            ],
            dependTable: [],
            dependTotal: 0,
            dependPage: 1,
            dependLimit: 20,
            loading: false,
            //所用语言下拉
            useLanguageOptions: [{
                    label: "java",
                    value: 1
                },
                {
                    label: "python",
                    value: 2
                },
                {
                    label: "go",
                    value: 3
                },
                {
                    label: "nodejs",
                    value: 4
                },
                {
                    label: "Javascript",
                    value: 5
                },
            ],
            //代码仓库类型
            repoTypeOptions: [{
                    label: "gitlab",
                    value: 1
                },
                {
                    label: "github",
                    value: 2
                },
                {
                    label: "gitee",
                    value: 3
                },
                {
                    label: "gogs",
                    value: 4
                },
                {
                    label: "svn",
                    value: 5
                },
                {
                    label: "codeup",
                    value: 6
                },
            ],
            //是否核心应用
            isCoreOptions: [{
                    label: "是",
                    value: 1
                },
                {
                    label: "否",
                    value: 2
                },
            ],
            //优先级
            priorityOptions: [{
                    label: "极高",
                    value: 1
                },
                {
                    label: "高",
                    value: 2
                },
                {
                    label: "中",
                    value: 3
                },
                {
                    label: "低",
                    value: 4
                },
            ],
		        
		        //所属产品
		        optionsInfos: [],
		        
            appDetail: {},
            teamOptions: [],
            domainMemberOptions: [],
            form: {},
            enable_info: false,
            template_id: "",
            kube_env_disabled: false,
            yaml_content: "",
            domain_ingress: "",
            newTitle: "新增",
            dialognewRowForm: false,
            dialogKubeRowForm: false,
            dialogKubeRowSvc: false,
            dialogKubeRowIngress: false,
            newRow: {
                env: "",
                build_type: "",
                user_list: [],
                usergroup_list: []
            },
            kubeRow: {
                pub_id: "",
                yaml_content: ""
            },
            kubeRowSvc: {
                id: "",
                name: "",
                yaml: "",
                deployment_resource_id: ""
            },
            kubeRowIngress: {
                id: "",
                name: "",
                yaml: "",
                svc_resource_id: ""
            },
            pub_loading: false,
            kube_loading: false,
            svc_loading: false,
            ingress_loading: false,
            AppData: {},
            appId: "",
            appCode: null,
            app_url: this.GLOBAL.baseUrl + "/app/detail/",
            app_resource_url: this.GLOBAL.service_tag + "/api/ams/app-resource/",
            create_yaml_url: this.GLOBAL.service_tag + "/api/ams/create-yaml/",
            temp_url: this.GLOBAL.service_tag + "/api/ams/app-kubernetes-template/",
            app_resource_kube_url: this.GLOBAL.service_tag + "/api/ams/app-resource-kubernetes/",
            app_svc_kube_url: this.GLOBAL.service_tag + "/api/ams/app-svc/",
            app_ingress_kube_url: this.GLOBAL.service_tag + "/api/ams/app-ingress/",
            projects: [],
            languages: [],
            users: [],
            envs: [],
            images: [],
            build_types: [],
            usergroups: [],
            publishData: [],
            kubeData: [],
            templates: [],
            Row: {
                name: "",
                code: "",
                git: "",
                language: "",
                owner: "",
                ignoreverifyresult: false,
            },
            limit: 10,
            page: 1,
            total: 0,
            kube_limit: 10,
            kube_page: 1,
            kube_total: 0,

            SvcData: [],
            svc_limit: 10,
            svc_page: 1,
            svc_total: 0,

            IngressData: [],
            ingress_limit: 10,
            ingress_page: 1,
            ingress_total: 0,
            temp_show: false,
            heath_check: false,
            // 校验规则
            rules: {
                groupId: [{
                    required: true,
                    message: "请选择业务域",
                    trigger: "blur"
                }],
                prodMgrId: [{
                    required: true,
                    message: "请选择产品负责人",
                    trigger: "blur"
                }, ],
                projMgrId: [{
                    required: true,
                    message: "请选择项目负责人",
                    trigger: "blur"
                }, ],
                qualityMgrId: [{
                    required: true,
                    message: "请选择项质量负责人",
                    trigger: "blur"
                }, ],
                devMgrId: [{
                    required: true,
                    message: "请选择项开发负责人",
                    trigger: "blur"
                }, ],
                testers: [{
                    required: true,
                    message: "请选择测试人员",
                    trigger: "blur"
                }, ],
                bizMgrIds: [{
                    required: true,
                    message: "请选择业务负责人",
                    trigger: "blur"
                }, ],
                devlopers: [{
                    required: true,
                    message: "请选择开发人员",
                    trigger: "blur"
                }, ],
                gitRepoUrl: [{
                    required: true,
                    message: "请输入代码仓库地址",
                    trigger: "blur"
                }, ],
                isCore: [{
                    required: true,
                    message: "请选择是否核心应用",
                    trigger: "blur"
                }, ],
                priority: [{
                    required: true,
                    message: "请选择优先级",
                    trigger: "blur"
                }, ],
                useLanguage: [{
                    required: true,
                    message: "请选择开发语言",
                    trigger: "blur"
                }, ],
                repoType: [{
                    required: true,
                    message: "请选择代码仓库类型",
                    trigger: "blur"
                }, ],
                repoUsername: [{
                    required: true,
                    message: "请选择代码仓库账号",
                    trigger: "blur"
                }, ],
                repoPassword: [{
                    required: true,
                    message: "请选择代码仓库密码",
                    trigger: "blur"
                }, ],
            },
        };
    },
    watch: {},
    methods: {
				// 跳转变更记录
		    jumpChangeReord(){
				    this.$router.push(
					    "/cicd/change-record?appId=" + this.appId + "&appCode=" + this.hpaAppCode
				    );
		    },
				initOptionsInfos(){
						let url = this.GLOBAL.baseUrl + "/product/infos";
						this.axios({
								method: "get",
								url: url,
						})
							.then((res) => {
									if (res.status === 200) {
											res.data.data.forEach((element) => {
													this.optionsInfos.push({
															value: element.id,
															label: element.name,
													});
											});
									}
							})
							.catch((err) => {
									console.log(err);
							});
				},
        openDialog() {
            if (this.activeName === "second") {
                this.hpaVisable = true;
                this.hpaType = "新增";
                this.hpaFormData = {
                    appId: "",
                    envId: "",
                    namespace: "",
                    minReplicas: null,
                    maxReplicas: "",
                    resourceName: "",
                    targetAverageUtilization: null,
                };
            } else if (this.activeName === "third") {
                this.dependVisbale = true;
            } else if (this.activeName === "fourth") {
                this.dependVisbale = true;
            }
        },
        handleClose() {
            if (this.activeName === "second") {
                this.hpaVisable = false;
            } else {
                this.dependVisbale = false;
            }
        },
        handleSure() {
            if (this.activeName === "second") {
                this.hpaVisable = false;
                this.getHpaList();
            } else {
                this.dependVisbale = false;
                this.getDependList();
            }
        },
        handleClick(e) {
            if (e.name === "second") {
                this.getHpaList();
            } else if (e.name === "third") {
                this.getDependList();
            } else if (this.activeName === "fourth") {
                this.loadGitGrantInfo();
            } else if (this.activeName === "five") {
                this.loadHealthyCheckInfos()
                this.loadHealthyPage();
            }
        },

        // hpa操作
        handleOperationClick(e) {
            let {
                row,
                handleType
            } = e;
            if (handleType === "modify") {
                this.hpaType = "修改";
                this.hpaVisable = true;
                this.hpaFormData = JSON.parse(JSON.stringify(row));
            } else {
                this.$confirm("是否确认删除该数据?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        if (this.activeName === "second") {
                            this.deleteHpa(row);
                        } else if (this.activeName === "third") {
                            this.deleteDepend(row);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除",
                        });
                    });
            }
        },
        // 获取动态扩缩容
        async getHpaList() {
            let params = {
                appId: this.hpaAppCode,
            };
            let res = await hpaListApi(params, this.appId);
            let {
                code,
                data
            } = res;
            if (code === 200) {
                if (data && data.length) {
                    data.map((item) => {
                        item.operationList = [{
                                name: "修改",
                                value: "modify"
                            },
                            {
                                name: "删除",
                                value: "delete"
                            },
                        ];
                    });
                }
                this.tableData = data || [];
            }
        },

        // 获取依赖列表
        async getDependList() {
            let res = await getDependAPi(this.hpaAppCode, this.appId);
            let {
                code,
                data
            } = res;
            if (code === 200) {
                if (data && data.length) {
                    data.map((item) => {
                        item.operationList = [{
                            name: "删除",
                            value: "delete"
                        }];
                    });
                }
                this.dependTable = data || [];
            }
        },

        // 删除依赖
        async deleteDepend(row) {
            let res = await deleteDependAPi(row.id, this.appId);
            let {
                code,
                message
            } = res;
            if (code === 200) {
                this.$message({
                    message,
                    type: "success",
                });
                this.getDependList();
            }
        },

        // 删除hpa请求
        async deleteHpa(row) {
            let res = await deleteHpaAPi(row);
            let {
                code,
                message
            } = res;
            if (code === 200) {
                this.$message({
                    message,
                    type: "success",
                });
                this.getHpaList();
            }
        },
        //关键字搜索租户成员
        getTenantMembersByKeyword(keyword) {
            this.domainMemberOptions = [];
            let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        res.data.data.forEach((element) => {
                            this.domainMemberOptions.push({
                                value: element.selectKey,
                                label: element.selectValue,
                            });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //清空关键字搜索租户成员结果
        clearDomainMemberOptions() {
            this.domainMemberOptions = [];
        },

        UpdateApp() {
            this.$refs.appBasicDetailForm.validate(async (valid) => {
                if (valid) {
                    let postForm = {
                        id: this.form.id,
                        tenantId: this.form.tenantId,
                        groupId: this.form.groupId,
                        code: this.form.code,
                        priority: this.form.priority,
                        description: this.form.description,
                        labels: this.form.labels,
		                    prodId: this.form.prodId,
                        projMgrId: this.form.projMgrId,
                        prodMgrId: this.form.prodMgrId,
                        qualityMgrId: this.form.qualityMgrId,
                        devMgrId: this.form.devMgrId,
                        useLanguage: this.form.useLanguage,
                        gitRepoUrl: this.form.gitRepoUrl,
                        isCore: this.form.isCore,
                        resource: this.form.resource,
                        envFlog: this.form.envFlog,
                        testers: [],
                        devlopers: [],
                        bizMgrId: [],
                        repoType: this.form.repoType,
                        repoUsername: this.form.repoUsername,
                        repoPassword: this.form.repoPassword,
                    };
                    if (this.form.testers.length !== 0) {
                        postForm.testers = this.form.testers.toString();
                    }
                    if (this.form.devlopers.length !== 0) {
                        postForm.devlopers = this.form.devlopers.toString();
                    }
                    if (this.form.bizMgrIds.length !== 0) {
                        postForm.bizMgrId = this.form.bizMgrIds.toString();
                    }
                    let url = this.GLOBAL.baseUrl + "/app/detail/update/id";
                    this.axios({
                            method: "put",
                            url: url,
                            data: postForm,
                        })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$notify({
                                    title: "成功",
                                    message: "数据修改成功",
                                    type: "success",
                                });
                                this.$router.push(
                                    "/cicd/app-detail?appId=" +
                                    postForm.id +
                                    "&owner=" +
                                    postForm.devlopers
                                );
                            } else {
                                this.$alert(res.data.message, "提示", {
                                    type: "warning",
                                });
                            }
                        })
                        .catch((err) => {
                            alert(err);
                        });
                }
            });
        },
        clearYamlContent: function () {
            this.kubeRow.yaml_content = "";
        },

        GetTemplatesData: function (url) {
            const parms = {
                pageSize: 500,
                pageNumber: 1
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.templates = response.data.data;
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        // 通过appId获取应用基础信息
        GetAppData: function (url) {
            this.axios({
                    method: "GET",
                    url: url,
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        this.form = response.data.data;
                        if (!this.isEmpty(response.data.data.testers)) {
                            this.form.testers = response.data.data.testers.split(",");
                        }
                        if (!this.isEmpty(response.data.data.devlopers)) {
                            this.form.devlopers = response.data.data.devlopers.split(",");
                        }
                        if (!this.isEmpty(response.data.data.bizMgrId)) {
                            this.form.bizMgrIds = response.data.data.bizMgrId.split(",");
                        }
                        //产品负责人prodMgrId、项目负责人projMgrId、质量负责人qualityMgrId、开发人员devlopers、测试人员testers
                        let accountIdList = [];
                        accountIdList.push(response.data.data.prodMgrId);
                        accountIdList.push(response.data.data.projMgrId);
                        accountIdList.push(response.data.data.qualityMgrId);
                        accountIdList.push(response.data.data.devMgrId);
                        Array.prototype.push.apply(accountIdList, this.form.testers);
                        Array.prototype.push.apply(accountIdList, this.form.devlopers);
                        Array.prototype.push.apply(accountIdList, this.form.bizMgrIds);
                        this.getSelectedMember(accountIdList);
                        this.getSelectData();
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        getSelectedMember(accountIdList) {
            let url = this.GLOBAL.baseUrl + "/user/accountinfo";
            this.axios({
                    method: "POST",
                    url: url,
                    data: accountIdList,
                })
                .then((res) => {
                    if (res.status === 200) {
                        res.data.data.forEach((element) => {
                            this.domainMemberOptions.push({
                                value: element.id,
                                label: element.nickname + "-" + element.loginName,
                            });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        getSelectData() {
            let url = this.GLOBAL.baseUrl + "/app/init/updateAppDetailSelectData";
            this.axios({
                    method: "GET",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        if (res.data && res.data.data && res.data.data.teamOptions) {
                            //所属业务域下拉列表
                            res.data.data.teamOptions.forEach((element) => {
                                this.teamOptions.push({
                                    groupId: element.selectKey,
                                    groupIdStr: element.selectValue,
                                });
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        isEmpty(obj) {
            var nobj;
            if (nobj !== undefined) {
                nobj = obj.trim();
            } else {
                nobj = obj;
            }
            return (
                typeof obj === "undefined" ||
                obj === null ||
                obj === "" ||
                nobj.length == 0
            );
        },

        // 更新应用基础信息
        updateApp: function (url) {
            this.$refs.Row.validate((valid) => {
                if (valid) {
                    this.Row.ignoreverifyresult = !this.heath_check;
                    this.axios({
                            method: "PUT",
                            url: url,
                            data: this.Row,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.$message.success(response.data.message);
                            } else {
                                this.$message.error(response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                        });
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        // 通过appId获取应用发布管理信息
        GetAppResourceData: function (url) {
            const parms = {
                pageSize: this.limit,
                pageNumber: this.page,
                appId: this.appId,
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.publishData = response.data.data;
                        this.envs = response.data.envs;
                        this.usergroups = response.data.usergroups;
                        this.build_types = response.data.build_types;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        // 通过appid 获取应用对应环境的kube deployment信息
        GetAppResourceKubeData: function (url) {
            const parms = {
                pageSize: this.kube_limit,
                pageNumber: this.kube_page,
                appId: this.appId,
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.kubeData = response.data.data;
                        this.kube_total = response.data.total;
                        for (let i = 0; this.kubeData.length > i, i++;) {
                            try {
                                this.kubeData[i]["label_app"] = JSON.parse(
                                    this.kubeData[i].yaml_content
                                ).metadata.labels.app;
                            } catch (err) {
                                this.$message.error(
                                    this.kubeData[i].name + ",无状态配置解析错误"
                                );
                            }
                        }
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        // 通过appid 获取应用对应环境的kube svc信息
        GetAppKubeSvcData: function (url) {
            const parms = {
                pageSize: this.svc_limit,
                pageNumber: this.svc_page,
                appId: this.appId,
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.SvcData = response.data.data;
                        this.svc_total = response.data.total;
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        // 通过appid 获取应用对应环境的kube ingress信息
        GetAppKubeIngressData: function (url) {
            const parms = {
                pageSize: this.ingress_limit,
                pageNumber: this.ingress_page,
                appId: this.appId,
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.IngressData = response.data.data;
                        this.ingress_total = response.data.total;
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        //提示删除确认动作app Resource
        seletctDelAppResourceRow: function (row, url) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.delAppResourceRow(url, row);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        //删除app Resource
        delAppResourceRow: function (url, row) {
            this.pub_loading = true;
            let parms = {
                rows: [row.id]
            };
            this.axios({
                    method: "DELETE",
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.$message.success(response.data.message);
                        this.GetAppResourceData(this.app_resource_url);
                        this.GetAppResourceKubeData(this.app_resource_kube_url);
                    } else {
                        this.$message.error(response.data.error);
                    }
                    this.pub_loading = false;
                })
                .catch((response) => {
                    this.$message.error(String(response));
                    this.pub_loading = false;
                });
        },

        //添加 或 更新 app 发布管理 Resource
        addEditAppResourceRow: function (url, method) {
            this.$refs.newRow.validate((valid) => {
                if (valid) {
                    let parms = {
                        app_id: this.appId,
                        env: this.newRow.env,
                        usergroup_list: this.newRow.usergroup_list,
                        user_list: this.newRow.user_list,
                        build_type: this.newRow.build_type,
                    };
                    if (method === "PUT") {
                        parms.id = this.newRow.id;
                    }
                    this.axios({
                            method: method,
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.dialognewRowForm = false;
                                this.$message.success(response.data.message);
                                this.GetAppResourceData(this.app_resource_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                        });
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        // 生成yaml配置
        CreateYAML: function (url, method) {
            if (
                !this.kubeRow.pub_id ||
                !this.AppData.code ||
                !this.template_id ||
                !this.Row.project
            ) {
                return this.$message.error("缺少环境或模板或项目参数!");
            }
            let env = "";
            for (var i = 0; i < this.publishData.length; ++i) {
                if (this.publishData[i].id === this.kubeRow.pub_id) {
                    env = this.publishData[i].env;
                }
            }
            let parms = {
                id: this.template_id,
                args: {
                    env: env,
                    project: this.Row.project,
                    appCode: this.AppData.code,
                },
            };
            this.axios({
                    method: method,
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.kubeRow.yaml_content = response.data.data.yaml_config;
                        this.$message.success(response.data.message);
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        GetSvcYaml: function (url, method) {
            if (
                !this.kubeRowSvc.deployment_resource_id ||
                !this.AppData.code ||
                !this.template_id
            ) {
                return this.$message.error("缺少模板或无状态选项参数!");
            }
            let yaml_text = "";
            for (let i = 0; i < this.kubeData.length; ++i) {
                if (this.kubeData[i].id === this.kubeRowSvc.deployment_resource_id) {
                    yaml_text = this.kubeData[i].deploy_yaml;
                }
            }
            let tmp = JSON.parse(yaml_text);
            let parms = {
                id: this.template_id,
                args: {
                    appCode: this.AppData.code,
                    deployment_name: tmp.metadata.labels.app,
                    namespace: tmp.metadata.namespace,
                },
            };
            this.axios({
                    method: method,
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.kubeRowSvc.yaml = response.data.data.yaml_config;
                        this.$message.success(response.data.message);
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        GetIngressYaml: function (url, method) {
            if (
                !this.kubeRowIngress.svc_resource_id ||
                !this.AppData.code ||
                !this.template_id ||
                !this.domain_ingress
            ) {
                return this.$message.error("缺少模板、域名或服务选项参数!");
            }
            let yaml_text = "";
            for (let i = 0; i < this.SvcData.length; ++i) {
                if (this.SvcData[i].id === this.kubeRowIngress.svc_resource_id) {
                    yaml_text = this.SvcData[i].yaml;
                }
            }
            let tmp = JSON.parse(yaml_text);
            let parms = {
                id: this.template_id,
                args: {
                    appCode: this.AppData.code,
                    svc_name: tmp.metadata.name,
                    namespace: tmp.metadata.namespace,
                    domain: this.domain_ingress,
                },
            };
            this.axios({
                    method: method,
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.kubeRowIngress.yaml = response.data.data.yaml_config;
                        this.$message.success(response.data.message);
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        //添加 或 更新 kube Resource
        updateAppResourceKube: function (url, method) {
            this.$refs.kubeRow.validate((valid) => {
                if (valid) {
                    let data_json;
                    try {
                        data_json = YAML.parse(this.kubeRow.yaml_content, {});
                    } catch (err) {
                        this.$message.error({
                            message: String(err)
                        });
                        return;
                    }
                    let parms = {
                        deploy_yaml_json: data_json,
                        app_resource_id: this.kubeRow.pub_id,
                    };
                    if (method === "PUT") {
                        parms.id = this.kubeRow.id;
                    }
                    this.axios({
                            method: method,
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.dialogKubeRowForm = false;
                                this.$message.success(response.data.message);
                                this.GetAppResourceKubeData(this.app_resource_kube_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                        });
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        //添加 或 更新 kube Resource svc
        updateAppResourceSvc: function (url, method) {
            this.$refs.kubeRowSvc.validate((valid) => {
                if (valid) {
                    let data_json;
                    try {
                        data_json = YAML.parse(this.kubeRowSvc.yaml, {});
                    } catch (err) {
                        this.$message.error({
                            message: String(err)
                        });
                        return;
                    }
                    let parms = {
                        deploy_yaml_json: data_json,
                        deployment_resource_id: this.kubeRowSvc.deployment_resource_id,
                    };
                    if (method === "PUT") {
                        parms.id = this.kubeRowSvc.id;
                    }
                    this.axios({
                            method: method,
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.dialogKubeRowSvc = false;
                                this.$message.success(response.data.message);
                                this.GetAppKubeSvcData(this.app_svc_kube_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                        });
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        //添加 或 更新 kube Resource ingress
        updateAppResourceIngress: function (url, method) {
            this.$refs.kubeRowIngress.validate((valid) => {
                if (valid) {
                    let data_json;
                    try {
                        data_json = YAML.parse(this.kubeRowIngress.yaml, {});
                    } catch (err) {
                        this.$message.error({
                            message: String(err)
                        });
                        return;
                    }
                    let parms = {
                        deploy_yaml_json: data_json,
                        svc_resource_id: this.kubeRowIngress.svc_resource_id,
                    };
                    if (method === "PUT") {
                        parms.id = this.kubeRowIngress.id;
                    }
                    this.axios({
                            method: method,
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.dialogKubeRowIngress = false;
                                this.$message.success(response.data.message);
                                this.GetAppKubeIngressData(this.app_ingress_kube_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                        });
                } else {
                    this.$message.warning("请输入合法数据");
                }
            });
        },

        //删除app kube Resource
        delAppResourceKubeRow: function (url, row) {
            this.kube_loading = true;
            let parms = {
                rows: [row.id]
            };
            this.axios({
                    method: "DELETE",
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.$message.success(response.data.message);
                        this.GetAppResourceData(this.app_resource_url);
                        this.GetAppResourceKubeData(this.app_resource_kube_url);
                    } else {
                        this.$message.error(response.data.error);
                    }
                    this.kube_loading = false;
                })
                .catch((response) => {
                    this.$message.error(String(response));
                    this.kube_loading = false;
                });
        },

        //提示删除确认动作kube
        seletctDelKubeResourceRow: function (row, url) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.delAppResourceKubeRow(url, row);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        //提示删除确认动作kube Svc
        seletctDelKubeSvcRow: function (row, url) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.svc_loading = true;
                    let parms = {
                        rows: [row.id]
                    };
                    this.axios({
                            method: "DELETE",
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.$message.success(response.data.message);
                                this.GetAppKubeSvcData(this.app_svc_kube_url);
                                this.GetAppKubeIngressData(this.app_ingress_kube_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                            this.svc_loading = false;
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                            this.svc_loading = false;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },

        //提示删除确认动作kube Ingress
        seletctDelKubeIngressRow: function (row, url) {
            this.$confirm("此操作将永久删除路由该数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    this.ingress_loading = true;
                    let parms = {
                        rows: [row.id]
                    };
                    this.axios({
                            method: "DELETE",
                            url: url,
                            data: parms,
                        })
                        .then((response) => {
                            if (response.data.status) {
                                this.$message.success(response.data.message);
                                this.GetAppKubeIngressData(this.app_ingress_kube_url);
                            } else {
                                this.$message.error(response.data.error);
                            }
                            this.ingress_loading = false;
                        })
                        .catch((response) => {
                            this.$message.error(String(response));
                            this.ingress_loading = false;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },

        // 显示应用发布管理对话框
        showAddPub: function () {
            this.newTitle = "新增";
            this.dialognewRowForm = true;
            this.newRow.id = "";
            this.newRow.env = "";
            this.newRow.build_type = "";
            this.newRow.user_list = [];
            this.newRow.usergroup_list = [];
        },

        showEditPub: function (row) {
            this.newTitle = "编辑";
            this.dialognewRowForm = true;
            this.newRow.id = row.id;
            this.newRow.env = row.env;
            this.newRow.build_type = row.build_type;
            if (row.user_list) {
                var tgts = row.user_list.map(function (val) {
                    return Number(val.users__id);
                });
            } else {
                tgts = "";
            }
            if (row.usergroup_list) {
                var groups = row.usergroup_list.map(function (val) {
                    return Number(val.user_group__id);
                });
            } else {
                groups = "";
            }
            this.newRow.user_list = tgts;
            this.newRow.usergroup_list = groups;
        },

        // 显示应用kube管理对话框
        showAddKube: function () {
            this.newTitle = "新增无状态";
            this.dialogKubeRowForm = true;
            this.kubeRow.pub_id = "";
            this.kubeRow.id = "";
            this.kubeRow.yaml_content = "";
            this.kube_env_disabled = false;
            this.temp_show = true;
            this.template_id = "";
        },

        showEditKube: function (row) {
            this.temp_show = false;
            this.kube_env_disabled = true;
            this.newTitle = "编辑无状态";
            this.dialogKubeRowForm = true;
            this.kubeRow.id = row.id;
            this.kubeRow.pub_id = row.app_resource__id;
            if (row.deploy_yaml) {
                this.kubeRow.yaml_content = YAML.stringify(JSON.parse(row.deploy_yaml));
            } else {
                this.kubeRow.yaml_content = "";
            }
        },

        // 显示应用kube Svc管理对话框
        showAddSvc: function () {
            this.newTitle = "新增服务";
            this.dialogKubeRowSvc = true;
            this.kubeRow.pub_id = "";
            this.kubeRowSvc.id = "";
            this.kubeRowSvc.yaml = "";
            this.kube_env_disabled = false;
            this.temp_show = true;
            this.template_id = "";
        },

        showEditSvc: function (row) {
            this.temp_show = false;
            this.kube_env_disabled = true;
            this.newTitle = "编辑服务";
            this.dialogKubeRowSvc = true;
            this.kubeRowSvc.id = row.id;
            this.kubeRowSvc.name = row.name;
            this.kubeRowSvc.deployment_resource_id = row.deployment_resource_id;
            if (row.yaml) {
                this.kubeRowSvc.yaml = YAML.stringify(JSON.parse(row.yaml));
            } else {
                this.kubeRowSvc.yaml = "";
            }
        },

        // 显示应用kube ingress管理对话框
        showAddIngress: function () {
            this.newTitle = "新增路由";
            this.dialogKubeRowIngress = true;
            this.domain_ingress = "";
            this.kubeRowIngress.svc_resource_id = "";
            this.kubeRowIngress.id = "";
            this.kubeRowIngress.yaml = "";
            this.kube_env_disabled = false;
            this.temp_show = true;
            this.template_id = "";
        },

        showEditIngress: function (row) {
            this.temp_show = false;
            this.kube_env_disabled = true;
            this.newTitle = "编辑路由";
            this.dialogKubeRowIngress = true;
            this.kubeRowIngress.id = row.id;
            this.kubeRowIngress.name = row.name;
            this.kubeRowIngress.svc_resource_id = row.svc_resource_id;
            if (row.yaml) {
                this.kubeRowIngress.yaml = YAML.stringify(JSON.parse(row.yaml));
            } else {
                this.kubeRowIngress.yaml = "";
            }
        },

        Apply: function (row, url) {
            let parms = {
                yaml_json: JSON.parse(row.yaml),
                tgt_id: row.id,
                apply: "apply",
            };
            this.axios({
                    method: "POST",
                    url: url,
                    data: parms,
                })
                .then((response) => {
                    if (response.data.status) {
                        this.$message.success(response.data.message);
                    } else {
                        this.$message.error(response.data.error);
                    }
                })
                .catch((response) => {
                    this.$message.error(String(response));
                });
        },

        // 返回上一页
        goBack: function () {
            // this.$router.push('/cicd/app.html?appCode='+this.Row.code)
            // this.$router.push("/cicd/app-detail?appId=" + this.appId);
            window.history.back();
        },
        loadGitGrantInfo() {
            this.loading = true;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/grant/git/loadMembers/" + this.appId,
                    method: "GET",
                })
                .then((response) => {
                    this.loading = false;
                    if (response.data.code == 200) {
                        this.gitGrabtTableData = response.data.data;
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
        bindGitGrand() {
            this.showGitForm = true;
            this.gitFormtitle = "增加Git用户";
            this.gitGrantForm.gitUserId = "";
            this.gitGrantForm.roleNumber = "";
            this.gitRoleOptions = [{
                    value: 10,
                    label: "Guest",
                },
                {
                    value: 20,
                    label: "Reporter",
                },
                {
                    value: 30,
                    label: "Developer",
                }
            ]
        },
        changeGitGrant(item) {
            this.showGitForm = true;
            this.searchGitUserOptions = [];
            this.gitFormtitle = "更改Git角色";
            this.gitGrantForm.gitUserId = parseInt(item.grantGitUserId);
            this.gitGrantForm.roleNumber = parseInt(item.grantGitRole);
            this.gitGrantForm.roleNumber = parseInt(item.grantGitRole);
            this.gitGrantForm.gitUserCode = item.grantGitUserCode;
            this.searchGitUserOptions.push({
                label: item.grantGitUserCode,
                value: item.grantGitUserId,
            });
            this.gitRoleOptions = [{
                    value: 10,
                    label: "Guest",
                },
                {
                    value: 20,
                    label: "Reporter",
                },
                {
                    value: 30,
                    label: "Developer",
                },
                {
                    value: 40,
                    label: "Maintainer",
                },
                {
                    value: 50,
                    label: "Owner",
                },
                {
                    value: 60,
                    label: "Admin",
                },
            ]
        },
        deleteGitGrant(item) {
            var that = this;
            this.gitGrantForm.gitUserId = parseInt(item.grantGitUserId);
            this.gitGrantForm.roleNumber = parseInt(item.grantGitRole);
            this.gitGrantForm.devopsAppId = this.appId;
            this.gitGrantForm.gitUserCode = item.grantGitUserCode;
            this.$confirm("是否确认删除该用户,如果确认无误，请点击确认?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    that
                        .axios({
                            url: that.GLOBAL.baseUrl + "/grant/git/deleteGitMember",
                            data: that.gitGrantForm,
                            method: "POST",
                        })
                        .then((response) => {
                            console.log(response);
                            if (response.data.code == 200) {
                                that.$message({
                                    message: "您的删除请求已经成功提交，请留意后续审批结果",
                                    type: "success",
                                });
                                that.loadGitGrantInfo();
                                that.showGitForm = false;
                            } else {
                                this.$message({
                                    type: "error",
                                    message: response.data.message,
                                });
                                this.loadGitGrantInfo();
                                this.showGitForm = false;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        searchGitUser(query) {
            var that = this;
            this.searchGitUserOptions = [];
            this.axios({
                    url: this.GLOBAL.baseUrl +
                        "/grant/git/searchGitMembers/" +
                        query +
                        "/" +
                        this.appId,
                    method: "GET",
                })
                .then((response) => {
                    console.log(response);
                    if (response.data.code == 200) {
                        response.data.data.forEach((u) => {
                            that.searchGitUserOptions.push({
                                label: u.name,
                                value: u.id,
                            });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        goTaskCenter() {
            this.$router.push("/taskCenter");
        },
        onSubmitGitGrant() {
            if (this.gitGrantForm.gitUserId == undefined) {
                this.$message.warning("Git User必填");
                return;
            }
            if (this.gitGrantForm.roleNumber == undefined) {
                this.$message.warning("授权角色必选");
                return;
            }
            this.gitGrantForm.devopsAppId = this.appId;
            var requestUIrl = "";
            if (this.gitFormtitle === "增加Git用户") {
                requestUIrl = this.GLOBAL.baseUrl + "/grant/git/addGitMember";
                var gitUser = this.searchGitUserOptions.filter((u) => {
                    return u.value == this.gitGrantForm.gitUserId;
                });
                if (gitUser != undefined && gitUser != null && gitUser.length > 0) {
                    this.gitGrantForm.gitUserCode = gitUser[0].label;
                }

                //check User
                var contianUser = this.gitGrabtTableData.filter((u) => {
                    return u.grantGitUserCode == this.gitGrantForm.gitUserCode;
                });

                if (
                    contianUser != undefined &&
                    contianUser != null &&
                    contianUser.length > 0
                ) {
                    this.$message({
                        type: "error",
                        message: this.gitGrantForm.gitUserCode + "已经在当前项目中无需审批",
                    });
                    return
                }
            }
            if (this.gitFormtitle === "更改Git角色") {
                requestUIrl = this.GLOBAL.baseUrl + "/grant/git/updateGitMember";
            }
            this.axios({
                    url: requestUIrl,
                    data: this.gitGrantForm,
                    method: "POST",
                })
                .then((response) => {
                    console.log(response);
                    if (response.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: "数据提交成功，请留意后续审批结果",
                        });
                        this.loadGitGrantInfo();
                        this.showGitForm = false;
                    } else {
                        this.$message({
                            type: "error",
                            message: response.data.message,
                        });
                        this.loadGitGrantInfo();
                        this.showGitForm = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        loadGitTabShowPermission() {
            //允许新智和info
            let allowTenants = ['1369923265280311297', '1371750490517663745']
            var tenantId = localStorage.getItem("originTenantId")
            if (allowTenants.indexOf(tenantId) > -1) {
                this.showGitTab = true
            }
        },
        bindHealthyCheck() {
            this.showHeathyForm = true;
        },
        loadHealthyCheckInfos() {
            this.loading = true;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app/healthy/check/loadHealthy/" + this.appId,
                    method: "GET",
                })
                .then((response) => {
                    this.loading = false;
                    if (response.data.code == 200) {
                        this.healthyConfigTableData = response.data.data
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
        changeHealthCheck(row) {
            this.healthyForm = row;
            this.showHeathyForm = true;
            this.healthyFormtitle = "更改健康检查配置"

        },
        deleteHealthCheck(item) {
            var that = this;

            this.$confirm("是否确认删除健康检查配置信息,如果确认无误，请点击确认?调整配置将于部署过程中生效", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    that
                        .axios({
                            url: that.GLOBAL.baseUrl + "/app/healthy/check/delete/" + item.id,
                            method: "GET",
                        })
                        .then((response) => {
                            console.log(response);
                            if (response.data.code == 200) {
                                that.$message({
                                    message: "数据删除成功",
                                    type: "success",
                                });
                                this.loadHealthyCheckInfos();
                                this.loadHealthyPage();
                                this.showHeathyForm = false;
                            } else {
                                this.$message({
                                    type: "error",
                                    message: response.data.message,
                                });
                                this.loadHealthyCheckInfos();
                                this.loadHealthyPage();
                                this.showHeathyForm = false;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        loadHealthyPage() {
            var that = this;
            const parms = {
                pageSize: this.loglimit,
                pageNumber: this.logPage,
                appId: this.appId
            };
            this
                .axios({
                    url: that.GLOBAL.baseUrl + "/app/healthy/check/loadHealthyChangeLog",
                    method: "POST",
                    data: parms
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        this.healthyCheckLogList = response.data.data.list;
                        this.logTotal = response.data.data.total;
                    } else {
                        this.$message.error(response.data.error);
                    }

                    console.log(response)

                })
                .catch((err) => {
                    console.log(err);
                });

        },
        onHealthyCheckSubmit() {

            if (this.healthyForm.url == "" || this.healthyForm.url == undefined) {
                this.$message.warning("URL必选");
                return;
            }
            if (this.healthyForm.port == "" || this.healthyForm.port == undefined) {
                this.$message.warning("端口必选");
                return;
            }
            if (this.healthyForm.url.indexOf("/") != 0) {
                this.$message.warning("URL填写有误，必须以/开头");
                return;
            }

            var requestUrl = this.GLOBAL.baseUrl + "/app/healthy/check/save";
            this.healthyForm.appId = this.appId;
            this.healthyForm.appCode = this.hpaAppCode;
            if (this.healthyFormtitle == "更改健康检查配置") {
                requestUrl = this.GLOBAL.baseUrl + "/app/healthy/check/update";
            }
            this.axios({
                    url: requestUrl,
                    data: this.healthyForm,
                    method: "POST",
                })
                .then((response) => {
                    console.log(response);
                    this.healthyForm = {};
                    if (response.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: "数据提交成功",
                        });
                        this.loadHealthyCheckInfos();
                        this.loadHealthyPage();
                        this.showHeathyForm = false;
                    } else {
                        this.$message({
                            type: "error",
                            message: response.data.message,
                        });
                        this.loadHealthyCheckInfos();
                        this.loadHealthyPage();
                        this.showHeathyForm = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    computed: {},
    mounted() {
        this.enable_info = this.common.hasPermission(this.$store.state.user.roles, [
            "cicd_admin",
            "devops",
        ]);
        this.appId = String(this.$route.query.appId);
        this.hpaAppCode = this.$route.query.appCode;
        this.GetAppData(this.app_url + this.appId);
        // this.GetAppResourceData(this.app_resource_url);
        // this.GetAppResourceKubeData(this.app_resource_kube_url);
        // this.GetTemplatesData(this.temp_url);
        // this.GetAppKubeSvcData(this.app_svc_kube_url);
        // this.GetAppKubeIngressData(this.app_ingress_kube_url);
        this.loadGitTabShowPermission();
        if (this.activeName === "third") {
            this.getDependList();
        }
        if (this.activeName === "fourth") {
            this.loadGitGrantInfo();
        }
        if (this.activeName === "five") {
            this.loadHealthyCheckInfos();
            this.loadHealthyPage();
        }

        var setAppIdCodeLength=6;
        var currenAppIdCodeLength=this.appId.length;
        var leftLength=6-currenAppIdCodeLength;
        var preZero="";
        for (var i=0; i <leftLength; i++) {
           preZero +="0";
        }
        this.appIdCode=preZero +this.appId
		    
		    // 获取所属产品
		    this.initOptionsInfos();
    },
    components: {
        "table-box": Table,
        pagination: pagination,
        EnnTable,
        HpaDialog,
        DependDialog,
		    messageNotification,
    },
};
</script>

<style lang="scss" scoped>
.edit-form .el-select {
    width: 100%;
}

.edit-form {
    flex: 1;
    overflow-y: auto;
}

.card-panel {
    background: white;
    padding: 24px;
    height: calc(100% - 80px);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    box-sizing: border-box;
}

.card-panel {
    /deep/ .el-tabs__content {
        height: 100%;
    }
}

.card-panel .footer {
    margin-top: 30px;
    justify-content: flex-end;
}

.header {
    margin-bottom: 15px;
}

.header .el-icon-arrow-left {
    font-size: 16px;
    margin-right: 8px;
    color: #343a40;
    cursor: pointer;
}

.header span {
    font-size: 14px;
    color: #343a40;
}

.my-tab,
.table-box {
    flex: 1;
    overflow-y: auto;
}

.my-pane {
    height: 100%;
}

.el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
