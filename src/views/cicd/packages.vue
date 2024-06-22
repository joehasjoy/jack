<template>
  <div class="main flex-column">
    <div class="flex-center-between">
      <el-button
        style="margin-bottom:20px"
        @click="appAddClick"
        type="primary"
        icon="el-icon-upload"
        >制品上传</el-button
      >

      <!-- 搜索 -->
      <el-form
        :inline="true"
        :model="formSearch"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item>
          <el-input
            style="width:284px"
            v-model="formSearch.name"
            placeholder="请输入制品名称"
            clearable
            @keyup.enter.native="LoadData"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="LoadData" 
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box">
      <!-- 表格 -->
      <el-table
        stripe
        id="out-table"
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
      >
        <el-table-column
          label="制品名称"
          align="left"
          prop="productName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <a @click="productView(scope.row)">{{ scope.row.productName }}</a>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="类型"
          prop="productType"
          align="center"
          width="120"
        >
          <!-- <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.productType === 1"
              >镜像</el-tag
            >
            <el-tag type="danger" v-if="scope.row.productType === 2"
              >jar</el-tag
            >
            <el-tag type="info" v-if="scope.row.productType === 3">war</el-tag>
            <el-tag type="danger" v-if="scope.row.productType === 4"
              >目录</el-tag
            >
          </template> -->
        </el-table-column>
        <el-table-column
          sortable
          label="生成方法"
          prop="createType"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.createType === 1"
              >自动生成</el-tag
            >
            <el-tag type="danger" v-if="scope.row.createType === 2"
              >人工上传</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="所属应用"
          prop="appCode"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          sortable
          prop="createTime"
          :show-overflow-tooltip="true"
          width="160"
        ></el-table-column>
        <el-table-column
          label="审核状态"
          align="center"
          sortable
          prop="labelsName"
          :show-overflow-tooltip="true"
          width="120"
        ></el-table-column>
        <el-table-column label="操作"  align="left" width="286">
          <template slot-scope="scope">
            <!-- <el-button
            slot="reference"
              type="info"
              size="mini"
              icon="el-icon-info"
            @click="productView(scope.row)"
            >查看</el-button
          > -->
            <el-button type="text" @click="downloadProduct(scope.row)" :disabled="scope.row.productUrl ? false : true">下载</el-button>
            <el-button type="text" @click="deleteClick(scope.row)">删除</el-button>
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="check(scope.row, 'UAT_CHECKED')">UAT审核通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="LoadData"
    ></pagination>

    <el-dialog
      :title="title"
      :visible.sync="AppCreatedPermissiondialogVisible"
      width="590px"
    >
      <div class="flex-start-center">
        <el-form
          :model="packageModel"
          label-position="left"
          label-width="100px"
          ref="packageForm"
        >
          <el-form-item>
            <el-input
              style="display: none"
              v-model="packageModel.id"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="名称"
            required
            prop="product_name"
            :rules="[
              { required: true, message: '请输入名称', trigger: 'blur' },
            ]"
          >
            <el-input
              style="width: 360px"
              v-model="packageModel.product_name"
              placeholder="请输入名称"
              :disabled="nameDisabled"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="应用"
            required
            prop="app_id"
            :rules="[
              { required: true, message: '请选择应用', trigger: 'change' },
            ]"
          >
            <el-select
              v-model="packageModel.app_id"
              placeholder="请选择应用"
              style="width: 360px"
              clearable
              allow-create
              filterable
              :disabled="appDisabled"
            >
              <el-option
                v-for="item in app"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="productDesc">
            <label slot="label">&nbsp;&nbsp;描述</label>
            <el-input
              style="width: 360px"
              v-model="packageModel.productDesc"
              placeholder="请输入描述信息"
              type="textarea"
              rows="4"
            ></el-input>
          </el-form-item>

          <el-form-item label="制品上传" v-if="productShow">
            <el-upload
              class="upload-demo"
              ref="uploaddemo"
              drag
              :action="productUploadUrl()"
              :on-success="uploadFileSuccess"
              :limit="1"
              :on-remove="removeUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
       <div style="text-align: center; margin-top: 10px">
          <el-button type="primary" @click="Submit">提 交</el-button>
          <el-button
            @click="AppCreatedPermissiondialogVisible = false"
            >取 消</el-button
          >
        </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import { GoToPipeline } from "@/utils/pipeline.js";
import packagesDetails from "@/views/cicd/packagesDetails";

export default {
  name: "app",
  props: {},

  data() {
    return {
      title: "新增制品",
      packageModel: {
        id: 0,
        product_name: "",
        app_id: "",
        create_type: "",
        productDesc: "",
        product_type: "",
      },
      productOptions: [],
      createOptions: [],
      app: [],
      tanents: [],
      AppCreatedPermissiondialogVisible: false,
      productDetailView: false,
      checkPermissionURL: "",
      languages: [],
      users: [],
      formSearch: { name: "" },
      condition: [],
      newRules: {
        // display_name: [{required: true,message: "请输入内容",trigger: "blur"}],
      },
      newRow: { name: "", is_enable: true, description: "" },
      global_dict: { mudule_list: [] },
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
      product_upload_url:
        this.GLOBAL.baseUrl +
        "/products/uploads/file/" +
        localStorage.getItem("originTenantId"),
      product_file_url: "",
      appDisabled: false,
      nameDisabled: false,
      productShow: true,
    };
  },
  created: function () {},
  watch: {},
  methods: {
    deleteClick: function (row) {
      this.$confirm("此操作将永久删除该制品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            url:
              this.GLOBAL.baseUrl +
              "/products/delete?productName=" +
              row.productName,
            method: "get",
          })
            .then((result) => {
              if (result.data.code == 200) {
                this.LoadData();
                this.$message({
                  type: "success",
                  message: "删除成功",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "error",
                message: "操作失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit: function (row) {
      this.LoadSelectOption();
      this.title = "修改制品";
      this.AppCreatedPermissiondialogVisible = true;
      this.appDisabled = true;
      this.nameDisabled = true;
      this.productShow = false;
      this.packageModel.id = row.id;
      this.packageModel.productDesc = row.productDesc;
      this.packageModel.product_name = row.productName;
      this.packageModel.app_id = row.appId;
      this.packageModel.create_type = row.createType;
      this.packageModel.product_type = row.productType;
      // console.log(row);
    },

    check: function (row, type) {
      //row.id
      this.$confirm("是否确定UAT审核通过？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            method: "post",
            url:
              this.GLOBAL.baseUrl + "/products/labels/" + row.id + "/" + type,
          })
            .then((result) => {
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "操作成功",
                });
                this.LoadData();
              } else {
                this.$message.error(result.data.message);
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message.error("操作失败");
            });
        })
        .catch(() => {
          //this.$message({type: 'info', message: '已取消'})
        });
    },

    downloadProduct: function (row) {
      // console.log("正在下载的文件路径:" + row.productUrl);
      window.location.href = row.productUrl;
    },
    productView: function (row) {
      this.$router.push("/cicd/packageDetails?productId=" + row.id);
    },
    //跳转新增页面
    appAddClick: function () {
      this.title = "新增制品";
      this.appDisabled = false;
      this.nameDisabled = false;
      this.productShow = true;
      this.packageModel.product_name = "";
      this.packageModel.app_id = "";
      this.packageModel.productDesc = "";
      this.packageModel.product_type = "";
      this.product_file_url = "";
      this.AppCreatedPermissiondialogVisible = true;
    },
    Submit: function () {
      this.$refs.packageForm.validate(async (valid) => {
        if (valid) {
          let url = "";
          let postData = {};
          if (this.title == "新增制品") {
            url = this.GLOBAL.baseUrl + "/products/add";
            postData = {
              productName: this.packageModel.product_name,
              appId: this.packageModel.app_id,
              // createType: this.packageModel.create_type,
              // 2:表示人工生成
              createType: 2,
              productDesc: this.packageModel.productDesc,
              productType: this.packageModel.product_type,
              tenantId: localStorage.getItem("originTenantId"),
              productUrl: this.product_file_url,
            };
            if (this.packageModel.product_name == "") {
              this.$message.error("名称不能是空");
            }
            if (this.product_file_url == "") {
              this.$message.error(
                "未上传制品或制品未上传完成（等待上传完成提示后在提交）"
              );
              return;
            }
          } else {
            url = this.GLOBAL.baseUrl + "/products/update";
            postData = {
              id: this.packageModel.id,
              productName: this.packageModel.product_name,
              appId: this.packageModel.app_id,
              // 2:表示人工生成
              createType: 2,
              productDesc: this.packageModel.productDesc,
              productType: this.packageModel.product_type,
              tenantId: localStorage.getItem("originTenantId"),
            };
          }

          this.axios({
            method: "post",
            url: url,
            data: postData,
          })
            .then((result) => {
              if (result.data.code == 200) {
                this.AppCreatedPermissiondialogVisible = false;
                this.LoadData();
                this.$message({
                  type: "success",
                  message: "操作成功",
                });
                this.$refs.uploaddemo.clearFiles();
              } else {
                this.$message.error(result.data.message);
              }
            })
            .catch((error) => {
              // this.$message.error("上传失败");
              this.AppCreatedPermissiondialogVisible = false;
            });
          this.AppCreatedPermissiondialogVisible = false;
          this.$refs.packageForm.resetFields();
          this.LoadData();
        }
      });
    },
    GetAllApps: function () {
      this.axios({
        url: this.app_url,
        method: "GET",
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            if (result.data.code == 200) {
              this.app = result.data.data.list;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    LoadData: function () {
      let queryData = {};
      if (this.formSearch.name == "") {
        queryData = {
          pageSize: this.limit,
          pageNumber: this.page,
        };
      } else {
        queryData = {
          pageSize: this.limit,
          pageNumber: this.page,
          productName: this.formSearch.name,
        };
      }

      this.axios({
        url: this.GLOBAL.baseUrl + "/products/list/condition",
        method: "post",
        data: queryData,
      })
        .then((result) => {
          // console.log(result);
          if (result.status == 200) {
            if (result.data.code == 200) {
              // console.log("result.data.data.list == undefined::"+typeof(result.data.data.list)  != undefined );
              this.tableData = result.data.data.list;
              this.total = result.data.data.total;
            }
          }
        })
        .catch((error) => {
          // console.log(error);
          this.tableData = [];
          this.total = 0;
        });
    },
    LoadSelectOption: function () {
      this.productOptions = [
        { k: "镜像", product_type: 1 },
        { k: "jar", product_type: 2 },
        { k: "war", product_type: 3 },
        { k: "目录", product_type: 4 },
      ];
      this.createOptions = [
        { k: "自动生成", create_type: 1 },
        { k: "人工上传", create_type: 2 },
      ];
    },
    productUploadUrl: function () {
      return this.product_upload_url;
    },
    uploadFileSuccess(response, file, fileList) {
      // console.log("上传制品成功:" + response);
      this.product_file_url = response;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    removeUpload(file, fileList) {
      // console.log("删除制品成功");
      this.product_file_url = "";
    },
  },

  computed: {},
  mounted() {
    // this.GetAllTelantApps();
    this.GetAllApps();
    this.LoadData();
    this.LoadSelectOption();
  },
  components: {
    "table-box": Table,
    pagination: pagination,
    packagesDetails: packagesDetails,
  },
};
</script>

<style scoped>
.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.main .table-box {
  flex: 1;
  overflow-y: auto;
}
</style>
