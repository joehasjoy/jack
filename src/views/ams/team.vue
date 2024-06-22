<template>
<div class="team-main">
    <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="业务域管理" name="team">
            <!-- 搜索 -->
            <div class="search-box flex-center-between">
                <!-- <el-button icon="el-icon-plus" @click="toAddTeamDialogStep" style="margin-bottom: 10px">新增</el-button> -->
                <el-button icon="el-icon-plus" @click="createNameSpaceWorkFlow" style="margin-bottom: 10px">新增</el-button>
                <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent>
                    <el-form-item>
                        <el-input style="width: 285px" v-model="formSearch.teamName" placeholder="请输入业务域名称">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="
                  initBusinessDomainTableData(
                    team_url,
                    business_domain_limit,
                    business_domain_page
                  )
                ">
                            查询</el-button>

                        <!--  <el-button type="primary" icon="el-icon-plus" @click="toAddTeamDialog">新增</el-button>-->
                        <!--分步新增-->
                    </el-form-item>
                    <!-- <el-form-item>

<el-button

type="danger"

icon="el-icon-delete"

@click="deleteteamDialog"

>删除</el-button

>

</el-form-item> -->
                </el-form>
            </div>
            <!-- table -->
            <div class="table-box">
                <el-table stripe :data="business_domain_tableData" v-loading="business_domain_loading">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                    <template v-for="(item, index) in tableLabel">
                        <el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" v-if="item.show" align="center">
		                        <template slot-scope="scope">
				                        <div v-if="typeof scope.row[item.prop] === 'object'">
						                        <span v-for="val in scope.row[item.prop]">
								                        {{ val.clusterNsName}}
						                        <el-popover
									                         v-if="val.isSync === 2 "
									                         placement="top-start"
									                         title="提示"
									                         width="200"
									                         trigger="hover"
								                         >
								                        <i class="el-icon-warning" slot="reference" style="color: red"></i>
																				<p>{{val.errMsg}}，如需手动创建，请点击重试</p>
<!--								                        <p>{{ val.errMsg }}</p>-->
								                        <div style="text-align: right; margin: 0">
		<!--								                        <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>-->
										                        <el-button type="primary" size="mini" @click="retryNamespace(val)">重试</el-button>
								                        </div>
				                            </el-popover>
						                        </span>
				                        </div>
				                        
				                        <div v-else>
						                        {{scope.row[item.prop]}}
				                        </div>
				                        
				                       
		                        </template>
		                       
                        </el-table-column>
                    </template>

                    <el-table-column label="操作" align="center" width="240" fixed="right">
		                    
                        <template slot-scope="scope">
<!--                            <el-button :key="scope.row.id" @click="editBusinessDomain(scope.row)" type="primary"
                                        size="mini" :plain="true" >编辑
                            </el-button>-->
		                        <el-button @click="setTeamMermber(scope.row)" type="primary" size="mini">团队成员
		                        </el-button>
		                        <el-dropdown trigger="click">
				                        <el-button type="danger" size="mini">
						                        更多<i class="el-icon-arrow-down el-icon--right"></i>
				                        </el-button>
				                        <el-dropdown-menu slot="dropdown">
						                        <el-dropdown-item icon="el-icon-edit" @click.native="editBusinessDomain(scope.row)">修改名称</el-dropdown-item>
						                        <el-dropdown-item icon="el-icon-coordinate" @click.native="setTeamCluster(scope.row)">集群权限</el-dropdown-item>
						                        <el-dropdown-item icon="el-icon-user" @click.native="setRespPerson(scope.row)">修改负责人</el-dropdown-item>
						                        <el-dropdown-item icon="el-icon-bottom" @click.native="businessDomainOffline(scope.row)" >业务域下线</el-dropdown-item>
				                        </el-dropdown-menu>
		                        </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <pagination v-show="business_domain_total > 0" :total="business_domain_total" :page.sync="business_domain_page" :limit.sync="business_domain_limit" @pagination="
            initBusinessDomainTableData(
              team_url,
              business_domain_limit,
              business_domain_page
            )
          "></pagination>
        </el-tab-pane>
    </el-tabs>
		
		<el-dialog title="修改业务域" :visible.sync="edit.TeamVisible" width="30%" @close="closeEditTeamDialog">
				<el-form ref="editTeamForm" :model="edit.editForm" :rules="rules" label-width="120px">
						<el-row>
								<el-col :span="24">
										<el-form-item label="原业务域名称:">
												<el-input v-model="edit.editForm.nameOrigin" placeholder="请输入业务域名称" disabled></el-input>
										</el-form-item>
								</el-col>
						</el-row>
						
						<el-row>
								<el-col :span="24">
										<el-form-item label="新业务域名称:" prop="name">
												<el-input v-model="edit.editForm.name" maxlength="40" show-word-limit placeholder="请输入新业务域名称"></el-input>
										</el-form-item>
								</el-col>
						</el-row>
						<el-form-item>
								<el-button type="primary" @click="saveEditTeam" :loading="edit.loading">确 认</el-button>
								<el-button @click="closeEditTeamDialog">取 消</el-button>
						</el-form-item>
				</el-form>
		</el-dialog>
		
    <el-dialog title="新增业务域" :visible.sync="addTeamVisible" width="40%">
        <el-form ref="addTeamForm" :model="teamForm" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="业务域名称:" prop="name">
                        <el-input v-model="teamForm.name" placeholder="请输入业务域名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="英文名称:" prop="teamCode">
                        <el-input v-model="teamForm.teamCode" placeholder="请输入业务域名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="负责人:" prop="respPersonId" required>
                        <el-select style="width: 100%" v-model="teamForm.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                            <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item>
                <el-button type="primary" @click="saveAddTeam">确 认</el-button>
                <el-button type="info" @click="closeAddTeamDialog">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title="修改负责人" :visible.sync="addRespPersonVisible" width="590px">
        <el-form ref="addRespPersonForm" :model="respPersonForm" :rules="addRespPersonFormRules" label-width="100px" label-position="left">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="当前负责人:" prop="respPersonNameOld">
                        <el-input v-model="respPersonForm.respPersonNameOld" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="负责人:" prop="respPersonId" required>
                        <el-select style="width: 100%" v-model="respPersonForm.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                            <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item>
                <el-button type="primary" @click="saveAddMainPerson">确 认</el-button>
                <el-button @click="closeRespPersonDialog">取 消 </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title="团队成员" :visible.sync="addTeamMemberVisible" width="610px" :before-close="addTeamMemberClose">
        <div v-loading="showTeamAll" element-loading-text="数据加载中">
            <el-form ref="addTeamMemberForm" :model="memberform" :rules="memberformRules" size="small" inline>
                <el-form-item label="成员:" prop="respPersonId" required>
                    <el-select style="width: 140px" v-model="memberform.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色:" prop="roleId" required>
                    <el-select v-model="memberform.roleId" placeholder="请选择角色" style="width: 140px" filterable>
                        <el-option v-for="item in roleOptions" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="addTeamMember(tabledataid)" :loading="addTeamMemberBtnLoading">加入应用组</el-button>
                </el-form-item>
            </el-form>

            <div class="title-box">已有成员</div>
            <el-table ref="singleTable" :data="memberTableData" tooltip-effect="dark" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" min-width="40" align="center"></el-table-column>
                <el-table-column prop="memberName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click="removeTeamMember(scope.row)" :loading="scope.row.removeTeamMemberBtnLoading" type="text" size="small">移除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="teamId" align="center" prop="teamId" v-if="false" />
                <!--业务域id-->
                <el-table-column label="respPersonId" align="center" prop="respPersonId" v-if="false" />
                <!--负责人id-->
                <el-table-column label="roleId" align="center" prop="roleId" v-if="false" />
            </el-table>
        </div>
    </el-dialog>

    <el-dialog title="空间权限" :visible.sync="setTeamClusterVisible" :before-close="this.closeSetTeamClusterDialog">
        <div>
            <el-tabs v-model="clusterName" type="border-card" v-loading="loadingClusterVisible">
                <el-tab-pane :key="cluster.clusterId" v-for="(cluster, index) in clusterList" :label="cluster.clusterName" :name="cluster.clusterName">
                    <el-row>
                        <el-col :span="24">
                            <el-checkbox-group v-model="clusterNsCheckeds" class="flex-wrap" v-if="cluster.clusterNsList.length">
                                <el-checkbox v-for="clusterNsItem in cluster.clusterNsList" :label="clusterNsItem.clusterNsId" :key="clusterNsItem.clusterNsId" :checked="clusterNsItem.clusterNsChecked" class="label-text" :title="clusterNsItem.clusterNsName">
                                    {{ clusterNsItem.clusterNsName }}
                                </el-checkbox>
                            </el-checkbox-group>

                            <el-image v-else>
                                <div slot="error" class="image-slot">暂无数据</div>
                            </el-image>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>

            <!--

<div v-for="cluster in clusterList" :key="cluster.clusterId">

<el-row>

<el-col :span="24">

<h3 style="margin-bottom: 15px">{{ cluster.clusterName }}</h3>

</el-col>

</el-row>

<el-row>

<el-col :span="24">

<el-checkbox-group v-model="clusterNsCheckeds" class="flex-wrap">

<el-checkbox

v-for="clusterNsItem in cluster.clusterNsList"

:label="clusterNsItem.clusterNsId"

:key="clusterNsItem.clusterNsId"

:checked="clusterNsItem.clusterNsChecked"

class="label-text"

:title="clusterNsItem.clusterNsName"

>

{{ clusterNsItem.clusterNsName }}

</el-checkbox>

</el-checkbox-group>

</el-col>

</el-row>

</div>

-->
        </div>

        <div style="text-align: center; margin-top: 30px">
            <el-button type="primary" @click="saveCluster">确 认</el-button>
            <el-button @click="closeSetTeamClusterDialog">取 消 </el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="addClusterDialogFormVisible" title="创建业务域" :before-close="this.addTeamDialogClose" width="790px">
        <el-steps :active="active" process-status="finish" finish-status="success" simple style="margin-bottom: 20px">
            <el-step title="① 基本信息" icon="none"></el-step>
            <el-step title="② 团队成员" icon="none"></el-step>
            <el-step title="③ 创建成功" icon="none"></el-step>
        </el-steps>

        <div v-if="active == 0" class="flex flex-justify-content-center">
            <el-form ref="addTeamFormStep" :model="teamForm" :rules="addTeamFormStepRules" label-width="100px" label-position="left">
                <el-form-item label="业务域名称:" prop="name">
                    <el-input style="width: 285px" v-model="teamForm.name" placeholder="请输入业务域名称"></el-input>
                </el-form-item>

                <el-form-item label="英文名称:" prop="teamCode">
                    <el-input style="width: 285px" v-model="teamForm.teamCode" placeholder="请输入业务域名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="color: #999; line-height: 22px">
                        提示: 长度为2-30个字符,不得包含特殊字符或者中文;
                        <br />
                        正确示例:algorithm或者monitor-service
                    </div>
                </el-form-item>

                <el-form-item label="负责人:" prop="respPersonId" required>
                    <el-select style="width: 285px" v-model="teamForm.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="active == 1">
            <el-form ref="addTeamMemberForm" :model="memberform" :rules="memberformRules" inline size="small">
                <el-form-item label="成员:" prop="respPersonId" required>
                    <el-select v-model="memberform.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                        <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色:" prop="roleId" required>
                    <el-select v-model="memberform.roleId" placeholder="请选择角色" style="width: 150px" filterable>
                        <el-option v-for="item in roleOptions" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button size="small" type="primary" @click="addTeamMember(teamForm.teamId)">加入应用组</el-button>
            </el-form>

            <div class="title-box">已有成员</div>
            <el-table ref="singleTable" :data="memberTableData" tooltip-effect="dark" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" min-width="40" align="center"></el-table-column>
                <el-table-column prop="memberName" label="名称" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click="removeTeamMember(scope.row)" type="text" size="small">移除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="teamId" align="center" prop="teamId" v-if="false" />
                <!--业务域id-->
                <el-table-column label="respPersonId" align="center" prop="respPersonId" v-if="false" />
                <!--负责人id-->
                <el-table-column label="roleId" align="center" prop="roleId" v-if="false" />
            </el-table>
        </div>

        <template v-if="active == 2">
            <div class="active_sucess">
                <i class="el-icon-success" style="font-size: 100px; color: #67c23a; margin-top: 40px"></i>
                <span style="font-size: 14px; margin-top: 20px"> 接入成功 </span>
            </div>
        </template>

        <div style="text-align: center; margin-top: 40px">
            <el-button v-if="(this.active > 0) & (this.active < 2)" size="medium" @click="prev">上一步
            </el-button>
            <el-button v-if="this.active < 2" size="medium" type="primary" @click="next">下一步
            </el-button>
            <el-button v-if="this.active == 2" size="medium" type="primary" @click="complete">完成
            </el-button>
        </div>
    </el-dialog>

		<!-- 点击新增 -->
    <el-dialog :title="flow.title" :visible.sync="flow.open" @close="requestNameSpaceCancle" width="550px" style="padding: 50px 20px 0 20px;">
        <el-form ref="addTeamFormFlow" :model="teamForm" :rules="addTeamFormStepRules" label-width="120px" label-position="left">
            <el-form-item label="业务域名称:" prop="name">
                <el-input style="width: 325px" show-word-limit maxlength="40" v-model="teamForm.name" placeholder="请输入业务域名称"></el-input>
            </el-form-item>

            <el-form-item label="英文名称:" prop="teamCode">
                <el-input style="width: 325px" show-word-limit maxlength="30" v-model="teamForm.teamCode"
                          @blur="teamCodeBlur"
                          placeholder="请输入业务域名称"></el-input>
            </el-form-item>
            <el-form-item>
                <div style="color: #999; line-height: 22px;width: 325px">

                    <el-alert type="warning" show-icon>

                        <template slot="title">
                            提示: 不得包含特殊字符或者中文;
                            <br />
                            正确示例:algorithm或者monitor-service
                        </template>
                    </el-alert>

                </div>
            </el-form-item>
		
		        <el-form-item label="命名空间:" prop="namespace" required>
				        <el-input style="width: 325px" show-word-limit maxlength="30" v-model="teamForm.namespace" placeholder="请输入命名空间"
				                  clearable
				                  @clear="namespaClear"
				        ></el-input>
		        </el-form-item>
		        <el-form-item>
				        <div style="color: #999; line-height: 22px;width: 325px">
						        <el-alert type="warning" show-icon>
								        <template slot="title">
										        提示: 长度为2-30个字符,不得包含特殊字符或者中文;<br />
										        正确示例:algorithm-ns或者monitor-service-ns
								        </template>
						        </el-alert>
				        </div>
		        </el-form-item>
		        
            <el-form-item label="负责人:" prop="respPersonId" required>
                <el-select style="width: 325px" v-model="teamForm.respPersonId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
                    <el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
		        
		        
        </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer" >
				    <el-button @click="requestNameSpaceCancle" size="small">取 消
				    </el-button>
				    <el-button size="medium" :loading="flow.loading" type="primary" @click="requestNameSpaceCreate">提交申请
				    </el-button>
		    </div>
    </el-dialog>
		
		<!-- 重试命名空间 -->
		<el-dialog title="重试命名空间" :visible.sync="retryNamespaceForm.open" @close="closeRetryNamespace" width="550px" style="padding: 50px 20px 0 20px;">
        <el-form ref="retryNamespace" :model="retryNamespaceForm" :rules="retryNamespaceForm.namespaceRules" label-width="120px" label-position="left">
          
		        <el-form-item label="命名空间:" prop="namespace">
				        <el-input style="width: 325px" show-word-limit maxlength="30" v-model="retryNamespaceForm.namespace" placeholder="请输入命名空间"
				                  clearable
				        ></el-input>
		        </el-form-item>
		        <el-form-item>
				        <div style="color: #999; line-height: 22px;width: 325px">
						        <el-alert type="warning" show-icon>
								        <template slot="title">
										        提示: 长度为2-30个字符,不得包含特殊字符或者中文;<br />
										        正确示例:algorithm-ns或者monitor-service-ns
								        </template>
						        </el-alert>
				        </div>
		        </el-form-item>
		        
        </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer" >
				    <el-button @click="closeRetryNamespace" size="small">取 消
				    </el-button>
				    <el-button size="medium" :loading="retryNamespaceForm.loading" type="primary" @click="submitRetryNamespace">确 定
				    </el-button>
		    </div>
    </el-dialog>
</div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";

export default {
    name: "ams-base-config",
    data() {
        const validateTeamCode = (rule, value, callback) => {
            let regexp = /^[a-z]{1}[a-z|-]{0,28}[a-z]{1}$/;
            let isCorrect = true;
            if (regexp.test(value) == false) {
                isCorrect = false;
            }
            if (value == "") {
                return callback(new Error("请输入符合规则的业务域编码"));
            } else if (!isCorrect) {
                callback(new Error("请输入符合规则的业务域编码"));
            } else {
                callback();
            }
        };
		    const validateNs = (rule, value, callback) => {
						console.log(rule,'----')
						console.log(value,'----')
						console.log(callback,'----')
				    let regexp = /^[a-z]{1}[a-z|-]{0,28}[a-z]{1}$/;
				    let isCorrect = true;
				    if (regexp.test(value) == false) {
						    isCorrect = false;
				    }
				    if (value == "") {
						    return callback(new Error("请输入符合规则的命名空间"));
				    } else if (!isCorrect) {
						    callback(new Error("请输入符合规则的命名空间"));
				    } else {
						    callback();
				    }
		    };
        return {
		        retryNamespaceForm:{
				        loading: false,
				        open: false,
				        namespace: '',
				        
				        namespaceRules:{
						        namespace: [{
								        required: true,
								        message: "请输入命名空间",
								        trigger: "change",
						        }, ],
				        }
		        },
						edit: {
								loading: false,
								TeamVisible: false,
								editForm: {
								
								},
						},
		        
            showTeamAll: false,
            flow: {
                title: "创建业务域",
                open: false,
                loading: false,
            },
            loadingCluster: false,
            clusterName: "",
            active: 0,
            clusterId: "",
            addClusterDialogFormVisible: false,
            clusterNsCheckeds: [],
            clusterList: "",
            roleOptions: [],
            teamId: "",
            memberTableData: [],
		        addTeamMemberBtnLoading: false,
		        removeTeamMemberBtnLoading: false,
            memberform: {
                roleId: "",
                respPersonId: "",
                endDate: "",
                teamId: "",
            },
            respPersonForm: {
                respPersonNameOld: "",
                respPersonId: "",
            },
            teamForm: {
                teamId: "",
                name: "",
                respPersonId: "",
                teamCode: "",
		            namespace: "",
            },
            //分步添加业务域
            addTeamFormStepRules: {
                name: [{
                    required: true,
                    message: "请输入业务域名称",
                    trigger: "change",
                }, ],
                teamCode: [{
                    required: true,
                    validator: validateTeamCode,
                    trigger: "change",
                }, ],
                respPersonId: [{
                    required: true,
                    message: "请选择人员",
                    trigger: "change",
                }, ],
		            namespace: [{
				            required: true,
				            validator: validateNs,
				            trigger: ["blur","change"],
		            }, ],

            },
            //成员表单校验
            memberformRules: {
                respPersonId: [{
                    required: true,
                    message: "请选择团队成员",
                    trigger: "change",
                }, ],
                roleId: [{
                    required: true,
                    message: "请选择角色",
                    trigger: "change",
                }, ],
            },
            //修改负责人校验
            addRespPersonFormRules: {
                respPersonId: [{
                    required: true,
                    message: "请选择团队成员",
                    trigger: "change",
                }, ],
            },
            // 校验规则
            rules: {
                name: [{
                    required: true,
                    message: "请输入集群名称",
                    trigger: "change",
                }, ],
                roleId: [{
                    required: true,
                    message: "请选择角色",
                    trigger: "change",
                }, ],
                respPersonId: [{
                    required: true,
                    message: "请选择人员",
                    trigger: "change",
                }, ],
                teamCode: [{
                    required: true,
                    message: "请输入英文名称",
                    trigger: "blur",
                }, ],
            },
            addRespPersonVisible: false, //修改负责人
            addTeamMemberVisible: false, //团队成员
            tabledataid: "",
            addTeamVisible: false, //添加业务域
            setTeamClusterVisible: false, //集群权限
            loadingClusterVisible: false, // loading
            respPersonName: "", //业务域负责人
            respPersonId: "",
            domainMemberOptions: [], //业务域成员下拉
            tableLabel: [],
            activeName: "team",
            newTitle: "新增",
            formSearch: {
                teamName: "",
                teamCode: "",
            },
            loading: false,
            tableData: [],
            limit: 10,
            page: 1,
            total: 0,
            business_domain_loading: false,
            business_domain_tableData: [],
            business_domain_limit: 10,
            business_domain_page: 1,
            business_domain_total: 0,

            team_url: this.GLOBAL.baseUrl + "/team/list/condition",
		        defaultName:'',
		        oprationBtn: false,
		        apply: false,
        };
    },
    methods: {
				// 重新创建 Namespace
		    retryNamespace(row){
						this.retryNamespaceForm.open = true
						this.retryNamespaceForm.clusterId = row.clusterId
						console.log(row,'===')
				    this.retryNamespaceForm.namespace = row.clusterNsName
		    },
		    closeRetryNamespace(){
				    this.retryNamespaceForm.open = false
				    this.retryNamespaceForm.namespace = ''
				    this.retryNamespaceForm.clusterId = ''
				    this.$refs.retryNamespace.resetFields()
		    },
		    submitRetryNamespace(){
				    if (!this.retryNamespaceForm.namespace){
						    this.$message({
								    type:'error',
								    message: '命名空间不能为空'
						    })
						    return false
				    }
				    let url = this.GLOBAL.baseUrl + `/cluster/addK8sNamespace/${this.retryNamespaceForm.clusterId}/${this.retryNamespaceForm.namespace}`;
				    this.axios({
						    method: "post",
						    url: url,
				    })
					    .then((res) => {
							    if (res.data.code === 200){
											this.closeRetryNamespace()
									    this.init()
									    this.$message({
											    type:'success',
											    message: '重新创建成功'
									    })
							    }else{
									    this.$message({
											    type:'error',
											    message: res.data.message
									    })
									    done();
							    }
					    })
		    },
				// 业务域下线
		    businessDomainOffline(row){
				    this.apply = false;
						let url = this.GLOBAL.baseUrl + "/team/offline/apply";
				    const h1 = this.$createElement;
				    this.$msgbox({
						    title:'提示',
						    showCancelButton: true,
						    cancelButtonText: "取消",
						    confirmButtonText: "确定下线",
						    message: h1('p', { class: 'tac' }, [
								    h1('i', { class: 'el-icon-question confirmIcon' }),
								    h1('span', {class:'msgbox-el'}, '  确定下线该条业务域数据吗？'),
						    ]),
						    beforeClose: (action, instance, done) => {
								    if (action === "confirm") {
										    instance.confirmButtonLoading = true;
										    this.axios({
												    method: "post",
												    url: url,
												    data: {
														    "name":row.name,
														    "teamId": row.teamId,
														    "respPersonId": row.respPersonId,
														    "respPersonName": row.respPersonName,
												    },
										    })
											    .then((res) => {
													    instance.confirmButtonLoading = false;
													    if (res.data.code === 200){
															    done();
															    this.apply = true;
															    this.init()
													    }else{
															    this.apply = false;
															    this.$message({
																	    type:'error',
																	    message: res.data.message
															    })
															    done();
													    }
											    })
								    } else {
										    instance.confirmButtonLoading = false;
										    done();
								    }
						    },
				    }).then((action)=>{
						    if (!this.apply){
										return false
						    }
						    const h = this.$createElement;
						    this.$msgbox({
								    title:'提示',
								    showCancelButton: true,
								    cancelButtonText: "关闭",
								    confirmButtonText: "查看审批状态",
								    message: h('p', { class: 'marl' }, [
										    h('i', { class: 'el-icon-success icolor' }),
										    h('p', {class:'msgbox-el'}, '业务域下线发起成功，请留意后续审批结果'),
								    ]),
						    })
							    .then(() => {
									    this.$router.push("/taskCenter");
							    })
							    .catch((e) => {
									
							    });
						
				    }).catch(()=>{
						    this.$message({
								    type:'info',
								    message:'已取消'
						    })
				    })
		    },
		    
		    editBusinessDomain(row){
						this.edit.TeamVisible = true;
				    this.edit.editForm.nameOrigin = row.name
				    this.edit.editForm.respPersonName = row.respPersonName
				    this.edit.editForm.respPersonId = row.respPersonId
				    this.edit.editForm.teamId = row.teamId
				    // this.$set(row, "editName", true);
		    },
		    closeEditTeamDialog(){
				    this.edit.TeamVisible = false;
						this.$refs.editTeamForm.resetFields()
		    },
				// 更新业务域
		    saveEditTeam(row){
						if (!this.edit.editForm.name){
								this.$message({
										type:'error',
										message: '请输入新业务域名称'
								})
								return false
						}
						this.edit.loading = true
				    let url = this.GLOBAL.baseUrl + "/team/modify/apply";
				    this.axios({
						    method: "post",
						    url: url,
						    data: {
								    "respPersonName": this.edit.editForm.respPersonName,
								    "respPersonId": this.edit.editForm.respPersonId,
								    "nameOrigin": this.edit.editForm.nameOrigin,
								    "id": this.edit.editForm.teamId,
								    "name": this.edit.editForm.name
						    },
				    })
					    .then((res) => {
							    this.edit.loading = ''
							    if (res.data.code === 200){
									    this.edit.TeamVisible = false;
									    const h = this.$createElement;
									    this.$msgbox({
											    title:'提示',
											    showCancelButton: true,
											    cancelButtonText: "关闭",
											    confirmButtonText: "查看审批状态",
											    message: h('p', { class: 'marl' }, [
													    h('i', { class: 'el-icon-success icolor' }),
													    h('p', {class:'msgbox-el'}, '业务域更新发起成功，请留意后续审批结果'),
											    ]),
									    })
										    .then(() => {
												    this.$router.push("/taskCenter");
										    })
										    .catch((e) => {
												
										    });
									
									    this.init()
							    }else{
									    this.$message({
											    type:'error',
											    message: res.data.message
									    })
							    }
					    }).finally(()=>{
						    this.edit.loading = false
				    })
		    },
		    
		    init(){
				    this.initBusinessDomainTableData(
					    this.team_url,
					    this.business_domain_limit,
					    this.business_domain_page
				    );
		    },
		    
		    teamCodeBlur(val){
				    if (val.target.value ){
						    this.teamForm.namespace = `${val.target.value}-ns`
				    }
		    },
		    namespaceBlur(val){
				    if (val.target.value && !val.target.value.endsWith('-ns')){
						    this.teamForm.namespace = `${val.target.value}-ns`
				    }
		    },
		    namespaClear(){
				    this.teamForm.namespace =''
		    },
        //创建工作流
        createNameSpaceWorkFlow() {
            this.flow.open = true;
        },
        requestNameSpaceCancle() {
            this.flow.open = false;
            this.$refs.addTeamFormFlow.resetFields();
        },
        requestNameSpaceCreate() {
            var that = this;
            this.$refs.addTeamFormFlow.validate(async (valid) => {
                if (valid) {
                    this.flow.loading = true;
                    let url = this.GLOBAL.baseUrl + "/team/create/namespace/flow";
                    this.axios({
                            method: "post",
                            url: url,
                            data: this.teamForm,
                        })
                        .then((res) => {
                            console.log(res)
                            this.flow.open = false;
                            this.flow.loading = false;
                            if (res.data.code === 200) {
                                /*this.$confirm("业务域申请发起成功，请留意后续审批结果", "提示", {
                                        distinguishCancelAndClose: true,
                                        cancelButtonText: "关闭",
                                        confirmButtonText: "查看审批状态",
                                    })
                                    .then(() => {
                                        that.$router.push("/taskCenter");
                                    })
                                    .catch((e) => {

                                    });*/
		
		                            const h = this.$createElement;
		                            this.$msgbox({
				                            title:'提示',
				                            showCancelButton: true,
				                            cancelButtonText: "关闭",
				                            confirmButtonText: "查看审批状态",
				                            message: h('p', { class: 'marl' }, [
						                            h('i', { class: 'el-icon-success icolor' }),
						                            h('p', {class:'msgbox-el'}, '业务域申请发起成功，请留意后续审批结果'),
				                            ]),
		                            })
			                            .then(() => {
					                            that.$router.push("/taskCenter");
			                            })
			                            .catch((e) => {
					
			                            });
		
																
		
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch((err) => {
                            this.flow.loading = false;
                            alert(err);
                        });
                }
            });
        },
        prev() {
            this.active = this.active - 1;
        },
        complete() {
            this.addClusterDialogFormVisible = false;
            this.getTableTitle();
            this.initBusinessDomainTableData(
                this.team_url,
                this.business_domain_limit,
                this.business_domain_page
            );
        },
        next() {
            if (this.active == 0) {
                this.$refs.addTeamFormStep.validate(async (valid) => {
                    if (valid) {
                        let url = this.GLOBAL.baseUrl + "/team/add/step1";
                        this.axios({
                                method: "post",
                                url: url,
                                data: this.teamForm,
                            })
                            .then((res) => {
                                if (res.data.code === 200) {
                                    this.teamForm.teamId = res.data.data.teamId;
                                    this.$message({
                                        message: res.data.message,
                                        type: "success",
                                    });
                                    this.active++;
                                    this.getTeamMembers(res.data.data.teamId);
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch((err) => {
                                alert(err);
                            });
                    }
                });
            } else if (this.active == 1) {
                this.active++;
            } else if (this.active == 2) {
                this.active++;
            } else if (this.active > 3) {
                this.active = 1;
                this.active++;
            }
        },
        toAddTeamDialogStep: function () {
            this.addClusterDialogFormVisible = true;
            this.active = 0;
        },
        //创建nameSpace
        getAllCluster(row) {
            this.clusterNsCheckeds = [];
            let url = this.GLOBAL.baseUrl + "/team/cluster/" + this.teamId + "/all";
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        this.loadingClusterVisible = false;
                        this.$set(row, "loading", false);
                        this.setTeamClusterVisible = true;

                        this.clusterList = res.data.data;
                        this.clusterName = this.clusterList[0].clusterName;

                        // 反显所有选中的数据
                        this.$nextTick(() => {
                            this.clusterList.forEach((cluster) => {
                                if (cluster.clusterNsList && cluster.clusterNsList.length > 0) {
                                    cluster.clusterNsList.forEach((clusterNsItem) => {
                                        if (clusterNsItem.clusterNsChecked) {
                                            this.clusterNsCheckeds.push(clusterNsItem.clusterNsId);
                                        }
                                    });
                                }
                            });
                        });
                    }
                })
                .catch((err) => {
                    this.loadingClusterVisible = false;
                    this.$set(row, "loading", false);
                    this.setTeamClusterVisible = false;
                    this.$alert(`查询失败！错误信息:${err}`, "提示", {
                        type: "error",
                    });
                });
        },
        tabClick(tab, event) {
            if (tab.name === "team") {
                this.getTableTitle();
                this.initBusinessDomainTableData(
                    this.team_url,
                    this.business_domain_limit,
                    this.business_domain_page
                );
            } else {
                aler("Tab选择错误");
            }
        },
        //添加成员
        addTeamMember(teamIdVar) {
            console.log("addTeamMember:" + teamIdVar);
            this.$refs.addTeamMemberForm.validate(async (valid) => {
                if (valid) {
		                this.addTeamMemberBtnLoading = true
                    let url = this.GLOBAL.baseUrl + "/team/member/add";
                    console.log(this.memberform);
                    this.memberform.teamId = teamIdVar;
                    this.axios({
                            method: "post",
                            url: url,
                            data: this.memberform,
                        })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$alert("操作成功", "提示", {
                                    type: "success",
                                });
                                this.$refs.addTeamMemberForm.resetFields();
                                this.getTeamMembers(teamIdVar);
                            } else {
                                this.$alert(res.data.message, "提示", {
                                    type: "warning",
                                });
                            }
                        })
	                    .finally(()=>{
			                    this.addTeamMemberBtnLoading = false
	                    })
                        .catch((err) => {
                            alert(err);
                        });
                }
                this.domainMemberOptions = [];
            });
        },

        // 关闭设置业务域负责人框
        addTeamMemberClose() {
            this.$refs.addTeamMemberForm.resetFields();
            this.domainMemberOptions = [];
            this.addTeamMemberVisible = false;
        },
        //业务域
        getSelectData() {
            let url = this.GLOBAL.baseUrl + "/team/init/select";
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        // 角色
                        res.data.data.roles.forEach((element) => {
                            this.roleOptions.push({
                                key: element.selectKey,
                                value: element.selectValue,
                            });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
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

        //保存修改负责人
        saveAddMainPerson() {
            this.$refs.addRespPersonForm.validate(async (valid) => {
                if (valid) {
                    let url =
                        this.GLOBAL.baseUrl +
                        "/team/resp/update/" +
                        this.tabledataid +
                        "/" +
                        this.respPersonForm.respPersonIdOld +
                        "/" +
                        this.respPersonForm.respPersonId;
                    this.axios({
                            method: "post",
                            url: url,
                            data: this.respPersonForm,
                        })
                        .then((res) => {
                            if (res.data.code === 200) {
		                            this.$alert("操作成功", "提示", {
				                            type: "success",
		                            });
                                this.$refs.addRespPersonForm.resetFields();
                                this.addRespPersonVisible = false;
                                this.initBusinessDomainTableData(
                                    this.team_url,
                                    this.business_domain_limit,
                                    this.business_domain_page
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
                this.domainMemberOptions = [];
            });
        },

        //保存业务域
        saveAddTeam() {
            this.$refs.addTeamForm.validate(async (valid) => {
                if (valid) {
                    let url = this.GLOBAL.baseUrl + "/team/add";

                    this.axios({
                            method: "post",
                            url: url,
                            data: this.teamForm,
                        })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.initBusinessDomainTableData(
                                    this.team_url,
                                    this.business_domain_limit,
                                    this.business_domain_page
                                );
                                this.$refs.addTeamForm.resetFields();
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                });
                            } else {
                                this.$message.error("添加失败，请重试");
                            }
                            this.addTeamVisible = false;
                        })
                        .catch((err) => {
                            alert(err);
                            this.addTeamVisible = false;
                        });
                }
            });
        },
        saveCluster: function () {
            let url = this.GLOBAL.baseUrl + "/team/cluster/set";
            this.axios({
                    method: "post",
                    url: url,
                    data: {
                        clusterNsCheckeds: new Set(this.clusterNsCheckeds),
                        teamId: this.teamId,
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        this.$alert("操作成功", "提示", {
                            type: "success",
                        });
                        this.closeSetTeamClusterDialog();
                    } else {
                        this.$alert(res.data.message, "提示", {
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        },
        //打开添加业务域弹框
        toAddTeamDialog() {
            this.addTeamVisible = true;
        },
        deleteteamDialog() {
		        this.$alert("暂时不支持删除业务域", "提示", {
				        type: "warning",
		        });
        },

        // 关闭
        closeAddTeamDialog() {
            if (this.addTeamVisible) {
                this.addTeamVisible = false;
            }
            this.getTableTitle();
            this.getData();
        },

        //设置业务域负责人
        setRespPerson(row) {
            this.addRespPersonVisible = true;
            if (row && row.teamId) {
                this.respPersonForm.respPersonNameOld = row.respPersonName;
                this.respPersonForm.respPersonIdOld = row.respPersonId;
                this.tabledataid = row.teamId;
            } else {
                this.respPersonName = "";
                this.respPersonId = "";
                this.tabledataid = "";
            }
        },

        // 关闭设置业务域负责人框
        closeRespPersonDialog() {
            this.$refs.addRespPersonForm.resetFields();
            this.domainMemberOptions = [];
            if (this.addRespPersonVisible) {
                this.addRespPersonVisible = false;
            }
            this.getTableTitle();
            this.getData();
        },

        //设置成员
        setTeamMermber(row) {
            this.addTeamMemberVisible = true;
            console.log("setTeamMermber:" + JSON.stringify(row));
            if (row && row.teamId) {
                this.tabledataid = row.teamId;
                this.getTeamMembers(row.teamId);
            } else {
                this.tabledataid = "";
            }
        },

        getTeamMembers(teamIdVar) {
            this.showTeamAll = true;
            this.memberTableData = [];
            let url = this.GLOBAL.baseUrl + "/team/member/" + teamIdVar + "/all";
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    this.showTeamAll = false;
                    if (res.status === 200) {
                        this.memberTableData = res.data.data;
                    }
                })
                .catch((err) => {
                    this.showTeamAll = false;
                    alert(err);
                });
        },

        // 关闭设置业务域负责人框
        closeTeamMermberDialog() {
            if (this.addTeamMemberVisible) {
                this.addTeamMemberVisible = false;
            }
            this.getTableTitle();
            this.getData();
        },

        //设置集群权限
        setTeamCluster(row) {
            this.$set(row, "loading", true);
            // this.setTeamClusterVisible = true;
            this.loadingClusterVisible = true;
            if (row && row.teamId) {
                this.tabledataid = row.teamId;
                this.teamId = row.teamId;
                this.getAllCluster(row);
            } else {
                this.tabledataid = "";
            }
        },

        // 关闭设置业务域负责人框
        closeSetTeamClusterDialog() {
            if (this.setTeamClusterVisible) {
                this.setTeamClusterVisible = false;
            }

            this.clusterName = "";
            this.clusterNsCheckeds = [];
            // this.clusterList = []
            this.getTableTitle();
            this.initBusinessDomainTableData(
                this.team_url,
                this.business_domain_limit,
                this.business_domain_page
            );
        },

        removeTeamMember(row) {
						console.log(row,'========')
            this.$confirm("是否确认移除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
										this.$set(row, 'removeTeamMemberBtnLoading', true)
                    let url =
                        this.GLOBAL.baseUrl +
                        "/team/member/" +
                        row.teamId +
                        "/" +
                        row.respPersonId +
                        "/" +
                        row.roleId;
                    this.axios({
                            method: "delete",
                            url: url,
                        })
                        .then((res) => {
                            let msg;
                            if (res.data.code === 200) {
                                msg = "移除成功";
                                this.getTeamMembers(row.teamId);
                            } else {
                                msg = res.data.message;
                            }
                            this.$alert(msg, "提示", {
                                type: "warning",
                            });
                        })
	                      .finally(()=>{
			                      this.$set(row, 'removeTeamMemberBtnLoading', false)
	                      })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        // 获取表格数据；
        initBusinessDomainTableData: function (url, page_size, page_index) {
            this.business_domain_loading = true;
            const parms = {
                pageSize: page_size,
                pageNumber: page_index,
                teamName: this.formSearch.teamName,
                teamCode: this.formSearch.teamCode,
            };
            this.axios({
                    method: "GET",
                    url: url,
                    params: parms,
                })
                .then((response) => {
                    if (response.data.code == 200) {
		                    response.data.data.list = response.data.data.list.map(item=>{
														return {
																...item,
																editName:false,
														}
		                    })
                        this.business_domain_tableData = response.data.data.list;
                        this.business_domain_total = response.data.data.total;
                    } else {
                        this.$message.error(response.data.error);
                    }
                    this.business_domain_loading = false;
                })
                .catch((response) => {
                    this.business_domain_loading = false;
                    this.$message.error(String(response));
                });
        },

        getTableTitle() {
            let url = this.GLOBAL.baseUrl + "/team/member/table-title";
            this.axios({
                    method: "get",
                    url: url,
                })
                .then((res) => {
                    if (res.status === 200) {
                        this.tableLabel = res.data.data;
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        },

        addTeamDialogClose: function () {
            this.addClusterDialogFormVisible = false;
            this.teamForm.teamId = "";
            this.teamForm.name = "";
            this.teamForm.respPersonId = "";
            this.teamForm.teamCode = "";

            this.memberform.roleId = "";
            this.memberform.respPersonId = "";
            this.memberform.endDate = "";
            this.memberform.teamId = "";
        },
    },

    computed: {},

    mounted() {
        //初始化业务域相关数据
        this.getTableTitle();
        this.initBusinessDomainTableData(
            this.team_url,
            this.business_domain_limit,
            this.business_domain_page
        );
        this.getSelectData();
    },
    components: {
        pagination: pagination,
        editor: require("vue2-ace-editor"),
    },
};
</script>

<style lang="scss" scoped>
/deep/ .el-message-box__content {
		padding-top: 20px;
		padding-bottom: 20px;
}
.msgbox-el{
		font-size: 18px;
}
.icolor{
		color:#55f513;
		font-size: 60px;
}
.marl{
		margin-left: 20px;
}
.tac{
		text-align: center;
}
.confirmIcon{
		font-size: 25px;
		color: #f5c813;
}
.label-text .el-checkbox__label {
    vertical-align: -3px;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}

/deep/ .el-tabs--border-card>.el-tabs__content {
    max-height: 500px;
    overflow: auto;
}

.el-image {
    text-align: center;
    width: 100%;
    font-size: 20px;
    color: #9a9a9b;
    padding: 20px;
}

.active_sucess {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.team-main {
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.team-main .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.team-main .el-tabs__content {
    flex: 1;
}

.team-main .el-tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.team-main .table-box {
    flex: 1;
    overflow-y: auto;
}

.label-text {
    width: 25%;
    margin-right: 0;
    margin-bottom: 10px;
}

.title-box {
    color: #333;
    font-size: 14px;
    font-weight: bold;
    padding-left: 12px;
    position: relative;
    margin-bottom: 12px;
}

.title-box::after {
    content: "";
    display: inline-block;
    width: 4px;
    height: 14px;
    border-radius: 4px;
    background: $primary;
    position: absolute;
    left: 0;
    top: 5px;
}
</style>
