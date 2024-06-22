<template>
  <div class="team-main flex-column">
    <div class="search-box flex-center-between">
      <div class="flex flex-align-items-center" style="margin-bottom:20px">
        <el-button  icon="el-icon-plus" @click="AddNewCursor"
            >关联集群</el-button
          >
          <el-button type="primary" icon="el-icon-plus" @click=" AddNewCursorEnv"
            >自定义环境</el-button
          >
          <el-button type="primary" icon="el-icon-plus" @click=" ClusterCreateAndAdd"
            >一键部署</el-button
          >
      </div>
      <!-- 搜索 -->
      <el-form
        :inline="true"
        :model="formSearch"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item
          ><el-input
            style="width: 284px"
            clearable
            v-model="formSearch.name"
            placeholder="请输入集群名称"
            @keyup.enter.native="InitGetTableData(cluster_url, limit, page)"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="InitGetTableData(cluster_url, limit, page)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        stripe
        :data="tableData"
        v-loading="loading"
        @selection-change="GetSectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          label="集群名称"
          prop="name"
          min-width="120"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="环境类型"
          prop="envName"
          min-width="120"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="集群外部访问方式"
          prop="visitType"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.visitType === 2">NodePor类型</span>
            <span v-else-if="scope.row.visitType === 3">Ingress类型</span>
            <span v-else>无</span>
          </template></el-table-column
        >
        <el-table-column label="操作" width="600" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editNameAndKubeConfig(scope.row)"
              :plain="true"
              >更新名称与kubeconfig</el-button
            >
            <el-button
              type="info"
              size="mini"
              @click="editNamespace(scope.row)"
              :plain="true"
              >忽略namespace</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="createNamespace(scope.row)"
              :plain="true"
              >创建namespace</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="editVisitType(scope.row)"
              :plain="true"
              >管理集群外访问方式</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="InitGetTableData(cluster_url, limit, page)"
    ></pagination>

    <!-- 新template Row -->
    <el-dialog
      :title="newTitle"
      :visible.sync="dialognewRowForm"
      :close-on-click-modal="false"
      width="998px"
    >
      <el-form
        size="mini"
        label-width="120px"
        :model="newRow"
        ref="newRow"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item hidden>
          <el-input v-model="newRow.id" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="newRow.name" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
          :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
        >
          <editor
            v-model="newRow.content"
            @init="common.editorInit"
            lang="yaml"
            theme="merbivore"
            width="100%"
            height="500"
          ></editor>
        </el-form-item>

        <el-form-item label>
          <el-button
            type="primary"
            plain="plain"
            @click="newPutRow(cluster_url, 'POST')"
            v-if="!newRow.id"
            :loading="action_loading"
            >确 定</el-button
          >
          <el-button
            type="warning"
            plain="plain"
            @click="newPutRow(cluster_url, 'PUT')"
            v-if="newRow.id"
            :loading="action_loading"
            >更 新</el-button
          >
          <el-button @click="dialognewRowForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新image Row -->
    <el-dialog
      :title="newTitle"
      :visible.sync="dialognewImageForm"
      :close-on-click-modal="false"
      width="998px"
    >
      <el-form
        size="mini"
        label-width="120px"
        :model="newImage"
        ref="newImage"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item hidden>
          <el-input v-model="newImage.id" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="newImage.name" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item
          label="镜像地址"
          prop="image"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="newImage.image"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newImage.description" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label>
          <el-button
            type="primary"
            plain="plain"
            @click="ImagenewPutRow(image_url, 'POST')"
            v-if="!newImage.id"
            :loading="action_loading"
            >确 定</el-button
          >
          <el-button
            type="warning"
            plain="plain"
            @click="ImagenewPutRow(image_url, 'PUT')"
            v-if="newImage.id"
            :loading="action_loading"
            >更 新</el-button
          >
          <el-button @click="dialognewImageForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新BusinessDomain Row -->
    <el-dialog
      :title="newTitle"
      :visible.sync="dialogBusinessDomainForm"
      :close-on-click-modal="false"
      width="998px"
    >
      <el-form
        size="mini"
        label-width="120px"
        :model="newBusinessDomain"
        ref="newBusinessDomain"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item hidden>
          <el-input
            v-model="newBusinessDomain.id"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input
            v-model="newBusinessDomain.name"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="代号"
          prop="code"
          :rules="[
            { required: true, message: '请输入名称', trigger: 'blur' },
            {
              pattern: /^[a-z\-]+$/,
              message: '只能输入小写英文字母和-',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="newBusinessDomain.code"></el-input>
        </el-form-item>
        <el-form-item label="上级域">
          <el-select
            v-model="newBusinessDomain.up_domain_id"
            clearable
            filterable
            placeholder="上级域"
          >
            <el-option
              :value="item.id"
              :label="item.name + '<' + item.code + '>'"
              v-for="(item, index) in business_domains"
              :key="index"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.code
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newBusinessDomain.description"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建NS">
          <el-checkbox-group v-model="create_ns">
            <el-checkbox
              v-for="env in ['dev', 'test', 'uat', 'prod']"
              :label="env"
              :key="env"
              >{{ env }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Harbor项目">
          <el-switch v-model="harbor_create"></el-switch>
        </el-form-item>
        <el-form-item label="NS初始化">
          <el-switch v-model="ns_init"></el-switch>
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">1. 镜像key<br />2. 证书</div>
            <icon class="el-icon-chat-dot-round" style="cursor: pointer"></icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label>
          <el-button
            type="primary"
            plain="plain"
            @click="BusinessDomainnewPutRow(team_url, 'POST')"
            v-if="!newBusinessDomain.id"
            :loading="action_loading"
            >确 定</el-button
          >
          <el-button
            type="warning"
            plain="plain"
            @click="BusinessDomainnewPutRow(team_url, 'PUT')"
            v-if="newBusinessDomain.id"
            :loading="action_loading"
            >更 新</el-button
          >
          <el-button @click="dialogBusinessDomainForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新Env Row -->
    <el-dialog
      :title="newTitle"
      :visible.sync="dialognewEnvForm"
      :close-on-click-modal="false"
      width="998px"
    >
      <el-form
        size="mini"
        label-width="120px"
        :model="newEnv"
        ref="newEnv"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item hidden>
          <el-input v-model="newEnv.id" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="newEnv.name" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newEnv.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-select v-model="newEnv.is_enable" placeholder="启用">
            <el-option :value="true" label="是"></el-option>
            <el-option :value="false" label="否"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label>
          <el-button
            type="primary"
            plain="plain"
            @click="EnvPutRow(env_url, 'POST')"
            v-if="!newEnv.id"
            :loading="action_loading"
            >确 定</el-button
          >
          <el-button
            type="warning"
            plain="plain"
            @click="EnvPutRow(env_url, 'PUT')"
            v-if="newEnv.id"
            :loading="action_loading"
            >更 新</el-button
          >
          <el-button @click="dialognewEnvForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="结果"
      :visible.sync="ShowResultProject"
      :close-on-click-modal="false"
      width="998px"
    >
      <div v-if="ResultProjectInit.harbor_ret.status !== 'default'">
        <div>
          <span style="font-weight: bold">Harbor 项目创建：</span>
          <span
            style="font-weight: bold; color: green"
            v-if="ResultProjectInit.harbor_ret.status === 'success'"
            >{{ ResultProjectInit.harbor_ret.msg }}</span
          >
          <span style="font-weight: bold; color: red" v-else>{{
            ResultProjectInit.harbor_ret.msg
          }}</span>
        </div>
      </div>
      <div
        v-if="ResultProjectInit.create_ns_ret.status !== 'default'"
        style="margin-top: 10px"
      >
        <div style="font-weight: bold">创建 Namespace：</div>
        <div
          v-for="(o, i) in ResultProjectInit.create_ns_ret.list"
          :key="i"
          class="text item"
        >
          <span
            style="font-weight: bold; color: green"
            v-if="o.status === 'success'"
            >创建命名空间 {{ o.namespace }}成功， 信息：{{ o.msg }}</span
          >
          <span style="font-weight: bold; color: red" v-else
            >创建命名空间{{ o.namespace }}失败， 信息：{{ o.msg }}</span
          >
        </div>
      </div>
      <div
        v-if="ResultProjectInit.ns_init_ret.status !== 'default'"
        style="margin-top: 10px"
      >
        <div style="font-weight: bold">Namespace 初始化：</div>
        <div
          v-for="(o, i) in ResultProjectInit.ns_init_ret.list"
          :key="i"
          class="text item"
        >
          <span>命名空间{{ o.namespace }}下，</span>
          <span>
            创建 Image key
            <span
              style="font-weight: bold; color: green"
              v-if="o.image === 'success'"
              >成功。</span
            >
            <span style="font-weight: bold; color: red" v-else
              >失败，{{ o.image }}</span
            >
          </span>
          <span>
            创建 证书
            <span
              style="font-weight: bold; color: green"
              v-if="o.cert === 'success'"
              >成功。</span
            >
            <span style="font-weight: bold; color: red" v-else
              >失败，{{ o.cert }}</span
            >
          </span>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="新增业务域" :visible.sync="addTeamVisible" width="40%">
      <el-form
        ref="addTeamForm"
        :model="teamForm"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务域名称:" prop="name">
              <el-input
                v-model="teamForm.name"
                placeholder="请输入业务域名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="英文名称:" prop="teamCode">
              <el-input
                v-model="teamForm.teamCode"
                placeholder="请输入业务域名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="负责人:" prop="respPersonId" required>
              <el-select
                style="width: 100%"
                v-model="teamForm.respPersonId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getTenantMembersByKeyword"
                :loading="loading"
                clearable
                @change="clearDomainMemberOptions"
                @focus="clearDomainMemberOptions"
              >
                <el-option
                  v-for="item in domainMemberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="SaveAddTeam">确 认</el-button>
          <el-button type="info" @click="closeAddTeamDialog">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改负责人"
      :visible.sync="addRespPersonVisible"
      width="40%"
    >
      <el-form
        ref="addRespPersonForm"
        :model="respPersonForm"
        :rules="addRespPersonFormRules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="当前负责人:" prop="respPersonNameOld">
              <el-input
                v-model="respPersonForm.respPersonNameOld"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="负责人:" prop="respPersonId" required>
              <el-select
                style="width: 100%"
                v-model="respPersonForm.respPersonId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getTenantMembersByKeyword"
                :loading="loading"
                clearable
                @change="clearDomainMemberOptions"
                @focus="clearDomainMemberOptions"
              >
                <el-option
                  v-for="item in domainMemberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="SaveAddMainPerson">确 认</el-button>
          <el-button type="info" @click="closeRespPersonDialog"
            >取 消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="团队成员"
      :visible.sync="addTeamMemberVisible"
      width="80%"
      :before-close="addTeamMemberClose"
    >
      <el-form
        ref="addTeamMemberForm"
        :model="memberform"
        :rules="memberformRules"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="成员:" prop="respPersonId" required>
              <el-select
                v-model="memberform.respPersonId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getTenantMembersByKeyword"
                :loading="loading"
                clearable
                @change="clearDomainMemberOptions"
                @focus="clearDomainMemberOptions"
              >
                <el-option
                  v-for="item in domainMemberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="角色:" prop="roleId" required>
              <el-select
                v-model="memberform.roleId"
                placeholder="请选择角色"
                style="width: 150px"
                filterable
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button size="medium" type="primary" @click="addTeamMember()"
              >加入应用组</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <span style="float: left; padding-top: 10px">已有成员</span><br /><br />
      <el-table
        ref="singleTable"
        :data="memberTableData"
        border
        tooltip-effect="dark"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          type="index"
          min-width="40"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="memberName"
          label="名称"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="addDate"
          label="加入时间"
          align="center"
          :formatter="dateFormat"
        ></el-table-column> -->
        <el-table-column
          prop="roleName"
          label="角色"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="endDate"
          label="到期日期"
          align="center"
          :formatter="dateFormat"
        ></el-table-column> -->
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              @click="removeTeamMember(scope.row)"
              type="text"
              size="small"
              >移除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="teamId"
          align="center"
          prop="teamId"
          v-if="false"
        />
        <!--业务域id-->
        <el-table-column
          label="respPersonId"
          align="center"
          prop="respPersonId"
          v-if="false"
        />
        <!--负责人id-->
        <el-table-column
          label="roleId"
          align="center"
          prop="roleId"
          v-if="false"
        />
      </el-table>
    </el-dialog>

    <el-dialog title="空间权限" :visible.sync="setTeamClusterVisible">
      <span v-for="cluster in clusterList" :key="cluster.clusterId">
        <el-row>
          <el-col :span="24">
            <h4 style="float: left">{{ cluster.clusterName }}</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-checkbox-group v-model="clusterNsCheckeds" style="">
              <el-checkbox
                v-for="clusterNsItem in cluster.clusterNsList"
                :label="clusterNsItem.clusterNsId"
                :key="clusterNsItem.clusterNsId"
                :checked="clusterNsItem.clusterNsChecked"
                style="margin-left: 0px; float: left"
              >
                {{ clusterNsItem.clusterNsName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </span>
      <div style="text-align: center">
        <el-button type="primary" @click="Savecluster">确 认</el-button>
        <el-button type="info" @click="closeSetTeamClusterDialog"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <!-- //更新名称与kubeconfig -->

    <el-dialog
      title="更新名称和kubeconfig"
      :visible.sync="nameAndKubeConfigDialogFormVisible"
      width="590px"
    >
      <el-form
        ref="nameAndKubeConfigAddForm"
        :model="kubeconfigform"
        label-width="120px"
      >
        <el-input v-model="kubeconfigform.id" type="hidden"></el-input>
        <el-form-item label="集群名称:" required>
          <el-input
            v-model="kubeconfigform.name"
            style="width: 286px"
          ></el-input>
        </el-form-item>
        <el-form-item label="环境类型:" required>
          <el-select
            v-model="kubeconfigform.envFlag"
            placeholder="请选择环境"
            style="width: 286px"
          >
            <el-option
              v-for="item in envOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="kubeconfig" required>
          <el-upload
            action="/"
            ref="upload"
            accept=""
            :before-upload="beforeUpload"
            :default-file-list="this.fileList"
          >
            <el-button icon="el-icon-upload" size="mini"
              >上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item required>
          <el-input
            type="textarea"
            v-model="kubeconfigform.kubeConfig"
            id="tenantRemark"
            rows="6"
            style="width: 286px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="UpdateK8sConfig()"
            >保 存</el-button
          >
          <el-button size="small" @click="ResetConfig('K8sConfig')"
            >重 置</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- //忽略namespace -->
    <el-dialog
      title="忽略namespace"
      :visible.sync="namespaceDialogFormVisible"
      width="590px"
    >
      <div class="btn-group flex">
        <div class="btn btn1" @click="ignoreAll()">全部忽略</div>
        <div class="btn btn2" @click="enableAll()">全部启用</div>
      </div>
      <el-table
        :data="namespaceTableData"
        height="380"
        style="width: 100%"
        class="namespace-table"
      >
        <el-table-column v-if="false" prop="id" label="隐藏id">
        </el-table-column>
        <el-table-column prop="name" label="命名空间"> </el-table-column>
        <el-table-column label="是否忽略" align="right">
          <template slot-scope="scope">
            <el-switch
              on-text="是"
              off-text="否"
              on-color="#5B7BFA"
              off-color="#dadde5"
              v-model="scope.row.status"
              @change="enableAndIgnoreNs(scope.$index, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column :render-header="renderButtons"></el-table-column> -->
      </el-table>
      <div style="margin-top: 15px; text-align: center">
        <el-button size="small" type="primary" @click="IgnoreNamespace"
          >确 定</el-button
        >
        <el-button size="small" @click="closeNamespace">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="创建namespace"
      :visible.sync="createNamespaceDialogFormVisible"
      width="590px"
    >
      <div class="flex flex-justify-content-center">
        <el-form
          ref="createNameSpaceFormRef"
          :model="createNameSpaceForm"
          :rules="rules"
          label-width="120px"
        >
          <el-input v-model="createNameSpaceForm.id" type="hidden"></el-input>
          <el-form-item label="命名空间名称:" prop="namespaceName" required>
            <el-input
              v-model="createNameSpaceForm.namespaceName"
              style="width: 284px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="tip">
              提示: 长度为2-30个字符,不得包含特殊字符或者中文;<br />
              正确示例:algorithm或者monitor-service
            </div>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="confirmAddForm"
              >确 定</el-button
            >
            <el-button size="small" @click="closeCreateNameSpace"
              >取 消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- //管理集群外访问方式 -->
    <el-dialog
      title="管理集群外访问方式"
      :visible.sync="visitTypeDialogFormVisible"
      width="590px"
    >
      <div class="flex flex-justify-content-center">
        <el-form
          ref="vistTypeform"
          :model="formVistType"
          :rules="rules"
          label-width="120px"
        >
          <el-input v-model="formVistType.id" type="hidden"></el-input>
          <el-row>
            <el-col>
              <el-form-item label="集群访问方式:" prop="visitType" required>
                <el-select
                  v-model="formVistType.visitType"
                  placeholder="请选择集群访问方式"
                  @change="visitTypeSelectOptionChange($event)"
                  style="width: 286px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="visitType == 2">
            <el-col>
              <el-form-item label="NodeIp1:" prop="nodeIp1" required>
                <el-input
                  v-model="formVistType.nodeIp1"
                  style="width: 286px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="visitType == 3">
            <el-col>
              <el-form-item label="Ingress域名:" prop="ingressDs" required>
                <el-input
                  v-model="formVistType.ingressDs"
                  style="width: 286px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="margin-top: 15px; text-align: center">
        <el-button size="small" type="primary" @click="saveFormVistType"
          >确 定</el-button
        >
        <el-button size="small" @click="closeFormVistType">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="addClusterDialogFormVisible"
      title="新增集群信息"
      width="790px"
    >
      <el-steps
        :active="active"
        finish-status="success"
        simple
        process-status="finish"
      >
        <el-step title="① 输入集群信息" icon="none"></el-step>
        <el-step title="② 选择空间" icon="none"></el-step>
        <el-step title="③ 接入完成" icon="none"></el-step>
      </el-steps>

      <div class="flex flex-justify-content-center" v-if="active == 0">
        <el-form
          ref="NewNameAndKubeConfigAddForm"
          :model="AddKubeconfigform"
          label-width="120px"
          label-position="left"
        >
          <el-input v-model="AddKubeconfigform.id" type="hidden"></el-input>
          <el-form-item label="集群名称:" required>
            <el-input
              v-model="AddKubeconfigform.name"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="环境类型:" required>
            <el-select
              v-model="AddKubeconfigform.envFlag"
              placeholder="请选择环境"
              style="width: 495px"
            >
              <el-option
                v-for="item in envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="vpcId">
            <el-input
              v-model="AddKubeconfigform.vpcId"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="subnet">
            <el-input
              v-model="AddKubeconfigform.subnet"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="kubeconfig" required>
            <el-upload
              action="/"
              ref="upload"
              accept=""
              :before-upload="beforeUpload"
              :default-file-list="this.fileList"
            >
              <el-button icon="el-icon-upload" size="mini"
                >上传</el-button
              >
            </el-upload>
          </el-form-item>
          <el-form-item required>
            <el-input
              type="textarea"
              v-model="AddKubeconfigform.kubeConfig"
              id="tenantRemark"
              rows="6"
              style="width: 495px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <template v-if="active == 1">
        <div class="btn-group flex" style="margin-top:20px">
          <div class="btn btn1" @click="ignoreAll()">全部忽略</div>
          <div class="btn btn2" @click="enableAll()">全部启用</div>
        </div>
        <el-table
          :data="namespaceTableData"
          height="380"
          style="width: 100%"
          class="namespace-table"
        >
          <el-table-column v-if="false" prop="id" label="隐藏id">
          </el-table-column>
          <el-table-column prop="name" label="命名空间"> </el-table-column>
          <el-table-column label="是否忽略" align="right">
            <template slot-scope="scope">
              <el-switch
                on-text="是"
                off-text="否"
                on-color="#5B7BFA"
                off-color="#dadde5"
                v-model="scope.row.status"
                @change="enableAndIgnoreNs(scope.$index, scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-if="active == 2">
        <div class="active_sucess">
          <i
            class="el-icon-success"
            style="font-size: 100px; color: #67c23a; margin-top: 40px"
          ></i>
          <span style="font-size: 20px; font-weight: blod; margin-top: 40px">
            接入成功
          </span>
        </div>
      </template>

      <div style="text-align: center; margin-top: 20px">
        <el-button
          v-if="(this.active > 0) & (this.active < 2)"
          size="small"
          @click="prev"
          >上一步</el-button
        >
        <el-button
          v-if="this.active < 2"
          size="small"
          type="primary"
          @click="next"
          >下一步</el-button
        >
        <el-button
          v-if="this.active == 2"
          size="medium"
          type="primary"
          @click="complete"
          >完成</el-button
        >
      </div>
    </el-dialog>

 <el-dialog
      :visible.sync="createClusterDialogFormVisible"
      title="一键部署集群信息"
      width="790px"
    >
      <el-steps
        :active="showStep"
        finish-status="success"
        simple
        process-status="finish"
      >
        <el-step title="① 输入集群信息" icon="none"></el-step>
        <el-step title="③ 接入完成" icon="none"></el-step>
      </el-steps>

      <div class="flex flex-justify-content-center" v-if="showStepInfomation">
        <el-form
          ref="CreateClusterForm"
          :model="CreateClusterform"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="集群名称:" required>
            <el-input
              v-model="CreateClusterform.name"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="环境类型:" required>
            <el-select
              v-model="CreateClusterform.envFlag"
              placeholder="请选择环境"
              style="width: 495px"
            >
              <el-option
                v-for="item in envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="master1">
            <el-input
              v-model="CreateClusterform.master1"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="master2">
            <el-input
              v-model="CreateClusterform.master2"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="master3">
            <el-input
              v-model="CreateClusterform.master3"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="worker1">
            <el-input
              v-model="CreateClusterform.worker1"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="worker2">
            <el-input
              v-model="CreateClusterform.worker2"
              style="width: 495px"
            ></el-input>
          </el-form-item>
          <el-form-item label="worker3">
            <el-input
              v-model="CreateClusterform.worker3"
              style="width: 495px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

            <el-result v-if="showStepSubmitSuccess" icon="success" title="一键部署提交成功">
                <template slot="extra">
                    <el-button type="danger" @click="goTaskCenter" size="medium">查看审批</el-button>

                </template>
            </el-result>
   

      <div  v-if="showStepInfomation" style="text-align: center; margin-top: 20px">
        <el-button
          size="medium"
          type="primary"
          @click="submitApply"
          >完成</el-button
        >
      </div>
    </el-dialog>


     <el-dialog
      title="自定义集群环境"
      :visible.sync="AddNewCursorEnvdialogVisible"
      width="708px"
      id="appapply"
    >
      <iframe
        :src="CursorEnvURL"
        frameborder="0"
        width="100%"
        height="470px"
      ></iframe>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="closeEv"
          type="primary"
          >关 闭</el-button
        >
      </div>
    </el-dialog>


  </div>
</template>

<script>
const StepInfomation = 0;
const StepSubmit = 1;
const StepSubmitSuccess = 2;

const StepStart = StepInfomation;
const baseUrlThrower = function (response) {
    if (response.status != 200) {
        throw "网络错误";
    }
    if (response.data.code != 200) {
        throw response.data.message;
    }
    return response;
    };
import pagination from "@/components/Pagination/pagination";
import YAML from "yaml";
import BaseImageComponent from "../../components/BaseImage/BaseImageComponent";
export default {
  name: "ams-base-config",
  data() {
    // IP地址验证
    const validateIPAddress = (rule, value, callback) => {
      let regexp =
        /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
      let isCorrect = true;
      if (regexp.test(value) == false) {
        isCorrect = false;
      }
      if (value == "") {
        return callback(new Error("请输入iP地址"));
      } else if (!isCorrect) {
        callback(new Error("请输入正确的ip地址"));
      } else {
        callback();
      }
    };
    // 域名校验
    const validateIngressDS = (rule, value, callback) => {
      let regexp =
        /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
      let isCorrect = true;
      if (regexp.test(value) == false) {
        isCorrect = false;
      }
      if (value == "") {
        return callback(new Error("请输入域名地址"));
      } else if (!isCorrect) {
        callback(new Error("请输入正确的域名地址"));
      } else {
        callback();
      }
    };
    
    // IP地址验证
    const validateNs = (rule, value, callback) => {
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
      AddNewCursorEnvdialogVisible:false,
      CursorEnvURL:"",
      code_config: {
        repoType: 1,
        url: "",
        sshKeyFile: "",
        token: "",
        user: "",
      },
      fileList: [],
      selectCur: [],
      active: 0,
      stepIndex: StepStart,
      createClusterActive: 0,
      clusterId: "",
      options: [
        {
          value: "1",
          label: "无",
        },
        {
          value: "2",
          label: "NodePort方式",
        },
        {
          value: "3",
          label: "Ingress方式",
        },
      ],
      visitType: 1,
      formVistType: {
        id: "",
        visitType: "1",
        clusterId: this.clusterId,
        nodeIp1: "",
        nodeIp2: "",
        nodeIp3: "",
        ingressDs: "",
      },
      namespaceTableData: [],
      envOptions: [],
      fileList: [],
      kubeconfigform: {
        id: "",
        tenantId: "",
        name: "",
        envFlag: "",
        kubeConfig: "",
        envName: "",
      },
      AddKubeconfigform: {
        id: "",
        tenantId: "",
        name: "",
        envFlag: "",
        kubeConfig: "",
        vpcId: "",
        subnet: "",
      },
      CreateClusterform: {
        tenantId: "",
        name: "",
        envFlag: "",
        master1: "",
        master2: "",
        master3: "",
        worker1: "",
        worker2: "",
        worker3: "",
      },
      createNameSpaceForm: {
        id: "",
        namespaceName: "",
      },
      createClusterDialogFormVisible: false,
      addClusterDialogFormVisible: false,
      nameAndKubeConfigDialogFormVisible: false,
      namespaceDialogFormVisible: false,
      visitTypeDialogFormVisible: false,
      createNamespaceDialogFormVisible: false,
      clusterNsCheckeds: [],
      clusterList: "",
      roleOptions: [],
      teamId: "",
      memberTableData: [],
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
      domainMemberOptions: [],
      teamForm: {
        name: "",
        respPersonId: "",
        teamCode: "",
      },
      //成员表单校验
      memberformRules: {
        respPersonId: [
          { required: true, message: "请选择团队成员", trigger: "change" },
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
      //修改负责人校验
      addRespPersonFormRules: {
        respPersonId: [
          { required: true, message: "请选择团队成员", trigger: "change" },
        ],
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "请输入集群名称", trigger: "change" },
        ],
        kubeconfig: [
          { required: true, message: "kubeconfig不能为空", trigger: "change" },
        ],
        ingressDs: [
          { required: false, validator: validateIngressDS, trigger: "change" },
        ],
        nodeIp1: [
          { required: true, validator: validateIPAddress, trigger: "blur" },
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        respPersonId: [
          { required: true, message: "请选择人员", trigger: "change" },
        ],
        respPersonId: [
          { required: true, message: "请选择负责人", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入业务域名称", trigger: "blur" },
        ],
        respPersonId: [
          { required: true, message: "请选择业务域负责人", trigger: "blur" },
        ],
        teamCode: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
        ],
        namespaceName: [
          { required: false, validator: validateNs, trigger: "change" },
        ],
      },
      addRespPersonVisible: false, //修改负责人
      addTeamMemberVisible: false, //团队成员
      tabledataid: "",
      teamName: "",
      addTeamVisible: false, //添加业务域
      setTeamClusterVisible: false, //集群权限
      respPersonName: "", //业务域负责人
      respPersonId: "",
      domainMemberOptions: [], //业务域成员下拉
      roleOptions: [], //角色
      imageTypes: [
        {
          value: 1,
          label: "前端镜像",
        },
        {
          value: 2,
          label: "后端镜像",
        },
      ], //镜像类型
      buildTypes: [
        {
          value: 1,
          label: "maven",
        },
        {
          value: 2,
          label: "gradle",
        },
      ],
      repoTypes: [
        {
          value: 1,
          label: "gitlab",
        },
        {
          value: 2,
          label: "github",
        },
        {
          value: 3,
          label: "gitee",
        },
        {
          value: 4,
          label: "gogs",
        },
        {
          value: 5,
          label: "svn",
        },
        {
          value: 6,
          label: "code.aliyun",
        },
      ],
      activeTenantSetting: "code",
      imageType: "",
      build_config: {},
      image_config: {},
      account_config: {},
      tableLabel: [],
      action_loading: false,
      ShowResultProject: false,
      ResultProjectInit: {
        harbor_ret: { status: "default" },
        create_ns_ret: { status: "default", list: [] },
        ns_init_ret: { status: "default", list: [] },
      },
      test_value: "",
      create_ns: [],
      harbor_create: true,
      ns_init: false,
      activeName: "cluster",
      dialognewImageForm: false,
      dialogBusinessDomainForm: false,
      newRow: { name: "", id: "", content: "" },
      newImage: { name: "", id: "", description: "", image: "" },
      newBusinessDomain: {
        name: "",
        id: "",
        description: "",
        code: "",
        up_domain_id: "",
      },
      newTitle: "新增",
      dialognewRowForm: false,
      formSearch: { name: "" },
      loading: false,
      tableData: [],
      limit: 10,
      page: 1,
      total: 0,
      image_formSearch: { name: "" },
      business_domain_formSearch: { name: "" },
      image_loading: false,
      image_tableData: [],
      image_limit: 10,
      image_page: 1,
      image_total: 0,
      business_domains: [],
      business_domain_loading: false,
      business_domain_tableData: [],
      business_domain_limit: 10,
      business_domain_page: 1,
      business_domain_total: 0,

      dialognewEnvForm: false,
      newEnv: { name: "", id: "", description: "", is_enable: true },
      env_formSearch: { name: "" },
      env_loading: false,
      env_tableData: [],
      env_limit: 10,
      env_page: 1,
      env_total: 0,

      cluster_url: this.GLOBAL.baseUrl + "/cluster/list/condition",
      team_url: this.GLOBAL.baseUrl + "/team/list/condition",
      tenantSetting_url: this.GLOBAL.baseUrl + "/api/cicd/env/",
    };
  },
  beforeUpdate() {
    // 读取文件
    FileReader.prototype.reading = function ({ encode } = pms) {
      let bytes = new Uint8Array(this.result); //无符号整型数组
      let text = new TextDecoder(encode || "UTF-8").decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)
        //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = (e) => {
          //在this.onload函数中，完成公共处理
          let rs = this.reading();
        };
      this.readAsArrayBuffer(f); //内部会回调this.onload方法
    };
  },
  methods: {
    closeEv:function(){
      this.AddNewCursorEnvdialogVisible=false
    },
    submitApply() {
     this.$refs.CreateClusterForm.validate(async (valid) => {
       if (!valid) {
          this.$alert("部分字段校验未通过！请点击上一步，检查、修改后重试。", "错误", {
               type: "error",
                    });
                    return;
                }
                let postForm = {
                    BIZ_name: this.CreateClusterform.name,
                    BIZ_envFlag: this.CreateClusterform.envFlag,
                    BIZ_master: this.CreateClusterform.master1+","+ this.CreateClusterform.master2+","+ this.CreateClusterform.master3,
                    BIZ_worker: this.CreateClusterform.worker1+","+ this.CreateClusterform.worker2+","+ this.CreateClusterform.worker3,
                    processKey: "clusterCreate",
                    processInstanceName: "clusterCreate",
                };
           
                let response = null;
                try {
                    response = baseUrlThrower(
                        await this.axios({
                            method: "post",
                            url: this.GLOBAL.baseUrl + "/cluster/create/apply",
                            data: postForm,
                        })
                    );
                } catch (e) {
                    this.$notify({
                        title: "错误",
                        message: e.toString(),
                        type: "error",
                    });
                    return;
                }
                this.CreateClusterform = {};
                this.stepIndex = StepSubmitSuccess;
            });
        },
   
    //获取后端环境
    GetEnvs: function () {
      let envURL = this.GLOBAL.baseUrl + "/env/get";
      this.axios({
        method: "get",
        url: envURL,
        params: {},
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              response.data.data.forEach((element) => {
                this.envOptions.push({
                  value: element.selectKey,
                  label: element.selectValue,
                });
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "获取数据失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get account config info", response);
        });
    },
    ChangeRepoType(index) {
      this.repoTypes.forEach((item) => {
        if (item.value === index) {
          if (item.label.toLowerCase() === "gitlab") {
            if (this.code_config.user === "") {
              this.$message("仓库类型为gitlab时,user的值为:oauth2");
            }
          } else if (item.label.toLowerCase() === "github") {
            if (this.code_config.user === "") {
              this.$message("仓库类型为github时,user的值为:oauth2");
            }
          } else if (item.label.toLowerCase() === "gitee") {
            if (this.code_config.user === "") {
              this.$message("仓库类型为gitee时,user的值为:oauth2");
            }
          } else {
          }
        }
      });
    },
    ChangeBuildType(index) {
      this.buildTypes.forEach((item) => {
        if (item.value === index) {
        }
      });
    },
    prev() {
      this.active = this.active - 1;
    },
    complete() {
      this.addClusterDialogFormVisible = false;
      this.InitGetTableData(this.cluster_url, this.limit, this.page);
    },
    next() {
      if (this.AddKubeconfigform.name == "") {
        this.$notify({
          title: "提示",
          message: "集群名称未填写",
          type: "warning",
        });
        return;
      }
      if (this.AddKubeconfigform.envFlag == "") {
        this.$notify({
          title: "提示",
          message: "环境类型未选择",
          type: "warning",
        });
        return;
      }

      if (this.AddKubeconfigform.kubeConfig == "") {
        this.$notify({
          title: "提示",
          message: "kubeconfig未填写",
          type: "warning",
        });
        return;
      }
      if (this.active == 0) {
        let url = this.GLOBAL.baseUrl + "/cluster/add";
        this.axios({
          method: "post",
          url: url,
          data: this.AddKubeconfigform,
        })
          .then((resp) => {
            if (resp.data.code === 200) {
              this.clusterId = resp.data.data.id;
              this.getClusterDataById(this.clusterId);
            } else {
              this.$alert(resp.data.message, "提示", {
                type: "warning",
              });
            }
          })
          .catch((resp) => {
            this.$alert(res.data.message, "提示", {
              type: "warning",
            });
          });
      }

      if (this.active == 2) {
        this.IgnoreNamespace();
      }
      if (this.active > 3) {
        this.active = 1;
      }
      this.active++;
    },
    beforeUpload(file) {
      var fileName = file.name;
      if (fileName.indexOf(".") != -1) {
        this.$alert("文件格式不正确:不能有扩展名", "提示", {
          type: "warning",
        });
        return false;
      }
      this.fileList = [file];
      // 读取数据
      this.read(file);
      return false;
    },
    read(f) {
      let rd = new FileReader();
      rd.onload = (e) => {
        let cont = rd.reading({ encode: "UTF-8" });
        this.kubeconfigform.kubeConfig = cont;
        if (this.AddNewCursor) {
          this.AddKubeconfigform.kubeConfig = cont;
        }

        if ("neus" === this.activeTenantSetting) {
          this.build_config.settingsFile = cont;
        }
        if ("code" === this.activeTenantSetting) {
          this.code_config.sshKeyFile = cont;
        }
      };
      rd.readAsBinaryString(f);
    },

    GetSectionChange: function (va) {
      this.selectCur = va;
    },
    deleteCursor: function () {
      if (this.selectCur.length == 0 || this.selectCur.length > 1) {
        this.$message({
          message: "请选择一条需要删除的集群",
          type: "warning",
        });
        return;
      }
      this.axios({
        method: "post",
        url: this.GLOBAL.baseUrl + "/cluster/delete/" + this.selectCur[0].id,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.InitGetTableData();
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        })
        .catch((resp) => {
          this.$notify({
            title: "提示",
            message: "暂时不支持删除集群",
            type: "warning",
          });
        });
    },
    AddNewCursor: function () {
      this.addClusterDialogFormVisible = true;
      this.active = 0;
      this.AddKubeconfigform.kubeConfig = ""; 
      this.AddKubeconfigform.name = "";
      this.AddKubeconfigform.envFlag = "";
    },
    ClusterCreateAndAdd: function () {
      this.createClusterDialogFormVisible = true;
      this.CreateClusterform.kubeConfig = ""; 
      this.CreateClusterform.name = "";
      this.CreateClusterform.envFlag = "";
      this.CreateClusterform.master1 = "";
      this.CreateClusterform.master2 = "";
      this.CreateClusterform.master3 = "";
      this.CreateClusterform.worker1 = "";
      this.CreateClusterform.worker2 = "";
      this.CreateClusterform.worker3 = "";
    },
    AddNewCursorEnv:function(){
       this.$router.push({
        path: "/cicd/env-add-workflow",
        query: {
          appId: 1,
          appCode: 2,
        },
      });
    },

   goTaskCenter() {
            this.$router.push("/taskCenter");
        },
    //更新名称和kubeconfig
    UpdateK8sConfig: function () {
      this.$refs.nameAndKubeConfigAddForm.validate(async (valid) => {
        if (valid) {
          let url = this.GLOBAL.baseUrl + "/cluster/add";
          this.axios({
            method: "post",
            url: url,
            data: this.kubeconfigform,
          })
            .then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                this.$message({
                  message: "更新成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.message);
              }
              this.nameAndKubeConfigDialogFormVisible = false;
              this.InitGetTableData(this.cluster_url, this.limit, this.page);
            })
            .catch((res) => {
              this.nameAndKubeConfigDialogFormVisible = false;
              this.InitGetTableData(this.cluster_url, this.limit, this.page);
            });
        } else {
          this.$message.error("请填写完整后再提交");
        }
      });
    },
    saveFormVistType: function () {
      this.$refs.vistTypeform.validate(async (valid) => {
        if (valid) {
          let url = this.GLOBAL.baseUrl + "/cluster/addVisitType";
          this.formVistType.clusterId = this.clusterId;
          this.axios({
            method: "post",
            url: url,
            data: this.formVistType,
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.InitGetTableData(this.cluster_url, this.limit, this.page);
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$alert(res.data.message, "提示", {
                  type: "warning",
                });
              }
              this.visitTypeDialogFormVisible = false;
            })
            .catch((err) => {
              this.visitTypeDialogFormVisible = false;
              this.InitGetTableData(this.cluster_url, this.limit, this.page);
              this.$alert(res.data.message, "提示", {
                type: "warning",
              });
            });
        }
      });
    },
    closeFormVistType: function () {
      this.visitTypeDialogFormVisible = false;
    },
    visitTypeSelectOptionChange: function (val) {
      this.visitType = val;
      this.formVistType.type = val;
      this.formVistType.visitType = val;
      this.$refs.vistTypeform.clearValidate();
    },
    getVisiTypeData(clusterId) {
      let url = this.GLOBAL.baseUrl + "/cluster/getVisitType/" + clusterId;
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          console.log("xxx", res);
          if (res.status === 200) {
            let rs = res.data.data;
            if (rs) {
              this.visitType = rs.type + "";
              this.formVistType.visitType = rs.type + "";
              this.formVistType.type = rs.type + "";
              this.formVistType.id = rs.id;
              this.formVistType.clusterId = rs.clusterId;
              this.formVistType.nodeIp1 = rs.nodeIp1;
              this.formVistType.nodeIp2 = rs.nodeIp2;
              this.formVistType.nodeIp3 = rs.nodeIp3;
              this.formVistType.ingressDs = rs.ingressDs;
            } else {
              this.visitType = "1";
              this.formVistType.visitType = "1";
              this.formVistType.type = "1";
              this.formVistType.nodeIp1 = "";
              this.formVistType.nodeIp2 = "";
              this.formVistType.nodeIp3 = "";
              this.formVistType.ingressDs = "";
              this.formVistType.id = "";
            }
          }
        })
        .catch((err) => {});
    },
    renderButtons(h) {
      return h("el-button-group", {}, [
        h(
          "el-button",
          {
            props: {
              type: "primary",
            },
            on: {
              click: () => {
                this.enableAll();
              },
            },
          },
          "全部启用"
        ),
        h(
          "el-button",
          {
            props: {
              type: "warning",
            },
            on: {
              click: () => {
                this.ignoreAll();
              },
            },
          },
          "全部忽略"
        ),
      ]);
    },
    enableAndIgnoreNs(index, row) {
      // row.status = !row.status
    },
    IgnoreNamespace() {
      let clusterId = "";
      let tableData = this.namespaceTableData;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].clusterId) {
          clusterId = tableData[i].clusterId;
          break;
        }
      }
      for (let i = 0; i < tableData.length; i++) {
        if (!tableData[i].clusterId) {
          tableData[i].clusterId = clusterId;
        }
      }
      let url = this.GLOBAL.baseUrl + "/cluster/addNamespace";
      this.axios({
        method: "post",
        url: url,
        data: tableData,
      })
        .then((resp) => {
          if (resp.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: resp.data.message,
            });
          }
          this.closeNamespace();
        })
        .catch((res) => {
          this.$notify.error({
            title: "错误",
            message: resp.data.message,
          });
          this.closeNamespace();
        });
    },
    closeNamespace() {
      this.namespaceDialogFormVisible = false;
    },
    //创建nameSpace
    confirmAddForm: function () {
      this.$refs.createNameSpaceFormRef.validate(async (valid) => {
        if (valid) {
          let url =
            this.GLOBAL.baseUrl +
            "/cluster/addK8sNamespace/" +
            this.clusterId +
            "/" +
            this.createNameSpaceForm.namespaceName;
          this.axios({
            method: "post",
            url: url,
            data: this.createNameSpaceForm,
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.$alert("操作成功", "提示", {
                  type: "success",
                });
                this.$emit("listenToChildEvent");
                this.createNameSpaceForm.namespaceName = "";
                this.createNamespaceDialogFormVisible = false;
              } else {
                this.$alert(res.data.message, "提示", {
                  type: "warning",
                });
              }
            })
            .catch((err) => {});
        }
      });
    }, //关闭创建NameSpace
    closeCreateNameSpace() {
      this.createNameSpaceForm.namespaceName = "";
      this.createNamespaceDialogFormVisible = false;
    },
    enableAll() {
      for (let i = 0; i < this.namespaceTableData.length; i++) {
        this.namespaceTableData[i].status = false;
      }
    },
    ignoreAll() {
      for (let i = 0; i < this.namespaceTableData.length; i++) {
        this.namespaceTableData[i].status = true;
      }
    },

    getClusterDataById(clusterId) {
      let url =
        this.GLOBAL.baseUrl + "/cluster/getClusterNamespaces/" + clusterId;
      this.axios({
        method: "get",
        url: url,
        params: {},
      })
        .then((res) => {
          if (res.status === 200) {
            this.namespaceTableData = res.data.data;
          }
        })
        .catch((err) => {});
    },
    editNameAndKubeConfig(row) {
      this.nameAndKubeConfigDialogFormVisible = true;
      this.$nextTick(() => {
        // let form = this.$refs.nameAndKubeConfigAddForm.form;
        let url = this.GLOBAL.baseUrl + "/cluster/get/" + row.id;
        this.axios({
          method: "get",
          url: url,
        })
          .then((res) => {
            if (res.status === 200) {
              this.kubeconfigform.id = res.data.data.id;
              this.kubeconfigform.tenantId = res.data.data.tenantId;
              this.kubeconfigform.name = res.data.data.name;
              this.kubeconfigform.envFlag = res.data.data.envFlag;
              this.kubeconfigform.kubeConfig = res.data.data.kubeConfig;
            }
          })
          .catch((err) => {});
      });
    },
    editNamespace(row) {
      this.namespaceDialogFormVisible = true;
      this.clusterId = row.id;
      this.getClusterDataById(this.clusterId);
      // this.$nextTick(() => {
      //   let form = this.$refs.addForm.form;
      // });
    },
    createNamespace(row) {
      this.createNamespaceDialogFormVisible = true;
      this.clusterId = row.id;
      // this.$nextTick(() => {
      //   let form = this.$refs.addForm.form;
      // });
    },
    editVisitType(row) {
      this.clusterId = row.id;
      this.visitTypeDialogFormVisible = true;
      this.getVisiTypeData(this.clusterId);
    },
    getAllCluster() {
      let url = this.GLOBAL.baseUrl + "/team/cluster/" + this.teamId + "/all";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            this.clusterList = res.data.data;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    SaveConfig(name) {
      let url;
      let postData;
      if (name == "code") {
        url = this.GLOBAL.baseUrl + "/code/repo/add";
        postData = this.code_config;
      }
      if (name == "neus") {
        url = this.GLOBAL.baseUrl + "/private/server/add";
        postData = this.build_config;
      }
      if (name == "image-repo") {
        url = this.GLOBAL.baseUrl + "/image/repo/add";
        postData = this.image_config;
      }
      if (name == "account") {
        url = this.GLOBAL.baseUrl + "/third/part/cloud/account/add";
        postData = this.account_config;
      }
      this.axios({
        method: "post",
        url: url,
        data: postData,
      })
        .then((response) => {
          if ((response.status = 200)) {
            this.InitConfig();
            this.$message({
              type: "success",
              message: "操作成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "操作失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to update info", response);
        });
    },
    ResetConfig(name) {
      if (name == "code") {
        this.code_config = {};
      }
      if (name == "neus") {
        this.build_config = {};
      }
      if (name == "image-repo") {
        this.image_config = {};
      }
      if (name == "account") {
        this.account_config = {};
      }
      if (name === "K8sConfig") {
        this.kubeconfigform.id = "";
        this.kubeconfigform.name = "";
        this.kubeconfigform.envFlag = "";
        this.kubeconfigform.kubeConfig = "";
      }
    },
    changeConfig() {
      this.InitConfig();
    },
    tabClick(tab, event) {
      if (tab.name === "cluster") {
        this.InitGetTableData(this.cluster_url, this.limit, this.page);
      } else if (tab.name === "team") {
        this.getTableTitle();
        this.InitBusinessDomainTableData(
          this.team_url,
          this.business_domain_limit,
          this.business_domain_page
        );
      } else if (tab.name === "tenantSetting") {
        this.InitConfig();
      }
    },
    //添加成员
    addTeamMember() {
      this.$refs.addTeamMemberForm.validate(async (valid) => {
        if (valid) {
          let url = this.GLOBAL.baseUrl + "/team/member/add";
          console.log(this.memberform);
          this.memberform.teamId = this.tabledataid;
          this.axios({
            method: "post",
            url: url,
            data: this.memberform,
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.$alert("操作成功", "提示", {
                  type: "warning",
                });
                this.$refs.addTeamMemberForm.resetFields();
                this.getTeamMembers();
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
    SaveAddMainPerson() {
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
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                });
                this.$refs.addRespPersonForm.resetFields();
                this.addRespPersonVisible = false;
                this.InitBusinessDomainTableData(
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
    // 返回上一页
        goBack: function () {
           createClusterDialogFormVisible=false;
        },
    //保存业务域
    SaveAddTeam() {
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
                this.InitBusinessDomainTableData(
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
    Savecluster: function () {
      let url = this.GLOBAL.baseUrl + "/team/cluster/set";
      this.axios({
        method: "post",
        url: url,
        data: {
          clusterNsCheckeds: this.clusterNsCheckeds,
          teamId: this.teamId,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.$alert("操作成功", "提示", {
              type: "warning",
            });
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
      this.$notify({
        title: "提示",
        message: "暂时不支持删除业务域",
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
      console.log(row);
      if (row && row.teamId) {
        this.tabledataid = row.teamId;
        this.getTeamMembers();
      } else {
        this.tabledataid = "";
      }
    },

    getTeamMembers() {
      let url =
        this.GLOBAL.baseUrl + "/team/member/" + this.tabledataid + "/all";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            this.memberTableData = res.data.data;
          }
        })
        .catch((err) => {
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
      this.setTeamClusterVisible = true;
      if (row && row.teamId) {
        this.tabledataid = row.teamId;
        this.teamId = row.teamId;
        this.getAllCluster();
      } else {
        this.tabledataid = "";
      }
    },

    // 关闭设置业务域负责人框
    closeSetTeamClusterDialog() {
      if (this.setTeamClusterVisible) {
        this.setTeamClusterVisible = false;
      }
      this.getTableTitle();
      this.getData();
    },

    removeTeamMember(row) {
      this.$confirm("是否确认移除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
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
              var msg;
              if (res.data.code === 200) {
                msg = "移除成功";
                this.getTeamMembers();
              } else {
                msg = res.data.message;
              }
              this.$alert(msg, "提示", {
                type: "warning",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //初始化配置信息
    InitConfig: function () {
      let repo_url = this.GLOBAL.baseUrl + "/code/repo/get";
      let private_url = this.GLOBAL.baseUrl + "/private/server/get";
      let image_url = this.GLOBAL.baseUrl + "/image/repo/get";
      let account_url = this.GLOBAL.baseUrl + "/third/part/cloud/account/get";

      this.axios({
        method: "get",
        url: repo_url,
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              this.code_config = response.data.data;
            }
          } else {
            this.$message({
              type: "error",
              message: "获取代码仓库配置失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get repo info", response);
        });

      this.axios({
        method: "get",
        url: private_url,
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              this.build_config = response.data.data;
            }
          } else {
            this.$message({
              type: "error",
              message: "获取私服配置失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get build config info", response);
        });

      this.axios({
        method: "get",
        url: image_url,
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              this.image_config = response.data.data;
            }
          } else {
            this.$message({
              type: "error",
              message: "获取私服配置失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get build config info", response);
        });

      this.axios({
        method: "get",
        url: account_url,
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              this.account_config = response.data.data;
            }
          } else {
            this.$message({
              type: "error",
              message: "获取账号配置失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get account config info", response);
        });
    },

    // template start
    // 获取表格数据；
    InitGetTableData: function (url, page_size, page_index) {
      this.loading = true;
      const parms = {
        pageSize: page_size,
        pageNumber: page_index,
        name: this.formSearch.name,
      };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          if (response.data.code == 200) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.total;
          } else {
            this.$message.error(response.data.error);
          }
          this.loading = false;
        })
        .catch((response) => {
          console.log("err", response);
          this.loading = false;
          // this.$message.error(response);
        });
    },

    seletctDelRow: function (url, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delTgt(url, row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    delTgt: function (url, row) {
      this.loading = true;
      let parms = { rows: [row.id] };
      this.axios({
        method: "DELETE",
        url: url,
        data: parms,
      })
        .then((response) => {
          if (response.data.status) {
            this.$message.success(response.data.message);
            this.InitGetTableData(url, this.limit, this.page);
          } else {
            this.$message.error(response.data.error);
          }
          this.loading = false;
        })
        .catch((response) => {
          this.loading = false;
          this.$message.error(String(response));
        });
    },

    newPutRow: function (url, method) {
      this.$refs.newRow.validate((valid) => {
        if (valid) {
          let data_json;
          let temp = this.newRow.content
            .replace(/{{ /g, "")
            .replace(/{{/g, "")
            .replace(/ }}/g, "")
            .replace(/}}/g, "");
          try {
            data_json = YAML.parse(temp, {});
          } catch (err) {
            this.$message.error({ message: String(err) });
            return;
          }
          // console.log("data_json:", data_json)
          let parms = JSON.parse(JSON.stringify(this.newRow));
          if (data_json.kind) {
            parms["type"] = data_json.kind;
          } else {
            this.$message.error("缺少kind");
            return;
          }
          if (method === "POST") {
            delete parms.id;
          }
          this.action_loading = true;
          this.axios({
            method: method,
            url: url,
            data: parms,
          })
            .then((response) => {
              // console.log('delAppResourceRow:',response.data);
              if (response.data.status) {
                this.dialognewRowForm = false;
                this.$message.success(response.data.message);
                this.InitGetTableData(url, this.limit, this.page);
              } else {
                this.$message.error(response.data.error);
              }
              this.action_loading = false;
            })
            .catch((response) => {
              this.action_loading = false;
              this.$message.error(String(response));
            });
        } else {
          this.$message.warning("请输入合法数据");
        }
      });
    },

    showNewRow: function () {
      this.dialognewRowForm = true;
      this.newTitle = "新增";
      this.newRow.id = "";
      this.newRow.name = "";
      this.newRow.content = "";
    },

    showEdit: function (row) {
      this.dialognewRowForm = true;
      this.newTitle = "编辑";
      this.newRow.id = row.id;
      this.newRow.name = row.name;
      this.newRow.content = row.content;
    },

    // baseImage start
    // 获取表格数据；
    InitImageTableData: function (url, page_size, page_index) {
      this.image_loading = true;
      const parms = {
        pageSize: page_size,
        pageNumber: page_index,
        name: this.image_formSearch.name,
      };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('aaa:',response.data);
          if (response.data.status) {
            this.image_tableData = response.data.data;
            this.image_total = response.data.total;
          } else {
            this.$message.error(response.data.error);
          }
          this.image_loading = false;
        })
        .catch((response) => {
          this.image_loading = false;
          this.$message.error(String(response));
        });
    },

    ImageseletctDelRow: function (url, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ImagedelTgt(url, row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    ImagedelTgt: function (url, row) {
      this.image_loading = true;
      let parms = { rows: [row.id] };
      this.axios({
        method: "DELETE",
        url: url,
        data: parms,
      })
        .then((response) => {
          if (response.data.status) {
            this.$message.success(response.data.message);
            this.InitImageTableData(url, this.image_limit, this.image_page);
          } else {
            this.$message.error(response.data.error);
          }
          this.image_loading = false;
        })
        .catch((response) => {
          this.image_loading = false;
          this.$message.error(String(response));
        });
    },

    ImagenewPutRow: function (url, method) {
      this.$refs.newImage.validate((valid) => {
        if (valid) {
          let parms = JSON.parse(JSON.stringify(this.newImage));
          if (method === "POST") {
            delete parms.id;
          }
          this.action_loading = true;
          this.axios({
            method: method,
            url: url,
            data: parms,
          })
            .then((response) => {
              // console.log('delAppResourceRow:',response.data);
              if (response.data.status) {
                this.dialognewImageForm = false;
                this.$message.success(response.data.message);
                this.InitImageTableData(url, this.image_limit, this.image_page);
              } else {
                this.$message.error(response.data.error);
              }
              this.action_loading = false;
            })
            .catch((response) => {
              this.action_loading = false;
              this.$message.error(String(response));
            });
        } else {
          this.$message.warning("请输入合法数据");
        }
      });
    },

    ImageShowNewRow: function () {
      this.dialognewImageForm = true;
      this.newTitle = "新增";
      this.newImage.id = "";
      this.newImage.name = "";
      this.newImage.image = "";
      this.newImage.description = "";
    },

    ImageShowEdit: function (row) {
      this.dialognewImageForm = true;
      this.newTitle = "编辑";
      this.newImage.id = row.id;
      this.newImage.name = row.name;
      this.newImage.image = row.image;
      this.newImage.description = row.description;
    },

    // BusinessDomain start
    // 获取表格数据；
    InitBusinessDomainTableData: function (url, page_size, page_index) {
      this.business_domain_loading = true;
      const parms = {
        pageSize: page_size,
        pageNumber: page_index,
        name: this.business_domain_formSearch.name,
        code: this.business_domain_formSearch.code,
      };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          if (response.data.code == 200) {
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

    BusinessDomainseletctDelRow: function (url, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.BusinessDomaindelTgt(url, row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    BusinessDomaindelTgt: function (url, row) {
      this.business_domain_loading = true;
      let parms = { rows: [row.id] };
      this.axios({
        method: "DELETE",
        url: url,
        data: parms,
      })
        .then((response) => {
          if (response.data.status) {
            this.$message.success(response.data.message);
            this.InitBusinessDomainTableData(
              url,
              this.business_domain_limit,
              this.business_domain_page
            );
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

    BusinessDomainnewPutRow: function (url, method) {
      this.$refs.newBusinessDomain.validate((valid) => {
        if (valid) {
          let parms = JSON.parse(JSON.stringify(this.newBusinessDomain));
          if (method === "POST") {
            delete parms.id;
            parms["create_ns"] = this.create_ns;
            parms["harbor_create"] = this.harbor_create;
            parms["ns_init"] = this.ns_init;
          }
          // console.log("parms:",parms)
          // return
          this.action_loading = true;
          this.axios({
            method: method,
            url: url,
            data: parms,
          })
            .then((response) => {
              // console.log('delAppResourceRow:',response.data);
              if (response.data.status) {
                this.dialogBusinessDomainForm = false;
                this.ShowResultProject = true;
                this.ResultProjectInit = response.data.data;
                this.$message.success(response.data.message);
                this.InitBusinessDomainTableData(
                  url,
                  this.business_domain_limit,
                  this.business_domain_page
                );
              } else {
                this.$message.error(response.data.error);
              }
              this.action_loading = false;
            })
            .catch((response) => {
              this.action_loading = false;
              this.$message.error(String(response));
            });
        } else {
          this.$message.warning("请输入合法数据");
        }
      });
    },

    BusinessDomainShowNewRow: function () {
      this.dialogBusinessDomainForm = true;
      this.newTitle = "新增";
      this.newBusinessDomain.id = "";
      this.newBusinessDomain.name = "";
      this.newBusinessDomain.code = "";
      this.newBusinessDomain.description = "";
      this.newBusinessDomain.up_domain_id = "";
    },

    BusinessDomainShowEdit: function (row) {
      this.dialogBusinessDomainForm = true;
      this.newTitle = "编辑";
      this.newBusinessDomain.id = row.id;
      this.newBusinessDomain.name = row.name;
      this.newBusinessDomain.code = row.code;
      this.newBusinessDomain.description = row.description;
      this.newBusinessDomain.up_domain_id = row.up_domain_id;
    },

    // env start
    // 获取表格数据；
    InitEnvTableData: function (url, page_size, page_index) {
      this.env_loading = true;
      const parms = {
        pageSize: page_size,
        pageNumber: page_index,
        name: this.env_formSearch.name,
      };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('InitEnvTableData:',response.data);
          if (response.data.status) {
            this.env_tableData = response.data.data;
            this.env_total = response.data.total;
          } else {
            this.$message.error(response.data.error);
          }
          this.env_loading = false;
        })
        .catch((response) => {
          this.env_loading = false;
          this.$message.error(String(response));
        });
    },

    EnvSeletctDelRow: function (url, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.env_loading = true;
          let parms = { rows: [row.id] };
          this.axios({
            method: "DELETE",
            url: url,
            data: parms,
          })
            .then((response) => {
              if (response.data.status) {
                this.$message.success(response.data.message);
                this.InitEnvTableData(url, this.env_limit, this.env_page);
              } else {
                this.$message.error(response.data.error);
              }
              this.env_loading = false;
            })
            .catch((response) => {
              this.env_loading = false;
              this.$message.error(String(response));
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },

    EnvPutRow: function (url, method) {
      this.$refs.newEnv.validate((valid) => {
        if (valid) {
          let parms = JSON.parse(JSON.stringify(this.newEnv));
          if (method === "POST") {
            delete parms.id;
          }
          this.action_loading = true;
          this.axios({
            method: method,
            url: url,
            data: parms,
          })
            .then((response) => {
              // console.log('delAppResourceRow:',response.data);
              if (response.data.status) {
                this.dialognewEnvForm = false;
                this.$message.success(response.data.message);
                this.InitEnvTableData(url, this.env_limit, this.env_page);
              } else {
                this.$message.error(response.data.error);
              }
              this.action_loading = false;
            })
            .catch((response) => {
              this.action_loading = false;
              this.$message.error(String(response));
            });
        } else {
          this.$message.warning("请输入合法数据");
        }
      });
    },

    EnvShowNewRow: function () {
      this.dialognewEnvForm = true;
      this.newTitle = "新增";
      this.newEnv.id = "";
      this.newEnv.name = "";
      this.newEnv.description = "";
      this.newEnv.is_enable = true;
    },

    EnvShowEdit: function (row) {
      this.dialognewEnvForm = true;
      this.newTitle = "编辑";
      this.newEnv.id = row.id;
      this.newEnv.name = row.name;
      this.newEnv.description = row.description;
      this.newEnv.is_enable = row.is_enable;
    },
  },

  computed: {
      showStepInfomation() {
            return this.stepIndex == StepInfomation;
        },
        showStepSubmitSuccess() {
            return this.stepIndex == StepSubmitSuccess;
        },
        showStep() {
            if (this.submitSuccess) {
                return StepSubmit;
            }
            return this.stepIndex;
        },
  },

  mounted() {
    this.InitGetTableData(this.cluster_url, this.limit, this.page);
    this.getSelectData();
    this.GetEnvs();
  },
  components: {
    pagination: pagination,
    editor: require("vue2-ace-editor"),
    BaseImageComponent: BaseImageComponent,
  },
};
</script>

<style lang="scss">
.active_sucess {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.team-main {
  background-color: #f4f4f4;
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
.team-main .panel-tab .el-tabs__content {
  overflow-y: auto;
}
.my-form-item .el-form-item__content {
  width: 100%;
}
.team-main .add-el-btn {
  color: $primary;
  border-color: $primary;
}
.team-main .btn-group {
  text-align: right;
  margin-bottom: 20px;
  justify-content: flex-end;
}
.team-main .btn-group .btn {
  width: 96px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  cursor: pointer;
}
.team-main .btn-group .btn1 {
  background: #ededed;
  border-radius: 4px 0px 0px 4px;
  color: #333;
  margin-right: 2px;
}
.team-main .btn-group .btn2 {
  background: rgba(15, 85, 250, 0.1);
  border-radius: 0px 4px 4px 0px;
  color: $primary;
}
.team-main .tip {
  color: #999999;
  font-size: 12px;
  line-height: 20px;
}
</style>

