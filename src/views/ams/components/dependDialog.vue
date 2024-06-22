<template>
  <el-dialog
    title="新增依赖"
    :visible.sync="dialogVisible"
    width="590px"
    :before-close="handleClose"
  >
    <el-form
      :model="dependFormData"
      :rules="rules"
      ref="ruleForm"
      label-width="108px"
      label-position="left"
      class="form"
    >
      <el-form-item label="环境" prop="env_code">
        <el-select
          v-model="dependFormData.env_code"
          placeholder="请选择环境"
          style="width: 285px"
          @change="changeEnv"
        >
          <el-option
            v-for="(item, index) in envOptions"
            :key="index"
            :label="item.selectValue"
            :value="item.selectValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
<!--
	    <el-form-item label="范围:">
		    <el-select
			    v-model="dependFormData.level"
			    placeholder="请选择范围"
			    @change="scopeLevelChange"
			    clearable
		    >
			    <el-option
				    v-for="item in scopeLevelOptions"
				    :disabled="item.disabled"
				    :key="item.value"
				    :label="item.label"
				    :value="item.value"
			    >
			    </el-option>
		    </el-select>
	    </el-form-item>
	
	    <el-form-item :label="label" v-if="dependFormData.level !== ''">
		    <el-select
			    v-model="dependFormData.code"
			    :placeholder="'请选择'+label"
			    @change="getMysql(dependFormData.env_code)"
			    clearable
		    >
			    <el-option
				    v-for="item in options"
				    :key="item.value"
				    :label="item.label"
				    :value="item.value"
			    >
			    </el-option>
		    </el-select>
	    </el-form-item>-->
	    
      <el-form-item label="数据库集群" prop="middleware_cluster_ip" >
        <el-select
          filterable
          v-model="dependFormData.middleware_cluster_ip"
          placeholder="请选择数据库集群"
          style="width: 285px"
          @change="changeMysql"
        >
	        <el-option
		        v-for="(item, index) in mySqlOptions"
		        :key="index"
		        :disabled="item.isCore==1&&item.isAvl==2"
		        :value="item.selectKey"
	        >
	          <span v-if="item.isCore==2">
		          {{ item.label }} <i style="color:#5CBB7A;font-style: normal;">非核心资源</i>
	          </span>
		        <span v-else-if="item.isCore==1&&item.isAvl==2">
		          {{ item.label }} <i style="font-style: normal;">核心资源</i> <!-- 不可用 -->
	          </span>
		        <span v-else-if="item.isCore==1&&item.isAvl==1">
		           {{ item.label }} <i style="color:#F56C6C;font-style: normal;">核心资源</i>
	          </span>
		        <span v-else>
                {{ item.label }}
             </span>
	        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库名称" prop="db_name">
        <el-select
          filterable
          v-model="dependFormData.db_name"
          placeholder="请选择数据库"
          style="width: 285px"
        >
          <el-option
            v-for="(item, index) in dataBaseOptions"
            :key="index"
            :label="item.dbname"
            :value="item.dbname"
          >
          </el-option>
        </el-select>
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
  addDependAPi,
  getMysqlApi,
  getDmsApi,
  getDependAPi,
} from "./../../../api/api";
import axios from "axios";
export default {
  name: "DependDialog",
  data() {
    return {
	    label:'',
	    scopeLevelOptions: [
		    {
			    label:'产品',
			    value:'1',
			    disabled: true
		    },{
			    label:'业务域',
			    value:'2',
		    },{
			    label:'应用',
			    value:'3',
		    }
	    ],
	    options: [],
	    optionsInfos: [],
	    teamOptions: [],
	    appOptions: [],
	    
      dependFormData: {
        env_code: "",
        db_name: "",
	      level: "",
	      code: "",
        middleware_cluster_ip: "",
      },
      rules: {
        env_code: [
          { required: true, message: "请选择环境", trigger: "change" },
        ],
        middleware_cluster_ip: [
          { required: true, message: "请选择数据库集群", trigger: "change" },
        ],
        db_name: [
          { required: true, message: "请选择数据库", trigger: "change" },
        ],
      },
      envOptions: [],
      mySqlOptions: [],
      dataBaseOptions: [],
    };
  },
  props: {
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
  },
  watch: {},
  created() {
    this.getEnvList();
	  this.initOptionsInfos();
	  this.getTeamsData();
	  this.getAppData();
  },
  methods: {
	  // 获取 产品列表
	  initOptionsInfos() {
		  let url = this.GLOBAL.baseUrl + "/product/infos";
		  this.axios({
			  method: "get",
			  url: url,
		  })
			  .then((res) => {
				  if (res.status === 200) {
					  res.data.data.forEach((element) => {
						  this.optionsInfos.push({
							  value: element.id,
							  label: element.name,
						  });
					  });
				  }
			  })
			  .catch((err) => {
				  console.log(err);
			  });
	  },
	  // 获取业务域
	  getTeamsData: async function () {
		  let url = this.GLOBAL.baseUrl + "/app/init/teams";
		  this.axios({
			  method: "get",
			  url: url,
		  })
			  .then((res) => {
				  if (res.status === 200) {
					  this.teamOptions = res.data.data.teamOptions.map(element =>{
						  return {
							  value: element.selectKey,
							  label: element.selectValue,
						  }
					  })
				  }
			  })
			  .catch((err) => {
				  console.log(err);
			  });
	  },
	  // 获取应用
	  getAppData: async function () {
		  let url = this.GLOBAL.baseUrl + "/app/list";
		  this.axios({
			  method: "get",
			  url: url,
		  })
			  .then((res) => {
				  if (res.status === 200) {
					  res.data.data.forEach((element) => {
						  this.appOptions.push({
							  value: element.id,
							  label: element.code,
						  });
					  });
				  }
			  })
			  .catch((err) => {
				  console.log(err);
			  });
	  },
	  scopeLevelChange(v){
		
		  this.code = ''
		  this.instancelist = []
		  this.tableData = []
		  switch (v) {
			  case '1':
				  this.label = '产品'
				  this.options = this.optionsInfos
				  break
			  case '2':
				  this.label = '业务域'
				  this.options = this.teamOptions
				  break
			  case '3':
				  this.label = '应用'
				  this.options = this.appOptions
				  break
		  }
	  },
	  
    // 关闭
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("handleClose");
    },

    // 确定操作
    handleSure() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let index = this.mySqlOptions.findIndex((item) => {
            return item.selectKey === this.dependFormData.middleware_cluster_ip;
          });
          let middleware_cluster_name = this.mySqlOptions[index].selectValue;
          let params = {
            app_id: this.appId,
            service_name: this.appCode,
            env_code: this.dependFormData.env_code,
            middleware_cluster_ip: this.dependFormData.middleware_cluster_ip,
            middleware_cluster_name,
            db_name: this.dependFormData.db_name,
            // middleware_type: this.dependFormData.middleware_type,
          };
          console.log(params, 111);
          this.addSubmit(params);
        } else {
          return false;
        }
      });
    },

    // 新增
    async addSubmit(params) {
      let res = await addDependAPi(params);
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
    changeEnv(e) {
      this.dependFormData.middleware_cluster_ip = "";
      this.getMysql(e);
    },
    // 获取集群
    async getMysql(env_code) {
	    this.axios
		    // &level=${this.level}&code=${this.code}
		    .get(`${this.GLOBAL.baseUrl}/middleware/MySql/${env_code}/${this.appId}`)
		    .then((response) => {
			    if ((response.code = 200)) {
				    if (response.data.data != null) {
					    this.mySqlOptions = response.data.data.map(item=>{
								return {
									...item,
									label: `${item.selectValue} (${item.selectKey})`
									// label:?item.selectValue+' ':? item.selectValue+' ': ? item.selectValue+' ':item.selectValue
								}
					    });
				    }
			    } else {
				    this.$message({
					    type: "error",
					    message: "获取数据失败",
				    });
			    }
		    });
			
     /* let res = await getMysqlApi("Mysql",env_code);
      let { code, data } = res;
      if (code === 200) {
        let list = data;
        if (list && list.length) {
          list.map((item) => {
            item.collect = `${item.selectValue}（${item.selectKey}）`;
          });
        }
        this.mySqlOptions = list || [];
      }*/
    },
    changeMysql(e) {
      this.dependFormData.db_name = "";
      this.dataBaseOptions = [];
      this.getDms(e);
    },

    // 获取数据库
    async getDms(ip) {

      let res = await getDmsApi(ip);
      let { code, data } = res;
      if (code === 200) {
        this.dataBaseOptions = data || [];
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
