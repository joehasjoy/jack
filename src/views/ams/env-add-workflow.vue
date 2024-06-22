<template>
    <div class="main">
        <div slot="header" class="flex flex-align-items-center header" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            <span>返回</span>
        </div>
        <el-steps :active="showStep" align-center style="margin-top: 20px">
            <el-step title="自定义集群环境" />
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
            <el-form-item v-show="showStepInfomation" label="环境名称" prop="envName">
                <el-input v-model="form.envName" style="width: 385px" placeholder="请输入环境名称"></el-input>
            </el-form-item>

            <el-result v-if="showStepSubmitSuccess" icon="success" title="自定义集群环境提交成功">
                <template slot="extra">
                    <el-button type="primary" @click="goBack" size="medium">返回</el-button>
                    <el-button type="danger" @click="goTaskCenter" size="medium">查看审批</el-button>

                </template>
            </el-result>
            <el-form-item style="margin-top: 30px">
                <el-button v-show="showStepInfomation" type="danger" @click="submitApply()"> 提交申请 </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const envNameRegex = /^[0-9a-z]+(-[0-9a-z]+)*$/;
const StepInfomation = 0;
const StepSubmit = 1;
const StepSubmitSuccess = 2;

const StepStart = StepInfomation;

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
            teamOptions: [],
            domainMemberOptions: [],
            form: {},
            enable_info: false,
            // 校验规则
            rules: {
                envName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (value == '' || value == undefined) {
								callback(new Error('请输入环境名称'))
								return
							}
							if (!envNameRegex.test(value)) {
								callback(new Error('环境名称格式不正确(xxx-xxx)'))
							}
							callback()
						},
						trigger: 'blur'
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
        showStepSubmitSuccess() {
            return this.stepIndex == StepSubmitSuccess;
        },
        showStep() {
            if (this.submitSuccess) {
                return StepSubmit;
            }
            return this.stepIndex;
        },
    },
    methods: {

        goTaskCenter() {
            this.$router.push("/taskCenter");
        },
        submitApply() {
            this.$refs.appBasicDetailForm.validate(async (valid) => {
                if (!valid) {
                    this.$alert("部分字段校验未通过！请点击上一步，检查、修改后重试。", "错误", {
                        type: "error",
                    });
                    return;
                }
                let postForm = {
                    BIZ_envName: this.form.envName,
                    processKey: "envEdit",
                    processInstanceName: "envEdit",
                };

                let response = null;
                try {
                    response = baseUrlThrower(
                        await this.axios({
                            method: "post",
                            url: this.GLOBAL.baseUrl + "/env/create/apply",
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
        this.enable_info = this.common.hasPermission(this.$store.state.user.roles, ["cicd_admin", "devops"]);
        this.getSelectData();
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
