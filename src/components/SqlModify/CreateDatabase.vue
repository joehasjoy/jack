<template>
  <div class="main flex-column">
    <div class="flex flex-align-items-center">
      <el-form :model="formH" :inline="true">
        <el-form-item label="环境:">
          <el-select
              v-model="envId"
              placeholder="请选择环境"
              @change="axiosGetinstanceList"
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
	      
	      <el-form-item label="范围:">
          <el-select
              v-model="level"
              placeholder="请选择范围"
              @change="scopeLevelChange"
              clearable
              style="width:150px"
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
	      
	      <el-form-item :label="label" v-if="this.level !== ''">
          <el-select
              v-model="code"
              :placeholder="'请选择'+label"
              @change="axiosGetinstanceList"
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
        </el-form-item>
	      
        <el-form-item label="实例:">
          <el-select
            style="width: 367px"
            v-model="formH.dbinstance"
            @change="axiosGetdatabaseList"
            value-key="selectValue"
            size="small"
            filterable
            placeholder="选择实例"
          >
            <el-option
              v-for="item in instancelist"
              :key="item.selectValue"
              :label="item.selectValue"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item style="text-align: left; width: 10%"> </el-form-item> -->
        <!--         <el-form-item style="text-align: left;width:40%;">-->
        <!--           <el-link type="primary" href="https://fanneng.yuque.com/fnw-ware/qs8ixn/rssr5b" target="_blank">找不到数据库实例,请点击这里</el-link>-->
        <!--         </el-form-item>-->
        <!-- <el-form-item style="text-align: right; width: 60%"> -->
        <!--            <el-input v-model="formH.search" size="small" style="width:200px;" placeholder="请输入搜索内容"></el-input>-->
        <!--<el-button  size="small" type="primary"  icon="el-icon-search" @click="axiosGetinstanceList" style="width:30%;" >搜索</el-button>-->
        <!-- </el-form-item> -->
      </el-form>
      <el-button
        style="margin-bottom: 20px"
        size="small"
        icon="el-icon-plus"
        type="primary"
        :disabled="openCreate"
        @click="handleCreate"
        >创建数据库</el-button
      >
    </div>

    <el-table
      :data="filterData(tableData, formH.search)"
      id="listTable"
      size="small"
      stripe
      style="width: 100%"
      class="table-box"
    >
      <el-table-column prop="dbname" label="数据库名称"></el-table-column>
      <el-table-column prop="character" label="字符集"></el-table-column>
      <el-table-column prop="domain_name" label="所属业务"></el-table-column>
      <el-table-column prop="owner_name" label="业务负责人"></el-table-column>
      <el-table-column prop="db_owner" label="创建人"></el-table-column>
      <el-table-column prop="marks" label="备注"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row.dbname)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogFormVisibleC"
      width="590px"
      :title="'集群:' + formH.dbinstance.selectValue"
    >
      <div class="flex-start-center">
        <el-form
          :model="formC"
          label-position="left"
          :rules="rulesC"
          ref="formC"
          label-width="110px"
        >
          <el-form-item label="数据库名称：" prop="dbname">
            <el-col
              ><el-input
                v-model="formC.dbname"
                size="medium"
                style="width: 286px"
              ></el-input
            ></el-col>
          </el-form-item>
          <el-form-item label="所属业务:" prop="domain">
            <el-select
              v-model="formC.domain"
              value-key="teamId"
              placeholder="业务方向"
              clearable
              size="medium"
              filterable
              style="width: 286px"
            >
              <el-option
                v-for="item in domainlist"
                :key="item.teamId"
                :label="item.name + '(' + item.respPersonName + ')'"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="marks">
            <el-input
              v-model="formC.marks"
              size="medium"
              type="textarea"
              style="width: 286px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleC = false">取 消</el-button>
        <el-button
          type="primary"
          v-bind:loading="submitC"
          @click="submitFormC('formC')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogFormVisibleE"
      width="590px"
      :title="
        '集群：' + formH.dbinstance.selectValue + '数据库：' + formE.dbname
      "
    >
      <!-- <h5 >
        集群:<span >{{ formH.dbinstance.name }}</span>
        数据库:<span >{{ formE.dbname }}</span>
      </h5> -->
      <div class="flex-start-center">
        <el-form
          :model="formE"
          label-position="left"
          :rules="rulesE"
          ref="formE"
          label-width="110px"
        >
          <el-form-item label="所属业务:" prop="domain">
            <el-select
              v-model="formE.domain"
              value-key="teamId"
              placeholder="业务方向"
              clearable
              size="medium"
              filterable
              style="width: 286px"
            >
              <el-option
                v-for="item in domainlist"
                :key="item.teamId"
                :label="item.name + '(' + item.respPersonName + ')'"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="marks">
            <el-input
              v-model="formE.marks"
              size="medium"
              type="textarea"
              style="width: 286px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleE = false">取 消</el-button>
        <el-button
          type="primary"
          v-bind:loading="submitE"
          @click="submitFormE('formE')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
const GLOBAL = window._env_;

export default {
  data() {
    var validatedbname = (rule, value, callback) => {
      const reg = /^[_a-zA-Z][_a-zA-Z0-9]+$/;
      if (!reg.test(value)) {
        callback(
          new Error(
            "数据库名称仅支持以字母、下划线和数字组成，且以字母及下划线开头"
          )
        );
      } else {
        callback();
      }
    };
    return {
      envOptions: [],
	    level:'',
	    label:'',
	    code:'',
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
	    
      envId: "",
      userName: "",
      instancelist: [],
      tableData: [],
      domainlist: [],
      openCreate: true,
      checkcount: 0,
      dialogFormVisibleE: false,
      dialogFormVisibleC: false,
      submitC: false,
      submitE: false,
      formH: {
        dbinstance: "",
        search: "",
      },
      formC: {
        dbname: "",
        domain: "",
        marks: "",
      },
      formE: {
        dbname: "",
        domain: "",
        marks: "",
      },

      rulesC: {
        domain: [
          { required: true, message: "请选择所属业务", trigger: "blur" },
        ],
        dbname: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
          { validator: validatedbname, trigger: "blur" },
        ],
        marks: [{ required: true, message: "请选择所属业务", trigger: "blur" }],
      },
      rulesE: {
        domain: [
          { required: true, message: "请选择所属业务", trigger: "blur" },
        ],
        marks: [{ required: true, message: "请选择所属业务", trigger: "blur" }],
      },
    };
  },

  methods: {
    handleEdit(dbname) {
      this.dialogFormVisibleE = true;
      this.formE.dbname = dbname;
      // this.axiosGetdomainList()
    },
    handleCreate() {
      this.dialogFormVisibleC = true;
      // this.axiosGetdomainList()
    },
    filterData(data, searchContent) {
      var input = searchContent.toLowerCase();
      var items = data;
      var items1;
      if (input) {
        items1 = items.filter(function (item) {
          return Object.keys(item).some(function (key1) {
            return String(item[key1]).toLowerCase().match(input);
          });
        });
      } else {
        items1 = items;
      }
      return items1;
    },
    //获取数据库实例下拉框数据
    axiosGetinstanceList() {
      axios
        // .get(this.GLOBAL.baseUrl + "/middleware/option/middlewares/spec/mysql/"+this.envId)
        .get(`${this.GLOBAL.baseUrl}/middleware/option/middlewares/spec/list?type=MySql&envId=${this.envId}&level=${this.level}&code=${this.code}`)
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              console.log("----" + response.data.data);
              this.instancelist = response.data.data;
            }
          } else {
            this.$message({
              type: "error",
              message: "获取数据失败",
            });
          }
        });
    },
    //业务域接口覆盖即可
    axiosGetdomainList() {
      axios
        .get(this.GLOBAL.baseUrl + "/team/list-simple/condition?pageSize=100000")
        .then((response) => {
          this.domainlist = response.data.data.list;
        })
        .catch((error) => {
          console.log("axiosGetdomainList:", error);
        });
    },
    //获取数据库数据信息
    axiosGetdatabaseList() {
      this.openCreate = false;
      axios
        .get(
          this.GLOBAL.baseUrl +
            "/middleware/middlewares/dms/" +
            this.formH.dbinstance.selectKey
        )
        .then((response) => {
          this.tableData = response.data.data;
          if (response.data.code == "200") {
            this.tableData = response.data.data;
          } else {
            this.errorMsg();
          }
        })
        .catch((error) => {
          console.log("axiosGetdatabaseList:", response.data.data);
        });
    },
    errorMsg() {
      this.$message({
        duration: 1800,
        showClose: true,
        message: "获取数据库失败，请联系DBA",
        type: "error",
      });
    },
    submitFormE(formName) {
      var that=this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitE = true;
          let body = {
            cluster_ip: this.formH.dbinstance.selectKey,
            marks: this.formE.marks,
            dbname: this.formE.dbname,
            domain_id: this.formE.domain.teamId,
            domain_name: this.formE.domain.name,
            domain_owner: this.formE.domain.respPersonName,
            db_owner: this.userName,
            operateMode: 1,
            type: "edit",
          };
          axios
            .post(
              this.GLOBAL.baseUrl + "/dms/db/modify-instance",
              body
            )
            .then((response) => {
              if (response.data.code == "200") {
                this.dialogFormVisibleE = false;
                this.axiosGetdatabaseList();
                this.submitE = false;
                 this.axiosGetdatabaseList();
                this.$confirm("数据提交成功,请留意后续审批信息", "提示", {
                  distinguishCancelAndClose: true,
                  cancelButtonText: "关闭",
                  confirmButtonText: "查看审批",
                })
                  .then(() => {
                    that.$router.push("/taskCenter");
                  })
                  .catch((action) => {});
              } else {
                alert(response.data.message + ";保存失败，如需要请联系DBA！");
                this.dialogFormVisibleE = false;
                this.submitE = false;
              }
            })
            .catch((error) => {
              console.log("submit formE fail:", error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitFormC(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitC = true;
          let body = {
            cluster_ip: this.formH.dbinstance.selectKey,
            marks: this.formC.marks,
            dbname: this.formC.dbname,
            domain_id: this.formC.domain.teamId,
            domain_name: this.formC.domain.name,
            domain_owner: this.formC.domain.respPersonName,
            db_owner: this.userName,
            operateMode: 0,
          };
          axios
            .post(this.GLOBAL.baseUrl + "/dms/db/modify-instance", body)
            .then((response) => {
              if (response.data.code == "200") {
                this.dialogFormVisibleC = false;
                this.submitC = false;
                this.axiosGetdatabaseList();
                this.$confirm("数据提交成功,请留意后续审批信息", "提示", {
                  distinguishCancelAndClose: true,
                  cancelButtonText: "关闭",
                  confirmButtonText: "查看审批",
                })
                  .then(() => {
                    that.$router.push("/taskCenter");
                  })
                  .catch((action) => {});
              } else {
                alert(
                  response.data.message + ";数据库创建失败，如需要请联系DBA！"
                );
                this.dialogFormVisibleC = false;
              }
            })
            .catch((error) => {
              console.log("submit formC fail:", error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    axiosGetUserInfo() {
      axios
        .get(this.GLOBAL.baseUrl + "/user/info")
        .then((response) => {
          //nikeName: "测试-张东" userName: "t-ZHANGDONGN"
          this.userName = response.data.data.nikeName;
          console.log("user:" + this.userName);
        })
        .catch((error) => {
          console.log("axiosGetUserInfo:", error);
        });
    },
    //获取环境下拉框
    getSelectData() {
      let url = this.GLOBAL.baseUrl + "/middleware/init/condition";
      this.axios({
        method: "get",
        url: url,
      })
          .then((res) => {
            if (res.status === 200) {
              //环境下拉列表
              res.data.data.envList.forEach((element) => {
                this.envOptions.push({
                  envId: element.selectKey,
                  label: element.selectValue,
                });
              });
            }
          })
          .catch((err) => {});
    },
	
	  envChange(){
			console.log(this.level)
			console.log(this.code)
			if (!this.level || !this.code){
				this.$message({
					type: 'warning',
					message: '查询条件不能为空'
				})
			}else{
				this.axiosGetinstanceList()
			}
	  },
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
			
			this.formH.dbinstance = ''
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
	  
  },
  mounted() {
    this.$emit("loading", "11-2-2");
    this.initOptionsInfos();
    this.getTeamsData();
    this.getAppData();
    this.axiosGetdomainList();
    this.axiosGetUserInfo();
    this.getSelectData();
    // this.$nextTick(function () {
    //   this.tableHeight =
    //     window.innerHeight - this.$refs.table.$el.offsetTop - 50;

    //   // 监听窗口大小变化
    //   let self = this;
    //   window.onresize = function () {
    //     self.tableHeight =
    //       window.innerHeight - self.$refs.table.$el.offsetTop - 50;
    //   };
    // });
  },
};
</script>
<style lang="scss" scoped>
.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.table-box {
  flex: 1;
  overflow-y: auto;
}
.dialog-footer {
  text-align: center;
}
</style>