<template>
  <div v-show="visible">
    <el-dialog
      title="主从节点设置"
      :visible.sync="visible"
      width="590px"
      :before-close="handleClose"
    >
      <div class="flex flex-justify-content-center flex-column">
        <el-button
          type="primary"
          size="small"
          style="width: 80px; margin-bottom: 20px"
          @click="addNode"
          >新增节点</el-button
        >
        <enn-table
          :tableColumn="tableColumn"
          :tableData="tableData"
          @handleOperationClick="deletHandle"
        ></enn-table>
      </div>
    </el-dialog>

    <el-dialog
      title="主从节点设置"
      :visible.sync="nodeVisble"
      width="590px"
      :before-close="handleNodeClose"
    >
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="节点IP" prop="nodeIp">
              <el-input
                v-model="ruleForm.nodeIp"
                placeholder="请输入IP"
                style="width: 300px"
              ></el-input>
            </el-form-item>

            <el-form-item prop="nodeIpPort">
              <el-input
                v-model.number="ruleForm.nodeIpPort"
                placeholder="端口"
                style="width: 80px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="   ">
              <el-radio-group v-model="ruleForm.nodeType">
                <el-radio label="master"></el-radio>
                <el-radio label="slave"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!--  <el-form-item label="角色" prop="nodeType">
          <el-select
            v-model="ruleForm.nodeType"
            placeholder="请选择角色"
            style="width: 300px"
          >
            <el-option
              v-for="item in ['master', 'slave']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="handleNodeClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EnnTable from "../../../components/EnnTable/index.vue";
import { getNodeListApi, addNodeApi, deleteNodeApi } from "../../../api/api";
export default {
  name: "NodeDialog",
  components: {
    EnnTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    middleId: {
      type: Number,
      default: -1,
    },
  },
  watch: {
    middleId(val) {
      if (val !== -1) {
        this.getTableData();
      }
    },
  },
  data() {
    let validatorIP = (rule, value, callback) => {
      let reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        callback(); // 添加成功回调
      }
    };

    let checkAge = (rule, value, callback) => {
      if (value!=="" && value !==undefined && !Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      tableColumn: [
        { label: "服务器IP", prop: "nodeIp" },
        { label: "服务器端口", prop: "nodeIpPort" },
        { label: "角色", prop: "nodeType" },
        {
          label: "操作",
          prop: "operationList",
          width: "80",
          btnType: "danger",
        },
      ],
      tableData: [],
      nodeVisble: false,
      ruleForm: {
        nodeType: "",
        nodeIp: "",
        nodeIpPort: "",
      },
      rules: {
        nodeIp: [
          { validator: validatorIP, trigger: "blur" },
          { required: true, message: "请输入IP", trigger: "blur" },
        ],
        nodeIpPort: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },

  methods: {
    async getTableData() {
      let res = await getNodeListApi(this.middleId);
      let { code, data } = res;
      if (code === 200) {
        if (data.length) {
          data.map((item) => {
            item.operationList = [{ name: "删除", value: "delete" }];
          });
        }
        this.tableData = data || [];
      }
    },
    handleClose() {
      this.$emit("closeHandle");
    },
    addNode() {
      this.nodeVisble = true;
    },
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let params = {
            middlewareId: this.middleId,
            ...this.ruleForm,
          };
          let res = await addNodeApi(params);
          let { code } = res;
          if (code === 200) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.getTableData();
            this.handleNodeClose();
          }
        }
      });
    },
    deletHandle(e) {
      let { row } = e;
      this.$confirm("是否确认删除此节点", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteNode(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除节点
    async deleteNode(id) {
      let res = await deleteNodeApi(id);
      let { code } = res;
      if (code === 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getTableData();
      }
    },
    handleNodeClose() {
      this.nodeVisble = false;
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        nodeType: "",
        nodeIp: "",
        nodeIpPort: "",
      }
    },
  },
};
</script>
<style scoped>
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>