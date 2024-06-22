<template>
		<div class="login-container">
				<div class="img">
						<img src="../../assets/img/authLogin_bg.png" alt=""/>
						<img class="img1" src="../../assets/img/authLogin_bg.png" alt=""/>
						<img class="img2" src="../../assets/img/authLogin_bg.png" alt=""/>
				</div>
				
				<el-row :gutter="20">
						<el-col :span="15">
								<div style="display: block;height: 100%;" >s
								</div>
						</el-col>
						
						<el-col :span="9">
								<div class="grid-content bg-purple">
										<div class="login_form">
												<div class="login_title">
														<h3 >{{ this.$store.state.settings.title }}</h3>
												</div>
												<el-form
													ref="loginForm"
													:model="loginForm"
													:rules="loginRules"
													class="_form"
													auto-complete="on"
													label-position="left"
													size="medium"
												>
														<el-form-item prop="tenantId">
																<el-select v-model="loginForm.tenantId" placeholder="请选择租户">
																		<el-option
																			v-for="item in loginTenantList"
																			:key="item.value"
																			:label="item.label"
																			:value="item.value">
																		</el-option>
																</el-select>
														</el-form-item>
														<el-form-item prop="userName">
																<el-input
																	v-model="loginForm.userName"
																	name="userName"
																	type="text"
																	auto-complete="on"
																	placeholder="请输入用户名"
																	prefix-icon="el-icon-user"
																>
																</el-input>
														</el-form-item>
														<el-form-item prop="pwd">
																<el-input
																	:type="pwdType"
																	v-model="loginForm.pwd"
																	name="pwd"
																	auto-complete="on"
																	placeholder="请输入密码"
																	prefix-icon="el-icon-lock"
																	@keyup.enter.native="handleLogin"
																>
																		<i
																			:class="icon_eye"
																			slot="suffix"
																			@click="showPwd">
																				<svg-icon icon-class="eye" v-show="!icon_eye"/>
																		</i>
																	
																</el-input>
														</el-form-item>
														
														<el-form-item class="submit_btn">
																<el-button
																	:loading="loading"
																	type="primary"
																	style="width:400px;"
																	size="medium"
																	@click.native.prevent="handleLogin"
																	id="self-button"
																>
																		登录
																</el-button>
														</el-form-item>
												</el-form>
										</div>
								
								</div>
						</el-col>
				</el-row>
		
		</div>
</template>

<script>
import {isvalidUsername} from '@/utils/validate'
import {tenantList, authFallbackLogin} from '@/api/authLogin'
import {mapMutations} from 'vuex';

export default {
		name: 'authLogin',
		data() {
				return {
						icon_eye: '',
						authLoginToken: null,
						loginTenantList: [],
						loginForm: {
								userName: '',
								pwd: '',
								tenantId: '',
						},
						loginRules: {
								tenantId: [
										{required: true, trigger: 'change', message: '请选择租户'},
								],
								userName: [
										{required: true, trigger: 'blur', message: '请输入用户名'},
								],
								pwd: [
										{required: true, trigger: 'blur', message: '请输入密码'},
								],
						},
						
						loading: false,
						pwdType: 'password',
						redirect: '/',
				}
		},
		created() {
				tenantList().then(res => {
						if (res.data.length > 0) {
								this.loginTenantList = res.data.map(item => {
										return {
												value: item,
												label: item
										}
								})
						}
				})
		},
		methods: {
				...mapMutations(['changeLogin']),
				showPwd() {
						if (this.pwdType === 'password') {
								this.icon_eye = "el-icon-view"
								this.pwdType = 'text'
						} else {
								this.icon_eye = ""
								this.pwdType = 'password'
						}
				},
				handleLogin() {
						this.$refs.loginForm.validate((valid) => {
								if (valid) {
										this.loading = true
										authFallbackLogin(this.loginForm).then(res => {
												if (res.success) {
														localStorage.clear()
														this.authLoginToken = res.data;
														// 将用户token保存到vuex中
														this.changeLogin({
																authLoginToken: this.authLoginToken,
																authLoginTenantId: this.loginForm.tenantId,
																authLoginUserName: this.loginForm.userName,
																authLoginUserId: this.loginForm.userName,
														});
														
														this.$router.push({path: this.redirect || '/'})
												} else {
														this.$message({message: "登录失败", type: 'error'})
												}
										})
								} else {
										this.$message({message: '非法数据', type: 'error'})
										console.log('error submit!!')
										return false
								}
						})
				},
				forgetPassword() {
						this.$router.push({path: '/reset-ldap-password'})
				},
		},
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #461a1a;
$light_gray: #2d3a4b;
/deep/ .el-row {
		padding: 0 !important;
		margin: 0 !important;
		height: 100%;
}

/deep/ .el-col-9 {
		display: table;
		height: 100%;
}

/deep/ .el-col-15 {
		height: 100%;
}

/deep/ .bg-purple {
		display: table-cell;
		vertical-align: middle;
}

/deep/ .el-select{
		width: 100%;
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.img{
		width: 100%;
		height: 100%;
		position: fixed;
}
.img1{
		transform: rotate(138deg);
		left: 536px;
		top: -481px;
}
.img2{
		transform: rotate(164deg);
		left: -604px;
		top: 264px;
}

.login-container {
		background: #0c5faefa;
		//background: #0d3459fa;
		height: 100%;
		width: 100%;
		img {
				height: 80%;
				position: fixed;
				background-size: cover;
				margin: 80px 0 0 80px;
		}
		.login_title{
				font-size: 28px;
				color: #0367c6;
				margin: 0 auto;
				text-align: center;
				padding: 20px 0;
		}
		.login_form {
				width: 500px;
				background: white;
				margin-left: auto;
				margin-right: auto;
				box-shadow: -7px 2px 17px #e5e4e4ba;
				._form{
						padding: 0 50px 50px 50px;
				}
		}
}

//@import 'src/styles/login';

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
/*.login-container {
		.show-pwd {
				position: absolute;
				right: 10px;
				top: 7px;
				font-size: 16px;
				color: $dark_gray;
				cursor: pointer;
				user-select: none;
		}
		
		.eye-btn {
				width: 60px;
				padding: 0;
		}
		
		.show-eye {
				font-size: 12px;
		}
		
		.prepend_span {
				display: block;
				text-align: center;
				width: 56px;
		}
		
		.tenant_span {
				height: 36px;
				width: 97px;
				background-color: #F5F7FA;
				color: #909399;
				vertical-align: middle;
				display: inline-block;
				position: relative;
				border: 1px solid #DCDFE6;
				border-right: 0px;
				border-bottom-left-radius: 4px;
				border-top-left-radius: 4px;
				text-align: center;
				padding: 0 20px;
				white-space: nowrap;
		}
		
		/deep/ .el-input__inner {
				border-radius: 0px;
				border-bottom-right-radius: 4px;
				border-top-right-radius: 4px;
		}
		
		/deep/ .el-select {
				top: 1px;
				width: 303px;
		}
		
		#self-button {
				background-color: #e6312a;
				border-color: #e6312a;
		}
}*/
</style>
