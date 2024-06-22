<!--
 * @Author: your name
 * @Date: 2021-07-01 17:30:05
 * @LastEditTime: 2021-07-28 10:49:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\cicd\app-mobile-config.vue
-->
<template>
  <el-card style="margin-bottom: 10px; height: 100vh; overflow: auto">
    <el-tabs tab-position="top" v-model="selectTab" @tab-click="handleTab">
      <el-tab-pane label="基本信息" name="basicInfo">
        <el-row>
          <el-col :span="24">
            <el-card>
              <div slot="header" style="font-weight: bolder">
                <span style="font-size: 15px">研发效能</span>
              </div>
              <div style="float: right; padding: 3px 0">
                <el-date-picker
                  @change="selectData"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="checkDate"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                >
                </el-date-picker>
              </div>
              <el-row style="margin-top: 20px">
                <el-col :span="8">
                  <span style="font-size: 16px">构建成功率</span>
                  <br />
                  <span style="font-size: 30px">37</span><span>%</span>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span style="font-size: 16px">发布次数</span>
                    <br />
                    <span style="font-size: 30px">10</span><span>次</span>
                  </el-col>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="16">
            <el-card>
              <div slot="header" style="font-weight: bold">
                <span style="font-size: 15px">应用信息</span>
              </div>
              <el-form
                ref="appBasicDetailForm"
                :model="form"
                :rules="rules"
                label-width="120px"
                label-position="right"
                size="small"
                style="width: 70%; margin-right: auto; margin-left: 20px"
              >
                <el-input v-model="form.id" type="hidden"></el-input>

                <el-form-item label="租户ID" hidden>
                  <el-input
                    style="width: 400px"
                    v-model="form.tenantId"
                    disabled
                  ></el-input>
                </el-form-item>

                <el-form-item label="AppId:" prop="code">
                  <el-input
                    style="width: 400px"
                    v-model="form.code"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="优先级:" prop="priority">
                  <el-select
                    v-model="form.priority"
                    style="width: 400px"
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

                <el-form-item label="是否核心应用:" prop="isCore">
                  <el-select
                    style="width: 400px"
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

                <el-form-item label="产品负责人:" prop="prodMgrId">
                  <el-select
                    style="width: 400px"
                    v-model="form.prodMgrId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="项目负责人:" prop="projMgrId">
                  <el-select
                    style="width: 400px"
                    v-model="form.projMgrId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="质量负责人:" prop="qualityMgrId">
                  <el-select
                    v-model="form.qualityMgrId"
                    filterable
                    remote
                    style="width: 400px"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="开发负责人:" prop="devMgrId">
                  <el-select
                    v-model="form.devMgrId"
                    filterable
                    remote
                    style="width: 400px"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="开发人员:" prop="devlopers">
                  <el-select
                    v-model="form.devlopers"
                    filterable
                    style="width: 400px"
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="测试人员:" prop="testers">
                  <el-select
                    v-model="form.testers"
                    filterable
                    remote
                    style="width: 400px"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="业务负责人:" prop="bizMgrIds">
                  <el-select
                    v-model="form.bizMgrIds"
                    filterable
                    remote
                    style="width: 400px"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getTenantMembersByKeyword"
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

                <el-form-item label="发布渠道:" prop="useLanguage">
                  <el-select
                    v-model="form.useLanguage"
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
                <el-form-item label="功能说明:" prop="description">
                  <el-input
                    type="textarea"
                    v-model="form.description"
                  ></el-input>
                </el-form-item>

                <el-form-item label="业务标签:" prop="labels">
                  <el-input type="textarea" v-model="form.labels"></el-input>
                </el-form-item>

                <el-form-item label="代码仓库地址:" prop="gitRepoUrl">
                  <el-input v-model="form.gitRepoUrl"></el-input>
                </el-form-item>

                <el-form-item label style="margin-bottom: 200px">
                  <el-button type="primary" @click="UpdateApp()"
                    >更 新</el-button
                  >
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card style="height: 350px">
              <div slot="header" style="font-weight: bold">
                <span style="font-size: 15px">产品详情</span>
              </div>

              <el-row>
                <el-col :span="6"></el-col>
                <el-col :span="18"></el-col>
              </el-row>
            </el-card>

            <el-card style="height: 350px; margin-top: 10px">
              <div slot="header" style="font-weight: bold">
                <span style="font-size: 15px">最新版本</span>
              </div>
              <el-empty description="无数据"></el-empty>
            </el-card>

            <el-card style="height: 350px; margin-top: 10px">
              <div slot="header" style="font-weight: bold">
                <span style="font-size: 15px">快捷导航</span>
              </div>
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                style="
                  margin-left: 6px;
                  margin-top: 8px;
                  width: 110px;
                  text-align: center;
                  color: #409eff;
                "
              >
                <el-link
                  :underline="false"
                  style="color: #409eff"
                  @click="goLink(tag.name)"
                >
                  {{ tag.name }}&nbsp;<i
                    style="color: #409eff"
                    :class="tag.icon"
                  ></i>
                </el-link>
              </el-tag>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="证书管理" name="file">
        <el-button type="primary" @click="showCertificateFiles"
          >添加证书<i class="el-icon-upload el-icon--right"></i
        ></el-button>
        <el-table :data="certificateFiles" stripe style="width: 100%">
          <el-table-column
            prop="date"
            label="Keystore 文件"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="序列号"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="address" label="Key 别名" align="center">
          </el-table-column>
          <el-table-column prop="address" label="过期时间" align="center">
          </el-table-column>
          <el-table-column prop="address" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="address" label="创建人" align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="330"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                :plain="true"
                icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                type="info"
                size="mini"
                :plain="true"
                icon="el-icon-edit"
                >修改</el-button
              >
              <el-button
                type="primary"
                size="mini"
                :plain="true"
                icon="el-icon-download"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!--
          上传证书面板
        -->
        <el-drawer
          :with-header="false"
          :visible.sync="showUploadpanel"
          direction="rtl"
        >
          <el-row style="margin-top: 15px">
            <el-col :span="12">
              <span style="font-size: 17px; margin-left: 5px">添加证书</span>
            </el-col>
            <div style="float: right; margin-right: 7px">
              <el-link :underline="false">
                <i class="el-icon-close"></i>
              </el-link>
            </div>
          </el-row>
          <div
            style="
              width: 100%;
              height: 1px;
              border-top: 1px dashed #efefef;
              margin-top: 10px;
            "
          ></div>
          <el-form
            :model="UploadModel"
            style="margin-left: 15px; margin-right: 10px"
          >
            <el-form-item label="证书上传" style="margin-top: 10px">
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <em>点击上传</em>或拖拽证书Keystore文件到此区域
                </div>
                <div class="el-upload__tip" slot="tip">
                  只能上传证书文件，且不超过500MB
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="Keystore密码">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="Key 别名">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="Key 密码">
              <el-input></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary">确定</el-button>
              <el-button @click="showUploadpanel = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-drawer>
      </el-tab-pane>
      <el-tab-pane label="构建参数" name="parms">
        <el-tabs tab-position="left" @tab-click="changeParmas">
          <el-tab-pane label="变量">
            <div style="float: right; margin-right: 5px">
              <el-link :underline="false" @click="AddConfigAction('basic')">
                <i class="el-icon-circle-plus" style="font-size: 14px"></i>
                &nbsp;&nbsp;新增变量
              </el-link>
            </div>
            <el-table
              v-if="BasicConfigData.length > 0"
              :data="BasicConfigData"
              border
              style="
                width: 100%;
                marin-top: 15px;
                height: 60vh;
                overflow: auto;
              "
            >
              <el-table-column
                prop="configKey"
                label="参数"
                width="350"
                align="center"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="configValue"
                label="默认值"
                align="left"
                sortable
              >
              </el-table-column>
              <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    :plain="true"
                    @click="modifyValue(scope.row, 0)"
                    icon="el-icon-delete"
                    >删除</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    :plain="true"
                    icon="el-icon-edit"
                    @click="modifyValue(scope.row, 1)"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-empty v-if="BasicConfigData.length == 0"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="通用变量组">
            <div style="float: right; margin-right: 5px">
              <el-link :underline="false" @click="AddConfigAction('common')">
                <i class="el-icon-circle-plus" style="font-size: 14px"></i>
                &nbsp;&nbsp;新增通用变量组
              </el-link>
            </div>
            <el-table
              v-if="commonConfigData.length > 0"
              :data="commonConfigData"
              border
              style="
                width: 100%;
                marin-top: 15px;
                height: 60vh;
                overflow: auto;
              "
            >
              <el-table-column
                prop="configKey"
                label="参数"
                width="350"
                align="center"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="configValue"
                label="默认值"
                align="center"
                sortable
              >
              </el-table-column>
              <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    :plain="true"
                    @click="modifyValue(scope.row, 0)"
                    icon="el-icon-delete"
                    >删除</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    :plain="true"
                    icon="el-icon-edit"
                    @click="modifyValue(scope.row, 1)"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-empty v-if="commonConfigData.length == 0"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="构建流程" name="process">
        <div class="build-work-place">
          <div
            class="build-work-place-item"
            v-for="(step, index) in steps"
            :key="index"
          >
            <div class="build-work-place-header">{{ step.title }}</div>
            <div class="build-work-place-container">
              <div
                class="build-work-place-content-arrow"
                style="background-color: white"
                v-if="index === 0"
              ></div>
              <div
                class="build-work-place-content-arrow"
                v-if="index > 0"
              ></div>

              <el-button
                class="build-work-place-content-right-btn"
                round
                @click="editStep(step, index)"
              >
                {{ step.name }}</el-button
              >
              <div class="build-work-place-content-arrow"></div>
            </div>
          </div>

          <div class="build-work-place-item" style="border-right: 0">
            <div class="build-work-place-header">新阶段</div>
            <div class="build-work-place-container">
              <div class="build-work-place-last-arrow"></div>
              <el-button
                icon="el-icon-circle-plus-outline"
                @click="crateNewStep"
                class="build-work-place-content-right-btn"
                round
                >新的任务</el-button
              >
              <div
                class="build-work-place-content-arrow"
                style="background-color: white"
              ></div>
            </div>
          </div>
        </div>

        <!--创建步骤-->
        <el-drawer
          :visible.sync="showCreateStep"
          direction="rtl"
          :with-header="false"
        >
          <el-row style="margin-top: 15px">
            <el-col :span="12">
              <span style="font-size: 14px; margin-left: 5px; font-weight: 500"
                >选择任务组</span
              >
            </el-col>
            <div style="float: right; margin-right: 7px">
              <el-link :underline="false">
                <i class="el-icon-close"></i>
              </el-link>
            </div>
          </el-row>
          <div
            style="
              width: 100%;
              height: 1px;
              border-top: 1px dashed #efefef;
              margin-top: 10px;
            "
          ></div>

          <el-tabs tab-position="left" style="height: 90vh">
            <el-tab-pane :label="codeSteps.name">
              <el-row :gutter="8" style="margin-right: 10px">
                <el-col
                  :span="12"
                  v-for="code in codeSteps.optionalSteps"
                  :key="code.key"
                >
                  <el-card
                    shadow="hover"
                    style="height: 90px; margin-top: 10px"
                  >
                    <el-link
                      :underline="false"
                      @click="AddStep(code, codeSteps)"
                    >
                      <el-row flex>
                        <el-col :span="6">
                          <div class="select-step-logo-container">
                            <img
                              style="width: 40px; height: 40px"
                              :src="code.logo"
                            />
                          </div>
                        </el-col>
                        <el-col :span="18">
                          <div class="select-step-container">
                            <div class="select-step-container-top">
                              {{ code.name }}
                            </div>
                            <div class="select-step-container-bottom">
                              {{ code.desc }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </el-link>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="构建打包">
              <el-row :gutter="8" style="margin-right: 10px">
                <el-col
                  :span="12"
                  v-for="build in buildSteps.optionalSteps"
                  :key="build.key"
                >
                  <el-card
                    shadow="hover"
                    style="height: 90px; margin-top: 10px"
                  >
                    <el-link
                      :underline="false"
                      @click="AddStep(build, buildSteps)"
                    >
                      <el-row flex>
                        <el-col :span="6">
                          <div class="select-step-logo-container">
                            <img
                              style="width: 40px; height: 40px"
                              :src="build.logo"
                            />
                          </div>
                        </el-col>
                        <el-col :span="18">
                          <div class="select-step-container">
                            <div class="select-step-container-top">
                              {{ build.name }}
                            </div>
                            <div class="select-step-container-bottom">
                              {{ build.desc }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </el-link>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="部署上传">
              <el-row :gutter="8" style="margin-right: 10px">
                <el-col
                  :span="12"
                  v-for="deploy in deploySteps.optionalSteps"
                  :key="deploy.key"
                >
                  <el-card
                    shadow="hover"
                    style="height: 90px; margin-top: 10px"
                  >
                    <el-link
                      :underline="false"
                      @click="AddStep(deploy, deploySteps)"
                    >
                      <el-row flex>
                        <el-col :span="6">
                          <div class="select-step-logo-container">
                            <img
                              style="width: 40px; height: 40px"
                              :src="deploy.logo"
                            />
                          </div>
                        </el-col>
                        <el-col :span="18">
                          <div class="select-step-container">
                            <div class="select-step-container-top">
                              {{ deploy.name }}
                            </div>
                            <div class="select-step-container-bottom">
                              {{ deploy.desc }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </el-link>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-drawer>

        <!--创建步骤-->
        <el-drawer
          :visible.sync="showUpdateStep"
          direction="rtl"
          :with-header="false"
        >
          <el-row style="margin-top: 15px">
            <el-col :span="12">
              <span style="font-size: 14px; margin-left: 10px; font-weight: 500"
                >编辑</span
              >
              &nbsp;
              <el-link :underline="false" @click="removeStep">
                <el-tooltip content="点击删除" placement="right">
                  <i class="el-icon-delete"></i>
                </el-tooltip>
              </el-link>
            </el-col>
            <div style="float: right; margin-right: 10px">
              <el-link :underline="false" @click="closeUpdate">
                <i class="el-icon-close"></i>
              </el-link>
            </div>
          </el-row>
          <div
            style="
              width: 100%;
              height: 1px;
              border-top: 2px solid #efefef;
              margin-top: 10px;
            "
          ></div>
          <el-form
            :model="currentStepObject"
            v-if="
              currentStepKey === 'build-android' ||
              currentStepKey === 'build-ios'
            "
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                任务名称
                <el-tooltip content="任务名称" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.name"> </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                构建命令
                <el-tooltip content="输入构建相关的命令" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input
                v-model="currentStepObject.params.build_arg"
                type="textarea"
                rows="5"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <el-form
            v-if="currentStepKey === 'deploy-oss'"
            label-width="90px"
            label-position="top"
            class="update_form"
            :model="currentStepObject"
          >
            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                任务名称
                <el-tooltip content="任务名称" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.name"> </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                BucketZone
                <el-tooltip content="填写bucketZone" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.params.bucketZone">
              </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                AuthId
                <el-tooltip content="填写AuthId" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.params.authId"> </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                AuthSecret
                <el-tooltip content="填写AuthSecret" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input
                type="password"
                v-model="currentStepObject.params.authSecret"
              >
              </el-input>
            </el-form-item>
          </el-form>

          <el-form
            v-if="
              currentStepKey === 'code-clone-gogs' ||
              currentStepKey === 'code-clone-gitlab'
            "
            label-width="90px"
            label-position="top"
            class="update_form"
            :model="currentStepObject"
          >
            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                任务名称
                <el-tooltip content="任务名称" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.name"> </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                Account Name
                <el-tooltip content="填写代码仓库账户名称" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="currentStepObject.params.account"> </el-input>
            </el-form-item>

            <el-form-item class="update_form_item">
              <span slot="label" style="font-weight: normal; font-size: 13px">
                Token
                <el-tooltip content="填写代码仓库密令值" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input
                v-model="currentStepObject.params.token"
                type="password"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </el-drawer>
      </el-tab-pane>
    </el-tabs>
    <el-button
      style="position: absolute; right: 25px; top: 24px; width: 60px"
      type="text"
      @click="goBack"
      >返回</el-button
    >
    <el-button
      v-if="selectTab === 'process'"
      style="position: absolute; right: 85px; top: 24px; width: 60px"
      type="text"
      @click="saveBuildProcess"
      >保存配置</el-button
    >
    <el-dialog
      title="修改配置"
      center
      width="55%"
      :visible.sync="updateConfigDialogVisible"
    >
      <el-form :model="modifiedModel">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="参数名">
              <el-input
                v-model="modifiedModel.configKey"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="参数值">
              <el-input
                v-model="modifiedModel.configValue"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-form-item style="margin-top: 10px">
            <el-button type="primary" @click="updateValue">确 认</el-button>
            <el-button @click="updateConfigDialogVisible = false"
              >取 消</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <!--新增配置-->
    <el-dialog
      :title="title"
      center
      width="55%"
      :visible.sync="addConfigDialogVisible"
      style="height: 700px"
    >
      <el-form :model="SelectConfigModel">
        <div class="line" style="margin-top: -20px"></div>

        <el-row
          :gutter="10"
          style="margin-top: 10px; font-weight: bold; margin-bottom: 10px"
        >
          <el-col :span="10"><span>参数</span></el-col>
          <el-col :span="10"><span>默认值</span></el-col>
          <el-col :span="4"><span>操作</span></el-col>
        </el-row>
        <el-row :gutter="10" v-for="item in basicConfigList" :key="item.index">
          <el-col :span="10">
            <el-form-item>
              <el-input
                placeholder="请输入参数"
                v-model="item.config_key"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-input
                placeholder="请输入参数默认值"
                v-model="item.config_value"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-link
                :underline="false"
                @click="DeleteBsicConfiguration(item.index)"
              >
                <i class="el-icon-delete" style="color: red">删除</i>
              </el-link>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-link :underline="false" @click="AddBasicConfiguration">
              <i class="el-icon-plus" style="color: red">新增</i>
            </el-link>
          </el-col>
        </el-row>

        <el-form-item style="margin-top: 10px">
          <el-button type="primary" @click="SaveConfiguration()"
            >添 加</el-button
          >
          <el-button @click="addConfigDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      logSteps: [],
      updateModelIOS: { name: "" },
      updateModelAndroid: { name: "" },
      currentStepIndex: 0,
      currentStepKey: "",
      currentStepObject: {},
      steps: [],
      codeSteps: {
        name: "代码拉取",
        stepKey: "code-clone",
        optionalSteps: [
          {
            name: "GitLab",
            desc: "Gitlab拉取代码",
            logo: require("../../assets/step_logo/gitlab.png"),
            key: "code-clone-gitlab",
            params: {
              account: "",
              token: "",
            },
          },
          {
            name: "Gogs",
            desc: "Gogs拉取代码",
            logo: require("../../assets/step_logo/gogs.png"),
            key: "code-clone-gogs",
            params: {
              account: "",
              token: "",
            },
          },
        ],
      },
      buildSteps: {
        name: "构建打包",
        stepKey: "build",
        optionalSteps: [
          {
            name: "安卓构建",
            desc: "构建生成APK",
            logo: require("../../assets/step_logo/android.png"),
            key: "build-android",
            params: {
              build_arg: "",
            },
          },
          {
            name: "ios构建",
            desc: "生成Ios构建包",
            logo: require("../../assets/step_logo/ios.png"),
            key: "build-ios",
            params: {
              build_arg: "",
            },
          },
          {
            name: "Java构建",
            desc: "Java 构建打包",
            logo: require("../../assets/step_logo/java.png"),
            key: "build-java",
            params: {
              build_arg: "",
            },
          },
          {
            name: "NodeJs构建",
            desc: "NodeJs构建打包",
            logo: require("../../assets/step_logo/nodejs.png"),
            key: "build-nodejs",
            params: {
              build_arg: "",
            },
          },
          {
            name: "Python构建",
            desc: "python构建打包",
            logo: require("../../assets/step_logo/python.png"),
            key: "build-python",
            params: {
              build_arg: "",
            },
          },
          {
            name: "Golang构建",
            desc: "Golang构建打包",
            logo: require("../../assets/step_logo/go.png"),
            key: "build-go",
            params: {
              build_arg: "",
            },
          },
        ],
      },
      deploySteps: {
        name: "部署上传",
        stepKey: "deploy",
        optionalSteps: [
          {
            name: "构建上传",
            desc: "上传到Oss",
            logo: require("../../assets/step_logo/oss.png"),
            key: "deploy-oss",
            params: {
              bucketZone: "",
              authId: "",
              authSecret: "",
            },
          },
        ],
      },

      showCreateStep: false,
      showUpdateStep: false,
      //所用语言下拉
      useLanguageOptions: [
        { label: "java", value: 1 },
        { label: "python", value: 2 },
        { label: "go", value: 3 },
        { label: "nodejs", value: 4 },
        { label: "android", value: 6 },
        { label: "iOS", value: 7 },
        { label: "flutter", value: 8 },
        { label: "miniProgram", value: 9 },
      ],
      //是否核心应用
      isCoreOptions: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
      //优先级
      priorityOptions: [
        { label: "极高", value: 1 },
        { label: "高", value: 2 },
        { label: "中", value: 3 },
        { label: "低", value: 4 },
      ],
      appDetail: {},
      teamOptions: [],
      domainMemberOptions: [],
      form: {},
      enable_info: false,
      template_id: "",
      kube_env_disabled: false,
      yaml_content: "",
      domain_ingress: "",
      newTitle: "新增",
      dialognewRowForm: false,
      dialogKubeRowForm: false,
      dialogKubeRowSvc: false,
      dialogKubeRowIngress: false,
      newRow: { env: "", build_type: "", user_list: [], usergroup_list: [] },
      kubeRow: { pub_id: "", yaml_content: "" },
      kubeRowSvc: { id: "", name: "", yaml: "", deployment_resource_id: "" },
      kubeRowIngress: { id: "", name: "", yaml: "", svc_resource_id: "" },
      pub_loading: false,
      kube_loading: false,
      svc_loading: false,
      ingress_loading: false,
      AppData: {},
      appId: null,
      appCode: null,
      app_url: this.GLOBAL.baseUrl + "/app/detail/",
      app_resource_url: this.GLOBAL.service_tag + "/api/ams/app-resource/",
      create_yaml_url: this.GLOBAL.service_tag + "/api/ams/create-yaml/",
      temp_url: this.GLOBAL.service_tag + "/api/ams/app-kubernetes-template/",
      app_resource_kube_url:
        this.GLOBAL.service_tag + "/api/ams/app-resource-kubernetes/",
      app_svc_kube_url: this.GLOBAL.service_tag + "/api/ams/app-svc/",
      app_ingress_kube_url: this.GLOBAL.service_tag + "/api/ams/app-ingress/",
      projects: [],
      languages: [],
      users: [],
      envs: [],
      images: [],
      build_types: [],
      usergroups: [],
      publishData: [],
      kubeData: [],
      templates: [],
      Row: {
        name: "",
        code: "",
        git: "",
        language: "",
        owner: "",
        ignoreverifyresult: false,
      },
      limit: 10,
      page: 1,
      total: 0,
      kube_limit: 10,
      kube_page: 1,
      kube_total: 0,

      SvcData: [],
      svc_limit: 10,
      svc_page: 1,
      svc_total: 0,

      IngressData: [],
      ingress_limit: 10,
      ingress_page: 1,
      ingress_total: 0,
      temp_show: false,
      heath_check: false,
      // 校验规则
      rules: {
        groupId: [{ required: true, message: "请选择业务域", trigger: "blur" }],
        prodMgrId: [
          { required: true, message: "请选择产品负责人", trigger: "blur" },
        ],
        projMgrId: [
          { required: true, message: "请选择项目负责人", trigger: "blur" },
        ],
        qualityMgrId: [
          { required: true, message: "请选择项质量负责人", trigger: "blur" },
        ],
        devMgrId: [
          { required: true, message: "请选择项开发负责人", trigger: "blur" },
        ],
        testers: [
          { required: true, message: "请选择测试人员", trigger: "blur" },
        ],
        bizMgrIds: [
          { required: true, message: "请选择业务负责人", trigger: "blur" },
        ],
        devlopers: [
          { required: true, message: "请选择开发人员", trigger: "blur" },
        ],
        gitRepoUrl: [
          { required: true, message: "请输入代码仓库地址", trigger: "blur" },
        ],
        isCore: [
          { required: true, message: "请选择是否核心应用", trigger: "blur" },
        ],
        priority: [
          { required: true, message: "请选择优先级", trigger: "blur" },
        ],
        useLanguage: [
          { required: true, message: "请选择开发语言", trigger: "blur" },
        ],
      },
      appData: {},
      selectTab: "parms",
      title: "新增变量",
      SelectConfigModel: {},
      modifiedModel: {},
      addConfigDialogVisible: false,
      updateConfigDialogVisible: false,
      basicConfigList: [{ config_key: "", config_value: "", index: 0 }], //基础配置参数
      certificateFiles: [],
      tags: [
        { name: "构建打包", icon: "el-icon-s-promotion" },
        { name: "移动测试", icon: "el-icon-s-check" },
        { name: "移动热修复", icon: "el-icon-s-claim" },
        { name: "崩溃分析", icon: "el-icon-s-marketing" },
        { name: "性能分析", icon: "el-icon-info" },
        { name: "远程日志", icon: "el-icon-s-promotion" },
      ],
      BasicConfigData: [],
      commonConfigData: [],
      UploadModel: {},
      showUploadpanel: false,
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      checkDate: ["2021-07-00 00:00:00", "2021-08-05 00:00:00"],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  mounted() {
    this.LoadConfigs(0);
    this.loadAppData();
    this.getSelectData();
    this.loadBuildSteps();
    if (
      this.common.getUrlKey("tabName") === "" ||
      this.common.getUrlKey("tabName") === null ||
      this.common.getUrlKey("tabName") === undefined
    ) {
      this.selectTab = "basicInfo";
    } else {
      this.selectTab = this.common.getUrlKey("tabName");
    }
  },
  methods: {
    loadBuildSteps() {
      this.axios({
        methods: "get",
        url:
          this.GLOBAL.baseUrl +
          "/mobile/step/" +
          this.common.getUrlKey("appId"),
      })
        .then((result) => {
          if (result.data.code === 200) {
            if (result.data.data != null && result.data.data.length > 0) {
              this.steps = [];
              result.data.data.forEach((step) => {
                step.params = JSON.parse(step.params);
                this.steps.push(step);
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "加载构建流程失败",
            });
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "加载构建流程失败",
          });
        });
    },
    handleTab(tab, event) {
      if (this.logSteps.length > 0) {
        var lastStep = this.logSteps[this.logSteps.length - 1];
        if (lastStep === "process") {
          this.$confirm("请确认当前构建流程信息是否已经保存?", "提示", {
            confirmButtonText: "继续切换",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {})
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消切换页面",
              });
              this.selectTab = "process";
            });
        }
      }
      this.logSteps.push(tab.name);
    },
    closeUpdate() {
      this.showUpdateStep = false;
    },
    saveBuildProcess() {
      var postParameters = [];
      this.steps.forEach((step) => {
        var newStep = {
          title: step.title,
          name: step.name,
          stepRootKey: step.stepRootKey,
          stepKey: step.stepKey,
          params: step.params,
        };
        newStep.params = JSON.stringify(newStep.params);
        newStep.appId = this.common.getUrlKey("appId");
        postParameters.push(newStep);
      });
      this.axios({
        url: this.GLOBAL.baseUrl + "/mobile/step/save",
        method: "POST",
        data: postParameters,
      })
        .then((res) => {
          if (res.data.code == 200) {
            console.log(this.steps);
            this.$message({
              type: "success",
              message: "构建流程保存成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "构建流程保存失败",
            });
          }
        })
        .catch((err) => {});
    },
    removeStep() {
      this.$confirm("此操作将删除当前步骤, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.steps.splice(this.currentStepIndex, 1);
          this.showUpdateStep = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editStep(step, index) {
      this.showUpdateStep = true;
      this.currentStepIndex = index;
      this.currentStepKey = step.stepKey;
      this.currentStepObject = step;
    },
    AddStep(step, stepDetail) {
      if (
        step.key == "build-ios" ||
        step.key == "build-android" ||
        step.key == "code-clone-gogs" ||
        step.key == "code-clone-gitlab" ||
        step.key == "deploy-oss"
      ) {
        this.showCreateStep = false;
        this.steps.push({
          title: stepDetail.name,
          name: step.name,
          stepRootKey: stepDetail.stepKey,
          stepKey: step.key,
          params: step.params,
        });
      } else {
        this.$message({
          type: "warning",
          message: "暂时不支持选择该功能",
        });
        this.showCreateStep = false;
        return;
      }
    },
    updateStep() {
      this.showUpdateStep = true;
    },
    crateNewStep() {
      this.showCreateStep = true;
    },
    selectData() {
      alert(this.checkDate);
      console.log(this.checkDate);
    },
    getSelectedMember(accountIdList) {
      let url = this.GLOBAL.baseUrl + "/user/accountinfo";
      this.axios({
        method: "POST",
        url: url,
        data: accountIdList,
      })
        .then((res) => {
          if (res.status === 200) {
            res.data.data.forEach((element) => {
              this.domainMemberOptions.push({
                value: element.id,
                label: element.nickname + "-" + element.loginName,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getSelectData() {
      let url = this.GLOBAL.baseUrl + "/app/init/updateAppDetailSelectData";
      this.axios({
        method: "GET",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            //所属业务域下拉列表
            res.data.data.teamOptions.forEach((element) => {
              this.teamOptions.push({
                groupId: element.selectKey,
                groupIdStr: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

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
    //清空关键字搜索租户成员结果
    clearDomainMemberOptions() {
      this.domainMemberOptions = [];
    },
    loadAppData() {
      this.axios({
        url: this.GLOBAL.baseUrl + "/app/" + this.common.getUrlKey("appId"),
        method: "get",
      })
        .then((response) => {
          console.log("GetAppData:", response.data);
          if (response.data.code == 200) {
            this.form = response.data.data;
            if (!this.isEmpty(response.data.data.testers)) {
              this.form.testers = response.data.data.testers.split(",");
            }
            if (!this.isEmpty(response.data.data.devlopers)) {
              this.form.devlopers = response.data.data.devlopers.split(",");
            }
            if (!this.isEmpty(response.data.data.bizMgrId)) {
              this.form.bizMgrIds = response.data.data.bizMgrId.split(",");
            }
            //产品负责人prodMgrId、项目负责人projMgrId、质量负责人qualityMgrId、开发人员devlopers、测试人员testers
            let accountIdList = [];
            accountIdList.push(response.data.data.prodMgrId);
            accountIdList.push(response.data.data.projMgrId);
            accountIdList.push(response.data.data.qualityMgrId);
            accountIdList.push(response.data.data.devMgrId);
            Array.prototype.push.apply(accountIdList, this.form.testers);
            Array.prototype.push.apply(accountIdList, this.form.devlopers);
            Array.prototype.push.apply(accountIdList, this.form.bizMgrIds);
            this.getSelectedMember(accountIdList);
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((error) => {});
    },
    goLink(val) {
      if ("构建打包" === val) {
        this.$router.push(
          "/cicd/app/build-mobile/?appId=" +
            this.common.getUrlKey("appId") +
            "&appCode=" +
            this.common.getUrlKey("app_code")
        );
      }
    },
    isEmpty(obj) {
      var nobj;
      if (nobj !== undefined) {
        nobj = obj();
      } else {
        nobj = obj;
      }
      return (
        typeof obj === "undefined" ||
        obj === null ||
        obj === "" ||
        nobj.length == 0
      );
    },
    goBack() {
      if (this.selectTab == "process") {
        this.$confirm(
          "请确认当前步骤信息构建流程是否保存,如果已经保存数据请点击继续离开当前页面?",
          "提示",
          {
            confirmButtonText: "继续",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            window.history.back();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        window.history.back();
      }
    },
    updateValue() {
      this.axios({
        url: this.GLOBAL.baseUrl + "/mobile/config/update",
        method: "post",
        data: this.modifiedModel,
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.updateConfigDialogVisible = false;
            this.LoadConfigs(0);
            this.LoadConfigs(1);
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
            });
          }
        })
        .catch((error) => {});
    },
    modifyValue(v, t) {
      if (t === 0) {
        this.$confirm("此操作会持久化删除该变量, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.axios({
              url: this.GLOBAL.baseUrl + "/mobile/config/delete/" + v.id,
              method: "get",
            })
              .then((response) => {
                if (response.data.code === 200) {
                  this.LoadConfigs(0);
                  this.LoadConfigs(1);
                  this.$notify({
                    title: "成功",
                    message: "操作成功",
                    type: "success",
                  });
                }
              })
              .catch((error) => {});
          })
          .catch((e) => {
            this.$message({
              type: "info",
              message: "取消终止操作",
            });
          });
      }
      if (t === 1) {
        this.updateConfigDialogVisible = true;
        this.modifiedModel = v;
      }
    },
    changeParmas(tab, event) {
      var _type = tab.label === "通用变量组" ? 1 : 0;
      this.LoadConfigs(_type);
    },
    LoadConfigs(_type) {
      this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/mobile/config/loadConfigurations/" +
          this.common.getUrlKey("appId") +
          "/" +
          _type,
        method: "get",
      })
        .then((res) => {
          console.log(res.data.data);

          if (_type == 0) {
            this.BasicConfigData = res.data.data;
          } else {
            this.commonConfigData = res.data.data;
          }
        })
        .catch((err) => {});
    },
    SaveConfiguration: function () {
      var _type = 0;

      if (this.title == "添加变量") {
        _type = 0;
      }
      if (this.title == "添加通用变量") {
        _type = 1;
      }
      this.axios({
        method: "post",
        url: this.GLOBAL.baseUrl + "/mobile/config/addConfiguration",
        data: {
          app_code: this.common.getUrlKey("app_code"),
          app_id: this.common.getUrlKey("appId"),
          app_type: _type,
          configList: this.basicConfigList,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.LoadConfigs(0);
            this.LoadConfigs(1);
            this.$message({
              message: "配置增加成功",
              type: "success",
            });
            this.addConfigDialogVisible = false;
            this.basicConfigList = [
              { config_key: "", config_value: "", index: 0 },
            ];
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "添加失败",
            type: "error",
          });
          this.addConfigDialogVisible = false;
        });
    },
    AddBasicConfiguration: function () {
      this.basicConfigList.push({
        config_key: "",
        config_value: "",
        index: parseFloat(Math.random()).toFixed(3),
      });
    },
    DeleteBsicConfiguration: function (index) {
      if (this.basicConfigList.length != 1) {
        for (var i = 0; i < this.basicConfigList.length; i++) {
          if (this.basicConfigList[i].index === index) {
            this.basicConfigList.splice(i, 1);
          }
        }
      } else {
        this.$message({
          message: "至少有一个输入框",
          type: "warning",
        });
        return;
      }
    },
    AddConfigAction: function (_type) {
      this.addConfigDialogVisible = true;
      if (_type == "basic") {
        this.title = "添加变量";
      } else {
        this.title = "添加通用变量";
      }
    },
    showCertificateFiles() {
      this.showUploadpanel = true;
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>
<style scoped>
.line {
  width: 100%;
  height: 2px;
  border-top: 1px solid #ced4ce;
}
.build-work-place {
  height: 70vh;
  line-height: 88rpx;
  font-size: 30rpx;
  display: flex;
  overflow-x: auto;
  width: 100%;
}

.build-work-place-item {
  flex-basis: 172rpx;
  flex-shrink: 0;
  width: 250px;
  white-space: nowrap;
  background-color: #ffffff;
  border-right: #e5e5e5 solid 1px;
}
.build-work-place-header {
  font-size: 15px;
  margin-left: 12px;
  margin-top: 10px;
  color: #8c8c8c;
}
.build-work-place-header {
  font-size: 15px;
  margin-left: 12px;
  margin-top: 10px;
  color: #8c8c8c;
}
.build-card-item {
  width: 180px;
  margin-top: 20px;
  height: 190px;
}
.build-work-place-container {
  display: flex;
  flex-direction: row;
  height: 200px;
  width: 240x;
  justify-content: center;
  align-items: center;
}
.build-work-place-content-arrow {
  flex: 1;
  height: 1px;
  background-color: #e5e5e5;
  display: inline-block;
}
.build-work-place-last-arrow {
  height: 1px;
  flex: 1;
  width: 40px;
  background-color: #e5e5e5;
  display: inline-block;
}
.build-work-place-content-right-btn {
  text-align: center;
}
.select-step-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
  width: 180px;
}
.select-step-container-top {
  font-size: 14px;
  color: #262626;
  margin-top: 6px;
}
.select-step-container-bottom {
  font-size: 12px;
  color: #8c8c8c;
  display: -webkit-box; /*设置为弹性盒子*/
  -webkit-line-clamp: 1; /*设置要显示多少行*/
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis; /*超出显示为省略号*/
  -webkit-box-orient: vertical;
  word-break: break-all; /*强制英文单词自动换行*/
  padding-right: 5px;
}
.select-step-logo-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  padding: 10px;

  border: #e5e5e5 1px solid;
  border-radius: 2px;
}
.update_form {
  margin-left: 10px;
}
.update_form_item {
  width: 90%;
}
</style>