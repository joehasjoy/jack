<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="590px"
    :before-close="handleClose"
  >
    <el-form
      :model="hpaFormData"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
      class="form"
    >
      <el-form-item label="环境" prop="envId">
        <el-select
          v-model="hpaFormData.envId"
          placeholder="请选择环境"
          style="width: 285px"
        >
          <el-option
            v-for="(item, index) in envOptions"
            :key="index"
            :label="item.selectValue"
            :value="item.selectKey"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源" prop="resourceName">
        <el-select
          v-model="hpaFormData.resourceName"
          placeholder="请选择资源"
          style="width: 285px"
        >
          <el-option
            v-for="(item, index) in ['cpu', 'memory']"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阈值" prop="targetAverageUtilization">
        <el-select
          v-model="hpaFormData.targetAverageUtilization"
          placeholder="请选择资源"
          style="width: 285px"
        >
          <el-option
            v-for="(item, index) in [50, 60, 70, 80, 90]"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="命名空间" prop="namespace">
        <el-select
          v-model="hpaFormData.namespace"
          placeholder="请选择资源"
          style="width: 285px"
        >
          <el-option
            v-for="(item, index) in namespaceOptions"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最小节点数" prop="minReplicas">
        <el-input-number
          v-model="hpaFormData.minReplicas"
          :controls="false"
          :min="1"
          :max="10"
          :step-strictly="true"
          style="width: 285px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="最大节点数" prop="maxReplicas">
        <el-input-number
          v-model="hpaFormData.maxReplicas"
          :controls="false"
          :min="1"
          :max="10"
          :step-strictly="true"
          style="width: 285px"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer flex flex-justify-content-center">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSure">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  envListAPi,
  namespaceListAPi,
  addNewHpaAPi,
  modifyHpaAPi,
} from "./../../../api/api";
export default {
  name: "HpaDialog",
  data() {
    return {
      rules: {
        envId: [{ required: true, message: "请选择环境", trigger: "change" }],
        namespace: [
          { required: true, message: "请选择命名空间", trigger: "change" },
        ],
        minReplicas: [
          { required: true, message: "请输入最小节点数", trigger: "blur" },
        ],
        maxReplicas: [
          { required: true, message: "请输入最大节点数", trigger: "blur" },
        ],
        resourceName: [
          { required: true, message: "请选择资源", trigger: "change" },
        ],
        targetAverageUtilization: [
          { required: true, message: "请选择阈值", trigger: "change" },
        ],
      },
      envOptions: [],
      namespaceOptions: [],
    };
  },
  props: {
    hpaFormData: {
      type: Object,
      default: () => {
        return {
          appId: "",
          envId: "",
          namespace: "",
          minReplicas: null,
          maxReplicas: "",
          resourceName: "",
          targetAverageUtilization: null,
        };
      },
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    appId: {
      type: String,
      default: "",
    },
    appCode: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  watch: {
    appId(newVal) {
      if (newVal) {
        this.getNameSpaceList();
      }
    },
    type(newVal) {
      if (newVal === "新增") {
        this.$nextTick(() => {
          this.$refs["ruleForm"].clearValidate();
        });
      }
    },
  },
  created() {
    this.getEnvList();
  },
  methods: {
    // 关闭
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("handleClose");
    },

    // 确定操作
    handleSure() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let params = {
            ...this.hpaFormData,
            appId: this.appCode,
          };
          if (params.minReplicas > params.maxReplicas) {
            this.$message({
              type: "error",
              message: "最小节点数不能大于最大节点数",
            });
            return;
          }
          if (this.type === "新增") {
            this.addSubmit(params);
          } else {
            this.modifySubmit(params);
          }
        } else {
          return false;
        }
      });
    },

    // 新增
    async addSubmit(params) {
      let res = await addNewHpaAPi(params);
      let { code, message } = res;
      if (code === 200) {
        this.$message({
          message,
          type: "success",
        });
        this.$refs["ruleForm"].resetFields();
        this.$emit("handleSure");
      }
    },

    // 修改
    async modifySubmit(params) {
      let res = await modifyHpaAPi(params);
      let { code, message } = res;
      if (code === 200) {
        this.$message({
          message,
          type: "success",
        });
        this.$refs["ruleForm"].resetFields();
        this.$emit("handleSure");
      }
    },

    // 获取环境变量
    async getEnvList() {
      let res = await envListAPi();
      let { code, data } = res;
      if (code === 200) {
        this.envOptions = data || [];
      }
    },

    // 获取命名空间
    async getNameSpaceList() {
      let res = await namespaceListAPi(this.appId);
      let { code, data } = res;
      if (code === 200) {
        let list = [];
        if (data && data.length) {
          data.forEach((item) => {
            list.push(item.appDeployK8s.namespace);
          });
        }
        this.namespaceOptions = list;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 0 auto;
}
</style>
