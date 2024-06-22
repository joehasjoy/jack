<!--
 * @Author: your name
 * @Date: 2021-05-10 12:07:52
 * @LastEditTime: 2021-05-24 17:09:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\property\vm.vue
-->
<!--
 * @Author: your name
 * @Date: 2021-04-19 09:12:39
 * @LastEditTime: 2021-05-08 19:04:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\ams\team.vue
-->
<template>
  <div class="main flex-column">
    <el-form
      :inline="true"
      :model="formSearch"
      class="demo-form-inline"
      @submit.native.prevent
      label-position="left"
      label-width="100px"
      style="width: 100%"
    >
      <el-form-item label="所属业务域">
        <el-select
          v-model="teamId"
          placeholder="请选择所属业务域"
          @change="envCodeSelectOptionChange"
          filterable
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.teamId"
            :label="item.label"
            :value="item.teamId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属环境">
        <el-select
          v-model="envId"
          placeholder="请选择所属环境"
          @change="handleChangeOwner"
          filterable
          clearable
        >
          <el-option
            v-for="item in envOptions"
            :key="item.envId"
            :label="item.label"
            :value="item.envId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器用途">
        <el-select
          v-model="hostUsageId"
          placeholder="请选择服务器用途"
          @change="envCodeSelectOptionChange"
          filterable
          clearable
        >
          <el-option
            v-for="item in hostUsageOptions"
            :key="item.hostUsageId"
            :label="item.label"
            :value="item.hostUsageId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作系统类型">
        <el-select
          v-model="operateSystemId"
          placeholder="请选择操作系统类型"
          @change="envCodeSelectOptionChange"
          clearable
        >
          <el-option
            v-for="item in operateSystemOptions"
            :key="item.operateSystemId"
            :label="item.label"
            :value="item.operateSystemId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="ip" placeholder="IP地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="主机名">
        <el-input v-model="hostsName" placeholder="主机名" clearable></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input
          v-model="respPersonName"
          placeholder="负责人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 100px">
        <el-button type="primary" @click="searchForms" size="medium"
          >查询
        </el-button>
        <el-button @click="resetForms" size="medium">重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="operate-box">
      <el-button
        icon="el-icon-plus"
        @click="openVM"
        v-if="canAddVm"
        size="medium"
        >添加</el-button
      >
      <el-button icon="el-icon-plus" @click="openVMBuLu" size="medium"
        >补录数据</el-button
      >
      <el-button @click="deleteVm" v-if="canAddVm" size="medium"
        >删除</el-button
      >
    </div>
    <div class="table-box" style="width: 100%">
      <el-table
        ref="singleTable"
        :data="tableData.slice(0, pageSize)"
        stripe
        v-loading="dataLoding"
        tooltip-effect="dark"
        style="width: 100%"
        element-loading-text="数据加载中"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
        width="100%"
      >
        >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          width="60"
          label="序号"
          align="center"
        ></el-table-column>

        <el-table-column prop="ip" label="IP" align="center" min-width="130">
        </el-table-column>
        <el-table-column
          prop="hostName"
          label="主机名"
          width="auto"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="envName"
          label="所属环境"
          align="center"
          min-width="80"
        >
        </el-table-column>

        <el-table-column
          prop="teamName"
          label="所属业务域"
          min-width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="respPersonName"
          label="负责人"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="hostUsageName"
          label="用途分类"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="operateSystemName"
          label="操作系统"
          align="center"
          min-width="230"
        ></el-table-column>
        <el-table-column
          prop="isMonitor"
          label="是否监控"
          align="center"
          min-width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isMonitor === 1" type="danger">是</span>
            <span v-else type="info">否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="cpu"
          label="CPU(s)"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="mem"
          label="内存(G)"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isGroup === 1">
              <el-button @click="disRelateGroup(scope.row)" type="text"
                >解除关联</el-button
              >
            </span>
            <span v-else>
              <el-button @click="toRelateGroupDialog(scope.row, 1)" type="text"
                >关联到业务域</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="totalCount > 0"
      :total="totalCount"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="loadData"
    ></pagination>

    <el-dialog
      title="新增虚拟机"
      :visible.sync="addVMVisible"
      width="930px"
      :before-close="handleClose"
    >
      <el-steps :active="active" style="margin-bottom: 30px; padding: 0 40px">
        <el-step title="基本信息" icon="icon-enn-jibenxinxi"></el-step>
        <el-step title="选择镜像" icon="icon-enn-caozuoxitong"></el-step>
        <el-step title="配置选择" icon="icon-enn-peizhi"></el-step>
        <el-step
          title="网络配置"
          icon="icon-enn-000-wangluoshezhi-05"
        ></el-step>
      </el-steps>
      <div class="flex flex-justify-content-center">
        <el-form
          :model="vmForm"
          label-position="left"
          ref="refvmForm"
          label-width="112px"
          :rules="checkRules"
        >
          <div v-show="active == 1">
            <el-form-item label="所属业务域:" prop="teamId">
              <el-select
                v-model="vmForm.teamId"
                placeholder="请选择业务域"
                @change="handleChangeTeam"
                style="width: 430px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.teamId"
                  :label="item.label"
                  :value="{ value: item.teamId, label: item.label }"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属环境:" prop="envId">
              <el-select
                v-model="vmForm.envId"
                placeholder="请选择环境"
                @change="handleChangeEnv"
                style="width: 430px"
              >
                <el-option
                  v-for="item in envOptions"
                  :key="item.envId"
                  :label="item.label"
                  :value="{ value: item.envId, label: item.label }"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="用途分类:" prop="hostUsageId">
              <el-select
                v-model="vmForm.hostUsageId"
                placeholder="请选择服务器用途"
                @change="handleChangeHostUsage"
                style="width: 430px"
              >
                <el-option
                  v-for="item in hostUsageOptions"
                  :key="item.hostUsageId"
                  :label="item.label"
                  :value="{
                    value: item.hostUsageId,
                    label: item.label,
                  }"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新智云账号:" prop="enncloudAccount">
              <el-select
                v-model="vmForm.enncloudAccount"
                placeholder="请选择新智云账号"
                @change="handleChangeEnnCloudAccount"
                style="width: 430px"
              >
                <el-option
                  v-for="item in enncloudAccountOptions"
                  :key="item.enncloudAccount"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人:" prop="respPersonName">
              <el-select
                v-model="vmForm.respPersonName"
                placeholder="请选择负责人"
                @change="handleChangeRespPerson"
                style="width: 430px"
                filterable
              >
                <el-option
                  v-for="item in domainMemberOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="{ value: item.key, label: item.value }"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="用途说明:" prop="hostUsageDesc">
              <el-input
                v-model="vmForm.hostUsageDesc"
                placeholder="用途说明"
                type="textarea"
                rows="4"
                style="width: 430px"
              ></el-input>
            </el-form-item>
          </div>

          <div v-show="active == 2">
            <el-form-item label="选用镜像:"> </el-form-item>
            <el-transfer
              filterable
              v-model="selectImage"
              :data="imagesOptions"
              @change="changeImage"
              :titles="['可选用镜像', '已选择']"
            ></el-transfer>
          </div>
          <div v-show="active == 3">
            <el-col :span="24" style="margin-top: 15px">
              <el-form-item label="主机数量:" prop="hostCount">
                <el-input-number
                  v-model="vmForm.hostCount"
                  @change="handleChange"
                  :min="1"
                  :max="10"
                  label="描述文字"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CPU:" prop="cpu">
                <el-radio-group v-model.number="vmForm.cpu">
                  <el-radio-button :label="1">1核</el-radio-button>
                  <el-radio-button :label="2">2核</el-radio-button>
                  <el-radio-button :label="4">4核</el-radio-button>
                  <el-radio-button :label="8">8核</el-radio-button>
                  <el-radio-button :label="12">12核</el-radio-button>
                  <el-radio-button :label="16">16核</el-radio-button>
                  <el-radio-button :label="32">32核</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内存:" prop="mem">
                <el-radio-group v-model.number="vmForm.mem">
                  <el-radio-button :label="1">1G</el-radio-button>
                  <el-radio-button :label="2">2G</el-radio-button>
                  <el-radio-button :label="4">4G</el-radio-button>
                  <el-radio-button :label="8">8G</el-radio-button>
                  <el-radio-button :label="12">12G</el-radio-button>
                  <el-radio-button :label="16">16G</el-radio-button>
                  <el-radio-button :label="32">32G</el-radio-button>
                  <el-radio-button :label="64">64G</el-radio-button>
                  <el-radio-button :label="128">128G</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="系统盘(GB):" prop="systemDisk">
                <el-tooltip
                  effect="dark"
                  content="系统盘默认100GB"
                  placement="top"
                >
                  <el-input
                    placeholder="请输入内容"
                    v-model="vmForm.systemDisk"
                    style="width: 200px"
                    disabled
                  >
                    <template slot="append">GB</template>
                  </el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="数据盘(GB):" prop="dataDisk">
                <el-slider
                  v-model="vmForm.dataDisk"
                  :format-tooltip="formatTooltip"
                ></el-slider>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="24">
                <el-form-item label="是否创建新服务器:">
                  <el-tooltip content="按钮打开时,系统将创建全新的服务器">
                    <el-switch v-model="vmForm.createFlag"> </el-switch>
                  </el-tooltip>
                </el-form-item>
              </el-col> -->

            <el-col :span="24" v-if="this.vmForm.createFlag == 0">
              <el-form-item label="主机ID:" prop="instanceId">
                <el-input
                  v-model="vmForm.instanceId"
                  placeholder="主机ID"
                  style="width: 300px"
                  @blur="checkInstanceId"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="this.vmForm.createFlag == 0">
              <el-form-item label="主机IP:" prop="ip">
                <el-input
                  v-model="vmForm.ip"
                  placeholder="主机IP地址"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="this.vmForm.createFlag == 0">
              <el-form-item label="主机名称:" prop="hostName">
                <el-input
                  v-model="vmForm.hostName"
                  placeholder="主机名称"
                  style="width: 300px"
                  @blur="checkHostName"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="this.vmForm.createFlag == 0">
              <el-form-item label="Root密码:" prop="consumerPassword">
                <el-input
                  v-model="vmForm.consumerPassword"
                  placeholder="Root密码"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div
            v-show="active == 4"
            justify="space-between"
            style="margin-top: 30px"
          >
            <el-col :span="24">
              <el-form-item label="选择配置网络:">
                <el-radio-group size="medium" v-model="vmForm.NetType">
                  <el-radio border label="Basic">基础网络</el-radio>
                  <el-radio border label="VPC">VPC网络</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="vmForm.NetType === 'VPC'">
              <el-form-item label="VPC专有网络：">
                <el-transfer
                  filterable
                  v-model="selectVpcNet"
                  :data="vpcNetOptions"
                  @change="changeNet"
                  :titles="['可选用VPC专有网络', '已选择']"
                ></el-transfer>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="vmForm.NetType === 'Basic'">
              <el-form-item label="基础网络：">
                <el-transfer
                  filterable
                  v-model="selectBasicNet"
                  :data="basicNetOptions"
                  @change="changeBasicNet"
                  :titles="['可选用基础网络', '已选择']"
                ></el-transfer>
              </el-form-item>
            </el-col>
          </div>

          <div style="text-align: center; margin-top: 20px">
            <el-button
              v-if="(this.active > 0) & (this.active <= 4)"
              size="small"
              icon="el-icon-arrow-left"
              @click="prev"
              >上一步</el-button
            >
            <el-button
              v-if="this.active < 4"
              size="small"
              type="primary"
              @click="next"
              >下一步<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
            <el-button
              v-if="this.active == 4"
              size="medium"
              type="primary"
              icon="el-icon-s-promotion"
              @click="complete"
              >提 交</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="关联到业务域"
      :visible.sync="dialogFormVisibleGroup"
      width="590px"
    >
      <div class="flex flex-justify-content-center">
        <el-form
          ref="relateGroupForm"
          :model="relateGroupForm"
          label-width="120px"
          label-position="left"
          :rules="rules"
        >
          <el-form-item label="所属环境:" prop="envId" required>
            <el-select
              v-model="relateGroupForm.envId"
              placeholder="请选择环境"
              style="width:286px"
            >
              <el-option
                v-for="item in envOptions"
                :key="item.envId"
                :label="item.label"
                :value="item.envId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属业务域:" prop="teamId" required>
            <el-select
              v-model="relateGroupForm.teamId"
              placeholder="请选择业务域"
              style="width:286px"
            >
              <el-option
                v-for="item in options"
                :key="item.teamId"
                :label="item.label"
                :value="item.teamId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人:" prop="teamMemberId" required>
            <el-select
              v-model="relateGroupForm.teamMemberId"
              placeholder="请选择负责人"
              style="width:286px"
            >
              <el-option
                v-for="item in teamMembers"
                :key="item.teamMemberId"
                :label="item.label"
                :value="item.teamMemberId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用途分类:" prop="hostUsageId" required>
            <el-select
              v-model="relateGroupForm.hostUsageId"
              placeholder="请选择用途分类"
              style="width:286px"
            >
              <el-option
                v-for="item in hostUsageOptions"
                :key="item.hostUsageId"
                :label="item.label"
                :value="item.hostUsageId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div style="text-align: center; margin-top: 30px; margin-bottom: 10px">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="handleRelative"
              >提 交</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";

export default {
  components: {
    pagination,
  },
  data() {
    return {
      searchLoadin: false,
      relateGroupForm: {
        teamId: "",
        envId: "",
        teamMemberId: "",
        hostUsageId: "",
      },
      vmForm: {
        id: "",
        code: "",
        name: "",
        adminId: "",
        adminName: "",
        groupAccount: "",
        adminPhone: "",
        address: "",
        url: "",
        respPersonName: "",
        teamId: "",
        remark: "",
        options: [],
        teamName: "",
        envOptions: [],
        enncloudAccountOptions: [],
        enncloudAccount: "",
        enncloudAccountSecret: "",
        envId: "",
        hostUsageOptions: [],
        hostUsageId: "",
        hostUsageName: "",
        operateSystemOptions: [],
        operateSystemId: "",
        operateSystemName: "",
        systemDisk: 100,
        dataDisk: 0,
        hostCount: 1,
        hostName: "",
        isMonitor: 1,
        cpu: "1",
        mem: "1",
        ip: "",
        xinCloudMail: "",
        hostUsageDesc: "",
        hostType: "1",
        hostTypeName: "性能型",
        copyStrategy: "1",
        copyStrategyName: "同数据中心多副本",
        vXnetType: 0,
        vpcnet: "",
        basicnet: "",
        firewall: "",
        anthType: "1",
        userName: "root",
        sshKey: "",
        password: "",
        createFlag: 0,
        instanceId: "",
        NetType: "Basic",
        consumerPassword: "",
      },
      selectBasicNet: [],
      selectVpcNet: [],
      selectImage: [],
      active: 2,
      addVMVisible: false,
      // 数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数
      pageSize: 10,
      // 默认总条数
      totalCount: 0,
      dialogFormVisible: false,
      dialogFormVisibleGroup: false,
      dialogFormVisibleAddMonitor: false,
      tabledataid: "",
      ip: "",
      hostsName: "",
      respPersonName: "",
      options: [],
      teamId: "",
      envOptions: [],
      envId: "",
      hostUsageOptions: [],
      hostUsageId: "",
      operateSystemOptions: [],
      operateSystemId: "",
      enncloudAccountOptions: [],
      enncloudAccount: "",
      teamOptions: [],
      teamMembers: [],
      teamMemberId: "",
      imagesOptions: [],
      domainMemberOptions: [],
      formSearch: {},
      basicNetOptions: [],
      vpcNetOptions: [],
      hostId: 0,
      canAddVm: false,
      multipleSelection: [],
      errorInstanceMsg: "",
      errorNameMsg: "",
      rules: {
        teamId: [
          { required: true, message: "请选择所属业务域", trigger: "change" },
        ],
        envId: [
          { required: true, message: "请选择所属环境", trigger: "change" },
        ],
        teamMemberId: [
          { required: true, message: "请选择业务域负责人", trigger: "change" },
        ],
        hostUsageId: [
          { required: true, message: "请选择服务器用途", trigger: "change" },
        ],
      },
      checkRules: {
        teamId: [
          { required: true, message: "请选择所属业务域", trigger: "change" },
        ],
        envId: [
          { required: true, message: "请选择所属环境", trigger: "change" },
        ],
        respPersonName: [
          { required: true, message: "请填写负责人", trigger: "change" },
        ],
        hostUsageId: [
          { required: true, message: "请选择用途分类", trigger: "change" },
        ],
        enncloudAccount: [
          { required: true, message: "请选择新智云账号", trigger: "change" },
        ],
        hostCount: [
          { required: true, message: "请填入主机数量", trigger: "blur" },
        ],
        cpu: [{ required: true, message: "请选择CPU类型", trigger: "blur" }],
        mem: [{ required: true, message: "请选择内存类型", trigger: "blur" }],
        dataDisk: [
          { required: true, message: "请选择数据盘", trigger: "blur" },
        ],
        // instanceId: [
        //   { required: true, message: "请填写主机ID", trigger: "blur" },
        // ],
        // ip: [{ required: true, message: "请填写主机IP", trigger: "blur" }],
        // hostName: [
        //   { required: true, message: "请填写主机名称", trigger: "blur" },
        // ],
        // consumerPassword: [
        //   { required: true, message: "请填写初始化密码", trigger: "blur" },
        // ],
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteVm: function () {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$notify.info({
          title: "提醒",
          message: "请先选择需要删除的数据",
        });
        return;
      }
      if (this.multipleSelection.length != 1) {
        this.$notify.info({
          title: "提醒",
          message: "暂时只支持删除一条数据",
        });
        return;
      }
      this.$prompt("请输入删除备注消息", "提示", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          that.dataLoding = true;
          that
            .axios({
              url: this.GLOBAL.baseUrl + "/hosts/delHosts",
              method: "post",
              data: {
                message: value,
                id: that.multipleSelection[0].id,
              },
            })
            .then((res) => {
              that.dataLoding = false;
              that.getData();
              if (res.data.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((res) => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    handleRelative() {
      this.$refs.relateGroupForm.validate(async (valid) => {
        if (valid) {
          let url = this.GLOBAL.baseUrl + "/hosts/group/relate/" + this.hostId;
          this.axios({
            method: "post",
            url: url,
            data: this.relateGroupForm,
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: "数据关联成功",
                  type: "success",
                });
                this.$refs.relateGroupForm.resetFields();
                this.handleClose();
                this.getData();
              } else {
                this.$alert(res.data.message, "提示", {
                  type: "warning",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    disRelateGroup(row, val) {
      const promptMsg = "确定要解除关联吗?";
      this.$confirm(promptMsg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = this.GLOBAL.baseUrl + "/hosts/group/disrelate/" + row.id;
          this.axios({
            method: "post",
            url: url,
          }).then((res) => {
            var msg = "操作成功";
            if (res.status === 200) {
              this.getData();
            } else {
              msg = res.data.message;
            }
            this.$alert(msg, "提示", {
              type: "warning",
            });
          });
        })
        .catch(() => {});
    },
    toRelateGroupDialog(row, val) {
      this.dialogFormVisibleGroup = true;
      this.hostId = row.id;
    },

    changeImage() {
      if (this.selectImage.length > 1) {
        this.$notify({
          title: "警告",
          message: "最多只能选择一个",
          type: "warning",
        });
        this.selectImage.splice(1, this.selectImage.length);
      }
    },

    changeNet() {
      if (this.selectVpcNet.length > 1) {
        this.$notify({
          title: "警告",
          message: "最多只能选择一个基础网络配置",
          type: "warning",
        });
        this.selectVpcNet.splice(1, this.selectVpcNet.length);
      }
    },

    changeBasicNet() {
      if (this.selectBasicNet.length > 1) {
        this.$notify({
          title: "警告",
          message: "最多只能选择一个基础网络配置",
          type: "warning",
        });
        this.selectBasicNet.splice(1, this.selectBasicNet.length);
      }
    },
    handleChangeHostUsage() {},
    handleChangeTeam() {},
    handleChangeRespPerson() {},
    formatTooltip(val) {
      if (val * 20 === 1000) {
        this.$notify({
          title: "提示",
          message: "单块数据盘的容量最大是1000G,最大支持容量是2000G",
          position: "bottom-right",
        });
      }
      return val * 20 + "G";
    },
    onSelectAll() {
      this.$refs.singleTable.clearSelection();
    },
    on_select() {},
    change() {},
    handleChange() {},
    handleChangeOwner() {},
    handleChangeEnv() {},
    loadData(e) {
      this.currentPage = e.page;
      this.pageSize = e.limit;
      this.getData();
    },
    handleClose() {
      this.addVMVisible = false;
      this.dialogFormVisibleGroup = false;
    },
    closeRelateGroupDialog() {},
    envCodeSelectOptionChange() {},
    handleChangeEnnCloudAccount() {},
    getTeamsSelect() {
      let url = this.GLOBAL.baseUrl + "/hosts/list/enncloudaccount";
      this.axios({
        method: "post",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            //新智云下拉列表
            res.data.data.forEach((element) => {
              this.enncloudAccountOptions.push({
                enncloudAccount: element.selectValue,
                label: element.selectKey,
              });
            });
          }
        })
        .catch((err) => {});
    },
    getSelectRespPersonData() {
      let url = this.GLOBAL.baseUrl + "/team/init/select";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            // 业务域成员
            res.data.data.domainMembers.forEach((element) => {
              this.domainMemberOptions.push({
                key: element.selectKey,
                value: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {});
    },

    getVpCOptions() {
      let url = this.GLOBAL.baseUrl + "/hosts/baseResources/resources/";
      if (this.vmForm.enncloudAccountSecret != "") {
        var secretArr = this.vmForm.enncloudAccountSecret.split("#####");
        if (secretArr.length != 3) {
          this.$notify({
            title: "警告",
            message: "Vpc网络配置数据获取失败",
            type: "warning",
          });
          return;
        } else {
          this.axios({
            method: "post",
            url: url,
            data: {
              qingCloudAccessId: secretArr[1],
              qingCloudAccessKey: secretArr[2],
            },
          })
            .then((res) => {
              if (res.data.code === 200) {
                if (res.data.data.data.private_vpc_infos === null) {
                  this.vpcNetOptions = [];
                } else {
                  this.vpcNetOptions = [];
                  res.data.data.data.private_vpc_infos.forEach((item) => {
                    this.vpcNetOptions.push({
                      lable: item.vxnetId + "--" + item.vxnetName,
                      key: item.vxnetId + "--" + item.vxnetName,
                    });
                  });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    getBasicOptions() {
      let url = this.GLOBAL.baseUrl + "/hosts/list/basicnet";
      this.axios({
        method: "post",
        url: url,
        data: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          enncloudAccount: this.vmForm.enncloudAccount,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.data === null) {
              this.basicNetOptions = [];
            } else {
              this.basicNetOptions = [];
              res.data.data.forEach((item) => {
                this.basicNetOptions.push({
                  lable: item.selectKey + "--" + item.selectValue,
                  key: item.selectKey + "--" + item.selectValue,
                });
              });
            }
          }
        })
        .catch((err) => {});
    },

    getSystemImageData() {
      let url = this.GLOBAL.baseUrl + "/hosts/list/system/image";
      this.axios({
        method: "post",
        url: url,
        params: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          this.imagesOptions = [];
          if (res.status === 200) {
            if (res.data.data === null) {
              return false;
            } else {
              this.imagesOptions = [];
              res.data.data.list.forEach((item) => {
                this.imagesOptions.push({
                  label: item.systemName,
                  key: item.systemId,
                });
              });
            }
          }
        })
        .catch((err) => {});
    },
    getSelectData() {
      let url = this.GLOBAL.baseUrl + "/hosts/init/select";
      this.axios({
        apiMethod: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            // console.log("res.data.data.teamList"+res.data.data.teamList)
            //所属业务域下拉列表
            res.data.data.teamList.forEach((element) => {
              this.options.push({
                teamId: element.selectKey,
                label: element.selectValue,
              });
            });
            //所属环境下拉列表
            res.data.data.envList.forEach((element) => {
              this.envOptions.push({
                envId: element.selectKey,
                label: element.selectValue,
              });
            });

            //服务器用途下拉列表
            res.data.data.hostUsageList.forEach((element) => {
              this.hostUsageOptions.push({
                hostUsageId: element.selectKey,
                label: element.selectValue,
              });
            });

            //操作系统类型下拉列表
            res.data.data.operateSystemList.forEach((element) => {
              this.operateSystemOptions.push({
                operateSystemId: element.selectKey,
                label: element.selectValue,
              });
            });
            res.data.data.teamMembers.forEach((element) => {
              this.teamMembers.push({
                teamMemberId: element.selectKey,
                label: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {});
    },
    getData() {
      let url = this.GLOBAL.baseUrl + "/hosts/list/condition";
      this.dataLoding = true;
      this.axios({
        method: "post",
        url: url,
        data: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          teamId: this.teamId,
          envId: this.envId,
          hostUsageId: this.hostUsageId,
          operateSystemId: this.operateSystemId,
          ip: this.ip,
          hostsName: this.hostsName,
          respPersonName: this.respPersonName,
        },
      })
        .then((res) => {
          this.dataLoding = false;
          if (res.status === 200) {
            if (res.data.code === 500) {
              this.$alert(res.data.message, "提示", {
                type: "warning",
              });
            } else {
              if (res.data.data != null) {
                this.tableData = res.data.data.list;
                this.totalCount = res.data.data.total;
              } else {
                this.tableData = [];
                this.totalCount = 0;
              }
            }
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
        })
        .catch((err) => {
          this.dataLoding = false;
          console.log(err);
        });
    },
    openVM() {
      this.addVMVisible = true;
      this.active = 1;
      if (this.$refs.refvmForm != undefined) {
        this.$refs.refvmForm.resetFields();
      }
      this.selectImage = [];
      this.selectVpcNet = [];
      this.selectBasicNet = [];
      this.vmForm.createFlag = 1;
    },
    openVMBuLu() {
      this.addVMVisible = true;
      this.active = 1;
      if (this.$refs.refvmForm != undefined) {
        this.$refs.refvmForm.resetFields();
      }
      this.selectImage = [];
      this.selectVpcNet = [];
      this.selectBasicNet = [];
      this.vmForm.createFlag = 0;
      this.vmForm.instanceId = "";
      this.vmForm.ip = "";
      this.vmForm.hostName = "";
      this.vmForm.consumerPassword = "";
    },
    searchForms() {
      this.currentPage = 1;
      this.getData();
    },
    resetForms() {
      this.teamId = "";
      this.envId = "";
      this.hostUsageId = "";
      this.operateSystemId = "";
      this.ip = "";
      this.hostsName = "";
      this.respPersonName = "";
    },
    prev() {
      this.active = this.active - 1;
      if (this.active == 0) {
        this.active = 1;
      }
    },
    complete() {
      if (this.vmForm.NetType === "Basic") {
        if (this.selectBasicNet.length == 0) {
          this.$notify({
            title: "警告",
            message: "请先选择基础网络后再提交创建",
            type: "warning",
          });
          return;
        }
      }
      if (this.vmForm.NetType === "VPC") {
        if (this.selectVpcNet.length == 0) {
          this.$notify({
            title: "警告",
            message: "请先选择专有网络后再提交创建",
            type: "warning",
          });
          return;
        }
      }

      this.$confirm(
        "请检查创建虚机相关的配置参数，如无误,请确认提交?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$refs.refvmForm.validate(async (valid) => {
            if (valid) {
              this.addVMVisible = false;
              var postData = {
                teamId: this.vmForm.teamId.value,
                remark: this.vmForm.remark,
                teamName: this.vmForm.teamId.label,
                respPersonId: this.vmForm.respPersonName.value,
                enncloudAccount: this.vmForm.enncloudAccount,
                qingCloudAccessId:
                  this.vmForm.enncloudAccountSecret.split("#####")[1],
                qingCloudAccessKey:
                  this.vmForm.enncloudAccountSecret.split("#####")[2],
                envId: this.vmForm.envId.value,
                hostUsageId: this.vmForm.hostUsageId.value,
                hostUsageName: this.vmForm.hostUsageId.label,
                operateSystemId: "",
                operateSystemName: "",
                systemDisk: this.vmForm.systemDisk,
                dataDisk:
                  parseInt(this.vmForm.dataDisk) === 0
                    ? ""
                    : 20 * parseInt(this.vmForm.dataDisk),
                hostCount: this.vmForm.hostCount,
                hostName: this.vmForm.hostName,
                hostType: this.vmForm.hostType,
                hostTypeName: this.vmForm.hostTypeName,
                createFlag: this.vmForm.createFlag,
                respPersonName: this.vmForm.respPersonName.label,
                cpu: parseInt(this.vmForm.cpu),
                mem: parseInt(this.vmForm.mem),
                ip: this.vmForm.ip,
                hostUsageDesc: this.vmForm.hostUsageDesc,
                systemName: "centos7x64d",
                firewall: "sg-zxyhtebp",
                userName: "root",
                sshKey: "kp-yt0bww0b",
                password: "fuzhiwei@W1",
                consumerPassword: this.vmForm.consumerPassword,
                instanceId: this.vmForm.instanceId,
                tenantId: localStorage.getItem("originTenantId"),
                vxnetId: "",
                vxnetName: "",
              };
              this.imagesOptions.forEach((i) => {
                var imageKey = this.selectImage[0];
                if (i.key === imageKey) {
                  postData.operateSystemId = imageKey;
                  postData.operateSystemName = i.label;
                }
              });
              if (this.vmForm.NetType === "Basic") {
                var baseNetKey = this.selectBasicNet[0];
                postData.vxnetId = baseNetKey.split("--")[0];
              }
              if (this.vmForm.NetType === "VPC") {
                var vpcNetKey = this.selectVpcNet[0];
                postData.vxnetId = vpcNetKey.split("--")[0];
              }
              let url = this.GLOBAL.baseUrl + "/hosts/instances/createServer/";
              if (!this.vmForm.createFlag) {
                url = this.GLOBAL.baseUrl + "/hosts/createHostsCallBack";
                var temp = postData;
                postData = {};
                postData = {
                  code: 200,
                  message: "成功",
                  data: [temp],
                };
              }
              this.axios({
                method: "POST",
                url: url,
                data: postData,
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  if (res.data.code == 200) {
                    if (this.vmForm.createFlag) {
                      this.$notify({
                        title: "提示",
                        message:
                          "由于添加服务器耗时比较长，添加完成后会邮件通知，请知晓",
                        type: "success",
                      });
                    } else {
                      this.$notify({
                        title: "提示",
                        message: "添加成功",
                        type: "success",
                      });
                    }
                  } else {
                    this.$notify({
                      title: "警告",
                      message: "创建失败",
                      type: "warning",
                    });
                  }
                  this.getData();
                  this.$refs.refvmForm.resetFields();
                })
                .catch((res) => {
                  this.$notify({
                    title: "警告",
                    message: "创建失败",
                    type: "warning",
                  });
                });
            } else {
              this.$notify({
                title: "警告",
                message: "提交失败，请检查必填项是否填写",
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    },
    next() {
      this.active = this.active + 1;
      if (this.active === 2) {
        this.$refs.refvmForm.validate(async (valid) => {
          if (!valid) {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: "请先填写完成必填项后再下一步",
              type: "warning",
            });
          }
        });
      }
      if (this.active === 3) {
        if (this.selectImage.length == 0) {
          this.active = this.active - 1;
          this.$notify({
            title: "警告",
            message: "请先选择镜像后再下一步",
            type: "warning",
          });
        }
        this.enncloudAccountOptions.forEach((item) => {
          if (this.vmForm.enncloudAccount === item.label) {
            this.vmForm.enncloudAccountSecret = item.enncloudAccount;
          }
        });
        this.getVpCOptions();
      }
      if (this.active === 4) {
        this.getBasicOptions();

        if (this.vmForm.createFlag == 0) {
          if (this.vmForm.instanceId == "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: "请填写主机ID",
              type: "warning",
            });
            return;
          }
          if (this.vmForm.ip == "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: "请填写主机IP",
              type: "warning",
            });
            return;
          }
          if (this.vmForm.hostName == "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: "请填写主机名称",
              type: "warning",
            });
            return;
          }
          if (this.vmForm.consumerPassword == "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: "请填写Root密码",
              type: "warning",
            });
            return;
          }
          //服务器Id和名称校验
          console.log(
            "(this.errorInstanceMsg !== )" + (this.errorInstanceMsg !== "")
          );
          if (this.errorInstanceMsg !== "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: this.errorInstanceMsg,
              type: "warning",
            });
            return;
          }
          console.log("(this.errorNameMsg !== )" + (this.errorNameMsg !== ""));
          if (this.errorNameMsg !== "") {
            this.active = this.active - 1;
            this.$notify({
              title: "警告",
              message: this.errorNameMsg,
              type: "warning",
            });
            return;
          }
        }
      }
    },
    checkInstanceId() {
      if (this.vmForm.instanceId == "") {
        this.$notify({
          title: "警告",
          message: "请填写主机ID",
          type: "warning",
        });
        return;
      }

      let url =
        this.GLOBAL.baseUrl +
        "/hosts/checkInstanceIdAndName?instanceId=" +
        this.vmForm.instanceId +
        "&hostName=";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.errorInstanceMsg = "";
          } else {
            this.errorInstanceMsg = res.data.message;
            console.log("this.errorInstanceMsg:" + this.errorInstanceMsg);
            this.$notify({
              title: "警告",
              message: res.data.message,
              type: "warning",
            });
            return;
          }
        })
        .catch((err) => {});
    },
    checkHostName() {
      if (this.vmForm.hostName == "") {
        this.$notify({
          title: "警告",
          message: "请填写主机名称",
          type: "warning",
        });
        return;
      }

      let url =
        this.GLOBAL.baseUrl +
        "/hosts/checkInstanceIdAndName?instanceId=&hostName=" +
        this.vmForm.hostName;
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.errorNameMsg = "";
          } else {
            console.log("this.errorNameMsg:" + this.errorNameMsg);
            this.errorNameMsg = res.data.message;
            this.$notify({
              title: "警告",
              message: res.data.message,
              type: "warning",
            });
            return;
          }
        })
        .catch((err) => {});
    },
    checkVmAddPermission() {
      var currentUser = localStorage.getItem("userName");
      if (this.GLOBAL.canAddVmUsers.indexOf(currentUser) >= 0) {
        this.canAddVm = true;
      }
    },
  },
  created: function () {
    this.getData();
    this.getSelectData();
    this.getSystemImageData();
    this.getSelectRespPersonData();
    this.getTeamsSelect();
    this.checkVmAddPermission();
  },
};
</script>
<style>
.infor_item {
  margin-top: 40px;
  width: 100%;
}
/* .vm_plain {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  align-items: center;
  justify-content: center;
} */

.el-transfer-panel {
  width: 280px;
}

.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.main .operate-box {
  margin-bottom: 20px;
}
.main .table-box {
  flex: 1;
  overflow-y: auto;
}
.demo-form-inline {
  display: flex;
  flex-wrap: wrap;
}
</style>
