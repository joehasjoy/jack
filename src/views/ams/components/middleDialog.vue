<template>
  <el-dialog
    :title="type + '中间件'"
    :visible.sync="visible"
    width="590px"
    :before-close="handleClose"
  >
    <div class="flex flex-justify-content-center">
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="addMiddlewareForm"
        label-position="left"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="集群类型:" prop="clusterType">
              <el-select
                v-model="form.clusterType"
                placeholder="请选择集群类型"
                style="width: 285px"
              >
                <el-option
                  v-for="item in clusterTypeOptions"
                  :key="item.clusterTypeName"
                  :label="item.label"
                  :value="item.clusterTypeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <el-form-item label="集群名称:" prop="clusterName">
              <el-input
                v-model="form.clusterName"
                placeholder="请输入集群名称"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.clusterType!=='Redis'">
          <el-col :span="24">
            <el-form-item label="集群IP:" prop="clusterIp">
              <el-input
                v-model="form.clusterIp"
                placeholder="请输入集群IP"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <el-form-item label="负责人:" prop="ownerName">
              <el-select
                style="width: 285px"
                v-model="form.ownerName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getTenantMembersByKeyword"
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in domainMemberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="环境:" prop="environment">
              <el-select
                v-model="form.environment"
                placeholder="请选择环境"
                style="width: 285px"
              >
                <el-option
                  v-for="item in envOptions"
                  :key="item.selectKey"
                  :label="item.selectValue"
                  :value="item.selectKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本:" prop="clusterVersion">
              <el-input
                v-model="form.clusterVersion"
                placeholder="请输入版本"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用途:" prop="clusterUsages">
              <el-input
                v-model="form.clusterUsages"
                placeholder="请输入用途"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="标记:" prop="marks">
              <el-input
                v-model="form.marks"
                placeholder="请输入标记"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="网络类型:" prop="networkType">
              <el-input
                v-model="form.networkType"
                placeholder="请输入网络类型"
                style="width: 285px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="sure">确 定</el-button>
      <el-button size="small" @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addMiddleApi, modifyMiddleApi } from "./../../../api/api";
export default {
  name: "MiddleDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => {
        return {
          clusterName: "",
          clusterIp: "",
          clusterType: "",
          clusterVersion: "",
          environment: "",
          networkType: "",
          clusterUsages: "",
          marks: "",
          ownerId: "",
        };
      },
    },
    clusterTypeOptions:{
      type: Array,
      default: [],
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.type === '添加') {
        this.$nextTick(() => {
          this.$refs["addMiddlewareForm"].clearValidate();
        })
      }
    }
  },
  data() {
    let validatorIP = (rule, value, callback) => {
      let reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        callback() // 添加成功回调
      }
    };
    return {
      rules: {
        clusterName: [
          { required: true, message: "请输入集群名称", trigger: "blur" },
        ],
        clusterIp: [
          { required: true, validator: validatorIP, trigger: 'blur' }
        ],
        clusterType: [
          { required: true, message: "请选择集群类型", trigger: "blur" },
        ],
        clusterVersion: [
          { required: true, message: "请输入版本", trigger: "blur" },
        ],
        environment: [
          { required: true, message: "请选择环境", trigger: "change" },
        ],
        clusterUsages: [
          { required: true, message: "请输入用途", trigger: "blur" },
        ],
        ownerName: [{ required: true, message: "请选择负责人", trigger: "blur" }],
      },
      insertClusterTypeOptions: [{ label: "MySql", value: "MySql" },{ label: "Redis", value: "Redis" },{ label: "MongoDB", value: "MongoDB" }], // 集群
      domainMemberOptions: [],
      envOptions: JSON.parse(localStorage.getItem("envs")) || [],
    };
  },
  methods: {
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
    // 选择负责人
    selectChange(e) {
      this.form.ownerId = e.value
      this.form.ownerName = e.label
    }, 
    cancel() {
      this.handleClose();
    },
    sure() {
      if(this.form.clusterType === "Redis"){
        this.form.clusterIp = ""
      }
      if(this.type === '添加') {
        this.submitAddMiddleware();
      } else {
        this.submitModifyMiddleware()
      }
    },
    //添加中间件提交
    submitAddMiddleware() {
      this.$refs.addMiddlewareForm.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.form,
            clusterIpPort:''
          };
          let res = await addMiddleApi(params);
          let { code } = res;
          if (code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handleClose();
            this.$emit("sureHandle");
          }
        }
      });
    },
    // 修改中间件提交
    submitModifyMiddleware() {
      this.$refs.addMiddlewareForm.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.form,
          };
          let res = await modifyMiddleApi(params);
          let { code } = res;
          if (code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handleClose();
            this.$emit("sureHandle");
          }
        }
      });
    },
    handleClose() {
      this.$refs["addMiddlewareForm"].resetFields();
      this.$emit("closeHandle");
    },
  },
};
</script>