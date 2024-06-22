<template>
  <div>
    <el-card style="margin: 10px">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">应用详情</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="goBack"
          >返回</el-button
        >
      </div>
      <!-- 应用基础信息-->
      <el-card >
        <div slot="header" class="clearfix">
          <span style="font-size: 16px">应用基础信息</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="appEditClick()"
            v-if="
              common.hasPermission($store.state.user.roles, [
                'cicd_admin',
                'devops',
                'app_owner',
              ])
            "
            >编辑</el-button
          >
        </div>
        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>应用名称：{{ AppData.name }}</p></el-col
          >
          <el-col :span="12"
            ><p>应用ID：{{ AppData.id }}</p></el-col
          >
        </el-row>

        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>应用代号：{{ AppData.code }}</p></el-col
          >
          <el-col :span="12"
            ><p>
              核心业务： <span v-if="AppData.isCore === 1">是</span>
              <span v-else>否</span>
            </p></el-col
          >
        </el-row>

        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>业务域：{{ AppData.groupIdStr }}</p></el-col
          >
          <el-col :span="12"
            ><p>应用所属人：{{ owner }}</p></el-col
          >
        </el-row>

        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>
              语言/渠道：
              <span v-if="AppData.useLanguage === 1">java</span>
              <span v-if="AppData.useLanguage === 2">python</span>
              <span v-if="AppData.useLanguage === 3">golang</span>
              <span v-if="AppData.useLanguage === 4">nodeJs</span>
              <span v-if="AppData.useLanguage === 5">Javascript</span>
              <span v-else></span></p
          ></el-col>

          <el-col :span="12"
            ><p>仓库地址：{{ AppData.gitRepoUrl }}</p></el-col
          >
        </el-row>
      </el-card>

      <!-- 应用发布基础配置-->
      <el-card style="margin-top: 10px;display:none;">
        <div slot="header" class="clearfix">
          <span style="font-size: 16px">应用发布基础配置</span>
        </div>
        <el-table
          border
          :data="publishData"
          size="mini"
          v-loading="pub_loading"
        >
          <el-table-column
            label="应用代码"
            prop="app__code"
            width="200"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="环境"
            prop="env"
            width="100"
          ></el-table-column>
          <el-table-column
            label="部署类型"
            prop="build_type"
            width="100"
          ></el-table-column>
          <el-table-column label="授权用户" prop="user_list" width="">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.user_list"
                :key="index"
                style="margin: 0 2px"
                size="mini"
                >{{ item.users__displayname }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="授权用户组" prop="usergroup_list" width="">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.usergroup_list"
                :key="index"
                style="margin: 0 2px"
                size="mini"
                >{{ item.user_group__name }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <pagination
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            @pagination="GetAppResourceData(app_resource_url)"
          ></pagination>
        </div>
      </el-card>

      <!-- 应用无状态资源信息-->
      <el-card style="margin-top: 10px;display:none;">
        <div slot="header" class="clearfix">
          <span style="font-size: 16px">应用无状态资源信息</span>
        </div>
        <el-table border :data="kubeData" size="mini" v-loading="kube_loading">
          <el-table-column
            label="环境"
            prop="app_resource__env"
            width=""
          ></el-table-column>
          <el-table-column label="name" prop="name" width=""></el-table-column>
          <el-table-column
            label="Pod数量"
            prop="replicas"
            width=""
          ></el-table-column>
          <el-table-column
            label="限制CPU"
            prop="cpu"
            width=""
          ></el-table-column>
          <el-table-column
            label="限制内存"
            prop="memory"
            width=""
          ></el-table-column>
        </el-table>
        <div class="block">
          <pagination
            :total="kube_total"
            :page.sync="kube_page"
            :limit.sync="kube_limit"
            @pagination="GetAppResourceData(app_resource_url)"
          ></pagination>
        </div>
      </el-card>

      <!-- 应用主机资源信息-->
      <!--
        <el-card style="margin-top: 10px">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px">应用主机资源信息</span>
          </div>
          <el-table :data="instance_list" border size="mini">
            <el-table-column type="expand">
              <template slot-scope="instances">
                <el-table :data="instances.row.instanceInfo" border size="mini">
                  <el-table-column label="主机名" prop="hostname" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="IP" prop="ip" width="200"></el-table-column>
                  <el-table-column label="镜像" prop="image_id" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="hardware" prop="hardware" width="120"></el-table-column>
                  <el-table-column label="可用区" prop="zone_id" width="120"></el-table-column>
                  <el-table-column label="区域" prop="region_id" width="120"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="环境" prop="name" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="数量" prop="num" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </el-card>
        -->
    </el-card>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";
export default {
  name: "app-detail",
  data() {
    return {
      kube_loading: false,
      pub_loading: false,
      appId: "",
      appCode: "",
      AppData: {},
      owner: {},
      app_url: this.GLOBAL.baseUrl + "/app/",
      app_resource_url: this.GLOBAL.service_tag + "/api/ams/app-resource/",
      app_resource_kube_url:
        this.GLOBAL.service_tag + "/api/ams/app-resource-kubernetes/",
      cmdb_app_url: this.GLOBAL.baseUrl + "/app/",

      kubeData: [],
      kube_limit: 10,
      kube_page: 1,
      kube_total: 0,

      publishData: [],
      limit: 10,
      page: 1,
      total: 0,

      instance_list: [],
    };
  },

  methods: {
    // 返回上一页
    goBack: function () {
      this.$router.push("/cicd/app?appCode=" + this.AppData.code);
    },

    appEditClick: function () {
      this.$router.push("/cicd/app-edit?appId=" + this.appId);
    },

    // 通过appId获取应用基础信息
    GetAppData: function (url) {
      this.axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
           console.log('GetAppData:',response.data);
          if (response.data.code == 200) {
            this.AppData = response.data.data;
            // this.Row = response.data.data[0]
            // this.languages = response.data.languages
            // this.users = response.data.users
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
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
          // console.log('GetAppResourceData:',response.data);
          if (response.data.status) {
            this.publishData = response.data.data;
            this.total = response.data.total;
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },

    // 通过appid 获取应用对应环境的kube信息
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
          // console.log('GetAppResourceKubeData:',response.data);
          if (response.data.status) {
            this.kubeData = response.data.data;
            this.kube_total = response.data.total;
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },

    // 通过appId获取应用host信息
    GetAppHostData: function (url) {
      let parms = { appId: this.appId };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetAppHostData:',response.data);
          if (response.data.code === 200) {
            if (response.data.data.length > 0) {
              this.instance_list = response.data.data[0].instances;
            }
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },
  },

  computed: {},
  mounted() {
    this.appId = this.common.getUrlKey("appId");
    this.owner = this.common.getUrlKey("owner");
    this.GetAppData(this.app_url + this.appId);
    // this.GetAppHostData(this.cmdb_app_url)
    // this.GetAppResourceData(this.app_resource_url)
    //this.GetAppResourceKubeData(this.app_resource_kube_url)
  },

  components: {
    pagination: pagination,
  },
};
</script>

<style scoped>
</style>
