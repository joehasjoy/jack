<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane name="histroy-list">
                <span slot="label"><i class="el-icon-folder-checked"></i> 历史记录</span>
                <div class="left-panel-q">
                    <div class="header flex-center-between">
                        <div class="back-box flex flex-align-items-center" @click="goBack">
                            <i class="el-icon-arrow-left"></i> {{ appCode }}
                        </div>
		
		                    <el-button circle icon="el-icon-plus" style="margin-bottom: 10px;" size="mini"
		                               @click="addBuildQuality">
		                    </el-button>
                    </div>
		                
                    <el-table ref="singleTable" :data="histroyList" :highlight-current-row="true"
                        @current-change="ClickAppVersionRow">
                        <el-table-column label="序号" type="index" align="center"> </el-table-column>
                        <el-table-column label="操作人员" prop="createBy" align="center"></el-table-column>
                        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
                        <el-table-column label="构建用时" prop="duration" align="center"></el-table-column>

                        <el-table-column label="构建状态" prop="status" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.status == 'UNSTART'">
                                    <i style="color: #85ce61" class="el-icon-time"></i> <span
                                        style="margin-left:2px;font-size: 14px">排队中</span>
                                </div>
                                <div v-if="scope.row.status == 'BUILDING'">
                                    <i style="color: #85ce61" class="el-icon-loading"></i> <span
                                        style="margin-left:2px;font-size: 14px">构建中</span>
                                </div>
                                <div v-if="scope.row.status == 'SUCCESS'">
                                    <i style="color: #85ce61" class="el-icon-success"></i> <span
                                        style="margin-left:2px;font-size: 14px">成功</span>
                                </div>

                                <div v-if="scope.row.status == 'FAILURE'">
                                    <i style="color: red" class="el-icon-error"></i> <span
                                        style="margin-left:2px;font-size: 14px">失败</span>
                                </div>
                                <div v-if="scope.row.status == 'ABORTED'">
                                    <i style="color:red" class="el-icon-remove-outline"></i> <span
                                        style="margin-left:2px;font-size: 14px">取消</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100px" align="">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-plus" type="text" @click="lookInfo(scope.row)">
                                    查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <pagination :small="false" :total="total" :page.sync="page" :limit.sync="limit"
                        @pagination="loadBuildHistory()"></pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane name="integrate-info" label="集成">
                <span slot="label"><i class="el-icon-s-home"></i> 立即集成</span>
                <div class="right-panel-q">
                    <div class="box">
                        <div class="row flex-center-between">
                            <div class="title-box flex flex-align-items-center">
                                <div class="bar"></div>
                                基本信息
                            </div>
                            <div class="refresh-box flex flex-align-items-center">
                                <!-- <i class="el-icon-refresh"></i> -->
                                <!-- <span style="margin-right: 10px" @click="refreshPageData()">刷新</span>
                                <el-button circle icon="el-icon-plus" style="margin-bottom: 10px;" size="mini"
                                    @click="showStartNewPipeline">
                                </el-button>-->
                            </div>
                        </div>
                        <div>
                            <el-descriptions direction="horizontal" :column="1" border
                                :labelStyle="{ 'text-align': 'center', 'width': '180px' }">
                                <el-descriptions-item label="创建时间">{{ cur_build_row.createTime }}</el-descriptions-item>
                                <el-descriptions-item label="构建用户">{{ cur_build_row.createdBy }}</el-descriptions-item>
                                <el-descriptions-item label="构建用时">{{ cur_build_row.duration }}</el-descriptions-item>
                                <el-descriptions-item label="构建状态">
                                    <div v-if="cur_build_row.buildStatus == 'UNSTART'">
                                        <i style="color: #85ce61" class="el-icon-time"></i> <span
                                            style="margin-left:2px;font-size: 14px">排队中</span>
                                    </div>
                                    <div v-if="cur_build_row.buildStatus == 'BUILDING'">
                                        <i style="color: #85ce61" class="el-icon-loading"></i> <span
                                            style="margin-left:2px;font-size: 14px">构建中</span>
                                    </div>
                                    <div v-if="cur_build_row.buildStatus == 'SUCCESS'">
                                        <i style="color: #85ce61" class="el-icon-success"></i> <span
                                            style="margin-left:2px;font-size: 14px">成功</span>
                                    </div>

                                    <div v-if="cur_build_row.buildStatus == 'FAILURE'">
                                        <i style="color: red" class="el-icon-error"></i> <span
                                            style="margin-left:2px;font-size: 14px">失败</span>
                                    </div>
                                    <div v-if="cur_build_row.buildStatus == 'ABORTED'">
                                        <i style="color: red" class="el-icon-remove-outline"></i> <span
                                            style="margin-left:2px;font-size: 14px">取消</span>
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item label="流水线配置">
                                    <el-button type="text" @click="goPipelineDesign">{{ pipline_name }}</el-button>
                                </el-descriptions-item>
		                            <!-- <el-descriptions-item label="构建操作"
																		v-if="cur_build_row.buildStatus == 'UNSTART' || cur_build_row.buildStatus == 'BUILDING'">
																		<el-button type="text">点击取消</el-button>
																</el-descriptions-item> -->
                                <el-descriptions-item label="已选择镜像" v-if="deployment_env != undefined">
                                    <el-tag type="danger">
                                        ecr-online.enncloud.cn/devops-jenkins/{{ appCode }}:{{
                                                this.cur_build_row.buildUuid
                                        }}
                                    </el-tag>
                                </el-descriptions-item>

                                <!-- 接口测试 -->
                                <el-descriptions-item label="总用例数" v-if="testingObj.interfaceVisible">
                                    {{ testingObj.totalCount }}
                                </el-descriptions-item>
                                <el-descriptions-item label="通过用例数" v-if="testingObj.interfaceVisible">
                                    {{ testingObj.successCount }}
                                </el-descriptions-item>
                                <el-descriptions-item label="失败用例数" v-if="testingObj.interfaceVisible">
                                    {{ testingObj.failCount }}
                                </el-descriptions-item>
                                <el-descriptions-item label="通过率" v-if="testingObj.interfaceVisible">
                                    {{ testingObj.successRate }}
                                </el-descriptions-item>

                                <!-- 性能测试 -->
                                <el-descriptions-item label="QPS" v-if="testingObj.performanceVisible">
                                    {{ testingObj.qps }}
                                </el-descriptions-item>
                                <el-descriptions-item label="TOP95" v-if="testingObj.performanceVisible">
                                    {{ testingObj.top95 }}
                                </el-descriptions-item>
                                <el-descriptions-item label="成功率" v-if="testingObj.performanceVisible">
                                    {{ testingObj.successRate }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>

                    <el-divider></el-divider>
		                <div class="box">
				                <div class="row flex-center-between">
						                <div class="title-box flex flex-align-items-center">
								                <div class="bar"></div>
								                任务信息
						                </div>
				                </div>
				                <div>
						                
														
						                <el-descriptions direction="horizontal" :column="1" border
						                                 :labelStyle="{ 'text-align': 'center', 'width': '180px' }">
								                <!-- 人员审批 -->
								                <el-descriptions-item label="人员角色" v-if="showStepKey === 'access-control-audit'">
										                {{ getRole(taskInfoObj.role)  }}
								                </el-descriptions-item>
								                <el-descriptions-item label="审批描述" v-if="showStepKey === 'access-control-audit'">{{ taskInfoObj.desc }}</el-descriptions-item>
								                <el-descriptions-item label="审批状态" v-if="showStepKey === 'access-control-audit'">
										                <el-tag type="warning" v-if="stepResultObj.status=='WAITING'">等待</el-tag>
										                <el-tag type="success" v-if="stepResultObj.status=='PASS'">通过</el-tag>
										                <el-tag type="danger" v-if="stepResultObj.status=='CLOSE'">不通过</el-tag>
								                </el-descriptions-item >
								                <el-descriptions-item label="操作" v-if="showStepKey === 'access-control-audit'">
										                <span v-if="(stepStatus=='BUILDING' || stepStatus == 'DELAYING') && stepResultObj.status == 'WAITING'">
												                <el-button type="primary" plain size="small" @click="auditButton(true)">通过</el-button>
										                    <el-button type="danger" plain size="small" @click="auditButton(false)">不通过</el-button>
										                </span>
										                <span style="float: right;" v-if="stepStatus=='FAILURE' || stepStatus=='SUCCESS'">
												                <el-button type="text" plain size="small" @click="retryButton('audit')">重试</el-button>
										                </span>
										                
								                </el-descriptions-item>
								                
								                <!-- 指定功能文件上传 -->
								                <el-descriptions-item label="文件功能描述" v-if="showStepKey === 'access-control-upload'">{{ taskInfoObj.desc }}</el-descriptions-item>
								                <el-descriptions-item label="文件连接" v-if="showStepKey === 'access-control-upload'">{{ stepResultObj.file }}</el-descriptions-item>
								                
								                <el-descriptions-item label="操作" v-if="showStepKey === 'access-control-upload'">
										                 <span v-if="(stepStatus=='BUILDING' || stepStatus == 'DELAYING')">
												                <el-upload
													                class="upload-demo"
													                ref="upload"
													                :action="attachment_upload_url"
													                :on-success="uploadReportMailURLSuccess"
													                :on-remove="removeReportMailURLUpload"
													                :limit="1"
													                :on-preview="handlePreview"
													                :file-list="fileList"
													                >
														                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
														                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传完成</el-button>
																					<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
												                </el-upload>
										                </span>
										                
										                <span style="float: right;" v-if="stepStatus=='FAILURE' || stepStatus=='SUCCESS'">
												                <el-button type="text" plain size="small" @click="retryButton('upload')">重试</el-button>
										                </span>
										                
								                </el-descriptions-item>
								                
								                <!-- 指定环境部署 -->
								                <el-descriptions-item label="环境" v-if="showStepKey === 'access-control-deploy'">
										                <span v-for="item in envList" :key="item.envValue">
												                {{ taskInfoObj.envCode == item.envValue ? item.envToUpperCase : ''  }}
										                </span>
								                </el-descriptions-item>
								                <el-descriptions-item label="链接跳转" v-if="showStepKey === 'access-control-deploy'">{{ taskInfoObj.duration }}</el-descriptions-item>
								                <el-descriptions-item label="操作" v-if="showStepKey === 'access-control-deploy'">
										                <span v-if=" (stepStatus=='BUILDING' || stepStatus == 'DELAYING')">
										                    <el-button style="margin-left: 10px;" size="small" type="success" @click="deployOK">部署完成</el-button>
										                </span>
										                
										                <span style="float: right;" v-if="stepStatus=='FAILURE' || stepStatus=='SUCCESS'">
												                <el-button type="text" plain size="small" @click="retryButton('deploy')">重试</el-button>
										                </span>
								                </el-descriptions-item>
								                
								                <!-- 指定分支构建 -->
								                <el-descriptions-item label="分支名称" v-if="showStepKey === 'access-control-build'">{{ taskInfoObj.branchName }}</el-descriptions-item>
								                <el-descriptions-item label="产物信息" v-if="showStepKey === 'access-control-build'">{{ stepResultObj.product }}</el-descriptions-item>
								                <el-descriptions-item label="链接跳转" v-if="showStepKey === 'access-control-build'">{{ taskInfoObj.url }}</el-descriptions-item>
								                <el-descriptions-item label="操作" v-show="showStepKey === 'access-control-build'">
										                <span v-if=" (stepStatus=='BUILDING' || stepStatus == 'DELAYING')">
												                <el-button size="small" type="primary" @click="productInfo" v-show="!stepResultObj.product">设置产物信息</el-button>
										                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitProduct" v-show="stepResultObj.product">构建完成</el-button>
										                </span>
										
										                <span style="float: right;" v-if="stepStatus=='FAILURE' || stepStatus=='SUCCESS'">
												                <el-button type="text" plain size="small" @click="retryButton('build')">重试</el-button>
										                </span>
								                </el-descriptions-item>
								
								                <!-- 接口测试 -->
								                <el-descriptions-item label="总用例数" v-if="testingObj.interfaceVisible">
										                {{ testingObj.totalCount }}
								                </el-descriptions-item>
								                <el-descriptions-item label="通过用例数" v-if="testingObj.interfaceVisible">
										                {{ testingObj.successCount }}
								                </el-descriptions-item>
								                <el-descriptions-item label="失败用例数" v-if="testingObj.interfaceVisible">
										                {{ testingObj.failCount }}
								                </el-descriptions-item>
								                <el-descriptions-item label="通过率" v-if="testingObj.interfaceVisible">
										                {{ testingObj.successRate }}
								                </el-descriptions-item>
								
								                <!-- 性能测试 -->
								                <el-descriptions-item label="QPS" v-if="testingObj.performanceVisible">
										                {{ testingObj.qps }}
								                </el-descriptions-item>
								                <el-descriptions-item label="TOP95" v-if="testingObj.performanceVisible">
										                {{ testingObj.top95 }}
								                </el-descriptions-item>
								                <el-descriptions-item label="成功率" v-if="testingObj.performanceVisible">
										                {{ testingObj.successRate }}
								                </el-descriptions-item>
						                </el-descriptions>
				                </div>
		                </div>
		                
                    <el-divider></el-divider>
                    <div class="box">
                        <div class="row flex-center-between">
                            <div class="title-box flex flex-align-items-center">
                                <div class="bar"></div>
                                流程状态
                            </div>
                            <div style="width:50px;" @click="showLog">
                                <i class="el-icon-notebook-2"></i>
                                <span>日志</span>
                            </div>
                        </div>
                        <div>
                            <el-steps :active="activeIndex" align-center>
                                <el-step v-for="(item, index) in piplineSteps" :key="index" :title="item.name"
                                    :status="item.icon_status" :icon="item.icon"  @click.native="technologicalProcessClick(item)" style="cursor: pointer">
                                    <div slot="description">
                                        {{ item.code_des }}<br />
                                        <div
                                            style="display:flex;flex-direction:row; justify-content: center;align-items: center;">
		                                        <!-- <template v-if="item.stepKey == 'access-control-build'">
																								<el-button type="text" size="mini" @click="doOperator('build-log')">
																										<i class="el-icon-collection"></i> 日志
																								</el-button>
																								<el-button type="text" size="mini" @click="doOperator('build-history')">
																										<i class="el-icon-s-data"></i> 构建历史
																								</el-button>
																						</template>


																						<template v-if="item.stepKey.indexOf('quality-') >
																						-1">
																								<el-button type="text" size="mini" @click="doOperator('retry')">
																										<i class="el-icon-document"></i> 报告
																								</el-button>
																						</template>

																							<template v-if="item.stepKey == 'access-control-audit'">
																								<el-button type="text" size="mini" @click="doOperator('retry')">
																										<i class="el-icon-s-check"></i> 卡点
																								</el-button>
																						</template>


																						<template v-if="item.stepKey == 'access-control-upload'">
																								<el-button type="text" size="mini" @click="doOperator('retry')">
																										<i class="el-icon-upload"></i> 上传
																								</el-button>
																						</template>

																						<template v-if="item.stepKey == 'access-control-deploy'">
																								<el-button type="text" size="mini" @click="doOperator('retry')">
																										<i class="deploy-app"></i> 发布
																								</el-button>
																						</template>-->
		                                        
                                        </div>
                                    </div>
                                </el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
		    
        <el-dialog title="新建版本" :close-on-click-modal="false" :visible.sync="openParam" :lock-scroll="false"
            width="708px">
            <el-form id="newVesionWindows" label-position="left" label-width="140px" :model="pipeLineConfig"
                style="width: 80%; margin: 0 auto" size="small" ref="pipeLineConfig">
                <el-form-item label="仓库地址" prop="gitlabAddress"
                    :rules="[{ required: true, message: '请输入仓库.', trigger: 'blur' }]">
                    <el-input v-model="pipeLineConfig.gitlabAddress" type="textarea" readonly></el-input>
                </el-form-item>
                <el-form-item label="构建分支" prop="branch"
                    :rules="[{ required: true, message: '请输入仓库.', trigger: 'blur' }]">
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


            </el-form>
            <div class="flex flex-justify-content-center footer">
                <el-button style="margin-right: 16px" type="primary" @click="onStart" :loading="new_version_loading">
                    立即创建</el-button>
                <el-button @click="openParam = false">取消</el-button>
            </div>
        </el-dialog>
		    
        <el-dialog title="设置产物信息" :close-on-click-modal="false" :visible.sync="productVisible" :lock-scroll="false"
        width="30%" @close="closeProductForm">
            <el-form  label-position="left" label-width="80px" :model="productForm"
                style="width: 80%; margin: 0 auto" size="small" ref="productForm">
                <el-form-item label="产物信息" prop="product"
                    :rules="[{ required: true, message: '请输入产物信息.', trigger: 'blur' }]">
                    <el-input v-model="productForm.product" type="textarea"></el-input>
                </el-form-item>
              
            </el-form>
            <div class="flex flex-justify-content-center footer">
                <el-button style="margin-right: 16px" type="primary" @click="submitProductForm" :loading="new_version_loading">
                    确 定</el-button>
                <el-button @click="closeProductForm">取消</el-button>
            </div>
        </el-dialog>


        <!--构建日志弹窗-->
        <el-dialog title="构建日志" center width="70%" :visible.sync="logDialogVisible" style="height: 900px">
            <el-tabs tab-position="left" v-model="showLogIndex">
                <el-tab-pane :label="step.name" :name="String(index)" v-for="(step, index) in piplineSteps"
                    :key="index">
                    <div class="log_content">
                        <div class="log_content-header">
                            <span>{{ step.name }}日志</span>
                            <el-link :underline="false" style="margin-left: auto; margin-right: 15px">下载日志</el-link>
                        </div>
                        <pre class="log_content-center" v-if="logs[index] != undefined">{{ logs[index].logTxt }}</pre>
                        <pre class="log_content-center" v-if="logs[index] == undefined">当前无日志信息</pre>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false" size="30%">
            <el-card style="height:100%;overflow: auto;">
                <div slot="header" class="list-card-header">
                    <div class="list-card-header-slot"></div>
                    <span style="margin-left: 5px">自动化测试</span> &nbsp;
                    <el-button class="list-card-header-slot-btn" @click="show = false" icon="el-icon-close">
                    </el-button>
                </div>
                <el-empty style="margin-top: 30vh;" description="当前步骤无需额外参数配置"></el-empty>
            </el-card>
        </el-drawer>
    </div>
</template>
    
<script>
import pagination from "@/components/Pagination/pagination";
import {
    getUseLanguageName
} from "@/utils/pipeline.js";

export default {
    name: "design-pipeline-build",
    components: {
        pagination,
    },
    data() {
        return {
            new_version_loading: false,
            nodeCompileType: "nodejs-front",
            javaCompileType: "jar",
            imageDatas: [],
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
                branch: "-",
                image: "",
            },
            activeName: 'histroy-list',

            show: false,
            testingObj: {
                interfaceVisible: false,
                performanceVisible: false,
                totalCount: null,
                detailURL: null,
                failCount: null,
                successCount: null,
                successRate: null,
            },
            pipline_name: "点击查看",
            isResultIsReported: false,
            deployment_env: undefined,
            envDatas: [],
		        envList: [],
            logs: [],
            showLogIndex: "0",
            logDialogVisible: false,
            cur_build_row: {
                createTime: "-",
                buildRepository: "-",
                createdBy: "-",
                duration: "-",
                buildStatus: "-",
                pipilineUUid: "-",
                buildUuid: "",
                branch: "",
            },
            activeIndex: 0,
            gitTagList: [],
            gitBranchList: [],
            form: {
                branch: ""
            },
            app: {},
            openParam: false,
            pipline_uuid: undefined,
            appCode: undefined,
            appId: undefined,
            histroyList: [],
            total: 10,
            page: 1,
            limit: 10,
            version_timer: null,
            piplineSteps: [],
            branchTagOptions: [{
                label: "分支",
                value: "branch",
                children: []

            },
            {
                label: "Tag",
                value: "tag",
                children: []

            }
            ],
		        taskInfoObj: {},
		        stepResultObj: {},
		        showStepKey: '',
		        stepStatus: '',
		        roleDatas: {
				        devMgrId: '开发负责人',
				        devlopers: '开发人员',
				        bizMgrId: '业务负责人',
				        prodMgrId: '产品负责人',
				        projMgrId: '项目负责人',
				        qualityMgrId: '质量负责人',
				        testers: '测试人员',
		        },
		        callbackCache: {},
		        fileList: [],
		        attachment_upload_url: this.GLOBAL.baseUrl +
			        "/appDeploy/uploadAttachment/" +
			        localStorage.getItem("originTenantId"),
		        fileUrl: '',
		        productVisible:false,
		        productForm: {},
        }
    },
    watch: {
        "cur_build_row.buildStatus": function () {
            if (this.cur_build_row.buildStatus === 'BUILDING' || this.cur_build_row.buildStatus == 'UNSTART') {
                clearInterval(this.version_timer);
                this.version_timer = window.setInterval(this.queryVersionStatus, 10000);
            } else if (this.cur_build_row.buildStatus === 'SUCCESS' || this.cur_build_row.buildStatus == 'ABORTED' || this.cur_build_row.buildStatus == 'FAILURE') {
                clearInterval(this.version_timer);
            } else {
                clearInterval(this.version_timer);
            }
        },
    },
    created() {
        this.pipline_name = this.common.getUrlKey("pipline_name");
        this.pipline_uuid = this.common.getUrlKey("pipline_uuid");
        this.appCode = this.common.getUrlKey("appCode")
        this.appId = this.common.getUrlKey("appId")
        // this.loadPipelineSteps();
        // this.loadApplicationInfo();
        this.loadBuildHistory(); // 查询 历史列表
        this.LoadDeployEnv();
        // this.getBuildParam();
    },
    methods: {
				getRole(key){
						for (const item in this.roleDatas) {
								if (key === item){
										return this.roleDatas[key]
								}
						}
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

            //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
            let parms = {
                tenantId: localStorage.getItem("originTenantId"),
                type: _type,
            } // 默认的

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

        //获取PipeLine 配置信息
        getBuildParam: function () {
            let url = this.GLOBAL.baseUrl + "/pipeline-conf/conf?appId=" + this.appId;
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
                            this.pipeLineConfig.sonar_scanner = false;
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
		    
		    //------------------------------------------
		    showLog() {
				    this.logDialogVisible = true;
				
				    this.axios({
						    url: this.GLOBAL.baseUrl + `/access_control/pipeline_step/log`,
						    method: "post",
						    data: {
								    appId: this.appId,
								    pipelineUuid: this.pipline_uuid,
								    buildUuid: this.cur_build_row.buildUuid,
						    },
				    }).then((response) => {
						    const {
								    data,
								    code
						    } = response.data;
						    if (code === 200) {
								    this.logs = data
								    console.log(data,'---------')
						    }
						
				    }).catch(err => {
						    console.log(err)
				    })
		    },
		    // 节点重试
		    retryButton(flag){
						/*switch (flag){
								case 'build':
								case 'deploy':
								case 'upload':
								case 'audit':
						}*/
				    this.axios({
						    url: this.GLOBAL.baseUrl + `/access_control/pipeline_step/retry`,
						    method: "post",
						    data: {
								    appId: this.appId,
								    pipelineUuid: this.pipline_uuid,
								    buildUuid: this.cur_build_row.buildUuid,
								    stepId: this.cur_build_row.stepId,
						    },
				    }).then((response) => {
						    const {
								    data,
								    code
						    } = response.data;
						    if (code === 200) {
								    this.$message({
										    type: 'success',
										    message: '重试执行成功!'
								    });
						    }
						
				    }).catch(err => {
						    this.$message.error("重试执行失败")
						    console.log(err)
				    })
				    
		    },
		    
		    // 构建完成
		    submitProduct(){
				    this.callbackCache.product = this.productForm.product
				    this.callbackCache.finished = true
				    this.pipelineStepCallback()
		    },
		    // 提交产物信息
		    submitProductForm(){
				    this.$refs.productForm.validate(v=>{
						    if (v){
								    this.callbackCache = {}
								    this.callbackCache.product = this.productForm.product
								    this.callbackCache.finished = false
								    this.pipelineStepCallback()
								    this.closeProductForm()
						    }else {
								    return
						    }
				    })
		    },
		    // 设置产物信息
		    productInfo(){
				    this.productVisible = true
		    },
		    // 关闭产物信息
		    closeProductForm(){
						this.$refs.productForm.resetFields()
				    this.productVisible = false
		    },
		    // 功能文件上传
		    uploadReportMailURLSuccess(response, file, fileList) {
				    console.log(response,'==========')
				    this.$message({
						    type: "success",
						    message: "上传成功",
				    });
				    this.callbackCache = {}
				    this.callbackCache.file = response
				    this.fileUrl = response
				    this.callbackCache.finished = false
				    this.pipelineStepCallback()
		    },
		    // 完成上传
		    submitUpload(){
				    this.callbackCache = {}
				    this.callbackCache.file = this.fileUrl
				    this.callbackCache.finished = true
				    this.pipelineStepCallback()
		    },
		    // 部署完成
		    deployOK(){
				    this.callbackCache = {}
				    this.callbackCache.finished = true
				    this.pipelineStepCallback()
		    },
		    
		    removeReportMailURLUpload(file, fileList) {
				    this.reportMailURL = "";
		    },
		    
		    // 通过 按钮
		    auditButton(value){
				    this.callbackCache = {}
						this.callbackCache.pass = value
				    this.pipelineStepCallback()
		    },
		
		    handlePreview(){},
		   
				// 门禁流水线实例节点信息回调信息
		    pipelineStepCallback(){
				    this.axios({
						    url: this.GLOBAL.baseUrl + `/access_control/pipeline_step/callback`,
						    method: "post",
						    data: {
								    appId: this.appId,
								    pipelineUuid: this.pipline_uuid,
								    buildUuid: this.cur_build_row.buildUuid,
								    stepId: this.cur_build_row.stepId,
								    paramters: JSON.stringify(this.callbackCache)
						    },
				    }).then((response) => {
						    const {
								    data,
								    code
						    } = response.data;
						    if (code === 200) {
								    this.$message({
										    type: 'success',
										    message: '回调执行成功!'
								    });
								    this.queryVersionStatus()
						    }
						
				    }).catch(err => {
						    this.$message.error("回调执行失败")
						    console.log(err)
				    })
		    },
		    
		    // 增加构建
		    addBuildQuality(){
				    this.$confirm('是否确定增加构建信息?', '确认信息', {
						    confirmButtonText: '确定',
						    cancelButtonText: '取消',
						    type: 'warning'
				    }).then(() => {
						
						    this.axios({
								    url: this.GLOBAL.baseUrl + `/access_control/pipeline_instance/start`,
								    method: "post",
								    data: {
										    appId: this.appId,
										    pipelineUuid: this.pipline_uuid,
								    },
						    }).then((response) => {
								    const {
										    data,
										    code
								    } = response.data;
								    if (code === 200) {
										    this.$message({
												    type: 'success',
												    message: '添加成功!'
										    });
												this.queryVersionStatus()
								    }
								
						    }).catch(err => {
								    this.$message.error("添加失败")
								    console.log(err)
						    })
						    
						    
				    }).catch(() => {
						    this.$message({
								    type: 'info',
								    message: '已取消'
						    });
				    });
		    },
		    
        // 查看详情
        async lookInfo(row) {
						console.log(row,'----')
            this.activeName = 'integrate-info'
		        this.callbackCache = {}
		        this.stepResultObj = {}
		        this.taskInfoObj = {}
		        this.showStepKey = ''
		        
		        this.ClickAppVersionRow(row) // 给cur_build_row 赋值 用于调用定时查询
		        
            await this.queryPipelineInfo() // 根据 buildUuid 查询基本信息详情

            await this.queryPipelineStep() // 根据 buildUuid 查询流程状态
        },

        // 门禁流水线实例信息查询
        queryPipelineInfo() {
            this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline_instance/info`,
                method: "post",
                data: {
                    appId: this.appId,
                    pipelineUuid: this.pipline_uuid,
                    buildUuid: this.cur_build_row.buildUuid
                },
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code === 200) {
                    this.cur_build_row.createTime = data.createTime
                    this.cur_build_row.createdBy = data.createBy
                    this.cur_build_row.duration = data.duration
                    this.cur_build_row.buildStatus = data.status
                    this.cur_build_row.pipilineUUid = data.pipelineUuid
                    this.cur_build_row.buildUuid = data.buildUuid
                    this.cur_build_row.branch = data.branch
                }

            }).catch(err => {
                this.$message.error("门禁流水线实例信息查询失败")
                console.log(err)
            })
        },
		    
				// 点击 流程 获取 任务信息
		    technologicalProcessClick(item){
						console.log(item)
				    // stepStatus=building || delaying && stepResult.status = WAITING
				    this.cur_build_row.stepId = item.id
				    if (item.stepResult !== undefined){
						    this.stepResultObj = JSON.parse(item.stepResult)
				    }
				    this.taskInfoObj = JSON.parse(item.stepParamters)
				    this.showStepKey = item.stepKey
				    this.stepStatus = item.stepStatus
		    },
		    
        // 门禁流水线实例流程状态查询
        queryPipelineStep() {
            this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline_step/list`,
                method: "post",
                data: {
                    appId: this.appId,
                    pipelineUuid: this.pipline_uuid,
                    buildUuid: this.cur_build_row.buildUuid,
                },
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code === 200) {
										this.activeIndex = data.activeIndex === -1 ? data.list.length : data.activeIndex === 0 ? '1' : data.activeIndex
		                this.piplineSteps = data.list.map(detail => {
                        return {
														...detail,
                            name: detail.stepName,
                            icon_status: detail.stepIcon === 'el-icon-error' ? "error" : "",
                            // icon_status: this.getStepIcon(detail.stepIcon),
                            icon: detail.stepIcon,
                            code_des: `${detail.stepMessage ? detail.stepMessage : ''}${detail.stepDutation ? ',耗时' + detail.stepDutation : ''}`,
                        }
                    })
		                this.technologicalProcessClick(this.piplineSteps[0])
                }

            }).catch(err => {
                this.$message.error("门禁流水线实例流程状态查询失败")
                console.log(err)
            })
        },

		    // 获取流程状态
		    getStepIcon(val){
						switch (val) {
								case 'el-icon-error':
										return 'error'
								case 'el-icon-success':
										return 'success'
						}
		    },
        goTestingReport() {
            console.log(this.testingObj.detailURL)
            window.open(this.testingObj.detailURL, "_blank");
        },
        goReport() {
            console.log(this.cur_build_row)

            let url =
                "http://sonarqube.ennewi.cn/dashboard?id=" +
                this.appCode +
                "_" +
                this.cur_build_row.branch +
                "_" +
                this.cur_build_row.commitId;
            window.open(url, "_blank");
        },
        goDeploy() {

            this.$router.push({
                path: "/cicd/app/app-deploy",
                query: {
                    appId: this.appId,
                    appCode: this.appCode,
                    image: "ecr-online.enncloud.cn/devops-jenkins/" + this.appCode + ":" + this.cur_build_row.buildUuid,
                    branch: this.cur_build_row.branchOrTag,
                    deployEnv: this.deployment_env,
                    language: this.common.getUrlKey("useLanguage"),
                },
            });

        },
        
        //加载部署集群
        LoadDeployEnv() {
            this.envDatas = []
            var that = this;
            this.axios({
                url: this.GLOBAL.baseUrl + "/env/get",
                method: "get",
            })
                .then((res) => {
                    if (res.data.code === 200) {
                        if (res.data.data != undefined || res.data.data != null) {
                            res.data.data.forEach((envObject) => {
                                if ("PROD" != envObject.selectValue.toUpperCase()) {
                                    that.envDatas.push({
                                        env: envObject.selectValue.toUpperCase(),
                                    });
		                                this.envList.push({
				                                envToUpperCase: envObject.selectValue.toUpperCase(),
				                                envLabel: envObject.selectValue,
				                                envValue: envObject.selectKey,
		                                });
                                }
                            });
                        }
                    }
                })
                .then((error) => {
                    console.log(error);
                });
        },
        //每一行的数据
        ClickAppVersionRow(row) {
            if (row != undefined) {
                this.cur_build_row.commitId = row.commitId
                this.cur_build_row.createdBy = row.createBy
                this.cur_build_row.duration = row.duration
                this.cur_build_row.buildStatus = row.status
                this.cur_build_row.pipilineUUid = row.pipelineUuid
                this.cur_build_row.buildUuid = row.buildUuid
                this.cur_build_row.branch = row.branch
                this.testingObj.interfaceVisible = false
                this.testingObj.performanceVisible = false
                // this.loadBuildDetail();
            }
        },
        //加载应用信息
        loadApplicationInfo() {
            let AppDataUrl = this.GLOBAL.baseUrl + "/app/detail/" + this.appId;
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
                    this.cur_build_row.buildLanguage = getUseLanguageName(data.useLanguage).toUpperCase()
                    this.buildBranchTagOptions();
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

        handleChangeTagBranch(e) {
            this.getGitBranchList();
        },
        /**
         * 获取分支tag
         */
        getGitBranchList() {
            if (
                this.app.gitRepoUrl.indexOf("http://") > -1 ||
                this.app.gitRepoUrl.indexOf("https://") > -1
            ) {
                if (this.appDetail != null && this.appDetail.repoType == 5) {
                    this.axios({
                        method: "GET",
                        url: this.GLOBAL.baseUrl +
                            "/pipeline-conf/branchs/svn/" +
                            this.app.id,
                    })
                        .then((response) => {
                            if (response.status == 200) {
                                this.gitBranchList = response.data.data.branch || [];
                                this.gitTagList = response.data.data.tag;
                            }
                        })
                        .catch((error) => {
                            console.log("Error getSVNBranchList", error);
                        });
                } else {
                    this.axios({
                        method: "GET",
                        url: this.GLOBAL.baseUrl + "/pipeline-conf/branchs",
                        params: {
                            appId: this.app.id,
                        },
                    })
                        .then((response) => {
                            if (response.status == 200) {
                                this.gitBranchList = response.data.data.branch || [];
                                this.gitTagList = response.data.data.tag;
                            }
                        })
                        .catch((error) => {
                            console.log("Error getGitBranchList", error);
                        });
                }
            } else {
                this.axios({
                    method: "GET",
                    url: this.GLOBAL.pipeline_tag + "/pipelineConf/branch-list",
                    params: {
                        gitUrl: this.app.gitRepoUrl,
                    },
                })
                    .then((response) => {
                        if (response.status == 200) {
                            this.gitBranchList = response.data.branch;
                            this.gitTagList = response.data.tag;
                        }
                    })
                    .catch((error) => {
                        console.log("Error getGitBranchList", error);
                    });
            }
        },

        //加载构建流水线步骤
        loadPipelineSteps() {
            var that = this;
            const requestUrl = this.GLOBAL.baseUrl + "/pipeline-design/loadBuildSteps/" + this.pipline_uuid
            this.axios({
                url: requestUrl,
                method: "GET"
            }).then(response => {
                const {
                    code,
                    data
                } = response.data;
                console.log(data)
                if (code === 200) {
                    that.piplineSteps = data;
                    var buildSteps = data.filter(u => u.nameCode == 'access-control-build')
                    if (buildSteps.length > 0) {
                        var param = buildSteps[0].params;
                        this.pipeLineConfig.branch = JSON.parse(param).branchName
                        
                    } else {
                        this.pipeLineConfig.branch = ""
                    }
                } else {
                    that.$message.error("加载pipline失败")
                }

            }).catch(err => {
                this.$message.error("加载pipline失败")
                console.log(err)
            })
        },
        goBack() {
            window.history.back();

        },
        /**
         * 加载构建详情
         */
        loadBuildDetail() {
            var that = this;
            console.log(this.cur_build_row.buildUuid, '=======rrrrrrrrrrrrr=')
            if (this.cur_build_row.buildUuid == undefined || this.cur_build_row.buildUuid == '') {
                return;
            }
            const requestUrl = this.GLOBAL.baseUrl + "/pipeline-build/getBuildDetail/" + this.cur_build_row.buildUuid
            this.axios({
                url: requestUrl,
                method: "GET"
            }).then(response => {
                const {
                    code,
                    data
                } = response.data;
                if (code === 200) {
                    var details = data.detail;
                    this.logs = data.log;
                    this.activeIndex = data.activeIndex;
                    if (details != undefined && details.length > 0) {
                        this.piplineSteps = []
                    }
                    for (var i = 0; i < details.length; i++) {
                        var detail = details[i];
                        var step = {
                            name: detail.stepName,
                            nameCode: detail.stepKey,
                            icon_status: detail.stepIcon == 'el-icon-error' ? "error" : "",
                            icon: detail.stepIcon,
                            code_des: `${detail.stepMessage ? detail.stepMessage : ''}${detail.stepDutation ? ',耗时' + detail.stepDutation : ''}`,
                        }
                        console.log(step)
                        this.piplineSteps.push(step)
                        if (detail.stepKey == 'extra-sonar' || detail.stepKey == 'extra-testing') {
                            this.isResultIsReported = true;
                        }
                        console.log(this.isResultIsReported, '=========')
                        // 自动化测试
                        if (detail.stepKey == 'extra-testing') {
                            if (detail.stepStatus == 'SUCCESS') {
                                if (JSON.parse(detail.stepParamters).taskType == '1') {
                                    this.testingObj = JSON.parse(detail.stepResult)
                                    this.testingObj.interfaceVisible = true
                                } else {
                                    this.testingObj = JSON.parse(detail.stepResult)
                                    this.testingObj.performanceVisible = true
                                }
                            } else {
                                this.testingObj.interfaceVisible = false
                                this.testingObj.performanceVisible = false
                            }

                        }
                    }
                } else {
                    // that.$message.error("加载数据失败")
                }

            }).catch(err => {
                // this.$message.error("加载数据失败")
                console.log(err)
            })
        },
		    
		    // 查询 历史列表
        loadBuildHistory() {
            this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline_instance/list`,
                method: "post",
                data: {
                    appId: this.appId,
                    pipelineUuid: this.pipline_uuid,
                    pageSize: this.limit,
                    pageNum: this.page,
                },
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code === 200) {
                    this.total = data.total;
                    this.histroyList = data.list
                    if (this.histroyList.length > 0 && this.$refs.singleTable !== undefined) {
                        this.$refs.singleTable.setCurrentRow(this.histroyList[0]);
                    }
                }

            }).catch(err => {
                this.$message.error("加载构建历史失败")
                console.log(err)
            })
        },
        buildBranchTagOptions() {
            this.getGitBranchList();
            this.branchTagOptions[0].children = []
            this.branchTagOptions[1].children = []
            for (var i = 0; i < this.gitBranchList.length; i++) {

                var branch = {
                    label: this.gitBranchList[i],
                    value: this.gitBranchList[i],
                }
                this.branchTagOptions[0].children.push(branch)
            }
            for (var i = 0; i < this.gitTagList.length; i++) {
                var tag = {
                    label: this.gitTagList[i],
                    value: this.gitTagList[i],
                }
                this.branchTagOptions[1].children.push(tag)
            }
            //兜底方案
            if (this.branchTagOptions[0].children.length == 0) {
                var branch = {
                    label: "master",
                    value: "master",
                }
                this.branchTagOptions[0].children.push(branch)
            }
        },

        //触发应用构建
        async triggerBuildApp() {
            let data;
            var imageBaseURL = "ecr-online.enncloud.cn/devops-jenkins/";
            var buildArgs = {
                PROJECT: "quality",
                ENV: "test",
                GIT: this.pipeLineConfig.gitlabAddress,
                BranchName: this.pipeLineConfig.branch,
                PORT: "5000",
                make_args: this.pipeLineConfig.compileCmd,
                ID: parseInt(this.appId),
                APPID: this.appCode,
                IMAGE: imageBaseURL +
                    this.groupIdStr +
                    "/" +
                    this.appCode +
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
        //触发自定义流水线
        async triggerPipeline(param) {
            let result;
            this.cur_build_row.branchOrTag = this.form.branch
            await this.axios({
                url: this.GLOBAL.baseUrl + "/pipeline-build/start",
                method: "POST",
                data: param
            }).then(res => {
                result = res;
                this.openParam = false
            }).catch(err => {
                this.openParam = false
                console.log(err)
            })
            return result;
        },
        //点击立即构建
        onStart() {
            if (this.form.branch == "-") {
                this.$message.error("没有指定构建分支")
                return
            }
            this.new_version_loading = true;
            this.triggerBuildApp().then(res => {
                const { code, data, message } = res.data;
                console.log(res)

                if (code != 200) {
                    this.$message.error(message)
                    this.openParam = false
                    return;
                }
                var param = {
                    pipelineUuid: this.pipline_uuid,
                    repositoryUrl: this.app.gitRepoUrl,
                    branch: this.form.branch[1],
                    appId: this.appId,
                    appCode: this.appCode,
                    tenantId: "",
                    createBy: "",
                    buildImage: data.image,
                    buildNum: data.buildNum,
                    pipelineName:data.pipelineName
                }
                this.triggerPipeline(param).then(result => {
                    this.new_version_loading = false;
                    const { code, message } = result.data;
                    if (code == 200) {
                        this.$message.success(message)
                        this.queryVersionStatus();
                    } else {
                        this.$message.error(message)
                    }
                }).catch(err => {
                    console.log(err)
                    this.new_version_loading = false;
                })

            })
        },
		    
        // 查询版本状态
        queryVersionStatus() {
            this.loadBuildHistory(); // 查询历史列表
		        
            // 查询 历史集成 信息
		        this.queryPipelineInfo() //  查询基本信息详情
		        this.queryPipelineStep() // 查询流程状态

        },
        goCodeUrl(row) {
            if (row.commitId != undefined && row.commitId != '') {
                var url = this.app.gitRepoUrl.replace(".git", "/-/commit/") + row.commitId
                window.open(url);
            } else {
                window.open(this.app.gitRepoUrl);
            }
        },
        goPipelineDesign() {
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config-design",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.app.groupIdStr,
                    pipline_uuid: this.pipline_uuid,
                    useLanguage: this.app.useLanguage
                },
            });
        },
        doOperator(e) {
            console.log(e)
            if("build-log"==e){
                this.logDialogVisible=true
            }
          
        }
    }
}
</script>
    
<style lang="scss" scoped>
.main {
    height: calc(100% - 80px);
}

.back-box {
    font-size: 14px;
    color: #343a40;
    cursor: pointer;
}

.back-box .el-icon-arrow-left {
    margin-right: 8px;
    font-size: 16px;
}

.left-panel-q {
    /* flex: 2; */
    width: 100%;
    padding: 20px;
    height: 80vh;
    background: white;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: auto;
}

.left-panel.panel-isCollapse {
    width: calc(100vw - 748px);
}

.left-panel .header {
    margin-bottom: 25px;
}

.left-panel .table-box {
    flex: 1;
    overflow-y: auto;
}

.right-panel-q {
    width: 100%;
    padding: 20px;
    height: 80vh;
    background: white;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: auto;
}

.right-panel .box {
    flex: 1;
    padding: 24px;
    background: white;
    margin-bottom: 24px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.right-panel .version-step-box {
    background: #f8f9fa;
    border-radius: 4px;
    height: 100px;
    display: flex;
    align-items: center;
}

.right-panel .row {
    margin-bottom: 20px;
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

.right-panel .refresh-box {
    font-size: 14px;
    color: $primary;
    cursor: pointer;
    flex-shrink: 0;
    width: 40px;
    margin-bottom: 10px;
}

.right-panel .item {
    margin-bottom: 20px;
}

.right-panel .item .label {
    color: #999;
    font-size: 14px;
    width: 70px;
    margin-right: 15px;
    flex-shrink: 0;
}

.right-panel .item .text {
    color: #000;
    font-size: 14px;
    word-break: break-all;
}

.right-panel .step-box {
    margin-bottom: 35px;
}

.self-label .el-form-item__label,
.self-label1 .el-form-item__label {
    width: 138px !important;
}

.self-label1 {
    display: flex;
}

.self-label1 .el-form-item__content {
    margin-left: 0 !important;
    flex: 1;
}

.footer {
    margin-top: 40px;
}

.form-box {
    display: flex;
    flex-wrap: wrap;
}

.form-box .el-form-item {
    margin-right: 24px;
}

.k-dialog .el-collapse {
    border-top: 0;
}

.k-dialog .panel {
    padding: 10px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 2px 14px 0px rgba(51, 51, 51, 0.1);
}

.k-dialog .btn-box {
    color: #0f55fa;
    font-size: 14px;
    margin-left: 38px;
    cursor: pointer;
    line-height: 50px;
}

.k-dialog .btn-box .el-icon-circle-plus-outline {
    margin-right: 8px;
}

.k-dialog .el-dialog__body {
    padding-top: 10px;
}

.k-dialog .el-link.el-link--danger {
    line-height: 40px;
}

.line {
    width: 100%;
    height: 1px;
    background: #eee;
}

.step-box {
    margin-top: 24px;
    margin-bottom: 24px;
}

.k-dialog .el-steps {
    width: 600px;
    margin: 0 auto;
}

.k-dialog .el-card__header {
    border-bottom: none;
    padding-bottom: 0;
}

.el-button--text {
    color: #0f55fa;
}

.info-table .el-tag {
    cursor: pointer;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.dialog-footer {
    text-align: center;
}

.log-text {
    word-wrap: break-word;
    background: white;
    padding: 5px;
    color: #333;
}

.log-text.error {
    color: red;
}

.log-text.warn {
    color: #e6a23c;
}

.main .box-wrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #f8f9fa;
    border-radius: 4px;
    padding-bottom: 0;
}

.disable-plain {
    width: 100%;
    filter: blur(10px);
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -ms-filter: blur(10px);
    -o-filter: blur(10px);
}

.log_content {
    height: 600px;
    width: 100%;
    background-color: black;
}

.log_content-header {
    width: 100%;
    height: 30px;
    color: white;
    border-bottom: 1px solid white;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 5px;
}

.log_content-center {
    height: 600px;
    overflow: auto;
    margin: 0px;
    padding-top: 5px;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    color: white;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5em;
    padding-bottom: 40px;
}

.list-card-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
}

.list-card-header-slot {
    height: 14px;
    width: 5px;
    background: #1989fa;
}

.list-card-header-slot-btn {
    margin-left: auto;
    padding: 3px 0;
    height: 20px;
    width: 20px;
    border-radius: 20px;
}

.drawer-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 0px;
    padding: 10px;
    border-top: 1px solid #efefef;
}
</style>
    