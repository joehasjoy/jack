<template>
    <div class="main flex-column">
      <el-page-header @back="goBack" content="自定义构建计划模板">
      </el-page-header>
      <div class="tab_info">
        构建计划是持续集成的基本单元，在这里你可以快速创建一个构建计划，更多内容可以到构建计划详情中进行配置
      </div>
  
      <el-button
        style="position: absolute; right: 70px; top: 60px; width: 90px"
        @click="saveBuildProcess"
        v-show="tabName == 'stepInfo'"
        >保存配置</el-button
      >
      <el-tabs v-model="tabName" @tab-click="changeTemplateTab">
        <el-tab-pane label="基本信息" name="basicInfo">
          <el-form
            ref="form"
            :model="form"
            label-width="160px"
            label-position="top"
          >
            <el-form-item label="流水线名称">
              <el-input
                v-model="form.name"
                style="width: 500px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="编程语言">
              <el-select
                v-model="form.piplineLanguage"
                placeholder="请选择编程语言"
                style="width: 500px"
              >
                <el-option
                  v-for="(item, index) in useLanguageOptions"
                  :key="index"
                  :value="item.label"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流水线描述">
              <el-input
                type="textarea"
                rows="8"
                v-model="form.description"
                style="width: 500px"
              ></el-input>
            </el-form-item>
  
            <el-form-item>
              <el-button type="primary" @click="nextStep">下一步</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="阶段任务设置" name="stepInfo">
          <div class="build-work-place" style="background-color: #f5f5f5">
            <div
              class="build-work-place-item"
              v-for="(step, index) in steps"
              :key="index"
              :style="index == 0 ? 'margin-left:10px' : ''"
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
  
            <div
              class="build-work-place-item"
              style="border-right: 0; margin-left: 10px"
            >
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
        </el-tab-pane>
      </el-tabs>
  
      <el-dialog title="生成 cron" :visible.sync="showCron">
        <vcrontab
          @hide="showCron = false"
          @fill="crontabFill"
          :expression="expression"
        ></vcrontab>
      </el-dialog>
  
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
            <el-link :underline="false" @click="clodeCreatePanel">
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
          <el-tab-pane label="构建打包">
            <el-row :gutter="8" style="margin-right: 10px">
              <el-col
                :span="12"
                v-for="build in buildSteps.optionalSteps"
                :key="build.key"
              >
                <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                  <el-link :underline="false" @click="AddStep(build, buildSteps)">
                    <div class="step-container">
                      <div class="select-step-logo-container">
                        <img
                          style="width: 30px; height: 30px"
                          :src="build.logo"
                        />
                      </div>
  
                      <div class="select-step-container">
                        <div class="select-step-container-top">
                          {{ build.name }}
                        </div>
                        <div class="select-step-container-bottom">
                          {{ build.desc }}
                        </div>
                      </div>
                    </div>
                  </el-link>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
  
          <el-tab-pane label="镜像上传">
            <el-row :gutter="8" style="margin-right: 10px">
              <el-col
                :span="12"
                v-for="build in imageSteps.optionalSteps"
                :key="build.key"
              >
                <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                  <el-link :underline="false" @click="AddStep(build, buildSteps)">
                    <div class="step-container">
                      <div class="select-step-logo-container">
                        <img
                          style="width: 30px; height: 30px"
                          :src="build.logo"
                        />
                      </div>
  
                      <div class="select-step-container">
                        <div class="select-step-container-top">
                          {{ build.name }}
                        </div>
                        <div class="select-step-container-bottom">
                          {{ build.desc }}
                        </div>
                      </div>
                    </div>
                  </el-link>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
  
          <el-tab-pane label="部署发布">
            <el-row :gutter="8" style="margin-right: 10px">
              <el-col
                :span="12"
                v-for="deploy in deploySteps.optionalSteps"
                :key="deploy.key"
              >
                <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                  <el-link
                    :underline="false"
                    @click="AddStep(deploy, deploySteps)"
                  >
                    <div class="step-container">
                      <div class="select-step-logo-container">
                        <img
                          style="width: 30px; height: 30px"
                          :src="deploy.logo"
                        />
                      </div>
  
                      <div class="select-step-container">
                        <div class="select-step-container-top">
                          {{ deploy.name }}
                        </div>
                        <div class="select-step-container-bottom">
                          {{ deploy.desc }}
                        </div>
                      </div>
                    </div>
                  </el-link>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
  
          <el-tab-pane label="●●●其他">
            <el-row :gutter="8" style="margin-right: 10px">
              <el-col
                :span="12"
                v-for="deploy in extraWork.optionalSteps"
                :key="deploy.key"
              >
                <el-card shadow="hover" style="height: 90px; margin-top: 10px">
                  <el-link :underline="false" @click="AddStep(deploy, extraWork)">
                    <div class="step-container">
                      <div class="select-step-logo-container">
                        <img
                          style="width: 30px; height: 30px"
                          :src="deploy.logo"
                        />
                      </div>
  
                      <div class="select-step-container">
                        <div class="select-step-container-top">
                          {{ deploy.name }}
                        </div>
                        <div class="select-step-container-bottom">
                          {{ deploy.desc }}
                        </div>
                      </div>
                    </div>
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
              >配置运行参数</span
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
  
        <div class="form-content">
          <!-- 代码clone -->
          <el-form
            :model="currentStepObject"
            v-if="currentStepKey === 'code-clone-gitlab'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="仓库类型">
              <el-radio-group
                v-model="currentStepObject.params.repoType"
                disabled
              >
                <el-radio
                  v-for="item in repoTypeOptions"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="代码仓库">
              <el-input
                readonly
                type="textarea"
                v-model="currentStepObject.params.repositoryUrl"
              ></el-input>
            </el-form-item>
            <template>
              <el-alert
                title="说明"
                type="success"
                description="如需修改仓库地址，请到应用管理页配置修改"
              >
              </el-alert>
            </template>
          </el-form>
  
          <!-- 上传到Habor -->
          <el-form
            :model="currentStepObject"
            v-if="currentStepKey === 'upload-habor'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="产物路径">
              <el-input
                clearable
                type="textarea"
                v-model="currentStepObject.params.build_result_path"
              ></el-input>
            </el-form-item>
            <el-form-item label="基础镜像">
              <el-select
                placeholder=""
                style="width: 100%"
                v-model="currentStepObject.params.build_base_image"
              >
                <el-option
                  v-for="item in baseInmageOptions"
                  v-bind:key="item.image"
                  :label="item.image"
                  :value="item.image"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
  
          <!-- java构建 -->
          <el-form
            :model="currentStepObject"
            ref="buildTypeRef"
            :rules="buildTypeRules"
            v-if="currentStepKey === 'build-java'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="编译环境">
              <el-radio-group
                v-model="currentStepObject.params.build_result_type"
                disabled
              >
                <el-radio label="jar"></el-radio>
                <el-radio label="tomcat-war"></el-radio>
                <el-radio label="resion"></el-radio>
              </el-radio-group>
            </el-form-item>
  
            <el-form-item label="编译命令" prop="build_arg">
              <el-input
                clearable
                v-model="currentStepObject.params.build_arg"
                type="textarea"
                rows="5"
                @change="buildTypeArg_Change"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="代码目录">
              <el-input
                clearable
                v-model="currentStepObject.params.coode_root_path"
              ></el-input>
            </el-form-item>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">每日构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="每日构建提供定时调度构建服务"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_every_build"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_every_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="定时构建时间">
                <el-input
                  clearable
                  v-model="currentStepObject.params.every_build_time"
                  readonly
                >
                  <el-button
                    @click="showCronDialog"
                    slot="append"
                    icon="el-icon-date"
                  ></el-button>
                </el-input>
              </el-form-item>
  
              <el-form-item label="定时构建分支/Tag" prop="branch">
                <el-cascader
                  v-model="currentStepObject.params.every_build_branch"
                  filterable
                  :options="branchTagOptions"
                  @focus="handleChangeTagBranch"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-card>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">GitLab WebHook触发构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="打开开关后请前往Gitlab->Settings->Webhooks进行配置"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_webhooks_build"
                @change="buildTypeEnable_Change"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_webhooks_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="触发Url">
                <el-input
                  autosize
                  clearable
                  type="textarea"
                  disabled
                  v-model="gitLabWebHookUrl"
                ></el-input>
              </el-form-item>
  
              <el-form-item label="支持触发类型">
                <el-checkbox-group v-model="currentStepObject.params.touch_types">
                  <el-checkbox label="pushEvent" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
  
              <el-form-item label="基础镜像" prop="build_base_image">
                <el-select
                  placeholder="请选择基础镜像"
                  style="width: 100%"
                  v-model="currentStepObject.params.build_base_image"
                  @change="buildTypeImage_Change"
                >
                  <el-option
                    v-for="item in baseInmageOptions"
                    v-bind:key="item.image"
                    :label="item.image"
                    :value="item.image"
                  ></el-option>
                </el-select>
              </el-form-item>
  
              <el-form-item label="产物路径" prop="build_result_path">
                <el-input
                  clearable
                  type="textarea"
                  v-model="currentStepObject.params.build_result_path"
                  placeholder="请输入内容"
                  @change="buildTypeInput_Change"
                ></el-input>
              </el-form-item>
            </el-card>
          </el-form>
  
          <!-- python构建 -->
          <el-form
            :model="currentStepObject"
            ref="buildTypeRef"
            :rules="buildTypeRules"
            v-if="currentStepKey === 'build-python'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="编译命令" prop="build_arg">
              <el-input
                clearable
                v-model="currentStepObject.params.build_arg"
                type="textarea"
                rows="5"
                @change="buildTypeArg_Change"
              ></el-input>
            </el-form-item>
            <el-form-item label="代码目录">
              <el-input
                clearable
                v-model="currentStepObject.params.coode_root_path"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="自动创建Dockerfile">
              <el-switch
                v-model="currentStepObject.params.enable_dockerfile"
              ></el-switch>
            </el-form-item>
  
            <el-form-item
              label="Dockerfile地址"
              v-if="!currentStepObject.params.enable_dockerfile"
            >
              <el-input v-model="currentStepObject.params.dockerfile_path" />
            </el-form-item>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">每日构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="每日构建提供定时调度构建服务"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_every_build"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_every_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="定时构建时间">
                <el-input
                  clearable
                  v-model="currentStepObject.params.every_build_time"
                  readonly
                >
                  <el-button
                    @click="showCronDialog"
                    slot="append"
                    icon="el-icon-date"
                  ></el-button>
                </el-input>
              </el-form-item>
  
              <el-form-item label="定时构建分支/Tag" prop="branch">
                <el-cascader
                  v-model="currentStepObject.params.every_build_branch"
                  filterable
                  :options="branchTagOptions"
                  @focus="handleChangeTagBranch"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-card>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">GitLab WebHook触发构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="打开开关后请前往Gitlab->Settings->Webhooks进行配置"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_webhooks_build"
                @change="buildTypeEnable_Change"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_webhooks_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="触发Url">
                <el-input
                  autosize
                  clearable
                  type="textarea"
                  disabled
                  v-model="gitLabWebHookUrl"
                ></el-input>
              </el-form-item>
  
              <el-form-item label="支持触发类型">
                <el-checkbox-group v-model="currentStepObject.params.touch_types">
                  <el-checkbox label="pushEvent" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
  
              <el-form-item label="基础镜像" prop="build_base_image">
                <el-select
                  placeholder="请选择基础镜像"
                  style="width: 100%"
                  v-model="currentStepObject.params.build_base_image"
                  @change="buildTypeImage_Change"
                >
                  <el-option
                    v-for="item in baseInmageOptions"
                    v-bind:key="item.image"
                    :label="item.image"
                    :value="item.image"
                  ></el-option>
                </el-select>
              </el-form-item>
  
              <el-form-item label="产物路径" prop="build_result_path">
                <el-input
                  clearable
                  type="textarea"
                  v-model="currentStepObject.params.build_result_path"
                  placeholder="请输入内容"
                  @change="buildTypeInput_Change"
                ></el-input>
              </el-form-item>
            </el-card>
          </el-form>
  
          <!-- golang构建 -->
          <el-form
            :model="currentStepObject"
            ref="buildTypeRef"
            :rules="buildTypeRules"
            v-if="currentStepKey === 'build-golang'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="编译命令" prop="build_arg">
              <el-input
                clearable
                v-model="currentStepObject.params.build_arg"
                type="textarea"
                rows="5"
                @change="buildTypeArg_Change"
              ></el-input>
            </el-form-item>
            <el-form-item label="代码目录">
              <el-input
                clearable
                v-model="currentStepObject.params.coode_root_path"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="自动创建Dockerfile">
              <el-switch
                v-model="currentStepObject.params.enable_dockerfile"
              ></el-switch>
            </el-form-item>
  
            <el-form-item
              label="Dockerfile地址"
              v-if="!currentStepObject.params.enable_dockerfile"
            >
              <el-input v-model="currentStepObject.params.dockerfile_path" />
            </el-form-item>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">每日构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="每日构建提供定时调度构建服务"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_every_build"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_every_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="定时构建时间">
                <el-input
                  clearable
                  v-model="currentStepObject.params.every_build_time"
                  readonly
                >
                  <el-button
                    @click="showCronDialog"
                    slot="append"
                    icon="el-icon-date"
                  ></el-button>
                </el-input>
              </el-form-item>
  
              <el-form-item label="定时构建分支/Tag" prop="branch">
                <el-cascader
                  v-model="currentStepObject.params.every_build_branch"
                  filterable
                  :options="branchTagOptions"
                  @focus="handleChangeTagBranch"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-card>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">GitLab WebHook触发构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="打开开关后请前往Gitlab->Settings->Webhooks进行配置"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_webhooks_build"
                @change="buildTypeEnable_Change"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_webhooks_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="触发Url">
                <el-input
                  autosize
                  clearable
                  type="textarea"
                  disabled
                  v-model="gitLabWebHookUrl"
                ></el-input>
              </el-form-item>
  
              <el-form-item label="支持触发类型">
                <el-checkbox-group v-model="currentStepObject.params.touch_types">
                  <el-checkbox label="pushEvent" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
  
              <el-form-item label="基础镜像" prop="build_base_image">
                <el-select
                  placeholder="请选择基础镜像"
                  style="width: 100%"
                  v-model="currentStepObject.params.build_base_image"
                  @change="buildTypeImage_Change"
                >
                  <el-option
                    v-for="item in baseInmageOptions"
                    v-bind:key="item.image"
                    :label="item.image"
                    :value="item.image"
                  ></el-option>
                </el-select>
              </el-form-item>
  
              <el-form-item label="产物路径" prop="build_result_path">
                <el-input
                  clearable
                  type="textarea"
                  v-model="currentStepObject.params.build_result_path"
                  placeholder="请输入内容"
                  @change="buildTypeInput_Change"
                ></el-input>
              </el-form-item>
            </el-card>
          </el-form>
  
          <!-- nodejs构建 -->
          <el-form
            :model="currentStepObject"
            ref="buildTypeRef"
            :rules="buildTypeRules"
            v-if="currentStepKey === 'build-nodejs'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-form-item label="编译环境">
              <el-radio-group
                v-model="currentStepObject.params.build_result_type"
              >
                <el-radio label="前端"></el-radio>
                <el-radio label="后端"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="编译命令" prop="build_arg">
              <el-input
                clearable
                v-model="currentStepObject.params.build_arg"
                type="textarea"
                rows="5"
                @change="buildTypeArg_Change"
              ></el-input>
            </el-form-item>
            <el-form-item label="代码目录">
              <el-input
                clearable
                v-model="currentStepObject.params.coode_root_path"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="自动创建Dockerfile">
              <el-switch
                v-model="currentStepObject.params.enable_dockerfile"
              ></el-switch>
            </el-form-item>
            <el-form-item
              label="Dockerfile地址"
              v-show="!currentStepObject.params.enable_dockerfile"
            >
              <el-input v-model="currentStepObject.params.dockerfile_path" />
            </el-form-item>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">每日构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="每日构建提供定时调度构建服务"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_every_build"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_every_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="定时构建时间">
                <el-input
                  clearable
                  v-model="currentStepObject.params.every_build_time"
                  readonly
                >
                  <el-button
                    @click="showCronDialog"
                    slot="append"
                    icon="el-icon-date"
                  ></el-button>
                </el-input>
              </el-form-item>
  
              <el-form-item label="定时构建分支/Tag" prop="branch">
                <el-cascader
                  v-model="currentStepObject.params.every_build_branch"
                  filterable
                  :options="branchTagOptions"
                  @focus="handleChangeTagBranch"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-card>
  
            <el-form-item>
              <template slot="label">
                <span style="color: black">GitLab WebHook触发构建</span>
                <el-link :underline="false">
                  <el-tooltip
                    content="打开开关后请前往Gitlab->Settings->Webhooks进行配置"
                    placement="right"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-link>
              </template>
              <el-switch
                v-model="currentStepObject.params.enable_webhooks_build"
                @change="buildTypeEnable_Change"
              ></el-switch>
            </el-form-item>
  
            <el-card
              class="box-card"
              v-if="currentStepObject.params.enable_webhooks_build"
            >
              <div slot="header" class="clearfix">
                <i class="el-icon-time"></i><span> &nbsp;配置参数</span>
              </div>
  
              <el-form-item label="触发Url">
                <el-input
                  autosize
                  clearable
                  type="textarea"
                  disabled
                  v-model="gitLabWebHookUrl"
                ></el-input>
              </el-form-item>
  
              <el-form-item label="支持触发类型">
                <el-checkbox-group v-model="currentStepObject.params.touch_types">
                  <el-checkbox label="pushEvent" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
  
              <el-form-item label="基础镜像" prop="build_base_image">
                <el-select
                  placeholder="请选择基础镜像"
                  style="width: 100%"
                  v-model="currentStepObject.params.build_base_image"
                  @change="buildTypeImage_Change"
                >
                  <el-option
                    v-for="item in baseInmageOptions"
                    v-bind:key="item.image"
                    :label="item.image"
                    :value="item.image"
                  ></el-option>
                </el-select>
              </el-form-item>
  
              <el-form-item label="产物路径" prop="build_result_path">
                <el-input
                  clearable
                  type="textarea"
                  v-model="currentStepObject.params.build_result_path"
                  placeholder="请输入内容"
                  @change="buildTypeInput_Change"
                ></el-input>
              </el-form-item>
            </el-card>
          </el-form>
  
          <!-- sonar扫描 -->
          <el-form
            :model="currentStepObject"
            v-if="currentStepKey === 'extra-sonar'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-empty
              :image-size="200"
              description="当前任务无需配置额外参数"
            ></el-empty>
          </el-form>
  
          <!-- 安全扫描扫描 -->
          <el-form
            :model="currentStepObject"
            v-if="currentStepKey === 'extra-scanner'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-empty
              :image-size="200"
              description="当前任务无需配置额外参数"
            ></el-empty>
          </el-form>
  
          <!-- k8s部署-->
          <el-form
            :model="currentStepObject"
            :inline="true"
            label-position="right"
            v-if="currentStepKey === 'deploy-k8s'"
            label-width="120px"
            class="update_form"
          >
            <el-form-item>
              <span slot="label">
                自定义镜像<el-tooltip
                  content="如希望使用前置步骤构建的镜像，此输入项请留空"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input
                style="width: 400px"
                placeholder="请输入自定义镜像名"
                clearable
                v-model="currentStepObject.params.custom_image"
                type="text"
              ></el-input>
            </el-form-item>
            <el-form-item label="部署环境">
              <el-select
                v-model="currentStepObject.params.env"
                style="width: 400px"
                placeholder="请选择发布环境"
                clearable
                @change="selectEnv"
              >
                <el-option
                  v-for="item in envDatas"
                  :key="item.env"
                  :label="item.env"
                  :value="item.env"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="命名空间">
              <el-select
                placeholder="请选择"
                style="width: 400px"
                v-model="currentStepObject.params.namespace"
              >
                <el-option
                  v-for="item in deploy_namespace"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
  
            <el-form-item label="实例规格">
              <el-select
                placeholder="请选择部署实例规格"
                style="width: 400px"
                clearable
                v-model="currentStepObject.params.instance_cores"
              >
                <el-option label="1cpu-2G" :value="1"></el-option>
                <el-option label="2cpu-4G" :value="2"></el-option>
              </el-select>
            </el-form-item>
  
            <el-form-item label="实例数量">
              <el-input
                placeholder="请输入实例数量"
                style="width: 400px"
                clearable
                v-model.number="currentStepObject.params.instance_num"
                type="number"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="服务标签">
              <el-button size="mini" plain>default</el-button>
            </el-form-item>
            <el-divider content-position="left">
              <span>
                <a href="#">
                  <div
                    class="btn-box flex flex-align-items-center"
                    @click="addDomain"
                  >
                    <i class="el-icon-circle-plus-outline"></i>
                    &nbsp;新增域名
                  </div>
                </a>
                <a href="#">
                  <div
                    class="btn-box flex flex-align-items-center"
                    style="color: red"
                    @click="removeDomain"
                  >
                    <i class="el-icon-delete"></i>
                    &nbsp;删除域名
                  </div>
                </a>
              </span>
            </el-divider>
            <div
              class="box-wrap"
              v-for="(item, index) in currentStepObject.params.portArr"
              :key="index"
            >
              <el-form-item label="容器端口" class="item-label">
                <el-input
                  placeholder="请输入容器端口"
                  style="width: 400px"
                  clearable
                  v-model.number="item.port"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="服务域名" class="item-label">
                <el-input
                  style="width: 400px"
                  v-model="item.ingress"
                  placeholder="请输入服务域名"
                  clearable
                ></el-input>
              </el-form-item>
              <el-divider></el-divider>
            </div>
          </el-form>
          <!-- 虚机部署 -->
          <el-form
            :model="currentStepObject"
            v-if="currentStepKey === 'deploy-virturl-mashine'"
            label-width="90px"
            label-position="top"
            class="update_form"
          >
            <el-empty :image-size="200" description="开发中,敬请期待"></el-empty>
          </el-form>
  
          <!-- 自动化测试 -->
          <el-form
            ref="extraTesting"
            :model="currentStepObject.params"
            v-if="currentStepKey === 'extra-testing'"
            label-position="right"
            class="update_form extraTesting"
            :inline="true"
            :rules="testingRules"
          >
            <el-form-item label="测试类型" prop="taskType">
              <el-select
                v-model="currentStepObject.params.taskType"
                placeholder="请选择测试类型"
                @change="taskTypeChange"
              >
                <el-option label="接口自动化测试" value="1"></el-option>
                <el-option label="性能自动化测试" value="2"></el-option>
              </el-select>
            </el-form-item>
  
            <el-form-item label="项目名称" prop="projectID">
              <el-select
                v-model="currentStepObject.params.projectID"
                filterable
                placeholder="请选择项目名称"
                @change="projectChange"
              >
                <el-option
                  v-for="item in testingConfig.projects"
                  :key="item.projectID"
                  :label="item.projectName"
                  :value="item.projectID"
                >
                </el-option>
              </el-select>
            </el-form-item>
  
            <el-form-item label="任务名称" prop="taskId">
              <el-select
                v-model="currentStepObject.params.taskId"
                placeholder="请选择任务名称"
                filterable
                @change="taskIdChange"
              >
                <el-option
                  v-for="item in testingConfig.tasks"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
  
            <el-form-item label="启动延时" class="delayTime">
              <el-input-number
                size="small"
                min="1"
                max="10"
                v-model="currentStepObject.params.delayTime"
                @change="authTestingStartDelay_Change"
                :min="0"
                :max="10"
                label="以分钟为单位"
              ></el-input-number>
              &nbsp;分钟
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="saveCurrentStep">保存</el-button>
          <el-button @click="showUpdateStep = false">取消</el-button>
        </div>
      </el-drawer>
  
      <el-dialog title="生成 cron" :visible.sync="showCron">
        <vcrontab
          @hide="showCron = false"
          @fill="crontabFill"
          :expression="expression"
          :hideComponent="hideComponent"
        ></vcrontab>
      </el-dialog>
    </div>
  </template>
      
      <script>
  import { getEnvNameIndex } from "@/utils/pipeline.js";
  import { getUseLanguageName } from "@/utils/pipeline.js";
  export default {
    data() {
      return {
        gitLabWebHookUrl: window._env_.gitLabWebHook || "",
        hideComponent: ["second", "min"],
        expression: "",
        showCron: false,
        testingConfig: {
          projects: [],
          tasks: [],
        },
        buildTypeRules: {
          build_arg: [
            {
              required: false,
              message: "请输入编译命令",
              trigger: ["blur", "change"],
            },
          ],
          build_base_image: [
            {
              required: true,
              message: "请选择基础镜像",
              trigger: ["blur", "change"],
            },
          ],
          build_result_path: [
            {
              required: true,
              message: "请输入产物路径",
              trigger: ["change", "blur"],
            },
          ],
        },
        testingRules: {
          taskType: [
            {
              required: true,
              message: "请选择测试类型",
              trigger: ["change", "blur"],
            },
          ],
          projectID: [
            {
              required: true,
              message: "请选择项目名称",
              trigger: ["change", "blur"],
            },
          ],
          taskId: [
            {
              required: true,
              message: "请选择任务名称",
              trigger: ["change", "blur"],
            },
          ],
        },
        gitTagList: [],
        gitBranchList: [],
        deploy_namespace: [],
        currentPipelineId: undefined,
        tabName: "basicInfo",
        logSteps: [],
        currentStepIndex: 0,
        currentStepKey: "",
        currentStepObject: {},
        steps: [
          {
            title: "代码拉取",
            name: "代码克隆",
            stepRootKey: "code-clone",
            stepKey: "code-clone-gitlab",
            pipline_name: "clone-make-pipeline",
            params: {
              repositoryUrl: "",
              repoType: "",
            },
          },
        ],
        repoTypeOptions: [
          {
            label: "GitLab",
            value: 1,
          },
          {
            label: "Github",
            value: 2,
          },
          {
            label: "Gitee",
            value: 3,
          },
          {
            label: "Gogs",
            value: 4,
          },
          {
            label: "Svn",
            value: 5,
          },
          {
            label: "Codeup",
            value: 6,
          },
        ],
        codeSteps: {
          name: "代码拉取",
          stepKey: "code-clone",
          optionalSteps: [
            {
              name: "GitLab",
              desc: "Gitlab拉取代码",
              logo: require("@/assets/step_logo/gitlab.png"),
              key: "code-clone-gitlab",
              params: {
                repositoryUrl: "",
                repoType: "",
              },
            },
            {
              name: "Gogs",
              desc: "Gogs拉取代码",
              logo: require("@/assets/step_logo/gogs.png"),
              key: "code-clone-gogs",
              params: {
                repositoryUrl: "",
                repoType: "",
              },
            },
          ],
        },
        buildSteps: {
          name: "构建打包",
          stepKey: "build",
          optionalSteps: [
            {
              name: "Java构建",
              desc: "Java 构建打包",
              logo: require("@/assets/step_logo/java.png"),
              key: "build-java",
              pipline_name: "build-make-pipeline",
              params: {
                build_arg: "",
                coode_root_path: "",
                build_result_type: "jar",
                enable_every_build: false,
                enable_webhooks_build: false,
                touch_types: ["pushEvent"],
                build_base_image: "",
                build_result_path: "",
                every_build_time: "",
              },
            },
            {
              name: "NodeJs构建",
              desc: "NodeJs构建打包",
              logo: require("@/assets/step_logo/nodejs.png"),
              key: "build-nodejs",
              pipline_name: "build-make-pipeline",
              params: {
                build_arg: "",
                coode_root_path: "",
                build_result_type: "前端",
                enable_every_build: false,
                every_build_time: "",
                enable_dockerfile: true,
                dockerfile_path: "",
              },
            },
            {
              name: "Python构建",
              desc: "python构建打包",
              logo: require("@/assets/step_logo/python.png"),
              key: "build-python",
              pipline_name: "build-make-pipeline",
              params: {
                build_arg: "",
                coode_root_path: "",
                enable_every_build: false,
                every_build_time: "",
                enable_dockerfile: false,
                dockerfile_path: "",
                enable_webhooks_build: false,
                touch_types: ["pushEvent"],
                build_base_image: "",
                build_result_path: "",
              },
            },
            {
              name: "Golang构建",
              desc: "Golang构建打包",
              logo: require("@/assets/step_logo/go.png"),
              // key: "build-go",
              key: "build-golang",
              pipline_name: "build-make-pipeline",
              params: {
                build_arg: "",
                coode_root_path: "",
                enable_every_build: false,
                every_build_time: "",
                enable_dockerfile: false,
                dockerfile_path: "",
                enable_webhooks_build: false,
                touch_types: ["pushEvent"],
                build_base_image: "",
                build_result_path: "",
              },
            },
          ],
        },
        imageSteps: {
          name: "镜像生成",
          stepKey: "upload",
          optionalSteps: [
            {
              name: "上传制品库",
              desc: "推送制品到Habor",
              logo: require("@/assets/step_logo/habor.png"),
              key: "upload-habor",
              pipline_name: "upload-image-make-pipeline",
              params: {
                build_result_path: "",
                build_base_image: "",
                language: "",
              },
            },
          ],
        },
        deploySteps: {
          name: "部署发布",
          stepKey: "deploy",
          optionalSteps: [
            {
              name: "虚机发布",
              desc: "虚机部署发布",
              logo: require("@/assets/design-pipeline/virtue.png"),
              key: "deploy-virturl-mashine",
              pipline_name: "",
              params: {},
            },
            {
              name: "k8s发布",
              desc: "kubernetes部署发布",
              logo: require("@/assets/design-pipeline/k8s.png"),
              key: "deploy-k8s",
              pipline_name: "",
              params: {
                portArr: [],
                namespace: "",
              },
            },
          ],
        },
        extraWork: {
          name: "集成测试",
          stepKey: "extra",
          optionalSteps: [
            {
              name: "Sonar扫描",
              desc: "集成代码质量测试",
              logo: require("@/assets/design-pipeline/icon-a-sonar.png"),
              key: "extra-sonar",
              pipline_name: "scan-make-pipeline",
              params: {},
            },
            {
              name: "安全扫描",
              desc: "集成代码安全管控测试",
              logo: require("@/assets/design-pipeline/code-scanner.png"),
              key: "extra-scanner",
              pipline_name: "Java",
              params: {
                url: "https://dev.mi.com/console",
              },
            },
            {
              name: "自动化测试",
              desc: "集成自动化测试工具平台",
              logo: require("@/assets/design-pipeline/biz-test-o.png"),
              key: "extra-testing",
              pipline_name: "testing",
              params: {
                delayTime: null,
                appId: this.appId,
                projectID: null,
                taskId: null,
                taskType: null,
                tenantId: localStorage.getItem("originTenantId"),
              },
            },
          ],
        },
        showCreateStep: false,
        showUpdateStep: false,
        //所用语言下拉
        useLanguageOptions: [
          {
            label: "Java",
            value: 1,
          },
          {
            label: "Python",
            value: 2,
          },
          {
            label: "Go",
            value: 3,
          },
          {
            label: "Nodejs",
            value: 4,
          },
        ],
        branchTagOptions: [
          {
            label: "分支",
            value: "branch",
            children: [],
          },
          {
            label: "Tag",
            value: "tag",
            children: [],
          },
        ],
  
        form: {
          appInfo: {},
        },
        AppData: {},
        appId: null,
        appCode: null,
        useLanguage: null,
        baseInmageOptions: [],
        envDatas: [],
      };
    },
    mounted() {
      this.appId = this.common.getUrlKey("appId");
      this.appCode = this.common.getUrlKey("appCode");
      this.groupIdStr = this.common.getUrlKey("groupIdStr");
      this.useLanguage = this.common.getUrlKey("useLanguage");
      this.currentPipelineId = this.common.getUrlKey("pipline_uuid");
      this.imageSteps.optionalSteps[0].params.language = getUseLanguageName(
        parseInt(this.useLanguage)
      ).toLowerCase();
      this.loadApplicationInfo();
      if (this.currentPipelineId != undefined) {
        this.loadDesignedSteps();
      }
      this.LoadDeployEnv();
    },
    methods: {
      crontabFill(value) {
        this.currentStepObject.params.every_build_time = value;
      },
      showCronDialog() {
        this.showCron = true;
      },
      handleChangeTagBranch(e) {
        this.getGitBranchList();
      },
      /**
       * 获取分支tag
       */
      getGitBranchList() {
        if (
          this.AppData.gitRepoUrl.indexOf("http://") > -1 ||
          this.AppData.gitRepoUrl.indexOf("https://") > -1
        ) {
          console.log(this.AppData);
          if (this.AppData != null && this.AppData.repoType == 5) {
            this.axios({
              method: "GET",
              url:
                this.GLOBAL.baseUrl + "/pipeline-conf/branchs/svn/" + this.appId,
            })
              .then((response) => {
                if (response.status == 200) {
                  this.gitBranchList = response.data.data.branch || [];
                  this.gitTagList = response.data.data.tag;
                }
              })
              .catch((error) => {
                console.log("Error getSVNBranchList", error);
              });
          } else {
            this.axios({
              method: "GET",
              url: this.GLOBAL.baseUrl + "/pipeline-conf/branchs",
              params: {
                appId: this.appId,
              },
            })
              .then((response) => {
                if (response.status == 200) {
                  this.gitBranchList = response.data.data.branch || [];
                  this.gitTagList = response.data.data.tag;
                }
              })
              .catch((error) => {
                console.log("Error getGitBranchList", error);
              });
          }
        } else {
          this.axios({
            method: "GET",
            url: this.GLOBAL.pipeline_tag + "/pipelineConf/branch-list",
            params: {
              gitUrl: this.AppData.gitRepoUrl,
            },
          })
            .then((response) => {
              if (response.status == 200) {
                this.gitBranchList = response.data.branch;
                this.gitTagList = response.data.tag;
                console.log("aaaa");
              }
            })
            .catch((error) => {
              console.log("Error getGitBranchList", error);
            });
        }
      },
      buildBranchTagOptions() {
        this.branchTagOptions[0].children = [];
        this.branchTagOptions[1].children = [];
        for (var i = 0; i < this.gitBranchList.length; i++) {
          var branch = {
            label: this.gitBranchList[i],
            value: this.gitBranchList[i],
          };
          this.branchTagOptions[0].children.push(branch);
        }
        for (var i = 0; i < this.gitTagList.length; i++) {
          var tag = {
            label: this.gitTagList[i],
            value: this.gitTagList[i],
          };
          this.branchTagOptions[1].children.push(tag);
        }
        //兜底方案
        if (this.branchTagOptions[0].children.length == 0) {
          var branch = {
            label: "master",
            value: "master",
          };
          this.branchTagOptions[0].children.push(branch);
          console.log("cccc");
          console.log(this.branchTagOptions);
        }
      },
      selectEnv(env) {
        this.loadCurrentAppNamespace(env);
        this.currentStepObject.params.namespace = "";
        this.currentStepObject.params.kube_env = getEnvNameIndex(env);
        // this.currentStepObject.params.kube_env = 160 // 暂时写死
        // 获取chart_envs的值
        // 不改变原逻辑下，从数组中找出值 envDatas
        let envFlag = "";
        this.envDatas.forEach((item) => {
          if (item.env == env) {
            envFlag = item.key;
          }
        });
        this.axios({
          url:
            this.GLOBAL.baseUrl +
            "/appDeploy/env/variables/" +
            this.appId +
            "/" +
            1 +
            "/" +
            envFlag +
            "/default",
          method: "get",
        })
          .then((response) => {
            if (response.status == 200) {
              this.currentStepObject.chart_envs = response.data.data;
            }
          })
          .catch((error) => {});
      },
      //加载当前应用所有的namespace
      loadCurrentAppNamespace(env) {
        var requestUrl = `/cluster/teamns/${getEnvNameIndex(env)}/${this.appId}/`;
        this.axios({
          url: this.GLOBAL.baseUrl + requestUrl,
        })
          .then((res) => {
            let { code, data } = res.data;
            if (code === 200) {
              this.deploy_namespace = data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      //加载部署集群
      LoadDeployEnv() {
        this.envDatas = [];
        var that = this;
        this.axios({
          url: this.GLOBAL.baseUrl + "/env/get",
          method: "get",
        })
          .then((res) => {
            if (res.data.code === 200) {
              if (res.data.data != undefined || res.data.data != null) {
                res.data.data.forEach((envObject) => {
                  if ("PROD" != envObject.selectValue.toUpperCase()) {
                    that.envDatas.push({
                      env: envObject.selectValue.toUpperCase(),
                      key: envObject.selectKey,
                    });
                  }
                });
              }
            }
          })
          .then((error) => {
            console.log(error);
          });
      },
      loadDesignedSteps() {
        var that = this;
        const requestUrl =
          this.GLOBAL.baseUrl +
          "/pipeline-design/loadBuildStepsDetail/" +
          this.currentPipelineId;
        this.axios({
          url: requestUrl,
          method: "GET",
        })
          .then((response) => {
            const { code, data } = response.data;
            if (code === 200) {
              this.form = data.info;
              var detail = data.detail;
              this.steps = [];
              for (var i = 0; i < detail.length; i++) {
                var params = JSON.parse(detail[i].params);
                if (params.delayTime) {
                  params.delayTime = params.delayTime / 60 / 1000;
                }
                var step = {
                  title: detail[i].name,
                  name: detail[i].name,
                  pipline_name: detail[i].piplineName,
                  stepRootKey: detail[i].nameCode,
                  stepKey: detail[i].nameCode,
                  params: params,
                };
                this.steps.push(step);
              }
              //默认加载自定义流水线
              if (this.steps.length == 0) {
                this.steps = [
                  {
                    title: "代码拉取",
                    name: "代码克隆",
                    stepRootKey: "code-clone",
                    stepKey: "code-clone-gitlab",
                    pipline_name: "clone-make-pipeline",
                    params: {
                      repositoryUrl: "",
                      repoType: "",
                    },
                  },
                ];
              }
            } else {
              that.$message.error("加载pipline失败");
            }
          })
          .catch((err) => {
            this.$message.error("加载pipline失败");
            console.log(err);
          });
      },
      changeTemplateTab(e) {
        console.log(e);
        var that = this;
        if (e.name == "stepInfo") {
          if (this.currentPipelineId == undefined) {
            that
              .$confirm("请点击下一步保存后,再配置阶段任务设置", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                that.tabName = "basicInfo";
              })
              .catch((e) => {
                console.log(e);
              });
          }
        }
      },
      loadBaseImages() {
        this.axios({
          method: "get",
          url: this.GLOBAL.baseUrl + "/pipeline/base-image/all",
          params: {
            tenantId: localStorage.getItem("originTenantId"),
            type: this.AppData.useLanguage,
          },
        })
          .then((response) => {
            if ((response.code = 200)) {
              if (response.data.data != null) {
                this.baseInmageOptions = response.data.data;
              }
            } else {
              this.$message({
                type: "error",
                message: "获取基础镜像失败",
              });
            }
          })
          .catch((response) => {
            console.log("fail to get account config info", response);
          });
      },
      //加载应用信息
      loadApplicationInfo() {
        let AppDataUrl = this.GLOBAL.baseUrl + "/app/detail/" + this.appId;
        this.axios({
          url: AppDataUrl,
          method: "GET",
        })
          .then((response) => {
            const { code, data } = response.data;
            if (code == 200) {
              this.AppData = data;
              this.steps[0].params.repositoryUrl = data.gitRepoUrl;
              this.steps[0].params.repoType = data.repoType;
              this.loadBaseImages();
              this.getGitBranchList();
            } else {
              this.$message.error("应用信息加载失败");
            }
          })
          .catch((err) => {
            this.$message.error("应用信息加载失败");
            console.log(err);
          });
      },
      nextStep() {
        var that = this;
        this.tabName = "stepInfo";
        if (this.form.name == "" || this.form.name == undefined) {
          this.$message.error("流水线名称未设置");
          this.tabName = "basicInfo";
          return;
        }
        if (
          this.form.piplineLanguage == "" ||
          this.form.piplineLanguage == undefined
        ) {
          this.$message.error("编程语言未设置");
          this.tabName = "basicInfo";
          return;
        }
        this.axios({
          method: "post",
          url:
            that.GLOBAL.baseUrl +
            "/pipeline-design/savePipeline/" +
            that.appId +
            "/" +
            that.appCode,
          data: that.form,
        })
          .then((res) => {
            if (res.data.code == 200) {
              var pipelineData = res.data.data;
              that.currentPipelineId = pipelineData.piplineUuid;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      clodeCreatePanel() {
        this.showCreateStep = false;
      },
  
      closeUpdate() {
        this.showUpdateStep = false;
      },
      saveBuildProcess() {
        if (
          this.currentPipelineId == undefined ||
          this.currentPipelineId == "" ||
          this.currentPipelineId == null
        ) {
          this.$message({
            message: "数据错误,请刷新后重试",
            type: "warning",
          });
          return;
        }
        var that = this;
        var postParameters = [];
        this.steps.forEach((step) => {
          if (step.name == "自动化测试") {
            if (!step.params.delayTime) {
              step.params.delayTime = 0;
            } else if (step.params.delayTime > 0) {
              step.params.delayTime = step.params.delayTime * 60 * 1000;
            }
          }
          if (step.name == "k8s发布") {
            step.params.chart_envs = this.currentStepObject.chart_envs;
            step.params.language = this.form.piplineLanguage;
          }
          var newStep = {
            title: step.title,
            name: step.name,
            stepRootKey: step.stepRootKey,
            stepKey: step.stepKey,
            params: step.params,
            jenkinsPipeline: step.pipline_name,
          };
          newStep.params = JSON.stringify(newStep.params);
          newStep.appId = this.common.getUrlKey("appId");
          postParameters.push(newStep);
        });
        this.axios({
          method: "POST",
          url:
            that.GLOBAL.baseUrl +
            "/pipeline-design/savePipelineStep/" +
            that.currentPipelineId,
          data: postParameters,
        })
          .then((res) => {
            if (res.data.code == 200) {
              that
                .$confirm("构建编排成功，即将离开当前页面，请确认", "提示", {
                  confirmButtonText: "离开",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  that.$router.push({
                    path: "/cicd/app/pipline-config",
                    query: {
                      appId: that.appId,
                      appCode: that.appCode,
                      groupIdStr: that.groupIdStr,
                      useLanguage: that.useLanguage,
                    },
                  });
                })
                .catch((e) => {
                  this.loadDesignedSteps();
                  this.loadApplicationInfo();
                  this.LoadDeployEnv();
                  console.log(e);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
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
        if (this.currentStepKey.indexOf("build") > -1) {
          this.buildBranchTagOptions();
        }
        // 自动化测试配置
        if (step.title == "自动化测试" || step.title == "集成测试") {
          // 获取接口数据项目数据
          this.getAllProjectIds();
        }
  
        // Java构建
        if (step.pipline_name == "build-make-pipeline") {
          step.params.touch_types = ["pushEvent"];
          // 把校验去除
          this.buildTypeEnable_Change(step.params.enable_webhooks_build);
          this.buildTypeInput_Change(step.params.build_result_path);
          this.buildTypeImage_Change(step.params.build_base_image);
          this.buildTypeArg_Change(step.params.build_arg);
        }
      },
      // 获取所有项目
      getAllProjectIds() {
        this.axios({
          method: "get",
          url: this.GLOBAL.baseUrl + "/pipeline-design/getAllProj",
        }).then((res) => {
          if (res.status == 200) {
            this.testingConfig.projects = res.data.data;
            if (
              this.currentStepObject.params.projectID &&
              this.currentStepObject.params.taskType
            ) {
              this.echoProjectId(
                this.currentStepObject.params.projectID,
                this.currentStepObject.params.taskType
              );
            } else {
              this.projectChange();
            }
          }
        });
      },
      echoProjectId(pid, tid) {
        this.currentStepObject.params.projectID = pid;
        this.getTestingTask(pid, tid);
      },
      // dom change
      projectChange(v) {
        if (v === undefined) return;
  
        this.currentStepObject.params.projectID = v;
        if (this.currentStepObject.params.taskId) {
          this.testingConfig.tasks = [];
          this.currentStepObject.params.taskId = "";
        }
        this.getTestingTask();
      },
      getTestingTask(pid, tid) {
        this.axios({
          method: "get",
          url: `${this.GLOBAL.baseUrl}/pipeline-design/getTestingTask/${this.currentStepObject.params.taskType}/${this.currentStepObject.params.projectID}`,
        }).then((res) => {
          if (res.status == 200) {
            this.testingConfig.tasks = res.data.data;
            if (tid && pid) {
              this.taskIdChange(this.currentStepObject.params.taskId);
            }
          }
        });
      },
      taskIdChange(v) {
        this.currentStepObject.params.taskId = v;
      },
  
      // 测试类型
      taskTypeChange(v) {
        return;
        this.currentStepObject.params.taskType = v;
        if (this.currentStepObject.params.taskId) {
          this.testingConfig.tasks = [];
          this.currentStepObject.params.taskId = "";
        }
        this.getAllProjectIds();
      },
  
      // 启动延时
      authTestingStartDelay_Change(val) {},
  
      AddStep(step, stepDetail) {
        if (step.key == "deploy-virturl-mashine" || step.key == "extra-scanner") {
          this.$message({
            type: "info",
            message: "暂不支持当前步骤的构建编排",
          });
          return;
        }
        if (this.steps.filter((u) => u.stepKey == step.key).length > 0) {
          this.$message({
            type: "info",
            message: "当前步骤已经编排请不要重复编排",
          });
          return;
        }
        this.showCreateStep = false;
        this.steps.push({
          title: stepDetail.name,
          name: step.name,
          pipline_name: step.pipline_name,
          stepRootKey: stepDetail.stepKey,
          stepKey: step.key,
          params: step.params,
        });
      },
      updateStep() {
        this.showUpdateStep = true;
      },
      crateNewStep() {
        this.showCreateStep = true;
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
      closeUpdateDrawer() {
        console.log(this.currentStepObject);
      },
      /* java构建 rules 校验 trigger 事件消失，手动设置false */
      buildTypeEnable_Change(val) {
        if (val) {
          if (this.currentStepObject.params.build_arg) {
            this.buildTypeRules.build_arg[0].required = false;
          } else {
            this.buildTypeRules.build_arg[0].required = true;
          }
        } else {
          this.buildTypeRules.build_arg[0].required = false;
        }
      },
      buildTypeInput_Change(val) {
        if (val) {
          this.buildTypeRules.build_result_path[0].required = false;
        } else {
          this.buildTypeRules.build_result_path[0].required = true;
        }
      },
      buildTypeImage_Change(val) {
        if (val) {
          this.buildTypeRules.build_base_image[0].required = false;
        } else {
          this.buildTypeRules.build_base_image[0].required = true;
        }
      },
      buildTypeArg_Change(val) {
        if (val) {
          this.buildTypeRules.build_arg[0].required = false;
        } else {
          if (this.currentStepObject.params.enable_webhooks_build) {
            this.buildTypeRules.build_arg[0].required = true;
          } else {
            this.buildTypeRules.build_arg[0].required = false;
          }
        }
      },
      /* rules 校验 trigger 事件消失，手动设置false end  */
  
      saveCurrentStep() {
        // 校验
        if (this.currentStepKey === "extra-testing") {
          this.$refs["extraTesting"].validate((valid) => {
            if (valid) {
              this.showUpdateStep = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
            } else {
              return;
            }
          });
        } else if (
          this.currentStepKey === "build-java" ||
          this.currentStepKey === "build-python" ||
          this.currentStepKey === "build-golang" ||
          this.currentStepKey === "build-nodejs"
        ) {
          // delete this.currentStepObject.delayTime
          // java 构建需要增加校验
          this.$refs["buildTypeRef"].validate((valid) => {
            if (valid) {
              this.showUpdateStep = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "必填项不能为空，请填写",
              });
              return;
            }
          });
        } else {
          this.showUpdateStep = false;
          this.$message({
            type: "success",
            message: "保存成功",
          });
        }
      },
      removeDomain() {
        var that = this;
        if (this.currentStepObject.params.portArr.length > 0) {
          var temp = this.currentStepObject.params.portArr;
          this.$confirm("是否删除当前服务域名列表中最后一个？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              that.currentStepObject.params.portArr = [];
              for (var i = 0; i < temp.length - 1; i++) {
                that.currentStepObject.params.portArr.push(temp[i]);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      },
      addDomain() {
        if (this.currentStepObject.params.portArr == undefined) {
          this.$set(this.currentStepObject.params, "portArr", []);
        }
        this.currentStepObject.params.portArr.push({
          port: "",
          ingress: "",
        });
      },
      goBack() {
        this.$confirm(
          "请确认构建计划模板是否保存？如果已经保存请点击离开",
          "提示",
          {
            confirmButtonText: "离开",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$router.push({
              path: "/cicd/app/pipline-config",
              query: {
                appId: this.appId,
                appCode: this.appCode,
                groupIdStr: this.groupIdStr,
                useLanguage: this.useLanguage,
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
    },
  };
  </script>
      
      <style scoped>
  .box-wrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    padding-bottom: 0;
  }
  
  .line {
    width: 100%;
    height: 2px;
    border-top: 1px solid #ced4ce;
  }
  
  .build-work-place {
    line-height: 88rpx;
    font-size: 30rpx;
    display: flex;
    overflow-x: auto;
    width: 100%;
  }
  
  .build-work-place-item {
    flex-basis: 172rpx;
    flex-shrink: 0;
    width: 300px;
    white-space: nowrap;
    background-color: #ffffff;
    margin-left: 4px;
    height: 70vh;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 4px;
  }
  
  .build-work-place-header {
    font-size: 15px;
    margin-left: 12px;
    margin-top: 10px;
    color: #8c8c8c;
    font-weight: bold;
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
  
  .step-container {
    display: flex;
    flex-direction: row;
    justify-self: center;
    align-items: center;
  }
  
  .select-step-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 5px;
    width: 180px;
    height: 40px;
  }
  
  .select-step-container-top {
    font-size: 14px;
    color: #262626;
    margin-top: 6px;
  }
  
  .select-step-container-bottom {
    margin-top: 3px;
    font-size: 12px;
    color: #8c8c8c;
  }
  
  .select-step-logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    padding: 5px;
    margin-left: -10px;
    border: #e5e5e5 1px solid;
    border-radius: 2px;
  }
  
  .update_form {
    margin-left: 10px;
  }
  
  .update_form_item {
    width: 90%;
  }
  
  .tab_info {
    font-size: 14px;
    text-align: left;
    margin-bottom: 15px;
    color: #76808e;
    font-weight: 400;
    margin-top: 10px;
  }
  
  .main {
    height: calc(100% - 90px);
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
  }
  
  .drawer-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0px;
    padding: 10px;
    border-top: 1px solid #efefef;
  }
  
  .form-content {
    padding: 10px;
    overflow: auto;
    margin-bottom: 60px;
  }
  </style>
      
      <style lang="scss" scoped>
  .extraTesting {
    .delayTime {
      /deep/ .el-input__inner {
        text-align: center !important;
      }
    }
  }
  </style>
      