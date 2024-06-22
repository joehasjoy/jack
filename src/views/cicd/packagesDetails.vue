<template>
  <div>
    <el-card style="margin: 10px">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">制品详情</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="goBack"
          >返回</el-button
        >
      </div>
      <!-- 制品基础信息-->
      <el-card>
        <div slot="header" class="clearfix">
          <span style="font-size: 16px">基础信息</span>
          <!-- <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="appEditClick()"
            v-if="
              common.hasPermission($store.state.user.roles, [
                'cicd_admin',
                'devops',
                'product_owner',
              ])
            "
            >编辑</el-button
          > -->
        </div>
        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>制品名称：{{ productData.productName }}</p></el-col
          >
          <el-col :span="12"
            ><p>所属应用：{{ productData.appId }}</p></el-col
          >
        </el-row>

        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>制品类型：{{ productData.productType }}</p></el-col
          >
          <el-col :span="12"
            ><p>租户ID： {{ productData.tenantId }}</p></el-col
          >
        </el-row>

        <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="12"
            ><p>创建人ID：
              <span v-if="!productData.personId">无</span>
              <span v-else>{{ productData.personId }}</span>
              </p></el-col
          >
          <el-col :span="12"
            ><p>创建人：
               <span v-if="!productData.personName">无</span>
              <span v-else>{{ productData.personName }}</span>
              </p></el-col
          >
        </el-row>

         <el-row style="font-size: 16px; margin: 10px 0">
          <el-col :span="24"
            ><p>
              制品地址：
              <span v-if="!productData.productUrl">无</span>
              <span v-else>
                <a :download="productData.productUrl" :href="productData.productUrl">{{productData.productUrl}}</a>
                </span>
            </p></el-col
          >

         </el-row>  

      </el-card>

      <el-card>
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="附件管理" name="first">
            <el-card style="margin: 5px 0">
              <!-- 搜索 -->

              <el-form
                :inline="true"
                class="demo-form-inline"
                @submit.native.prevent
              >
                <el-form-item label="附件名称:">
                  <el-input
                    v-model="productNameSearch"
                    placeholder="请输入附件名称"
                    clearable
                  ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="GetTableList"
                    icon="el-icon-search"
                    >查询</el-button
                  >
                  <el-button
                    style="float: right"
                    @click="appAddClick"
                    type="primary"
                    icon="el-icon-plus"
                    >附件上传</el-button
                  >
                </el-form-item>
              </el-form>
            </el-card>

            <el-card>
              <div style="width: 100%">
                <!-- 表格 -->
                <el-table
                  id="out-table"
                  v-loading="loading"
                  :data="tableData"
                  style="width: 100%; border: 1px solid #ebeef5"
                >
                  <el-table-column
                    sortable
                    label="附件名称"
                    prop="productOtherName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>

                  <el-table-column
                    sortable
                    label="类型"
                    prop="typeName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>

                  <el-table-column
                    sortable
                    label="上传时间"
                    prop="createTime"
                    :show-overflow-tooltip="true"
                  ></el-table-column>

                  <el-table-column
                    sortable
                    label="上传人"
                    prop="personName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>

                  <el-table-column sortable label="操作" prop="" align="center">
                    <template slot-scope="scope">
                      <el-button
                        slot="reference"
                        type="primary"
                        size="mini"
                        @click="downloadProduct(scope.row)"
                        :plain="true"
                        icon="el-icon-download"
                        :disabled="scope.row.productUrl ? false : true"
                        >下载</el-button
                      >

                      <el-button
                        slot="reference"
                        type="danger"
                        size="mini"
                        @click="deleteClick(scope.row)"
                        :plain="true"
                        icon="el-icon-delete"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>

               <el-dialog
      :title="title"
      :visible.sync="AppCreatedPermissiondialogVisible"
      width="50%"
      height="100%"
    >
      <div>
        <el-form
          :model="packageModel"
          label-position="left"
          label-width="80px"
          ref="packageForm"
        >
          <!-- <el-form-item>
            <el-input
              style="display: none"
              v-model="packageModel.id"
            ></el-input>
          </el-form-item> -->

          <el-form-item
            label="名称"
            required
            prop="product_other_name"
            :rules="[
              { required: true, message: '请输入名称', trigger: 'blur' },
            ]"
          >
            <el-input
              style="width: 100%"
              v-model="packageModel.product_other_name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>

          
          <el-form-item
            label="类型"
            required
            prop="product_type"
            :rules="[
              { required: true, message: '请选择附件类型', trigger: 'change' },
            ]"
          >
            <el-select
              v-model="packageModel.product_type"
              placeholder="请选择附件类型"
              style="width: 100%"
              clearable
              allow-create
              filterable
            >
              <el-option
                v-for="item in productTypeList"
                :label="item.productType"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

         
          <el-form-item label="附件上传">
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

        <div style="text-align: center; margin-top: 10px">
          <el-button type="primary" @click="Submit">提 交</el-button>
          <el-button
            type="info"
            @click="AppCreatedPermissiondialogVisible = false"
            >取 消</el-button
          >
        </div>
      </div>
    </el-dialog>

            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>
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
      productId: "",
      productData: {},
      product_url: this.GLOBAL.baseUrl + "/products/list/condition",
      product_detail_url: this.GLOBAL.baseUrl + "/product/other/list/condition",
      product_type_url: this.GLOBAL.baseUrl + "/product/other/product/types",
      productNameSearch: "",
      tableData: [],
      activeName: 'first',
      AppCreatedPermissiondialogVisible: false,
      productTypeList: [],
      packageModel: {
        id: 0,
        product_other_name: "",
        app_id: "",
        productDesc: "",
        product_type: "",
      },
      product_file_url: "",
      product_upload_url:
        this.GLOBAL.baseUrl +
        "/products/uploads/file/" +
        localStorage.getItem("originTenantId"),
    };
    
  },

  methods: {
    // 返回上一页
    goBack: function () {
      this.$router.push("/cicd/package");
    },

    // 通过productId获取制品基础信息
    GetProductData: function (url) {
      let parms = {
        id: this.productId,
      };
      // console.log("param:" + parms);
      this.axios({
        method: "POST",
        url: url,
        data: parms,
      })
        .then((response) => {
          // console.log("GetProductData:", response.data);
          if (response.data.code == 200) {
            this.productData = response.data.data.list[0];
            // console.log("this.productData:", this.productData);
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },
    GetTableList: function () {
      this.InitGetTableData(this.product_detail_url);
    },

    // 获取表格数据；
    InitGetTableData: function (url) {
      const parms = {
        productsId: this.productId,
        productOtherName: this.productNameSearch,
      };
      this.loading = true;
      this.axios({
        method: "POST",
        url: url,
        data: parms,
      })
        .then((response) => {
          if (response.data.code == 200) {
            this.tableData = response.data.data.list;
          } else {
            this.$notify.error(response.data.error);
          }
          this.loading = false;
        })
        .catch((response) => {
          this.tableData = [];
          this.loading = false;
          // this.$notify.error("GetTableData Error: " + String(response));
        });
    },
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
              "/product/other/delete?productOtherName=" +
              row.productOtherName,
            method: "get",
          })
            .then((result) => {
              if (result.data.code == 200) {
                this.InitGetTableData(this.product_detail_url);
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
    downloadProduct: function (row) {
      // console.log("正在下载的文件路径:" + row.productUrl);
      window.location.href = row.productUrl;
    },
    downloadProductByUrl: function(url){
      window.location.href = url;
    },
     //跳转新增页面
    appAddClick: function () {
      this.title = "新增附件";
      this.appDisabled = false;
      this.nameDisabled = false;
      this.packageModel.product_name = "";
      this.packageModel.app_id = "";
      this.packageModel.productDesc = "";
      this.packageModel.product_type = "";
      this.product_file_url = "";
      this.AppCreatedPermissiondialogVisible = true;
      
      // this.GetAllProductOtherType();
    },
    productUploadUrl: function () {
      return this.product_upload_url;
    },
    GetAllProductOtherType: function () {
      this.axios({
        url: this.product_type_url,
        method: "GET",
     })
        .then((result) => {
          if (result.status == 200) {
            if (result.data.code == 200) {
              this.productTypeList = result.data.data;
              // console.log("this.productTypeList:"+this.productTypeList);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
     uploadFileSuccess(response, file, fileList) {
      console.log("上传附件成功:" + response);
      this.product_file_url = response;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    removeUpload(file, fileList){
      // console.log("删除附件成功");
       this.product_file_url = "";
    },
    Submit: function () {
      this.$refs.packageForm.validate(async (valid) => {
        if (valid) {
          var url = "";
          var postData = {};
          if (this.title == "新增附件") {
            url = this.GLOBAL.baseUrl + "/product/other/add";
            postData = {
              productOtherName: this.packageModel.product_other_name,
              productDesc: this.packageModel.productDesc,
              productType: this.packageModel.product_type,
              tenantId: localStorage.getItem("originTenantId"),
              productUrl: this.product_file_url,
              productsId: Number(this.productId),
            };
            if (this.packageModel.product_other_name == "") {
              this.$message.error("名称不能是空");
              return;
            }
            if (this.product_file_url == "") {
              this.$message.error("未上传制品或制品未上传完成（等待上传完成提示后在提交）");
              return;
            }
          } else {
            url = this.GLOBAL.baseUrl + "/products/update";
            postData = {
              id: this.packageModel.id,
              productName: this.packageModel.product_name,
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
                this.InitGetTableData(this.product_detail_url);
                this.$message({
                  type: "success",
                  message: "操作成功",
                });
                this.removeUpload();
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
          this.InitGetTableData(this.product_detail_url);
        }
      });
    },
  },

  computed: {},
  mounted() {
    this.productId = this.common.getUrlKey("productId");
    this.owner = this.common.getUrlKey("owner");
    console.log("this.productId:" + this.productId);
    this.GetProductData(this.product_url);
    this.InitGetTableData(this.product_detail_url);
    this.GetAllProductOtherType();
  },

  components: {
    pagination: pagination,
  },
};
</script>

<style scoped>
</style>
