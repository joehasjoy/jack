<template>
  <div class="main">
    <div
      slot="header"
      class="flex flex-align-items-center header"
      @click="goBack"
    >
      <i class="el-icon-arrow-left"></i>
      <span>返回</span>
    </div>
    <el-steps :active="showStep" align-center style="margin-top: 20px">
      <el-step title="基础信息" />
      <el-step title="人员" />
      <el-step title="仓库信息" />
      <el-step title="其他" />
      <el-step title="提交" />
    </el-steps>
    <el-form
      class="edit-form"
      ref="appBasicDetailForm"
      :model="form"
      label-position="left"
      label-width="120px"
      style="max-width: 700px; margin: 40px auto 0"
      :rules="rules"
    >
      <el-form-item v-show="showStepInfomation" label="AppId" prop="code">
        <el-input
          v-model="form.code"
            maxlength="30"
          show-word-limit
          style="width: 385px"
          placeholder="示例：xxx-xxx-xxx (仅支持小写)"
        ></el-input>
      </el-form-item>

      <el-form-item v-show="showStepInfomation" label="名称" prop="name">
        <el-input v-model="form.name" style="width: 385px"></el-input>
      </el-form-item>

      <el-form-item v-show="showStepInfomation" label="业务域" prop="groupId">
        <el-select
          filterable
          style="width: 385px"
          v-model="form.groupId"
          placeholder="请选择业务域"
        >
          <el-option
            v-for="item in teamOptions"
            :key="item.groupId"
            :label="item.groupIdStr"
            :value="item.groupId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="showStepInfomation" label="优先级:" prop="priority">
        <el-select
          style="width: 385px"
          v-model="form.priority"
          placeholder="请选择是否核心应用"
        >
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-show="showStepInfomation"
        label="是否核心应用:"
        prop="isCore"
      >
        <el-select
          style="width: 385px"
          v-model="form.isCore"
          placeholder="请选择是否核心应用"
        >
          <el-option
            v-for="item in isCoreOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
		
		    <el-form-item label="所属产品:"
		                  v-show="showStepInfomation">
				    <el-select v-model="form.prodId" filterable clearable placeholder="请选择所属产品（非必选）" style="width: 385px">
						    <el-option v-for="item in optionsInfos" :key="item.value" :label="item.label" :value="item.label" />
				    </el-select>
		    </el-form-item>
		    
		    
      <el-form-item
        v-show="showStepInfomation"
        label="所用语言:"
        prop="useLanguage"
      >
        <el-select
          v-model="form.useLanguage"
          style="width: 385px"
          placeholder="请选择所用语言"
        >
          <el-option
            v-for="item in useLanguageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="showStepInfomation" label="logo:">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-show="showStepStaff" label="产品负责人:" prop="prodMgrId">
        <el-select
          style="width: 385px"
          v-model="form.prodMgrId"
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

      <el-form-item v-show="showStepStaff" label="项目负责人:" prop="projMgrId">
        <el-select
          v-model="form.projMgrId"
          style="width: 385px"
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

      <el-form-item
        v-show="showStepStaff"
        label="质量负责人:"
        prop="qualityMgrId"
      >
        <el-select
          v-model="form.qualityMgrId"
          style="width: 385px"
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

      <el-form-item v-show="showStepStaff" label="开发负责人:" prop="devMgrId">
        <el-select
          v-model="form.devMgrId"
          filterable
          remote
          style="width: 385px"
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

      <el-form-item v-show="showStepStaff" label="开发人员:" prop="devlopers">
        <el-select
          v-model="form.devlopers"
          filterable
          remote
          reserve-keyword
          style="width: 385px"
          placeholder="请输入关键词"
          :remote-method="getTenantMembersByKeyword"
          :loading="loading"
          clearable
          @change="clearDomainMemberOptions"
          @focus="clearDomainMemberOptions"
          multiple
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

      <el-form-item v-show="showStepStaff" label="测试人员:" prop="testers">
        <el-select
          v-model="form.testers"
          filterable
          style="width: 385px"
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getTenantMembersByKeyword"
          :loading="loading"
          clearable
          @change="clearDomainMemberOptions"
          @focus="clearDomainMemberOptions"
          multiple
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

      <el-form-item v-show="showStepStaff" label="业务负责人:" prop="bizMgrIds">
        <el-select
          v-model="form.bizMgrIds"
          filterable
          style="width: 385px"
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getTenantMembersByKeyword"
          :loading="loading"
          clearable
          @change="clearDomainMemberOptions"
          @focus="clearDomainMemberOptions"
          multiple
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
      <el-form-item
        v-show="showStepRepository"
        label="代码仓库类型:"
        prop="repoType"
      >
        <el-select
          v-model="form.repoType"
          style="width: 385px"
          placeholder="请选择代码仓库类型"
        >
          <el-option
            v-for="item in repoTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="showStepRepository"
        label="仓库地址:"
        prop="gitRepoUrl"
      >
        <el-input style="width: 385px" v-model="form.gitRepoUrl"></el-input>
      </el-form-item>
      <el-form-item
        v-show="showStepDescription"
        label="功能说明:"
        prop="description"
      >
        <el-input
          style="width: 385px"
          :autosize="{ minRows: 4 }"
          type="textarea"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-show="showStepDescription"
        label="业务标签:"
        prop="labels"
      >
        <el-input
          style="width: 385px"
          :autosize="{ minRows: 4 }"
          type="textarea"
          v-model="form.labels"
        ></el-input>
      </el-form-item>
      <el-result
        v-if="showStepSubmitSuccess"
        icon="success"
        title="应用创建提交成功！请留意后续审批，只有审批通过后，应用信息才会出现在应用列表中"
      >
        <template slot="extra">
          <el-button type="primary" @click="goBack">返回</el-button>
          <el-button type="danger" @click="goTaskCenter" size="medium"
            >查看审批</el-button
          >
        </template>
      </el-result>
      <el-form-item style="margin-top: 30px">
        <el-button v-if="needPrev" @click="stepPrev()"> 上一步 </el-button>
        <el-button v-if="needNext" @click="stepNext()"> 下一步 </el-button>
        <el-button
          v-show="showStepDescription"
          type="danger"
          @click="submitApply()"
        >
          提交申请
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const StepInfomation = 0;
const StepStaff = 1;
const StepRepository = 2;
const StepDescription = 3;
const StepSubmit = 4;
const StepSubmitSuccess = 5;

const StepStart = StepInfomation;
const StepEnd = StepDescription;

const baseUrlThrower = function (response) {
  if (response.status != 200) {
    throw "网络错误";
  }
  if (response.data.code != 200) {
    throw response.data.message;
  }
  return response;
};

export default {
  data() {
    return {
      activeName: "first",
      loading: false,
      //所用语言下拉
      useLanguageOptions: [
        { label: "java", value: 1 },
        { label: "python", value: 2 },
        { label: "go", value: 3 },
        { label: "nodejs", value: 4 },
        { label: "Javascript", value: 5 },
      ],
      //代码仓库类型
      repoTypeOptions: [
        { label: "gitlab", value: 1 },
        { label: "github", value: 2 },
        { label: "gitee", value: 3 },
        { label: "gogs", value: 4 },
        { label: "svn", value: 5 },
        { label: "codeup", value: 6 },
      ],
      //是否核心应用
      isCoreOptions: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
		
		    //所属产品
		    optionsInfos: [],
		    
      //优先级
      priorityOptions: [
        { label: "极高", value: 1 },
        { label: "高", value: 2 },
        { label: "中", value: 3 },
        { label: "低", value: 4 },
      ],
      teamOptions: [],
      domainMemberOptions: [],
      form: {},
      enable_info: false,
      // 校验规则
      rules: {
        code: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入AppId"));
              }
              if (!/^[a-z]+[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
                callback(new Error("AppId格式不合法"));
              }
              callback();
            },
            trigger: "blur",

          },
        ],
        name: [
          {
            required: true,
            message: "请输入应用名称",
            trigger: "blur",
          },
        ],
        groupId: [
          {
            required: true,
            message: "请选择业务域",
            trigger: "blur",
          },
        ],
        prodMgrId: [
          {
            required: true,
            message: "请选择产品负责人",
            trigger: "blur",
          },
        ],
        projMgrId: [
          {
            required: true,
            message: "请选择项目负责人",
            trigger: "blur",
          },
        ],
        qualityMgrId: [
          {
            required: true,
            message: "请选择项质量负责人",
            trigger: "blur",
          },
        ],
        devMgrId: [
          {
            required: true,
            message: "请选择项开发负责人",
            trigger: "blur",
          },
        ],
        testers: [
          {
            required: true,
            message: "请选择测试人员",
            trigger: "blur",
          },
        ],
        bizMgrIds: [
          {
            required: true,
            message: "请选择业务负责人",
            trigger: "blur",
          },
        ],
        devlopers: [
          {
            required: true,
            message: "请选择开发人员",
            trigger: "blur",
          },
        ],
        gitRepoUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入代码仓库地址"));
              }
              if (!/^http[s]?:\/\//.test(value)) {
                callback(
                  new Error(
                    "代码仓库地址格式不合法，仅支持http/https协议的地址"
                  )
                );
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        isCore: [
          {
            required: true,
            message: "请选择是否核心应用",
            trigger: "blur",
          },
        ],
        priority: [
          {
            required: true,
            message: "请选择优先级",
            trigger: "blur",
          },
        ],
        useLanguage: [
          {
            required: true,
            message: "请选择开发语言",
            trigger: "blur",
          },
        ],
        repoType: [
          {
            required: true,
            message: "请选择代码仓库类型",
            trigger: "blur",
          },
        ],
      },
      stepIndex: StepStart,
      submitSuccess: false,
    };
  },
  watch: {},
  computed: {
    showStepInfomation() {
      return this.stepIndex == StepInfomation;
    },
    showStepStaff() {
      return this.stepIndex == StepStaff;
    },
    showStepDescription() {
      return this.stepIndex == StepDescription;
    },
    showStepRepository() {
      return this.stepIndex == StepRepository;
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
    needNext() {
      return this.stepIndex < StepEnd;
    },
    needPrev() {
      return this.stepIndex > StepStart && this.stepIndex <= StepEnd;
    },
  },
  methods: {
			// 获取 所属产品
		  initOptionsInfos(){
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
		  
    goTaskCenter() {
      this.$router.push("/taskCenter");
    },
    stepNext() {
      if (this.stepIndex == StepEnd) {
        return;
      }
      this.stepIndex = this.stepIndex + 1;
    },
    stepPrev() {
      if (this.stepIndex == StepStart) {
        return;
      }
      this.stepIndex = this.stepIndex - 1;
    },
    //关键字搜索租户成员
    getTenantMembersByKeyword: async function (keyword) {
      this.domainMemberOptions = [];
      let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
      let response = null;
      try {
        response = baseUrlThrower(
          await this.axios({
            method: "get",
            url: url,
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
      response.data.data.forEach((element) => {
        this.domainMemberOptions.push({
          value: element.selectKey,
          label: element.selectValue,
        });
      });
    },
    //清空关键字搜索租户成员结果
    clearDomainMemberOptions() {
      this.domainMemberOptions = [];
    },

    submitApply() {
      this.$refs.appBasicDetailForm.validate(async (valid) => {
        if (!valid) {
          this.$alert(
            "部分字段校验未通过！请点击上一步，检查、修改后重试。",
            "错误",
            {
              type: "error",
            }
          );
          return;
        }
        let postForm = {
          BIZ_testers: [],
          BIZ_devlopers: [],
          BIZ_bizMgrId: [],
          BIZ_repoType: this.form.repoType,
          BIZ_name: this.form.name,
          BIZ_logo: this.form.logo,
          BIZ_prodMgrId: this.form.prodMgrId,
          BIZ_code: this.form.code,
          BIZ_groupId: [],
          BIZ_gitRepoUrl: this.form.gitRepoUrl,
          BIZ_useLanguage: this.form.useLanguage,
          BIZ_description: this.form.description,
          BIZ_priority: this.form.priority,
          BIZ_repoPassword: "",
          BIZ_labels: this.form.labels,
          BIZ_repoUsername: "",
          BIZ_isCore: this.form.isCore,
		      BIZ_prodName: this.form.prodId,
          BIZ_projMgrId: this.form.projMgrId,
          BIZ_qualityMgrId: this.form.qualityMgrId,
          BIZ_devMgrId: this.form.devMgrId,
          processKey: "appAply",
          processInstanceName: "应用创建",
        };
        if (this.form.testers.length !== 0) {
          postForm.BIZ_testers = this.form.testers.join(",");
        }
        if (this.form.devlopers.length !== 0) {
          postForm.BIZ_devlopers = this.form.devlopers.join(",");
        }
        if (this.form.bizMgrIds.length !== 0) {
          postForm.BIZ_bizMgrId = this.form.bizMgrIds.join(",");
        }
        if (this.form.groupId.length !== 0) {
          postForm.BIZ_groupId.push(this.form.groupId.toString());
        }
        let response = null;
        try {
          response = baseUrlThrower(
            await this.axios({
              method: "post",
              url: this.GLOBAL.baseUrl + "/app/cerate/apply",
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
        this.form = {};
        this.stepIndex = StepSubmitSuccess;
      });
    },

    getSelectedMember: async function (accountIdList) {
      let url = this.GLOBAL.baseUrl + "/user/accountinfo";
      let response = null;
      try {
        response = baseUrlThrower(
          await this.axios({
            method: "POST",
            url: url,
            data: accountIdList,
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
      response.data.data.forEach((element) => {
        this.domainMemberOptions.push({
          value: element.id,
          label: element.nickname + "-" + element.loginName,
        });
      });
    },

    getSelectData: async function () {
      let url = this.GLOBAL.baseUrl + "/app/init/teams";
      let response = null;
      try {
        response = baseUrlThrower(
          await this.axios({
            method: "GET",
            url: url,
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
      if (response.data.data.teamOptions == null) {
        response.data.data.teamOptions = [];
      }
      //所属业务域下拉列表
      response.data.data.teamOptions.forEach((element) => {
        this.teamOptions.push({
          groupId: element.selectKey,
          groupIdStr: element.selectValue,
        });
      });
    },

    // 返回上一页
    goBack: function () {
      window.history.back();
    },
  },
  mounted() {
    this.enable_info = this.common.hasPermission(this.$store.state.user.roles, [
      "cicd_admin",
      "devops",
    ]);
    this.getSelectData();
		
		this.initOptionsInfos();
  },
  components: {},
};
</script>

<style scoped lang="scss">
.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow-y: auto;
}
</style>
