<template>
  <div class="main flex">
    <div class="left-panel flex-column">
      <div class="header flex-center-between">
        <div class="back-box flex flex-align-items-center" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          {{ appCode }}
        </div>
        <el-button
          type="primary"
          plain
          style=""
          @click="ShowNewVersion"
          size="small"
          id="new-version"
          >新建版本
        </el-button>
      </div>
      <div class="table-box">
        <el-table
          size="small"
          id="buildtable"
          :data="tableData"
          @current-change="ClickAppVersionRow"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @expand-change="expandSelect"
          highlight-current-row
          ref="singleTable"
          v-loading="loading"
          element-loading-text="数据加载中,请稍候..."
        >
          <el-table-column
            label="构建ID"
            align="center"
            prop="id"
            sortable
          ></el-table-column>
          <el-table-column
            label="Commit"
            align="center"
            prop="commit"
            sortable
          ></el-table-column>
          <el-table-column
            label="分支"
            align="center"
            prop="branch"
            sortable
          ></el-table-column>
          <el-table-column
            label="时间"
            sortable
            align="center"
            prop="createTime"
          ></el-table-column>

          <el-table-column
            label="构建状态"
            prop="status"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-circle-check"
                style="color: rgb(51, 203, 1)"
                v-if="scope.row.status == 'FINISHED'"
              ></i>

              <span
                v-if="
                  scope.row.status == 'RUNNING' || scope.row.status == 'READY'
                "
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击可停止构建"
                  placement="top"
                >
                  <el-button
                    @click="stopBuild"
                    size="mini"
                    type="danger"
                    plain
                    icon="el-icon-loading"
                    >终止</el-button
                  >
                </el-tooltip>
              </span>

              <i
                class="el-icon-warning"
                v-if="scope.row.status == 'ERROR'"
                style="color: red"
              ></i>
              <i
                class="el-icon-video-pause"
                v-if="scope.row.status == 'STOP'"
                style="color: red"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :small="false"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="GetAppVersionData()"
      ></pagination>
    </div>
    <div class="right-panel flex-column">
      <!-- 基本信息 -->
      <div class="box" id="appcode">
        <div class="row flex-center-between">
          <div class="title-box flex flex-align-items-center">
            <div class="bar"></div>
            基本信息
          </div>
          <div class="refresh-box flex flex-align-items-center">
            <i class="el-icon-refresh"></i>
            <span style="margin-right: 10px" @click="updateVersionStatus()"
              >刷新</span
            >
            <el-button
              type="primary"
              plain
              size="mini"
              @click="PackageDownload()"
              v-if="['js', 'java'].indexOf(cur_version.code_type) >= 0"
              :disabled="cur_version_status.makeResult !== 'SUCCESS'"
            >
              产物下载
            </el-button>
          </div>
        </div>
        <div
          style="margin: 10px"
          v-loading="build_data_loading"
          element-loading-text="数据加载中"
          element-loading-spinner="el-icon-loading"
        >
          <div class="item flex">
            <span class="label">创建时间: </span>
            <span class="text">{{ cur_version.createTime }}</span>
          </div>
          <div class="item flex">
            <span class="label">开发语言: </span>
            <span class="text">{{ pipeLineConfig.language }}</span>
          </div>
          <div class="item flex">
            <span class="label">Git地址: </span>
            <span class="text">{{ pipeLineConfig.gitlabAddress }}</span>
          </div>
          <div class="item flex">
            <span class="label">commitId: </span>
            <span class="text">{{ cur_version.commit }}</span>
          </div>
          <div class="item flex">
            <span class="label">分支: </span>
            <span class="text">{{ cur_version.branch }}</span>
          </div>
          <div class="item flex">
            <span class="label">产物路径: </span>
            <span class="text">{{ cur_version.package }}</span>
          </div>
          <div class="item flex">
            <span class="label">制品信息: </span>
            <span class="text">{{ cur_version.image }}</span>
          </div>
          <div class="item flex" v-if="tableData.length > 0">
            <span class="label">sonar扫描: </span>
            <span class="text">{{
              cur_version.sonar_scanner ? "是" : "否"
            }}</span>
          </div>
          <div class="item flex" v-if="cur_version.sec_scan">
            <span class="label">安全扫描: </span>
            <span class="text">
              <el-link type="primary" :underline="false" @click="GetSecScanData"
                >详细</el-link
              >
            </span>
          </div>
          <div class="item flex">
            <span class="label">创建结果</span>
            <span class="text">
              <el-tag
                type="success"
                size="mini"
                v-if="
                  cur_version_status.version__finish &&
                  cur_version_status.makeResult === 'SUCCESS'
                "
                >{{ cur_version_status.makeResult }}</el-tag
              >
              <el-tag
                type="danger"
                size="mini"
                v-else-if="
                  cur_version_status.version__finish &&
                  cur_version_status.makeResult &&
                  cur_version_status.makeResult !== 'SUCCESS'
                "
                >{{ cur_version_status.makeResult }}</el-tag
              >
              <span
                v-else-if="
                  cur_version_status.version__finish &&
                  !cur_version_status.makeResult
                "
              ></span>
              <el-icon class="el-icon-loading" v-else></el-icon>
            </span>
          </div>
        </div>
      </div>

      <!-- 版本状态/发布步骤-->
      <div class="box" style="margin-bottom: 0">
        <div class="row flex-center-between">
          <div class="title-box flex flex-align-items-center">
            <div class="bar"></div>
            版本状态/发布步骤
          </div>
          <div
            class="refresh-box flex flex-align-items-center"
            title="编译日志"
            @click="showLog(cur_version_status.log)"
          >
            <i class="el-icon-notebook-2"></i>
            <span style="margin-right: 10px">日志</span>
          </div>
        </div>
        <div class="step-box version-step-box">
          <el-steps
            space="33.33%"
            id="buildSteps"
            style="width: 100%"
            :active="active_steps"
            align-center
          >
            <el-step
              :title="code_title"
              :description="code_des"
              :icon="code_icon"
              :status="code_status"
            ></el-step>
            <el-step
              :title="build_title"
              :description="build_des"
              :icon="build_icon"
              :status="build_status"
            ></el-step>
            <el-step
              :title="docker_title"
              :description="docker_des"
              :icon="docker_icon"
              :status="docker_status"
            ></el-step>
          </el-steps>
        </div>
        <!--sonar扫描-->
        <div
          style="margin: 10px; height: 40px"
          v-if="cur_version.sonar_scanner"
        >
          <div style="width: 200px; float: left">
            <Steps>
              <Step
                title="Sonar扫描成功"
                status="finish"
                :content="
                  cur_version_status.sonar_result +
                  ' ' +
                  cur_version_status.sonar_duration / 1000 +
                  's'
                "
                v-if="
                  cur_version.sonar_scanner &&
                  cur_version_status.sonar_result === 'SUCCESS'
                "
              ></Step>
              <Step
                title="Sonar扫描失败"
                status="error"
                :content="
                  cur_version_status.sonar_result +
                  ' ' +
                  cur_version_status.sonar_duration / 1000 +
                  's'
                "
                v-else-if="
                  cur_version.sonar_scanner && cur_version_status.sonar_result
                "
              ></Step>
              <Step
                title="Sonar扫描中"
                status="process"
                icon="ivu-icon el-icon-loading"
                v-else-if="!cur_version_status.sonar_result"
              ></Step>
              <Step title="Sonar扫描" status="wait" v-else></Step>
            </Steps>
          </div>
          <i
            class="el-icon-s-check"
            style="
              float: right;
              margin-top: 10px;
              cursor: pointer;
              color: #1482f0;
            "
            title="sonar日志"
            @click="goToJenkinsSonarConsole"
            >日志</i
          >
          <img
            src="../../assets/img/sonar.svg"
            width="83"
            height="30"
            style="
              color: #303133;
              float: right;
              cursor: pointer;
              margin-right: 10px;
            "
            @click="goToSonar"
            title="跳转Sonar服务"
          />
        </div>

        <!--发布-->
        <div class="item" id="buildmodel">
          <div class="label" style="width: 90px">选择发布模式</div>
          <el-select
              v-model="deployment_model"
              placeholder="主机发布"
              style="width: 100%;margin-top:16px"
              clearable
            >
              <el-option label="K8s发布" value="1"></el-option>
              <el-option label="虚机发布-容器化" value="2"></el-option>
              <el-option label="虚机发布-非容器化" value="3"></el-option>
            </el-select>
            <el-select
              style="width: 100%; margin-top:10px"
              v-model="deployment_env"
              placeholder="请选择发布环境"
              clearable
              @change="envChange"
            >
              <el-option
                v-for="item in AppCiCdData"
                :key="item.env"
                :label="item.env"
                :value="item.env"
              >
              </el-option>
            </el-select>
            <el-button
              style="width: 100%; margin-top:10px"
              type="primary"
              @click="ShowDeployment(false)"
              :disabled="
                cur_version_status.makeResult !== 'SUCCESS' ||
                cur_version_status.version__finish === false ||
                !deployment_env
              "
            >
              <span
                v-if="
                  deployment_env == 'PROD' &&
                  imageAlreadyApproved == false &&
                  isCurrentTenantCheck === true
                "
                >申请发布</span
              >
              <span v-else>发布</span>
            </el-button>
        </div>
      </div>
    </div>

    <!-- log -->
    <el-dialog
      title="编译日志"
      :close-on-click-modal="true"
      @close="closeSocket"
      :visible.sync="dialogLog"
      top="10px"
      width="70%"
    >
      <div
        style="position: relative; bottom: 10px; overflow: auto; height: 70vh"
      >
        <pre
          style="
            white-space: pre-wrap;
            word-wrap: break-word;
            background: white;
            color: #333;
          "
          >{{ message }}</pre
        >
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="CloseDialogLog">关 闭</el-button>
      </span> -->
    </el-dialog>

    <!-- K8s部署弹窗 -->
    <el-dialog
      title="K8s发布"
      :close-on-click-modal="false"
      top="10px"
      :visible.sync="dialogDeployment"
      width="80%"
      style="top: 10px; bottom: 10px"
    >
      <el-dialog
        title="容器日志"
        :close-on-click-modal="true"
        @close="closeSocket"
        :visible.sync="k8sLog"
        top="80px"
        width="65%"
        append-to-body
        :before-close="docerlog"
      >
        <div class="message_plain" id="msg_end" style="margin-top: -20px">
          <pre
            style="
              white-space: pre-wrap;
              word-wrap: break-word;
              background: #333;
              color: #aaa;
            "
            >{{ k8sLogContent }}</pre
          >
        </div>
      </el-dialog>

      <el-collapse v-model="activeCollapseNames">
        <el-collapse-item name="0">
          <template slot="title">
            部署配置
            <span style="color: red">{{ config_title }}</span>
          </template>
          <el-card style="width: 100%">
            <el-tabs
              v-model="activeConfigNames"
              @tab-click="handleClickChangeConfig"
            >
              <el-tab-pane label="DEV" name="DEV">
                <el-form
                  ref="form"
                  :model="deploy_paramters"
                  label-width="90px"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="服务名">
                        <el-input
                          v-model="deploy_paramters.service_name"
                          style="width: 400px"
                        ></el-input>
                        <!--                        <el-select-->
                        <!--                                v-model="deploy_paramters.service_name"-->
                        <!--                                placeholder="请选择"-->
                        <!--                                @change="changeServiceName"-->
                        <!--                        >-->
                        <!--                          <el-option-->
                        <!--                                  v-for="item in deploy_serviceNames"-->
                        <!--                                  :key="item.id"-->
                        <!--                                  :label="item.appDeployK8s.serviceName"-->
                        <!--                                  :value="item.appDeployK8s.serviceName"-->
                        <!--                          >-->
                        <!--                          </el-option>-->
                        <!--                        </el-select>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="命名空间">
                        <el-select
                          v-model="deploy_paramters.namespace"
                          @change="changeNameSpace"
                          placeholder="请选择"
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
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例规格">
                        <el-select
                          v-model="deploy_paramters.instance_cores"
                          placeholder="请选择实例规格"
                          style="width: 400px"
                          @change="
                            deploy_paramters.instance_mem_gb =
                              deploy_paramters.instance_cores * 2
                          "
                        >
                          <el-option label="1cpu-2G" :value="1"></el-option>
                          <el-option label="2cpu-4G" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例数量">
                        <el-input
                          v-model="deploy_paramters.instance_num"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="12">-->
                    <!--                      <el-form-item label="颜色">-->
                    <!--                        <el-input-->
                    <!--                                placeholder="请输入颜色"-->
                    <!--                                v-model="deploy_paramters.color"-->
                    <!--                                style="width: 400px"-->
                    <!--                        ></el-input>-->
                    <!--                      </el-form-item>-->
                    <!--                    </el-col>-->
                  </el-row>

                  <el-divider content-position="left">
                    <el-link type="primary" :underline="false" @click="AddPort"
                      ><i class="el-icon-circle-plus-outline"
                        >增加端口</i
                      ></el-link
                    >
                    <el-link
                      type="danger"
                      :underline="false"
                      @click="DeletePort()"
                      ><i class="el-icon-delete">删除端口</i></el-link
                    >
                  </el-divider>
                  <el-row
                    v-for="item in this.deploy_paramters.ports"
                    :key="'key-' + item.key"
                  >
                    <el-col :span="12"
                      ><el-form-item label="容器端口">
                        <el-input
                          type="number"
                          @input="AddPortChange(item)"
                          v-model.number="item.port"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>

                    <el-col :span="12"
                      ><el-form-item label="ingress域名">
                        <el-input
                          v-model="item.ingressDomain"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>
                  </el-row>

<!--                  <el-divider content-position="left">-->
<!--                    <el-link type="primary" :underline="false" @click="AddEnv"-->
<!--                      ><i class="el-icon-circle-plus-outline"-->
<!--                        >增加变量</i-->
<!--                      ></el-link-->
<!--                    >-->
<!--                  </el-divider>-->
<!--                  <el-row-->
<!--                    v-for="item in this.deploy_paramters.envs"-->
<!--                    :key="'key-pro' + item.time + item.time"-->
<!--                  >-->
<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="key">-->
<!--                        <el-input-->
<!--                          v-model="item.key"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->

<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="value">-->
<!--                        <el-input-->
<!--                          v-model="item.value"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <el-link-->
<!--                        type="danger"-->
<!--                        :underline="false"-->
<!--                        style="margin-top: 8px"-->
<!--                        @click="DeleteEnv(item)"-->
<!--                        ><i class="el-icon-delete">删除</i></el-link-->
<!--                      >-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="FAT" name="FAT">
                <el-form ref="form" :model="form" label-width="90px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="服务名">
                        <el-input
                          v-model="deploy_paramters.service_name"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="命名空间">
                        <el-select
                          v-model="deploy_paramters.namespace"
                          placeholder="请选择"
                          @change="changeNameSpace"
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
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例规格">
                        <el-select
                          v-model="deploy_paramters.instance_cores"
                          placeholder="请选择实例规格"
                          style="width: 400px"
                          @change="
                            deploy_paramters.instance_mem_gb =
                              deploy_paramters.instance_cores * 2
                          "
                        >
                          <el-option label="1cpu-2G" :value="1"></el-option>
                          <el-option label="2cpu-4G" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例数量">
                        <el-input
                          v-model="deploy_paramters.instance_num"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">
                    <el-link type="primary" :underline="false" @click="AddPort"
                      ><i class="el-icon-circle-plus-outline"
                        >增加端口</i
                      ></el-link
                    >
                    <el-link
                      type="danger"
                      :underline="false"
                      @click="DeletePort()"
                      ><i class="el-icon-delete">删除端口</i></el-link
                    >
                  </el-divider>
                  <el-row
                    v-for="item in this.deploy_paramters.ports"
                    :key="'key-' + item.key"
                  >
                    <el-col :span="12"
                      ><el-form-item label="容器端口">
                        <el-input
                          type="number"
                          @input="AddPortChange(item)"
                          v-model.number="item.port"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>

                    <el-col :span="12"
                      ><el-form-item label="ingress域名">
                        <el-input
                          v-model="item.ingressDomain"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>
                  </el-row>

<!--                  <el-divider content-position="left">-->
<!--                    <el-link type="primary" :underline="false" @click="AddEnv"-->
<!--                      ><i class="el-icon-circle-plus-outline"-->
<!--                        >增加变量</i-->
<!--                      ></el-link-->
<!--                    >-->
<!--                  </el-divider>-->
<!--                  <el-row-->
<!--                    v-for="item in this.deploy_paramters.envs"-->
<!--                    :key="'key-pro' + item.time + item.time"-->
<!--                  >-->
<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="key">-->
<!--                        <el-input-->
<!--                          v-model="item.key"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->

<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="value">-->
<!--                        <el-input-->
<!--                          v-model="item.value"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <el-link-->
<!--                        type="danger"-->
<!--                        :underline="false"-->
<!--                        style="margin-top: 8px"-->
<!--                        @click="DeleteEnv(item)"-->
<!--                        ><i class="el-icon-delete">删除</i></el-link-->
<!--                      >-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="UAT" name="UAT">
                <el-form ref="form" :model="form" label-width="90px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="服务名">
                        <el-input
                          v-model="deploy_paramters.service_name"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="命名空间">
                        <el-select
                          v-model="deploy_paramters.namespace"
                          placeholder="请选择"
                          @change="changeNameSpace"
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
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例规格">
                        <el-select
                          v-model="deploy_paramters.instance_cores"
                          placeholder="请选择实例规格"
                          style="width: 400px"
                          @change="
                            deploy_paramters.instance_mem_gb =
                              deploy_paramters.instance_cores * 2
                          "
                        >
                          <el-option label="1cpu-2G" :value="1"></el-option>
                          <el-option label="2cpu-4G" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例数量">
                        <el-input
                          v-model="deploy_paramters.instance_num"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">
                    <el-link type="primary" :underline="false" @click="AddPort"
                      ><i class="el-icon-circle-plus-outline"
                        >增加端口</i
                      ></el-link
                    >
                    <el-link
                      type="danger"
                      :underline="false"
                      @click="DeletePort()"
                      ><i class="el-icon-delete">删除端口</i></el-link
                    >
                  </el-divider>
                  <el-row
                    v-for="item in this.deploy_paramters.ports"
                    :key="'key-' + item.key"
                  >
                    <el-col :span="12"
                      ><el-form-item label="容器端口">
                        <el-input
                          type="number"
                          @input="AddPortChange(item)"
                          v-model.number="item.port"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>

                    <el-col :span="12"
                      ><el-form-item label="ingress域名">
                        <el-input
                          required
                          v-model="item.ingressDomain"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>
                  </el-row>

<!--                  <el-divider content-position="left">-->
<!--                    <el-link type="primary" :underline="false" @click="AddEnv"-->
<!--                      ><i class="el-icon-circle-plus-outline"-->
<!--                        >增加变量</i-->
<!--                      ></el-link-->
<!--                    >-->
<!--                  </el-divider>-->

<!--                  <el-row-->
<!--                    v-for="item in this.deploy_paramters.envs"-->
<!--                    :key="'key-pro' + item.time + item.time"-->
<!--                  >-->
<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="key">-->
<!--                        <el-input-->
<!--                          v-model="item.key"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->

<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="value">-->
<!--                        <el-input-->
<!--                          v-model="item.value"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <el-link-->
<!--                        type="danger"-->
<!--                        :underline="false"-->
<!--                        style="margin-top: 8px"-->
<!--                        @click="DeleteEnv(item)"-->
<!--                        ><i class="el-icon-delete">删除</i></el-link-->
<!--                      >-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="PROD" name="PROD">
                <el-form ref="form" :model="form" label-width="90px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="服务名">
                        <el-input
                          v-model="deploy_paramters.service_name"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="命名空间">
                        <el-select
                          v-model="deploy_paramters.namespace"
                          placeholder="请选择"
                          @change="changeNameSpace"
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
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例规格">
                        <el-select
                          v-model="deploy_paramters.instance_cores"
                          placeholder="请选择实例规格"
                          style="width: 400px"
                          @change="
                            deploy_paramters.instance_mem_gb =
                              deploy_paramters.instance_cores * 2
                          "
                        >
                          <el-option label="1cpu-2G" :value="1"></el-option>
                          <el-option label="2cpu-4G" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实例数量">
                        <el-input
                          v-model="deploy_paramters.instance_num"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">
                    <el-link type="primary" :underline="false" @click="AddPort"
                      ><i class="el-icon-circle-plus-outline"
                        >增加端口</i
                      ></el-link
                    >
                    <el-link
                      type="danger"
                      :underline="false"
                      @click="DeletePort(item)"
                      ><i class="el-icon-delete">删除端口</i></el-link
                    >
                  </el-divider>
                  <el-row
                    v-for="item in this.deploy_paramters.ports"
                    :key="'key-' + item.key"
                  >
                    <el-col :span="12"
                      ><el-form-item label="容器端口">
                        <el-input
                          type="number"
                          @input="AddPortChange(item)"
                          v-model.number="item.port"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>

                    <el-col :span="12"
                      ><el-form-item label="ingress域名">
                        <el-input
                          required
                          v-model="item.ingressDomain"
                          style="width: 400px"
                        ></el-input> </el-form-item
                    ></el-col>
                  </el-row>

<!--                  <el-divider content-position="left">-->
<!--                    <el-link type="primary" :underline="false" @click="AddEnv"-->
<!--                      ><i class="el-icon-circle-plus-outline"-->
<!--                        >增加变量</i-->
<!--                      ></el-link-->
<!--                    >-->
<!--                  </el-divider>-->

<!--                  <el-row-->
<!--                    v-for="item in this.deploy_paramters.envs"-->
<!--                    :key="'key-pro' + item.time + item.time"-->
<!--                  >-->
<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="key">-->
<!--                        <el-input-->
<!--                          v-model="item.key"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->

<!--                    <el-col :span="11"-->
<!--                      ><el-form-item label="value">-->
<!--                        <el-input-->
<!--                          v-model="item.value"-->
<!--                          style="width: 400px"-->
<!--                        ></el-input> </el-form-item-->
<!--                    ></el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <el-link-->
<!--                        type="danger"-->
<!--                        :underline="false"-->
<!--                        style="margin-top: 8px"-->
<!--                        @click="DeleteEnv(item)"-->
<!--                        ><i class="el-icon-delete">删除</i></el-link-->
<!--                      >-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-collapse-item>
      </el-collapse>
      <el-card style="margin-top: 15px">
        <div slot="header" class="clearfix">
          <span>部署信息</span>
        </div>

        <div style="vertical-align: middle; clear: both">
          <div style="float: left; width: 6%; display: inline-block">
            过程状态
          </div>
          <div style="float: right; width: 94%; display: inline-block">
            <el-steps
              :active="deploy_state.active"
              :space="200"
              finish-status="success"
            >
              <el-step
                title="开始部署"
                :status="deploy_state.move_status"
                :icon="deploy_state.move_icon"
              ></el-step>
              <el-step
                title="部署中"
                :status="deploy_state.deploy_status"
                :icon="deploy_state.deploy_icon"
              ></el-step>
              <el-step
                title="部署完成"
                :status="deploy_state.merge_status"
                :icon="deploy_state.merge_icon"
              ></el-step>
            </el-steps>
          </div>
        </div>

        <el-table
          :data="deployeInfo"
          style="width: 100%; margin-top: 50px; margin-bottom: 20px"
        >
          <el-table-column prop="name" label="应用" width="180" align="center">
          </el-table-column>
          <el-table-column prop="env" label="环境" width="90" align="center">
          </el-table-column>
          <el-table-column
            prop="cur_run_image"
            label="当前运行镜像"
            align="center"
            min-width="50"
          >
            <template slot-scope="scope">
              <el-tag type="danger">
                {{ scope.row.cur_run_image }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="cur_select_image"
            label="当前选择的镜像"
            align="center"
            min-width="50"
          >
            <template slot-scope="scope">
              <el-tag type="success">
                {{ scope.row.cur_select_image }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="deploy_type"
            width="80"
            label="部署类型"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.deploy_type }}
              </el-tag>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="flex flex-justify-content-end">
          <el-button
            type="warning"
            size="mini"
            style="margin-bottom: 10px"
            icon="el-icon-s-promotion"
            @click="DeployOnce"
            v-if="last_deployment.finish && !click_once"
            :loading="deployment_loading"
            >立即部署</el-button
          >
        </div>
        
      </el-card>

      <el-divider> </el-divider>
      <el-card>
        <div slot="header" class="clearfix">
          <span>部署状态</span>
          <el-button
            style="float: right; padding: 3px 0"
            icon="el-icon-refresh"
            type="text"
            @click="LoadDeployedInfo"
            >刷新状态</el-button
          >
        </div>
        <el-table :data="deployedData" v-loading="deployedStatus">
          <el-table-column
            align="center"
            label="镜像版本"
            min-width="270"
            prop="pod_image"
          ></el-table-column>
          <el-table-column
            align="center"
            label="Pod名称"
            min-width="200"
            prop="pod_name"
          ></el-table-column>
          <el-table-column
            align="center"
            label="Pod IP"
            prop="pod_ip"
            width="115"
          ></el-table-column>
          <el-table-column align="center" label="运行状态" prop="run_status">
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.run_status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="部署环境"
            prop="env"
            width="80"
          ></el-table-column>
          <el-table-column align="center" label="操作" prop="env" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                icon="el-icon-notebook-2"
                @click="showK8sLog(scope.row)"
                >查看日志</el-button
              >
              <el-button
                size="mini"
                plain
                icon="el-icon-download"
                @click="downloadK8sLog(scope.row)"
                >下载日志</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 原来逻辑
        <el-container>
        <el-container
          style="height: 100%; border: solid 1px #e8e8e8; padding: 5px"
        >

          <el-main style="border: solid 0 red">
            <div
              style="
                border-top: 0 solid #e8e8e8;
                min-height: 150px;
                width: 100%;
                display: inline-block;
              "
            >
              <div
                style="
                  margin-top: 10px;
                  border-bottom: 0 solid #e8e8e8;
                  min-height: 50px;
                  width: 100%;
                  display: inline-block;
                "
              >
                <el-table
                  border
                  :data="[
                    {
                      appCode: appCode,
                      env: deployment_info.env,
                      runningVersion: '',
                      curVersion: deployment_version.app_version,
                      buildtype: app_cd_data['build_type'],
                      merge_status: merge_result.status,
                    },
                  ]"
                  size="small"
                >
                  <el-table-column label="应用" prop="appCode">
                    <template slot-scope="scope">
                      <el-link type="primary" :underline="false">{{
                        scope.row.appCode
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="环境"
                    prop="env"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-link type="warning" :underline="false">{{
                        scope.row.env
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="当前运行版本" prop="runningVersion">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in running_list" :key="index">
                        <el-tag
                          type="success"
                          size="small"
                          v-if="item.env === scope.row.env"
                          >{{ item.running_version }}</el-tag
                        >
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="当前选择的版本" prop="curVersion">
                    <template slot-scope="scope">
                      <el-tag type="primary" size="small">{{
                        scope.row.curVersion
                      }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="部署类型"
                    prop="buildtype"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-link type="default" :underline="false">{{
                        scope.row.buildtype
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="分支合并"
                    prop="merge_status"
                    width="100px"
                    align="center"
                    v-if="deployment_info.env === 'prod'"
                  >
                    <template slot-scope="scope">
                      <div
                        v-if="scope.row.merge_status === 'unchange'"
                        @click="ShowMergeMsg = true"
                      >
                        <el-link type="warning" :underline="false">{{
                          scope.row.merge_status
                        }}</el-link>
                      </div>
                      <div
                        v-else-if="scope.row.merge_status === 'success'"
                        @click="ShowMergeMsg = true"
                      >
                        <el-link type="success" :underline="false">{{
                          scope.row.merge_status
                        }}</el-link>
                      </div>
                      <div
                        v-else-if="
                          scope.row.merge_status &&
                          ['warning', 'success'].indexOf(
                            scope.row.merge_status
                          ) >= 0
                        "
                        @click="ShowMergeMsg = true"
                      >
                        <el-link type="success" :underline="false">{{
                          scope.row.merge_status
                        }}</el-link>
                      </div>
                      <div v-else @click="ShowMergeMsg = true">
                        <el-link type="danger" :underline="false">{{
                          scope.row.merge_status
                        }}</el-link>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div
                style="
                  text-align: right;
                  margin-top: 10px;
                  border-bottom: 1px solid #e8e8e8;
                  min-height: 50px;
                  width: 100%;
                  display: inline-block;
                "
                v-if="app_cd_data['build_type'] === 'host'"
              >
                <el-button
                  type="primary"
                  size="mini"
                  @click="show_host_config = true"
                  v-if="!show_host_deployment && last_deployment.finish"
                  >开始</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  @click="appHostDeployment('Master', 'host', true, '')"
                  v-if="show_host_deployment && last_deployment.finish"
                  :loading="deployment_loading"
                  >发布</el-button
                >
                <el-button
                  size="mini"
                  @click="show_host_deployment = false"
                  v-if="show_host_deployment && last_deployment.finish"
                  >取消</el-button
                >
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  style="margin-left: 5px"
                  v-if="!last_deployment.finish"
                  icon="el-icon-loading"
                  @click=""
                  >终止</el-button
                >
              </div>

              <div
                style="
                  margin-top: 10px;
                  border-bottom: 1px solid #e8e8e8;
                  min-height: 50px;
                  width: 100%;
                  display: inline-block;
                "
                v-if="app_cd_data['build_type'] === 'k8s'"
              >
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  style="float: right; margin-left: 5px"
                  v-if="!last_deployment.finish"
                  icon="el-icon-loading"
                  @click="stop_deploy($store.state.cicd.deployment_version_url)"
                  >终止</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  style="float: right"
                  @click="appKubeDeployment('Master', 'k8s', true, 'once')"
                  v-if="last_deployment.finish && click_once"
                  :loading="deployment_loading"
                  >部署常规版本</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  style="float: right"
                  @click="appKubeDeployment('Master', 'k8s', false, '')"
                  v-if="
                    !last_deployment.finish &&
                    dep_master.finish &&
                    dep_check.finish &&
                    !click_once
                  "
                  :loading="deployment_loading"
                  >部署常规版本</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  style="float: right"
                  @click="appKubeDeployment('Check', 'k8s', true, 'check')"
                  v-if="last_deployment.finish && !click_once"
                  :loading="deployment_loading"
                  >部署验证版本</el-button
                >
              </div>
            </div>
            <div v-if="app_cd_data['build_type'] === 'k8s'">
              <div
                style="vertical-align: middle; clear: both"
                v-if="deployment_mode !== 'once'"
              >
                <div style="float: left; width: 30%; display: inline-block">
                  验证版本状态
                </div>
                <div style="float: right; width: 60%; display: inline-block">
                  <Steps :current="dep_check.steps" size="small">
                    <Step title="移出"></Step>
                    <Step
                      title="部署"
                      status="error"
                      v-if="
                        !dep_check.deploy &&
                        last_deployment.finish &&
                        dep_check.steps === 1
                      "
                    ></Step>
                    <Step
                      title="部署"
                      status="process"
                      icon="ivu-icon el-icon-loading"
                      v-else-if="
                        !dep_check.deploy &&
                        !last_deployment.finish &&
                        dep_check.steps === 1
                      "
                    ></Step>
                    <Step
                      title="部署"
                      status="finish"
                      v-else-if="dep_check.deploy"
                    ></Step>
                    <Step title="部署" v-else></Step>
                    <Step
                      title="health"
                      status="error"
                      v-if="
                        !dep_check.health &&
                        last_deployment.finish &&
                        dep_check.steps === 2
                      "
                    ></Step>
                    <Step
                      title="health"
                      status="process"
                      icon="ivu-icon el-icon-loading"
                      v-else-if="
                        !dep_check.health &&
                        !last_deployment.finish &&
                        dep_check.steps === 2
                      "
                    ></Step>
                    <Step
                      title="health"
                      status="finish"
                      v-else-if="dep_check.health"
                    ></Step>
                    <Step title="health" v-else></Step>
                    <Step title="加入"></Step>
                  </Steps>
                </div>
              </div>

              <div
                style="vertical-align: middle; clear: both"
                v-if="deployment_mode === 'gray'"
              >
                <div style="float: left; width: 30%; display: inline-block">
                  灰度版本状态
                </div>
                <div style="float: right; width: 60%; display: inline-block">
                  <Steps :current="dep_master.steps" size="small">
                    <Step title="移出"></Step>
                    <Step title="部署"></Step>
                    <Step title="health"></Step>
                    <Step title="加入"></Step>
                  </Steps>
                </div>
              </div>

              <div style="vertical-align: middle; clear: both">
                <div style="float: left; width: 30%; display: inline-block">
                  常规版本状态
                </div>
                <div style="float: right; width: 60%; display: inline-block">
                  <Steps :current="dep_master.steps" size="small">
                    <Step title="移出"></Step>
                    <Step
                      title="部署"
                      status="error"
                      v-if="
                        !dep_master.deploy &&
                        last_deployment.finish &&
                        dep_master.steps === 1
                      "
                    ></Step>
                    <Step
                      title="部署"
                      status="process"
                      icon="ivu-icon el-icon-loading"
                      v-else-if="
                        !dep_master.deploy &&
                        !last_deployment.finish &&
                        dep_master.steps === 1
                      "
                    ></Step>
                    <Step
                      title="部署"
                      status="finish"
                      v-else-if="dep_master.deploy"
                    ></Step>
                    <Step title="部署" v-else></Step>
                    <Step
                      title="health"
                      status="error"
                      v-if="
                        !dep_master.health &&
                        last_deployment.finish &&
                        dep_master.steps === 2
                      "
                    ></Step>
                    <Step
                      title="health"
                      status="process"
                      icon="ivu-icon el-icon-loading"
                      v-else-if="
                        !dep_master.health &&
                        !last_deployment.finish &&
                        dep_master.steps === 2
                      "
                    ></Step>
                    <Step
                      title="health"
                      status="finish"
                      v-else-if="dep_master.health"
                    ></Step>
                    <Step title="health" v-else></Step>
                    <Step title="加入"></Step>
                  </Steps>
                </div>
              </div>
            </div>

            <div
              style="
                border-top: 0px solid #e8e8e8;
                min-height: 150px;
                width: 100%;
                display: inline-block;
              "
            >
              <el-tabs
                v-model="activeName"
                @tab-click=""
              >
                <el-tab-pane
                  label="主机信息"
                  name="containerInfo"
                  v-if="app_cd_data['build_type'] === 'host'"
                >
                </el-tab-pane>

                <el-tab-pane
                  label="容器信息"
                  name="containerInfo"
                  v-if="app_cd_data['build_type'] === 'k8s'"
                >
                  <div
                    style="
                      clear: both;
                      width: 100%;
                      line-height: 38px;
                      height: 40px;
                      background: #f5f6fa;
                      border: 1px solid #e1e6eb;
                      border-left: 4px solid #6d7781;
                      border-bottom: none;
                    "
                  >
                    <span
                      style="margin-left: 16px; font-size: 14px; color: #333333"
                      >无状态信息</span
                    >
                    <el-button
                      style="float: right; margin: 5px"
                      size="mini"
                      @click="GetKubeDeploymentPod()"
                      type="primary"
                      >刷新</el-button
                    >
                  </div>
                  <el-table
                    v-loading="kube_loading"
                    border
                    size="mini"
                    :data="KubeDeployTableData"
                  >
                    <el-table-column
                      label="name"
                      prop="name"
                      :show-overflow-tooltip="true"
                      width=""
                    ></el-table-column>
                    <el-table-column
                      label="容器组"
                      prop=""
                      align="center"
                      width="60"
                    >
                      <template slot-scope="scope">
                        <template
                          v-if="scope.row.replicas == scope.row.ready_replicas"
                        >
                          <span style="color: #33cb01"
                            >{{ scope.row.ready_replicas }}/{{
                              scope.row.replicas
                            }}</span
                          >
                        </template>
                        <template v-else>
                          <span style="color: red"
                            >{{ scope.row.ready_replicas }}/{{
                              scope.row.replicas
                            }}</span
                          >
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                      sortable
                      label="镜像"
                      prop=""
                      width=""
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div
                          v-for="(item, index) in scope.row.detail.spec.template
                            .spec.containers"
                          :key="index"
                        >
                          {{ item.image }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      sortable
                      label="命令空间"
                      prop="namespace"
                      width="200"
                    ></el-table-column>
                    <el-table-column
                      sortable
                      label="最新更新时间"
                      prop="lastUpdateTime"
                      align="center"
                      width="160"
                    ></el-table-column>
                  </el-table>

                  <div
                    style="
                      clear: both;
                      width: 100%;
                      line-height: 38px;
                      height: 40px;
                      background: #f5f6fa;
                      border: 1px solid #e1e6eb;
                      border-left: 4px solid #6d7781;
                      border-bottom: none;
                    "
                  >
                    <span
                      style="margin-left: 16px; font-size: 14px; color: #333333"
                      >容器组信息</span
                    >
                  </div>
                  <el-table
                    v-loading="kube_loading"
                    border
                    size="mini"
                    :data="KubePodTableData"
                  >
                    <el-table-column
                      label="name"
                      prop="name"
                      :show-overflow-tooltip="true"
                      width=""
                    ></el-table-column>
                    <el-table-column
                      label="Ready"
                      prop=""
                      align="center"
                      width="60"
                    >
                      <template slot-scope="scope">
                        <template
                          v-if="
                            scope.row.container_count == scope.row.container_run
                          "
                        >
                          <span
                            style="cursor: pointer; color: #33cb01"
                            @click="
                              GetTgtEvent(
                                $store.state.cicd.event_url,
                                scope.row
                              )
                            "
                            >{{ scope.row.container_run }}/{{
                              scope.row.container_count
                            }}</span
                          >
                        </template>
                        <template v-else>
                          <span
                            style="cursor: pointer; color: red"
                            @click="
                              GetTgtEvent(
                                $store.state.cicd.event_url,
                                scope.row
                              )
                            "
                            >{{ scope.row.container_run }}/{{
                              scope.row.container_count
                            }}</span
                          >
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="tag"
                      prop="tag"
                      :show-overflow-tooltip="true"
                      width=""
                    ></el-table-column>
                    <el-table-column
                      label="状态"
                      prop="state"
                      align="center"
                      width="80"
                    >
                      <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="right">
                          <div
                            slot="content"
                            v-html="statusInfo(scope.row.detail)"
                          ></div>
                          <div
                            v-if="
                              scope.row.detail.status.conditions.length === 4 &&
                              scope.row.detail.status.conditions[0][
                                'status'
                              ] === 'True' &&
                              scope.row.detail.status.conditions[1][
                                'status'
                              ] === 'True' &&
                              scope.row.detail.status.conditions[2][
                                'status'
                              ] === 'True' &&
                              scope.row.detail.status.conditions[3][
                                'status'
                              ] === 'True'
                            "
                          >
                            <span
                              style="
                                width: 16px;
                                height: 16px;
                                background-color: #33cb01;
                                display: inline-block;
                                border-radius: 50%;
                                vertical-align: middle;
                              "
                            ></span>
                            <span style="color: #33cb01">运行中</span>
                          </div>
                          <div
                            v-else-if="
                              scope.row.detail.status.conditions.length === 4 &&
                              scope.row.detail.status.conditions[0][
                                'status'
                              ] === 'False' &&
                              scope.row.detail.status.conditions[1][
                                'status'
                              ] === 'False' &&
                              scope.row.detail.status.conditions[2][
                                'status'
                              ] === 'False' &&
                              scope.row.detail.status.conditions[3][
                                'status'
                              ] === 'False'
                            "
                          >
                            <span
                              style="
                                width: 16px;
                                height: 16px;
                                background-color: red;
                                display: inline-block;
                                border-radius: 50%;
                                vertical-align: middle;
                              "
                            ></span>
                            <span style="color: red">失败</span>
                          </div>
                          <div v-else>
                            <span
                              style="
                                width: 16px;
                                height: 16px;
                                background-color: #fd9801;
                                display: inline-block;
                                border-radius: 50%;
                                vertical-align: middle;
                              "
                            ></span>
                            <span style="color: #fd9801">等待中</span>
                          </div>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="重启次数"
                      prop="restart_count"
                      align="center"
                      width="70"
                    ></el-table-column>
                    <el-table-column
                      label="Pod IP"
                      prop="pod_ip"
                    ></el-table-column>
                    <el-table-column
                      label="节点"
                      prop="host_ip"
                      width="120"
                    ></el-table-column>
                    <el-table-column
                      sortable
                      label="创建时间"
                      prop="start_time"
                      align="center"
                      width="140"
                    ></el-table-column>
                    <el-table-column label="操作" width="80" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="showContainerLog(scope.row)"
                          >日志</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>

                <el-tab-pane label="部署日志" name="deploymentLog">
                  <el-table size="small" :data="deployLogTable">
                    <el-table-column
                      label="角色"
                      prop="role"
                      width="100"
                    ></el-table-column>
                    <el-table-column label="log" prop="log"></el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="部署历史" name="deploymentHistory">
                  <div>
                    <el-table
                      size="small"
                      :data="deployTableData"
                      v-loading="dep_loading"
                      highlight-current-row
                      ref="singleHistoryTable"
                      @current-change="ClickRowDepHistory"
                    >
                      <el-table-column
                        label="分支"
                        prop="app_version__app_version"
                      ></el-table-column>
                      <el-table-column
                        label="耗时(s)"
                        prop="use_time"
                        width="100"
                      ></el-table-column>
                      <el-table-column
                        label="检测"
                        prop="ignoreverifyresult"
                        width="100"
                      >
                        <template slot-scope="scope">
                          <el-tag
                            v-if="scope.row.ignoreverifyresult === false"
                            size="mini"
                            type="primary"
                            >是</el-tag
                          >
                          <el-tag v-else size="mini" type="warning">否</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="成功"
                        prop="success"
                        width="50"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <i
                            class="el-icon-circle-check"
                            style="color: rgb(51, 203, 1)"
                            v-if="scope.row.success"
                          ></i>
                          <i
                            class="el-icon-circle-close"
                            style="color: red"
                            v-else
                          ></i>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="完成"
                        prop="finish"
                        width="50"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <i
                            class="el-icon-circle-check"
                            style="color: rgb(51, 203, 1)"
                            v-if="scope.row.finish"
                          ></i>
                          <i
                            class="el-icon-circle-close"
                            style="color: red"
                            v-else
                          ></i>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="部署时间"
                        prop="ctime"
                        width="200"
                      ></el-table-column>
                      <el-table-column
                        label="部署者"
                        prop="creator"
                        width="100"
                      ></el-table-column>
                    </el-table>
                    <div class="block">
                      <pagination
                        :total="dep_total"
                        :page.sync="dep_page"
                        :limit.sync="dep_limit"
                        @pagination="GetAppDeploymentData()"
                      ></pagination>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-main>
        </el-container>
      </el-container>

   -->
    </el-dialog>

    <!-- 虚机部署 -->

    <el-dialog
      :title="VmDeployDialogTitle"
      :visible.sync="dialogvMDeployment"
      top="20px"
      width="70%"
      style="height: 90%"
    >
      <el-form
        :model="vm_deploy_paramters"
        label-position="right"
        label-width="90px"
        :rules="vm_deploy_form_rules"
        ref="vm_deploy_form"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span>主机列表</span>
          </div>
          <el-row style="width: 100%">
            <el-col :span="24">
              <el-form-item label="">
                <el-transfer
                  style="margin-left: 5%"
                  filterable
                  v-model="selectedVms"
                  :data="vmsOptions"
                  @change="changeVm"
                  :titles="['可选用主机', '已选择']"
                ></el-transfer>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card style="width: 100%">
          <div slot="header" class="clearfix">
            <span>部署参数</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主机:" prop="host">
                <el-input
                  v-model="vm_deploy_paramters.host"
                  placeholder="请选择部署主机"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="环境:" prop="envFlag">
                <el-input
                  disabled
                  v-model="vm_deploy_paramters.envFlag"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="this.deployment_model == 2">
              <el-form-item label="镜像:" prop="image">
                <el-input v-model="vm_deploy_paramters.image"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="this.deployment_model == 3">
              <el-form-item label="制品:" prop="productName">
                <el-input v-model="vm_deploy_paramters.productName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="服务名:" prop="app">
                <el-input disabled v-model="vm_deploy_paramters.app"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="this.deployment_model == 3">
              <el-form-item label="部署目录:" prop="directory">
                <el-input
                  v-model="vm_deploy_paramters.directory"
                  placeholder="例如：/home/tomcat"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div v-if="this.deployment_model == 2">
            <el-divider content-position="left">
              <el-link type="primary" :underline="false" @click="AddVMEnv"
                ><i class="el-icon-circle-plus-outline">增加变量</i></el-link
              >
            </el-divider>

            <el-row
              v-for="item in this.vm_deploy_paramters.envs"
              :key="'key-pro' + item.time + item.time"
            >
              <el-col :span="10"
                ><el-form-item label="Key:">
                  <el-input v-model="item.key"></el-input> </el-form-item
              ></el-col>

              <el-col :span="10"
                ><el-form-item label="Value:">
                  <el-input v-model="item.value"> </el-input> </el-form-item
              ></el-col>
              <el-col :span="2">
                <el-link
                  type="danger"
                  :underline="false"
                  style="margin-top: 8px; margin-left: 10px"
                  @click="DeleteVMEnv(item)"
                  ><i class="el-icon-delete">删除</i></el-link
                >
              </el-col>
            </el-row>
          </div>
        </el-card>

        <div style="text-align: center; margin-top: 20px">
          <el-button
            size="medium"
            @click="dialogvMDeployment = false"
            type="info"
            >取 消</el-button
          >
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-s-promotion"
            @click="StartDeployVM"
            :loading="deployment_loading"
            >立即部署</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <!-- 容器日志 -->
    <el-dialog
      title="容器日志"
      :visible.sync="container_log"
      top="20px"
      width="70%"
      style="height: 90%"
      :close-on-click-modal="false"
      @closed="CloseTerminal"
    >
      <div
        style="border: solid 1px #ddd; padding: 10px 20px; border-bottom: none"
      >
        <div class="clearfix">
          <div class="pull-left" style="display: inline; float: left">
            <span>容器：</span>
            <el-select
              v-model="container"
              placeholder="请选择"
              size="mini"
              style="width: 200px"
              @change="OpenTerminal"
            >
              <el-option
                v-for="item in containers"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span>显示行数：</span>
            <el-select
              v-model="logSzie"
              placeholder="请选择"
              size="mini"
              style="width: 80px"
              @change="OpenTerminal"
            >
              <el-option label="50" value="50"></el-option>
              <el-option label="100" value="100"></el-option>
              <el-option label="200" value="200"></el-option>
              <el-option label="500" value="500"></el-option>
            </el-select>
          </div>
          <div class="pull-right" style="display: inline; float: right">
            <el-checkbox v-model="auto_refresh" @change="OpenTerminal"
              >自动刷新</el-checkbox
            >
            <el-button
              size="mini"
              @click="connectWS()"
              :disabled="refresh_disabled"
              >{{ refresh_content }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="container">
        <div id="terminal-container" style="height: 500px; width: 100%"></div>
        <div
          id="copyRemind"
          style="
            position: relative;
            z-index: 1000;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -1000%);
            width: 160px;
            opacity: 0.8;
            display: none;
          "
        >
          <span
            style="
              background-color: #d5d5d5;
              color: black;
              font-size: 20px;
              border-radius: 10px;
              padding: 5px 10px;
            "
            class="show-size"
            >已复制</span
          >
        </div>
      </div>
    </el-dialog>

    <!-- 新版本 new make version -->
    <el-dialog
      title="新建版本"
      :close-on-click-modal="false"
      :visible.sync="dialogNewAppVersion"
      :lock-scroll="false"
      width="700px"
    >
      <el-form
        label-position="left"
        label-width="140px"
        :model="pipeLineConfig"
        style="width: 90%; margin:0 auto"
        size="small"
        ref="pipeLineConfig"
      >
        <el-form-item
          label="仓库地址"
          prop="gitlabAddress"
          :rules="[{ required: true, message: '请输入仓库.', trigger: 'blur' }]"
        >
          <el-input v-model="pipeLineConfig.gitlabAddress" readonly></el-input>
        </el-form-item>
        <el-form-item
          label="分支/标签"
          prop="branch"
          :rules="[{ required: true, message: '请选择分支.', trigger: 'blur' }]"
        >
          <el-row>
            <el-col :span="12">
              <el-select
                v-model="pipeLineConfig.gitType"
                placeholder="分支"
                allow-create
                @change="changeGitType"
                style="width:100%;"
              >
                <el-option label="分支" value="branch"></el-option>
                <el-option label="标签" value="tag"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="pipeLineConfig.branch"
                filterable
                placeholder=""
                allow-create
                v-show="pipeLineConfig.gitType == 'tag'"
                style="width:100%"
              >
                <el-option
                  allow-create
                  v-for="item in gitTagList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>

              <el-select
                v-show="pipeLineConfig.gitType == 'branch'"
                v-model="pipeLineConfig.branch"
                filterable
                allow-create
                placeholder=""
                style="width:100%"
              >
                <el-option
                  v-for="item in gitBranchList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="commitId">
          <el-input v-model.trim="pipeLineConfig.commitId"></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="app_version">
          <el-input v-model="pipeLineConfig.app_version" readonly></el-input>
        </el-form-item> -->

        <el-form-item
          label="编译环境"
          prop="compileEnv"
          :rules="[
            { required: true, message: '请选择编译环境.', trigger: 'blur' },
          ]"
        >
          <el-select v-model="pipeLineConfig.compileEnv" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in compileEnvList"
              v-bind:key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代码目录" prop="rootPath">
          <el-input v-model="pipeLineConfig.rootPath"></el-input>
        </el-form-item>

        <el-form-item label="产物路径" prop="compilePackagePath">
          <el-input v-model="pipeLineConfig.compilePackagePath"></el-input>
        </el-form-item>

        <el-form-item label="编译命令" prop="compileCmd">
          <el-input
            v-model="pipeLineConfig.compileCmd"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item label="自动创建Dockerfile" prop="createDockerfile">
          <el-switch v-model="pipeLineConfig.createDockerfile"></el-switch>
        </el-form-item>

        <el-form-item
          label="Dockerfile地址"
          prop="dockerfilePath"
          v-if="!pipeLineConfig.createDockerfile"
        >
          <el-input v-model="pipeLineConfig.dockerfilePath"></el-input>
        </el-form-item>

        <!-- <el-form-item label="Sonar扫描" prop="sonar_scanner">
          <el-switch v-model="pipeLineConfig.sonar_scanner"></el-switch>
          <el-link
            v-if="pipeLineConfig.sonar_scanner"
            type="danger"
            :underline="true"
            >可能会对测试环境产生影响，如需取消，请关闭.</el-link
          >
        </el-form-item> -->
        <!-- <el-form-item
          label="安全扫描"
          v-if="
            pipeLineConfig.language &&
            pipeLineConfig.language.toLowerCase() === 'java'
          "
        >
          <el-switch v-model="pipeLineConfig.sec_scan"></el-switch>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="appNewVersion()"
            :loading="new_version_loading"
            >立即创建</el-button
          >
          <el-button @click="dialogNewAppVersion = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="发布历史"
      :close-on-click-modal="false"
      :visible.sync="dialogDeployHistory"
      :lock-scroll="false"
      width="1200px"
    >
      <DeployHistory :appId="this.appId"></DeployHistory>
    </el-dialog>

    <!-- Events -->
    <el-dialog
      title="事件"
      :visible.sync="dialognTgtEvent"
      top="60px"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-table :data="tableDataEvents" style="width: 100%" size="mini">
        <el-table-column prop="type" label="类型" width="120"></el-table-column>
        <el-table-column
          prop="reason"
          label="原因"
          width="140px"
        ></el-table-column>
        <el-table-column
          prop="creation_timestamp"
          label="时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="from"
          label="来自"
          :show-overflow-tooltip="true"
          width="300px"
        ></el-table-column>
        <!--              <el-table-column prop="involvedObject" label="对象" :show-overflow-tooltip="true" width="300px"></el-table-column>-->
        <el-table-column prop="message" label="信息"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="安全扫描结果" :visible.sync="show_sec_detail" width="200">
      <div style="margin-bottom: 5px">
        target_id:
        <el-link type="primary" @click="goToSec(sec_dict.target_id)">{{
          sec_dict.target_id
        }}</el-link>
      </div>
      <el-table :data="sec_data">
        <el-table-column
          label="等级"
          prop="level"
          width=""
          align=""
        ></el-table-column>
        <el-table-column
          label="数量"
          prop="count"
          width=""
          align="center"
        ></el-table-column>
      </el-table>
      <!--      <el-link type="primary" :underline="false" @click="" style="float: right">>>>跳转详细</el-link>-->
    </el-dialog>

    <!-- 主机发布配置 -->
    <el-drawer
      title="Host主机发布配置"
      :visible.sync="show_host_config"
      custom-class="demo-drawer"
      direction="rtl"
      size="700px"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="host_config"
          label-width="150px"
          size="small"
          ref="host_config"
          style="width: 95%"
        >
          <el-form-item label="部署主机共">
            <span>{{ host_list.length }} 台</span>
          </el-form-item>
          <el-form-item label="忽略检测">
            <el-switch v-model="AppData.ignoreverifyresult"></el-switch>
            <!--            <el-switch v-model="host_config.ignoreverifyresult"></el-switch>-->
          </el-form-item>
          <el-form-item label="单批次拉出">
            <el-slider
              v-model="host_config.single_percentage"
              :min="0"
              :max="50"
              :marks="{ 0: '0%', 50: '50%' }"
              :step="5"
            ></el-slider>
          </el-form-item>
          <el-form-item label="应用启动超时时间">
            <!--            <el-slider v-model="host_config.startuptimeout" :min="0" :max="600" :marks="{0: '0s', 180: '180s',600: '600s'}" :step="10"></el-slider>-->
            <el-slider
              v-model="AppData.startuptimeout"
              :min="0"
              :max="600"
              :marks="{ 0: '0s', 180: '180s', 600: '600s' }"
              :step="10"
            ></el-slider>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              @click="
                show_host_deployment = true;
                show_host_config = false;
              "
              v-if="host_list.length >= 1"
              >保存</el-button
            >
            <el-button @click="show_host_config = false">取 消</el-button>
          </el-form-item>
        </el-form>
        <!--        <div class="demo-drawer__footer">-->
        <!--          <el-button @click="show_host_config = false">取 消</el-button>-->
        <!--          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>-->
        <!--        </div>-->
      </div>
    </el-drawer>

    <el-dialog
      title="Merge 信息"
      :visible.sync="ShowMergeMsg"
      width="100"
      :before-close="handleClose"
    >
      <div>
        <span style="font-weight: bold">状　态：</span>
        <span
          v-if="merge_result.status === 'error'"
          style="font-weight: bold; color: red"
          >{{ merge_result.status }}</span
        >
        <span v-else style="font-weight: bold">{{ merge_result.status }}</span>
      </div>
      <div>
        <span style="font-weight: bold">信　息：</span
        ><span
          v-if="merge_result.status === 'error'"
          style="font-weight: bold; color: red"
          >{{ merge_result.msg }}</span
        >
        <span v-else>{{ merge_result.msg }}</span>
      </div>
      <div>
        <span style="font-weight: bold">合并者：</span>
        <span style="color: #222f3e; font-weight: bold">{{
          merge_result.merger
        }}</span
        >，从
        <span style="color: #00a2ca; font-weight: bold"
          >{{ merge_result.source }}
        </span>
        合并到
        <span style="color: #2276d2; font-weight: bold">{{
          merge_result.target
        }}</span>
      </div>
    </el-dialog>
    <el-dialog
      title="镜像部署审批"
      :visible.sync="checkPermissiondialogVisible"
      width="58%"
      height="100%"
      :before-close="beforeClosePermissionCheck"
    >
      <iframe
        :src="checkPermissionURL"
        frameborder="0"
        width="100%"
        height="330px"
      ></iframe>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClosePermissionCheck" type="primary"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//IN_PROGRESS
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import pagination from "@/components/Pagination/pagination";
import appBuild from "@/guide/app-build.js";
import { showGuideInfo } from "@/utils/guide.js";
import {
  getPipeLineType,
  getUseLanguageName,
  getEnvNameIndex,
} from "@/utils/pipeline.js";

import DeployHistory from "./app-deploy-history.vue";

export default {
  name: "app-build",
  //属性data
  data() {
    return {
      VmDeployDialogTitle: "",
      isCanPublishUatFat: false,
      imageAlreadyApproved: false, //检查镜像是否已经审批
      imageInprogessApproved: false, //正在审批中
      isCurrentTenantCheck: false, //租户默认是不需要审批镜像
      disabelDeployBtn: false, //是否可以部署
      checkPermissiondialogVisible: false,
      checkPermissionURL: "",
      vm_deploy_form_rules:
        this.deployment_model && this.deployment_model == 2
          ? {
              app: [
                {
                  required: true,
                  message: "请填写部署服务名",
                  trigger: "blur",
                },
              ],
              host: [
                { required: true, message: "请选择部署主机", trigger: "blur" },
              ],
              image: [
                { required: true, message: "请输入部署镜像", trigger: "blur" },
              ],
              envFlag: [
                { required: true, message: "请输入部署环境", trigger: "blur" },
              ],
            }
          : {
              app: [
                {
                  required: true,
                  message: "请填写部署服务名",
                  trigger: "blur",
                },
              ],
              host: [
                { required: true, message: "请选择部署主机", trigger: "blur" },
              ],
              productName: [
                { required: true, message: "请输入制品", trigger: "blur" },
              ],
              directory: [
                { required: true, message: "请输入部署目录", trigger: "blur" },
              ],
              envFlag: [
                { required: true, message: "请输入部署环境", trigger: "blur" },
              ],
            },
      VmDeployForm: {},
      vmsOptions: [],
      selectedVms: [],
      dialogvMDeployment: false,
      isAlreadyConfig: false,
      deployedStatus: false,
      deployedData: [],
      deploy_state: {
        active: 0,
        move_status: "",
        deploy_status: "",
        merge_status: "",
        move_icon: "",
        deploy_icon: "",
        merge_icon: "",
      },
      deploy_paramters: {
        service_name: "",
        namespace: "",
        instance_num: 0,
        instance_cores: "",
        productName: "",
        branch: "",
        merge_branch: "",
        color: "default",
        ports: [],
        envs: [],
      },

      vm_deploy_paramters: {
        id: 1,
        app: "",
        host: "",
        image: "",
        envFlag: this.deployDev,
        directory: "",
        productName: "",
        branch: "",
      },

      deploy_namespace: [],
      deploy_serviceNames: [],
      config_title: "",
      activeCollapseNames: "0",
      activeConfigNames: "DEV",
      deployeInfo: [
        {
          name: "",
          env: "DEV",
          cur_run_image: "-",
          cur_select_image: "-",
          deploy_type: "k8s",
        },
      ],
      form: {},
      active_steps: 0,
      code_status: "init",
      build_status: "init",
      docker_status: "init",
      code_des: "",
      build_des: "",
      docker_des: "",
      code_title: "拉取代码",
      build_title: "构建",
      docker_title: "生成镜像",
      code_icon: "",
      build_icon: "",
      docker_icon: "",
      historyId: 0,
      compileEnvList: [],
      gitBranchList: [],
      gitTagList: [],
      deployment_info: { env: "" },
      sec_data: [],
      sec_dict: {
        target_id: "",
        critical: "",
        high: "",
        medium: "",
        low: "",
        name: "",
      },
      ali_code: false,
      error_list: ["ABORTED", "FAILED"],
      stop_version_loading: false,
      new_version_loading: false,
      deployment_loading: false,
      build_data_loading: false,
      click_once: false,
      log: "",
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      pod: {},
      container: "",
      containers: [],
      logSzie: 100,
      ShowMergeMsg: false,
      auto_refresh: false,
      kube_env_id: "",
      show_sec_detail: false,
      show_start_deploy: true,
      show_deploy_check: false,
      show_deploy_master: false,
      show_deploy_gray: false,
      dialognTgtEvent: false,
      container_log: false,
      loading: false,
      dep_loading: false,
      kube_loading: false,
      activeName: "containerInfo",
      deployment_env: "",
      deployment_model: "1",
      app_version_search: "",
      dialogLog: false,
      dialogDeployment: false,
      dialogNewAppVersion: false,
      submitToImageApprove: false,
      dialogDeployHistory: false,
      appId: "",
      appCode: "",
      AppData: {},
      AppCiCdDataDict: {},
      AppCiCdData: [
        {
          env: "DEV",
        },
        {
          env: "FAT",
        },

        {
          env: "UAT",
        },
        {
          env: "PROD",
        },
      ],
      AppK8sDataDict: {},
      AppK8sData: {},
      k8sLog: false,
      k8sLogContent: "",
      select_app_version: "",
      tableData: [],
      appIdVerDepTableData: [], // 根据版本查询到发布的版本列表
      deployTableData: [],
      deployLogTable: [],
      KubeDeployTableData: [],
      KubePodTableData: [],
      tableDataEvents: [],
      total: 0,
      page: 1,
      limit: 10,
      dep_total: 0,
      dep_page: 1,
      dep_limit: 10,
      ver_apid_total: 0,
      ver_apid_page: 1,
      ver_apid_limit: 10,
      cur_version: { finish: true, sonar_scanner: false, sonar_result: "" },
      cur_version_status: { version__finish: true, sonar_result: "SUCCESS" },
      deployment_version: {
        finish: true,
        sonar_scanner: false,
        sonar_result: "",
      },
      newVersion: {
        getRepo: "",
        branch: "",
        commitId: "",
        app_version: "",
        packeage: "",
        buildpath: "",
        project: "",
        sonar_scanner: true,
        sec_scan: false,
      },
      pipeLineConfig: {
        id: 0,
        dockerfilePath: "",
        createDockerfile: true,
        gitlabAddress: "",
        gitType: "",
        commitId: "",
        app_version: "",
        compileEnv: "",
        rootPath: "",
        compilePackagePath: "",
        compileCmd: "",
        sonar_scanner: true,
        sec_scan: true,
        language: "",
        branch: "",
      },

      branch_list: [],
      branch: {},
      version_timer: "",
      deploy_timer: "",
      make_arg_hide: false,
      load_page: 5,
      last_deployment: { finish: true, id: "" },
      dep_check: { steps: -1, finish: true },
      dep_gray: { steps: -1, finish: true },
      dep_master: { steps: -1, finish: true },
      websocket: "",
      term: "",
      running_list: [],
      running_dict: {},
      deployment_mode: "check", // check, once, gray
      refresh_disabled: false,
      refresh_content: "刷新",
      merge_result: { status: "", msg: "", merger: "", source: "", target: "" },
      sonar_url: "",
      app_cd_data: {},

      show_host_deployment: false,
      show_host_config: false,
      host_config: {
        single_percentage: 50,
        startuptimeout: 180,
        ignoreverifyresult: false,
      },
      host_list: [
        { ip: "192.168.22.104", hostname: "" },
        { ip: "192.168.0.105", hostname: "" },
      ],
      socket: null,
      message: "",
       devIngress: "",
      fatIngress: "",
      uatIngress: "",
      prodIngress: "",
      ingressIndexStr: "",
    };
  },
  watch: {
    "cur_version_status.version__finish": function () {
      console.log("watch", this.cur_version_status.version__finish);
      if (!this.cur_version_status.version__finish) {
        this.version_timer = window.setInterval(this.GetVersionStatus, 2000);
      } else if (
        this.cur_version_status.version__finish &&
        this.cur_version.sonar_scanner &&
        this.cur_version_status.sonar_result
      ) {
        this.GetAppVersionData();
        clearInterval(this.version_timer);
      } else if (
        this.cur_version_status.version__finish &&
        !this.cur_version.sonar_scanner
      ) {
        this.GetAppVersionData();
        clearInterval(this.version_timer);
      }
    },
    "cur_version_status.sonar_result": function () {
      if (
        this.cur_version_status.finish &&
        this.cur_version.sonar_scanner &&
        this.cur_version_status.sonar_result
      ) {
        this.GetAppVersionData();
        clearInterval(this.version_timer);
      }
    },
    "last_deployment.finish": function () {
      // let task_refresh
      if (!this.last_deployment.finish) {
        this.deploy_timer = window.setInterval(this.updateDeployStatus, 3000);
      } else {
        this.GetAppVersionData();
        this.GetKubeDeploymentPod();
        this.GetMergeData();
        clearInterval(this.deploy_timer);
      }
    },
  },
  methods: {
    // CheckUATLables : async function () {
    //   return new Promise((resolve) => {
    //     this.axios({
    //       url: this.GLOBAL.baseUrl + "/products/list/condition/eq",
    //       method: "post",
    //       data: {
    //         productName :  this.cur_version.image
    //       }
    //     })
    //             .then((res) => {
    //               if (res.status === 200) {
    //                 if (res.data.code == 200) {
    //                   if (res.data.data != null) {
    //                     resolve(res.data.data.list[0].labels);
    //                   }
    //                 }
    //               }
    //             })
    //             .catch((res) => {
    //               console.log(res);
    //               this.dialogvMDeployment = false;
    //               this.$message.error("查询制品uat标签异常");
    //             });
    //   });
    // },
    CheckDeployPermission() {
      this.checkPermissiondialogVisible = true;
      this.checkPermissionURL =
        this.GLOBAL.taskCenter +
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=image_approve_com&processName=image_approve_com&current=1";
    },
    StartDeployVM: function () {
      this.$refs.vm_deploy_form.validate(async (valid) => {
        if (valid) {
          this.$message("部署中,请稍候...");
          this.deployment_loading = true;
          this.vm_deploy_paramters.envs = [];
          this.vm_deploy_paramters.envs.length = 0;
          this.vm_deploy_paramters.id = this.appId;
          var tempEnv = this.vm_deploy_paramters.envs;
          if (this.deployment_model == "2") {
            tempEnv.forEach((env) => {
              this.vm_deploy_paramters.envs.push({
                key: env.key,
                value: env.value,
              });
            });
          }

          var postData = {
            id: parseInt(this.appId),
            app: this.vm_deploy_paramters.app,
            envFlag: getEnvNameIndex(this.vm_deploy_paramters.envFlag),
            host: this.vm_deploy_paramters.host,
            image: this.vm_deploy_paramters.image,
            envs: this.vm_deploy_paramters.envs,
            directory: this.vm_deploy_paramters.directory,
            productName: this.vm_deploy_paramters.productName,
            branch: this.vm_deploy_paramters.branch,
          };
          let url = this.GLOBAL.baseUrl + "/appDeploy/addVm";
          if (this.deployment_model == 3) {
            url = url + "/noContainer";
          }
          this.axios({
            url: url,
            method: "post",
            data: postData,
          })
            .then((res) => {
              if (res.status == 200) {
                if (res.data.code === 200) {
                  this.$notify({
                    title: "操作成功",
                    message: "恭喜你,部署成功",
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.message + ",部署失败,请重试");
                }
              }
              this.deployment_loading = false;
              this.dialogvMDeployment = false;
              this.selectedVms = [];
              this.vm_deploy_paramters.envs = [];
              if (this.$refs.vm_deploy_form != undefined) {
                this.$refs.vm_deploy_form.resetFields();
              }
            })
            .catch((res) => {
              this.$notify.error({
                title: "错误",
                message: "操作异常,请重试",
              });
              this.deployment_loading = false;
              this.dialogvMDeployment = false;
              this.selectedVms = [];
              this.vm_deploy_paramters.envs = [];
              if (this.$refs.vm_deploy_form != undefined) {
                this.$refs.vm_deploy_form.resetFields();
              }
            });
        }
      });
    },
    changeVm: function () {
      if (this.selectedVms.length > 1) {
        this.selectedVms.splice(1, this.selectedVms.length);
        this.$message({
          showClose: true,
          message: "当前仅支持单台虚机部署",
          type: "warning",
        });
      }
      this.vm_deploy_paramters.host = this.selectedVms[0];
    },
    //websocket初始化开始
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        //信息清空
        this.message = "";
        // 实例化socket
        // this.socket = new WebSocket(this.path);
        this.socket = new WebSocket(this.log);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function () {
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      this.message = this.message + msg.data;
    },

    changeGitType() {
      this.branch = "";
    },
    getGitBranchList() {
      this.axios({
        method: "GET",
        url: this.GLOBAL.pipeline_tag + "/pipelineConf/branch-list",
        params: {
          gitUrl: this.pipeLineConfig.gitlabAddress,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.gitBranchList = response.data.branch;
            this.gitTagList = response.data.tag;
          }
        })
        .catch((error) => {
          console.log("Error getGitBranchList", error);
        });
    },

    load() {
      this.load_page += 2;
    },
    handleClose: function () {},
    // 应用开始创建新版本
    appNewVersion: function () {
      this.$refs.pipeLineConfig.validate((valid) => {
        if (valid) {
          let parms = {
            appId: this.appId,
            codeRoot: this.pipeLineConfig.rootPath,
            compileCmd: this.pipeLineConfig.compileCmd,
            compileEnv: this.pipeLineConfig.compileEnv,
            compilePackagePath: this.pipeLineConfig.compilePackagePath,
            createDockerfile: this.pipeLineConfig.createDockerfile ? 1 : 0,
            defGitBranch: this.pipeLineConfig.branch,
            defGitType: this.pipeLineConfig.gitType,
            dockerfilePath: this.pipeLineConfig.dockerfilePath,
            pipelineType: getPipeLineType(this.pipeLineConfig.language),
          };
          //this.Loading.service({ background: "rgba(0, 0, 0, 0.7)" });
          this.loading = true;
          this.new_version_loading = true;
          let url = "";
          let method = "post";
          if (this.isAlreadyConfig) {
            url =
              this.GLOBAL.baseUrl +
              "/pipeline-conf/conf/" +
              this.pipeLineConfig.id;
            method = "PUT";
          } else {
            url = this.GLOBAL.baseUrl + "/pipeline-conf/conf";
            method = "POST";
          }
          this.axios({
            method: method,
            url: url,
            data: parms,
          })
            .then((response) => {
              if (response.status == 200) {
                if (!this.isAlreadyConfig) {
                  this.GetPipelineConf();
                  let url =
                    this.GLOBAL.baseUrl +
                    "/pipeline-conf/conf?appId=" +
                    this.appId;
                  this.axios({
                    method: "GET",
                    url: url,
                  })
                    .then((res) => {
                      if (res.status == 200) {
                        if (res.data != null) {
                          this.pipeLineConfig.id = res.data.data.id;
                        }
                        this.startBuild();
                      }
                    })
                    .catch((res) => {
                      this.$message.error("操作失败，请确定配置是否正确");
                      this.Loading.service({
                        background: "rgba(0, 0, 0, 0.7)",
                      }).close();
                    });
                } else {
                  this.startBuild();
                }
                this.dialogNewAppVersion = false;
              } else {
                this.$message.error("操作失败，请确定配置是否正确");
                this.Loading.service({
                  background: "rgba(0, 0, 0, 0.7)",
                }).close();
              }
              this.new_version_loading = false;
            })
            .catch((response) => {
              // this.Loading.service({
              //   background: "rgba(0, 0, 0, 0.7)",
              // }).close();
              this.loading = false;
              this.dialogNewAppVersion = false;
              this.new_version_loading = false;
              this.$message.error("操作失败，请确定配置是否正确");
              console.log(response);
            });
        } else {
          this.$message.warning("请输入完整数据");
        }
      });
    },
    //开始进行构建
    startBuild: function () {
      this.$message({
        message: "构建提交成功,数据处理中请稍候...",
        type: "success",
      });
      this.build_data_loading = true;
      let url = this.GLOBAL.pipeline_tag + "/v2/pipeline/start";
      let params = {
        branch: this.pipeLineConfig.branch,
        confId: this.pipeLineConfig.id,
        deployDev: false,
        deployPre: false,
        deployTest: false,
        tenantId: 1,
        type: this.pipeLineConfig.gitType,
      };
      this.axios({
        method: "POST",
        url: url,
        data: params,
      })
        .then((res) => {
          if (res.status == 200) {
            this.active_steps = 0;
            if (!res.data.respStatus) {
              this.$message.warning(
                "构建失败,当前构建正在进行中或构建配置异常"
              );
              this.loading = false;
              this.dialogNewAppVersion = false;
              this.build_data_loading = false;
              return;
            }
            setTimeout(() => {
              this.loading = false;
              this.build_data_loading = false;
              this.GetAppVersionData();
              this.$message({
                type: "success",
                message: "创建成功",
                duration: 1000,
              });
            }, 50);
          } else {
            this.build_data_loading = false;
            this.loading = false;
            this.dialogNewAppVersion = false;
            this.$message.console.error();
            ("构建失败，请重试");
          }
        })
        .catch((res) => {
          this.loading = false;
          this.build_data_loading = false;
          this.dialogNewAppVersion = false;
        });
    },
    // kube开始部署
    appKubeDeployment: function (role, build_type, new_record, mode) {
      this.deployment_loading = true;
      let parms = {
        env: this.deployment_info.env,
        build_type: build_type,
        appCode: this.appCode,
        appId: this.appId,
        code_type: this.AppData.language.toLowerCase(),
        role: role,
        new_record: new_record,
        app_version: this.deployment_version.app_version,
        mode: mode,
        project: this.AppData.project,
        image: this.deployment_version.image,
        record_id: this.last_deployment.id,
        startuptimeout: this.AppData.startuptimeout,
        ignore_health: this.AppData.ignoreverifyresult,
        app_version_id: this.deployment_version.id,
      };
      // console.log('parms:', parms)
      this.axios({
        method: "POST",
        url: this.$store.state.cicd.deployment_version_url,
        data: parms,
        // params: parms,
      })
        .then((response) => {
          // console.log('appKubeDeployment:',response.data);
          if (response.data.status) {
            this.$message({
              type: "success",
              message: response.data.message,
              duration: 10000,
            });
            this.GetAppDeploymentData();
            // this.GetAppVersionData()
          } else {
            this.$message.error(response.data.error);
          }
          this.deployment_loading = false;
        })
        .catch((response) => {
          this.deployment_loading = false;
          this.$message.error("appKubeDeployment: " + String(response));
        });
    },

    // host模式开始部署
    appHostDeployment: function (role, build_type, new_record, mode) {
      this.deployment_loading = true;
      let parms = {
        env: this.deployment_info.env,
        build_type: build_type,
        appCode: this.appCode,
        appId: this.appId,
        code_type: this.AppData.language.toLowerCase(),
        role: role,
        new_record: new_record,
        app_version: this.deployment_version.app_version,
        mode: mode,
        project: this.AppData.project,
        app_version_id: this.deployment_version.id,
        startuptimeout: this.AppData.startuptimeout,
        ignore_health: this.AppData.ignoreverifyresult,
        image: this.deployment_version.image,
        single_percentage: this.host_config.single_percentage,
        host_list: this.host_list,
      };
      // console.log('parms:', parms)
      // return
      this.axios({
        method: "POST",
        url: this.$store.state.cicd.deployment_version_url,
        data: parms,
      })
        .then((response) => {
          // console.log('appHostDeployment:',response.data);
          if (response.data.status) {
            this.$message({
              type: "success",
              message: response.data.message,
              duration: 10000,
            });
            this.GetAppDeploymentData();
            // this.GetAppVersionData()
          } else {
            this.$message.error(response.data.error);
          }
          this.deployment_loading = false;
        })
        .catch((response) => {
          this.deployment_loading = false;
          this.$message.error("appHostDeployment: " + String(response));
        });
    },

    // 根据cur_version.finish更新发布状态
    updateVersionStatus: function () {
      this.loading = true;
      this.GetAppVersionData();
    },

    // 根据last_deployment.finish更新发布状态
    updateDeployStatus: function () {
      this.GetAppDeploymentData();
    },

    // 获取appId的部署历史详细
    GetAppDeploymentData: function () {
      this.dep_loading = true;
      let parms = {
        env: this.deployment_info.env,
        appCode: this.appCode,
        appId: this.appId, //'build_type': build_type,
        pageSize: this.dep_limit,
        pageNumber: this.dep_page,
      };
      this.axios({
        method: "GET",
        url: this.$store.state.cicd.deployment_version_url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetAppDeploymentData:',response.data);
          this.dep_check = { steps: -1, finish: true };
          this.dep_gray = { steps: -1, finish: true };
          this.dep_master = { steps: -1, finish: true };
          if (response.data.status) {
            this.deployTableData = response.data.data;
            this.dep_total = response.data.total;
            this.running_list = response.data.running_list;
            if (response.data.data.length >= 1) {
              this.$refs.singleHistoryTable.setCurrentRow(
                this.deployTableData[0]
              );
              this.last_deployment = response.data.data[0];
            } else {
              this.$refs.singleHistoryTable.setCurrentRow(0);
              this.last_deployment = { finish: true, id: "" };
            }
            // console.log('last_deployment:',this.last_deployment);
          } else {
            this.$notify.error(response.data.error);
          }
          this.dep_loading = false;
        })
        .catch((response) => {
          this.dep_loading = false;
          this.$notify.error("GetAppDeploymentData: " + String(response));
        });
    },
    gotoBottom() {
      var element = document.getElementById("msg_end");
      if (element != null) {
        element.scrollTop = element.scrollHeight;
        element.scrollIntoView();
      }
    },
    // 获取appId的详细
    GetAppData: function (url) {
      this.axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          if (response.data.code == 200) {
            this.pipeLineConfig.gitlabAddress = response.data.data.gitRepoUrl;
            this.pipeLineConfig.language = getUseLanguageName(
              response.data.data.useLanguage
            );
            this.getGitBranchList();
            this.GetPipelineConf();
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          // this.$notify.error(String(response));
        });
    },
    //获取PipeLine环境
    getCompileEnvList() {
      this.axios({
        method: "GET",
        url: this.GLOBAL.baseUrl + "/pipeline-conf/image-list",
      })
        .then((response) => {
          if (response.status == 200) {
            this.compileEnvList = response.data.data;
          } else {
            this.$notify.error("获取编译环境失败");
          }
        })
        .catch((error) => {
          console.log("Error getCompileEnvList", error);
        });
    },

    //获取PipeLine 配置信息
    GetPipelineConf: function () {
      let url = this.GLOBAL.baseUrl + "/pipeline-conf/conf?appId=" + this.appId;
      this.axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.data != null && response.data.data != "") {
              this.isAlreadyConfig = true;
              this.pipeLineConfig.id = response.data.data.id;
              this.pipeLineConfig.gitType = response.data.data.defGitType;
              this.pipeLineConfig.branch = response.data.data.defGitBranch;
              this.pipeLineConfig.commitId = "";
              this.pipeLineConfig.app_version = "";
              this.pipeLineConfig.compileEnv = response.data.data.compileEnv;
              this.pipeLineConfig.rootPath = response.data.data.codeRoot;
              this.pipeLineConfig.compilePackagePath =
                response.data.data.compilePackagePath;
              this.pipeLineConfig.compileCmd = response.data.data.compileCmd;
              this.pipeLineConfig.dockerfilePath =
                response.data.data.dockerfilePath;
              if (response.data.data.createDockerfile == 1) {
                this.pipeLineConfig.createDockerfile = true;
              } else {
                this.pipeLineConfig.createDockerfile = false;
              }
              this.pipeLineConfig.sonar_scanner = false;
              this.pipeLineConfig.sec_scan = false;
            } else {
              this.isAlreadyConfig = false;
              if (this.pipeLineConfig.language === "java") {
                this.pipeLineConfig.compileCmd = `mvn clean package -DskipTests`;
                this.pipeLineConfig.compilePackagePath = `/target`;
                this.pipeLineConfig.rootPath = "/";
                this.pipeLineConfig.compileEnv =
                  "ecr-online.enncloud.cn/devops/devops-pipeline-executor:mvn3.3.9-java1.8";
                this.pipeLineConfig.dockerfilePath = "/Dockerfile";
                this.pipeLineConfig.createDockerfile = true;
              }
              if (
                this.pipeLineConfig.language == "nodeJs" ||
                this.pipeLineConfig.language.toLowerCase() == "javascript"
              ) {
                this.pipeLineConfig.compileCmd =
                  "npm config set registry https://registry.npm.taobao.org\nnpm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass\nnpm install\nnpm run buildreport";
                this.pipeLineConfig.compilePackagePath = `/dist`;
                this.pipeLineConfig.rootPath = "/";
                this.pipeLineConfig.compileEnv =
                  "ecr-online.enncloud.cn/devops/devops-pipeline-executor:node12";
                this.pipeLineConfig.dockerfilePath = "/Dockerfile";
                this.pipeLineConfig.createDockerfile = true;
              }
            }
          } else {
            this.$notify.error("获取默认配置失败");
          }
        })
        .catch((response) => {
          //this.$notify.error(String(response));
        });
    },
    //  根据appId获取发布相关信息
    GetAppCiCdData: function (url) {
      let parms = { appId: this.appId };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          if (response.data.status) {
            let temp = {};
            this.AppCiCdData = response.data.data;
            if (response.data.data) {
              response.data.data.map(function (value, index, arr) {
                temp[value.env] = value;
              });
            }
            this.AppCiCdDataDict = temp;
            //console.log('AppK8sData:', this.AppK8sData)
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$notify.error(String(response));
        });
    },

    //  根据appId和环境获取kube信息
    GetAppCiCdKube: function (url) {
      let parms = { appId: this.appId, env: this.deployment_info.env };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetAppCiCdKube:',response.data);
          if (response.data.status) {
            if (response.data.data.length > 0) {
            } else {
              this.dialogDeployment = false;
              this.$message.error("当前应用环境，缺少初始容器化配置！");
            }
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },

    // 获取appId的app version详细
    GetAppVersionData: function () {
      this.axios({
        method: "GET",
        url: this.GLOBAL.pipeline_tag + "/v2/pipeline/list",
        params: {
          pageSize: this.limit,
          page: this.page,
          appId: this.appId,
        },
      })
        .then((response) => {
          // console.log('GetAppVersionData:',response.data, this.cur_version.app_version);
          if (response.status == 200) {
            // this.running_list = response.data.running_list;
            // dep_total = response.data.content.length;
            this.total = response.data.totalElements;
            if (response.data.content.length > 0) {
              this.$refs.singleTable.setCurrentRow(response.data.content[0]);
            } else {
              this.$refs.singleTable.setCurrentRow(0);
              this.cur_version = { finish: true };
            }
            this.GetDeployedData()
              .then((res) => {
                this.tableData = response.data.content;
                if (res.code == 200) {
                  if (res.data.length > 0) {
                    this.getDeployDetail(
                      res.data[0].appDeployK8s.envFlag,
                      res.data[0].appDeployK8s.namespace,
                      res.data[0].appDeployK8s.serviceName
                    )
                      .then((r) => {
                        if (r.status == 200) {
                          var image = r.data.data.data.image;
                          for (
                            let index = 0;
                            index < this.tableData.length;
                            index++
                          ) {
                            if (image == this.tableData[index].image) {
                              this.tableData[index].env =
                                res.data[0].appDeployK8s.envFlag;
                            }
                          }
                        }
                      })
                      .catch((res) => {});
                  }
                }
              })
              .catch((res) => {});
            //this.sonar_url = response.data.sonar_url;
          } else {
            console.log(response.data.error);
          }
          this.loading = false;
        })
        .catch((response) => {
          this.loading = false;
          console.log("GetAppVersionData: " + String(response));
        });
    },

    GetVersionStatusList: function (status) {
      if ("READY" == status) {
        this.code_status = "wait";
        this.build_status = "wait";
        this.docker_status = "wait";

        this.code_icon = "el-icon-download";
        this.build_icon = "el-icon-connection";
        this.docker_icon = "el-icon-download";

        this.code_des = "准备中";
        this.build_des = "准备中";
        this.docker_des = "准备中";

        this.code_title = "代码拉取";
        this.build_title = "编译";
        this.docker_title = "生成镜像";
        this.active_steps = 1;
      }

      if ("STOP" == status) {
        this.code_status = "error";
        this.build_status = "error";
        this.docker_status = "error";
        this.code_icon = "";
        this.build_icon = "";
        this.docker_icon = "";
        this.code_des = "取消";
        this.build_des = "取消";
        this.docker_des = "取消";
        this.code_title = "代码拉取";
        this.build_title = "编译";
        this.docker_title = "生成镜像";
        this.cur_version_status.version__finish = true;
        this.active_steps = 3;
      }
      if ("ERROR" == status) {
        this.code_status = "error";
        this.build_status = "error";
        this.docker_status = "error";
        this.code_des = "停止";
        this.build_des = "停止";
        this.docker_des = "停止";
        this.code_title = "代码拉取";
        this.build_title = "编译";
        this.docker_title = "生成镜像";
        this.code_icon = "";
        this.build_icon = "";
        this.docker_icon = "";
        this.cur_version_status.version__finish = true;
        this.active_steps = 3;
      }
      if ("FINISHED" == status || "RUNNING" == status) {
        this.build_data_loading = true;
        this.axios({
          method: "GET",
          url:
            this.GLOBAL.pipeline_tag +
            "/v2/pipeline/status/list/" +
            this.cur_version.id,
        })
          .then((response) => {
            if (response.status == 200) {
              var codeAction = response.data[0];
              var buildAction = response.data[1];
              var dockerAction = response.data[2];

              if ("RUNNING" == status) {
                this.active_steps = 2;
                //拉取代码
                if (codeAction.status == "READY") {
                  this.code_status = "on";
                  this.code_icon = "el-icon-loading";
                  this.active_steps = 1;
                  this.code_title = "代码拉取";
                  this.code_des = "准备中";
                }

                if (codeAction.status == "RUNNING") {
                  this.code_des = "进行中";
                  this.code_status = "on";
                  this.code_icon = "el-icon-loading";
                  this.active_steps = 1;
                  this.code_title = "代码拉取";
                }
                if (codeAction.status == "FINISHED") {
                  this.code_des =
                    "耗时" +
                    (new Date(codeAction.endTime) -
                      new Date(codeAction.createTime)) /
                      1000 +
                    "s";
                  this.code_status = "success";
                  this.code_title = "代码拉取";
                  this.code_icon = "";
                }
                //编译代码
                if (buildAction.status == "READY") {
                  this.build_des = "就绪";
                  this.build_title = "编译";
                  this.build_status = "";
                  this.build_icon = "";
                }
                if (buildAction.status == "RUNNING") {
                  this.build_des = "正在编译";
                  this.build_title = "编译中";
                  this.build_status = "process";
                  this.build_icon = "el-icon-loading";
                }
                if (buildAction.status == "FINISHED") {
                  this.build_title = "编译成功";
                  this.build_status = "success";
                  this.build_icon = "";
                  this.build_des =
                    "耗时" +
                    (new Date(buildAction.endTime) -
                      new Date(buildAction.createTime)) /
                      1000 +
                    "s";
                  this.build_status = "success";
                }
                //生成镜像
                if (dockerAction.status == "READY") {
                  this.docker_des = "等待中";
                  this.docker_title = "生成镜像";
                  this.docker_status = "";
                  this.docker_icon = "";
                }
                if (dockerAction.status == "RUNNING") {
                  this.active_steps = 3;
                  this.docker_des = "请稍候";
                  this.docker_title = "镜像生成中";
                  this.docker_status = "process";
                  this.docker_icon = "el-icon-loading";
                }
                if (dockerAction.status == "FINISHED") {
                  this.active_steps = 3;
                  this.docker_title = "镜像生成";
                  this.docker_des =
                    "耗时" +
                    (new Date(dockerAction.endTime) -
                      new Date(dockerAction.createTime)) /
                      1000 +
                    "s";
                  this.docker_status = "success";
                }
              }

              if ("FINISHED" == status) {
                this.active_steps = 3;
                this.code_title = "代码拉取";
                this.build_title = "编译";
                this.docker_title = "生成镜像";
                this.code_icon = "";
                this.build_icon = "";
                this.docker_icon = "";
                this.code_status = "success";
                this.build_status = "success";
                this.docker_status = "success";
                this.code_des =
                  "耗时" +
                  (new Date(codeAction.endTime) -
                    new Date(codeAction.createTime)) /
                    1000 +
                  "s";
                this.build_des =
                  "耗时" +
                  (new Date(buildAction.endTime) -
                    new Date(buildAction.createTime)) /
                    1000 +
                  "s";
                this.docker_des =
                  "耗时" +
                  (new Date(dockerAction.endTime) -
                    new Date(dockerAction.createTime)) /
                    1000 +
                  "s";
              }
            }
          })
          .catch((response) => {
            this.build_data_loading = false;
          });
        this.build_data_loading = false;
      }
    },
    // 获取版本的构建信息
    GetVersionStatus: function () {
      this.build_data_loading = true;
      this.axios({
        method: "GET",
        url:
          this.GLOBAL.pipeline_tag + "/v2/pipeline/info/" + this.cur_version.id,
      })
        .then((response) => {
          console.log("status", response.data.status);
          if (response.status == 200) {
            if (
              response.data.status == "FINISHED" ||
              response.data.status == "ERROR" ||
              response.data.status == "STOP"
            ) {
              this.cur_version_status.version__finish = true;
            } else {
              this.cur_version_status.version__finish = false;
            }
            if (response.data.status == "FINISHED") {
              this.cur_version_status.makeResult = "SUCCESS";
            } else {
              this.cur_version_status.makeResult = response.data.status;
            }
            this.GetVersionStatusList(response.data.status);
          } else {
            this.$message.error(response.data.error);
          }
          this.build_data_loading = false;
        })
        .catch((error) => {
          this.build_data_loading = false;
          //  this.$message.error({ message: String(error) });
          console.log({ message: String(error) });
        });
    },

    // 获取版本安全扫描信息
    GetSecScanData: function () {
      let parms = { app_version_id: this.cur_version.id };
      this.sec_data = [];
      this.axios({
        method: "GET",
        url: this.$store.state.cicd.sec_scan_url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetSecScanData:',response.data);
          if (response.data.status) {
            this.sec_dict = response.data.data;
            let status = "";
            if (this.sec_dict.status === "scanning") {
              status = "扫描中";
            } else if (this.sec_dict.status === "complete") {
              status = "完成";
            } else {
              status = "";
            }
            this.sec_data = [
              { level: "严重", count: this.sec_dict.critical },
              { level: "高危", count: this.sec_dict.high },
              { level: "中危", count: this.sec_dict.medium },
              { level: "低危", count: this.sec_dict.low },
              { level: "状态", count: status },
            ];
            this.show_sec_detail = true;
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error("GetSecScanData: " + String(response));
        });
    },

    // 获取git 的分支列表
    GetGitRepoBranch: function (url) {
      let parms = { gitRepo: this.AppData.git };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetGitRepoBranch:',response.data, this.getCurTime());
          if (response.data.status) {
            this.branch_list = response.data.data;
            if (this.branch_list.length > 0) {
              this.newVersion.branch = this.branch_list[0].name;
              this.newVersion.commitId = this.branch_list[0]["commit"].id;
              this.newVersion.app_version =
                this.getCurTime() +
                "-" +
                this.branch_list[0]["name"].replace("/", "-");
            } else {
              this.$message.error("没有分支信息！");
            }
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error("GetGitRepoBranch: " + String(response));
        });
    },

    // 通过k8s api获取 deployment pod
    GetKubeDeploymentPod: function () {
      this.kube_loading = true;
      let parms = {
        env: this.deployment_info.env,
        label_selector:
          "appid=" + this.appCode + ",env=" + this.deployment_info.env,
      };
      this.axios({
        method: "GET",
        url: this.$store.state.cicd.kube_app_url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetKubeDeploymentPod:',response.data);
          if (response.data.status) {
            this.KubeDeployTableData = response.data.data.deploy_data;
            this.KubePodTableData = response.data.data.pod_data;
            this.kube_env_id = response.data.data.kube_env_id;
          } else {
            this.KubeDeployTableData = [];
            this.KubePodTableData = [];
            this.dialogDeployment = false;
            this.$notify.error(response.data.error);
          }
          this.kube_loading = false;
        })
        .catch((response) => {
          this.kube_loading = false;
          this.KubeDeployTableData = [];
          this.KubePodTableData = [];
          this.$notify.error(String(response));
        });
    },

    // 获取git 的分支列表
    GetMergeData: function () {
      let parms = {
        app_version: this.deployment_version.app_version,
        app_version_id: this.deployment_version.id,
      };
      this.axios({
        method: "GET",
        url: this.$store.state.cicd.app_merge_url,
        params: parms,
      })
        .then((response) => {
          //console.log('GetMergeData:',response.data);
          this.merge_result = {
            status: "",
            msg: "",
            merger: "",
            source: "",
            target: "",
          };
          if (response.data.status) {
            if (response.data.data) {
              this.merge_result = response.data.data;
            }
          } else {
            this.$message.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$message.error(String(response));
        });
    },

    // 产物下载
    PackageDownload: function () {
      // console.log(this.cur_version, this.cur_version_status)
      if (
        this.cur_version.finish &&
        this.cur_version_status.makeResult === "SUCCESS"
      ) {
        let url =
          this.$store.state.cicd.download_url +
          "?app=" +
          this.appCode +
          "&app_version=" +
          this.cur_version.app_version;
        window.open(url, "_blank");
      } else {
        this.$message.warning("版本尚未创建完成，或版本创建不成功。");
      }
    },

    // 选中创建版本
    ClickAppVersionRow: function (current_row, old_row) {
      //console.log("row-click:", current_row, old_row);
      if (current_row) {
        this.cur_version = current_row;
        this.cur_version.code = this.pipeLineConfig.language;
        this.cur_version.gitRepo = this.pipeLineConfig.gitlabAddress;
        this.cur_version.package = this.pipeLineConfig.compilePackagePath;
        this.GetVersionStatus();
        this.deployment_env = "";
        this.checkImageAlreadyApproved();
      }
    },
    // 选中部署历史版本
    ClickRowDepHistory: function (row, column, event) {
      // console.log("ClickRowDepHistory:", row, column, event)
      this.dep_check = { steps: -1, finish: true };
      this.dep_gray = { steps: -1, finish: true };
      this.dep_master = { steps: -1, finish: true };
      this.deployment_mode = row.mode;
      // console.log("deployment_mode:", this.deployment_mode)
      if (row.step_list.length > 0) {
        this.deployLogTable = row.step_list;
        for (let i = 0; row.step_list.length > i; ++i) {
          if (row.step_list[i].role === "check") {
            this.dep_check = row.step_list[i];
          } else if (row.step_list[i].role === "master") {
            this.dep_master = row.step_list[i];
          } else if (row.step_list[i].role === "gray") {
            this.dep_gray = row.step_list[i];
          }
        }
      }
    },
    async getDeployDetail(envFlag, namespace, serviceName) {
      let data;
      await this.axios({
        method: "GET",
        url:
          this.GLOBAL.baseUrl +
          "/app/k8s/appdetail/" +
          envFlag +
          "/" +
          namespace +
          "/" +
          serviceName,
      })
        .then((res) => {
          if (res.status == 200) {
            data = res;
          } else {
            this.$notify.error("获取部署信息失败");
          }
        })
        .catch((res) => {
          console.log("fail to get expandAppVersion", res);
        });
      return data;
    },
    // 展开获取 发布历史信息
    expandAppVersion: function (row, that) {
      this.axios({
        method: "GET",
        url: this.GLOBAL.baseUrl + "/appDeploy/deploy/" + this.appId,
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.data.length > 0) {
              let item = response.data.data[0];
              let envFlag = item.appDeployK8s.envFlag;
              let namespace = item.appDeployK8s.namespace;
              let serviceName = item.appDeployK8s.serviceName;
              that.expands.push(row.id);
              this.getDeployDetail(envFlag, namespace, serviceName).then(
                (r) => {
                  console.log("r", r);
                  this.appIdVerDepTableData.splice(
                    0,
                    this.appIdVerDepTableData.length
                  );
                  if (r.status == 200) {
                    r.data.data.data.pods.forEach((pod) => {
                      let rowShow = {
                        env: envFlag,
                        ingress:
                          r.data.data.data.services.ingressServices[0]
                            .ingressDomain,
                        port: r.data.data.data.services.ingressServices[0].port,
                        podName: pod.name,
                        podIP: pod.ip,
                        status: pod.status,
                      };
                      this.appIdVerDepTableData.push(rowShow);
                    });
                  }
                }
              );
            }
          } else {
            // this.$notify.error(response.data.error);
            console.log(response.data.error);
          }
        })
        .catch((response) => {
          console.log(response);
          // this.dep_loading = false
          //this.$notify.error("expandAppVersion: " + String(response));
        });
    },

    // 折叠面板每次只能展开一行
    expandSelect(row, expandedRows) {
      var that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          this.expandAppVersion(row, that);
          // that.expands.push(row.id)
        }
      } else {
        that.expands = [];
      }
    },

    // 分支变化
    branchChange: function () {
      // console.log('branchChange:',)
      if (!this.ali_code) {
        for (let i = 0; i < this.branch_list.length; ++i) {
          if (this.branch_list[i]["name"] === this.newVersion.branch) {
            this.newVersion.commitId = this.branch_list[i]["commit"].id;
            this.newVersion.app_version =
              this.getCurTime() +
              "-" +
              this.branch_list[i]["name"].replace("/", "-");
          }
        }
      } else {
        this.newVersion.app_version =
          this.getCurTime() + "-" + this.newVersion.branch;
      }
    },

    // 发布环境变化
    envChange: function () {
      if (this.deployment_env === "prod") {
        // console.log('选择生产环境：', this.cur_version)
        if (this.cur_version.uat !== "success") {
          this.deployment_env = "";
          this.$message.warning("当前版本尚未发布过UAT环境或发布UAT失败。");
        }
      }
    },

    //拉取日志信息
    FetchBuildLog() {
      this.axios({
        method: "GET",
        params: {
          buildNum: this.cur_version.buildNum,
          appId: this.appId,
        },
        url: this.GLOBAL.baseUrl + "/pipeline/getJobDetail",
      })
        .then((response) => {
          if (response.data.data != null) {
            this.logList = [];
            response.data.data.split("\n").forEach((line) => {
              var sig = "INFO";
              if (
                line.indexOf("[ERROR]") > -1 ||
                line.indexOf("ERROR") > -1 ||
                line.indexOf("npm ERR") > -1
              ) {
                sig = "ERROR";
              }
              if (line.indexOf("[WARNING]") > -1) {
                sig = "WARNING";
              }
              this.logList.push({
                sig: sig,
                log: line.trim(),
              });
            });
          }
          //this.message = response.data.data;
        })
        .catch((error) => {
          console.log("getLogPath error: " + error);
        });
    },
    docerlog: function () {
      this.k8sLog = false;
      clearInterval(this.k8sLogIntervel);
    },
    //下载k8s日志
    getK8sLog(data, show_model) {
      if (this.deploy_namespace.length == 0) {
        this.$message({
          showClose: true,
          message: "获取集群信息失败,无法查看容器日志",
          type: "error",
        });
        this.k8sLog = false;
        return;
      }
      this.axios({
        method: "get",
        url: this.GLOBAL.goClientURL + "/pod/logs",
        params: {
          clusterId: this.deploy_namespace[0].clusterId,
          appId: this.appCode,
          namespace: this.deploy_paramters.namespace,
          pod: data.pod_name,
        },
      })
        .then((response) => {
          if (response.data.code === 2000) {
            if (response.data.data != null && response.data.data != "") {
              if (show_model === "page") {
                this.k8sLogContent = response.data.data;
              }
              if (show_model === "file") {
                var FileSaver = require("file-saver");
                var blob = new Blob([response.data.data], {
                  type: "text/plain;charset=utf-8",
                });
                FileSaver.saveAs(blob, data.pod_name + ".txt");
              }
            } else {
              clearInterval(this.k8sLogIntervel);
              this.$message({
                showClose: true,
                message: "日志内容为空",
                type: "error",
              });
            }
          } else {
            this.$message({
              showClose: true,
              message: "接口异常,无法查看容器日志",
              type: "error",
            });
            this.k8sLog = false;
            clearInterval(this.k8sLogIntervel);
          }
        })
        .catch((error) => {
          console.log(error);
          clearInterval(this.k8sLogIntervel);
          this.$message({
            showClose: true,
            message: "接口异常,无法查看容器日志",
            type: "error",
          });
          this.k8sLog = false;
        });
    },
    showK8sLog: function (data) {
      var that = this;
      this.$message("日志信息加载中,请稍候");
      this.k8sLogIntervel = setInterval(function () {
        if (that.k8sLogContent != "") {
          that.k8sLog = true;
        }
        that.getK8sLog(data, "page");
      }, 1000);
    },
    downloadK8sLog: function (data) {
      this.$message("日志信息下载中,请稍候");
      this.getK8sLog(data, "file");
    },

    //关闭审批窗口
    beforeClosePermissionCheck: function () {
      this.checkPermissiondialogVisible = false;
      this.checkImageAlreadyApproved();
    },

    // 弹出创建新版本对话框
    ShowNewVersion: function () {
      // if(this.AppData.git.indexOf('code.aliyun.com')>=0){
      //   this.ali_code = true
      //   this.newVersion.branch = this.cur_version.branch
      //   this.newVersion.app_version = this.getCurTime() + '-' + this.newVersion.branch
      // }else {
      //   this.ali_code = false
      //   this.GetGitRepoBranch(this.$store.state.cicd.git_branch_url)
      // }
      // if(this.AppData.language==='JAVA' && !this.AppData.make_args){this.AppData.make_args='mvn -B -f pom.xml clean package -Dmaven.test.skip=true -am -U'}
      // else if(['JS', 'NODEJS'].indexOf(this.AppData.language)>=0 && !this.AppData.make_args){this.AppData.make_args='npm install && npm run build '}
      this.newVersion.buildpath = this.AppData.buildpath;
      this.newVersion.project = this.AppData.project;
      this.dialogNewAppVersion = true;
      // console.log('this.cur_version:', this.cur_version)
    },

    // 弹出发布历史页面
    ShowDeployHistory: function () {
      this.dialogDeployHistory = true;
    },

    async GetK8sConfiguration(namespace, appName, env_index) {
      let data;
      await this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/app/k8s/appdetail/" +
          env_index +
          "/" +
          namespace +
          "/" +
          appName,
        method: "get",
      })
        .then((response) => {
          if (response.status == 200) {
            data = response.data;
          } else {
            this.$message.warning("获取配置信息失败");
          }
        })
        .catch((response) => {
          console.log("fail to Get k8s configuration", response);
        });
      return data;
    },
    handleClickChangeConfig: function (tab, event) {
      this.checkImageAlreadyApproved();
      if (
        tab.name === "PROD" &&
        !this.imageAlreadyApproved &&
        this.isCurrentTenantCheck
      ) {
        this.disabelDeployBtn = true;
      } else {
        this.disabelDeployBtn = false;
      }
      this.deployment_env = tab.name;
      this.activeConfigNames = this.deployment_env;
      this.deployeInfo[0].env = this.deployment_env;
      this.deploy_paramters = {
        service_name: this.appCode,
        namespace: "",
        instance_num: 0,
        instance_cores: "",
        ports: [],
        envs: [],
      };
      this.LoadDeployConfig("");
      this.LoadDeployedInfo();
    },

    AddPort: function () {
      if (this.deploy_paramters.ports == null) {
        this.deploy_paramters.ports = [];
      }
      this.deploy_paramters.ports.push({
        port: 0,
        node_port: null,
        ingressDomain: "",
        key: Date.now(),
      });
    },
    AddEnv: function () {
      if (this.deploy_paramters.envs == null) {
        this.deploy_paramters.envs = [];
      }
      this.deploy_paramters.envs.push({
        value: "",
        key: "",
        time: Date.now(),
      });
    },
    AddVMEnv: function () {
      if (this.vm_deploy_paramters.envs == null) {
        this.vm_deploy_paramters.envs = [];
      }
      this.vm_deploy_paramters.envs.push({
        value: "",
        key: "",
        time: Date.now(),
      });
    },
    DeletePort: function () {
      if (this.deploy_paramters.ports.length > 0) {
        var index = this.deploy_paramters.ports.length - 1;
        if (index !== -1) {
          this.deploy_paramters.ports.splice(index, 1);
        }
      }
    },

    DeleteEnv: function (item) {
      for (let index = 0; index < this.deploy_paramters.envs.length; index++) {
        const env = this.deploy_paramters.envs[index];
        if (env.key === item.key) {
          this.deploy_paramters.envs.splice(index, 1);
        }
      }
    },

    DeleteVMEnv: function (item) {
      for (
        let index = 0;
        index < this.vm_deploy_paramters.envs.length;
        index++
      ) {
        const env = this.vm_deploy_paramters.envs[index];
        if (env.key === item.key) {
          this.vm_deploy_paramters.envs.splice(index, 1);
        }
      }
    },

    DeployOnce: function () {
      this.CheckUATCFATPermission();
      if (!this.isCanPublishUatFat) {
        if (this.deployment_env === "FAT" || this.deployment_env === "UAT") {
          this.$notify.error({
            title: "警告",
            message: "权限不足,非质量人员无法发布UAT和FAT环境",
          });
          return;
        }
      }

      //校验颜色
      // if (this.deployment_env === "DEV") {
      //   if (this.deploy_paramters.color =='') {
      //     this.deploy_paramters.color ='default';
      //   } else {
      //     var regu = /^[a-z]{1,10}$/;
      //     var re = new RegExp(regu);
      //     if (!re.test(this.deploy_paramters.color)) {
      //       this.$notify.error({
      //         title: "警告",
      //         message: "输入的颜色不符合规范!",
      //       });
      //       return;
      //     }
      //   }
      // }

      this.deploy_state.active = 0;
      this.deploy_state.move_icon = "";
      //console.log("config", this.deploy_paramters);
      let ingress_ports = [];
      this.deploy_paramters.ports.forEach((element) => {
        ingress_ports.push({
          port: element.port,
          domain: element.ingressDomain,
        });
      });
      this.deployment_loading = true;
      let url = this.GLOBAL.baseUrl + "/appDeploy/add";
      this.deploy_state.active = 2;
      this.deploy_state.deploy_status = "wait";
      this.deploy_state.deploy_icon = "el-icon-loading";
      var postData = {
        id: Number(this.appId),
        chart_name: this.appCode,
        kube_env: getEnvNameIndex(this.deployment_env),
        namespace: this.deploy_paramters.namespace,
        values_replica_count: Number(this.deploy_paramters.instance_num),
        values_repository: this.cur_version.image,
        values_resources_limit_cpu: this.deploy_paramters.instance_cores * 1000,
        values_resources_limit_mem:
          this.deploy_paramters.instance_mem_gb * 1024,
        chart_envs: this.deploy_paramters.envs,
        chart_service: {
          ingress_ports: ingress_ports,
        },
        productName: this.deploy_paramters.productName,
        branch: this.deploy_paramters.branch,
        mergeBranch: this.deploy_paramters.merge_branch,
        color: "default",
      };
      this.axios({
        url: url,
        method: "post",
        data: postData,
      })
        .then((response) => {
          this.deployment_loading = false;
          if (response.status == 200) {
            if (response.data.code === 200) {
              this.deploy_state.active = 3;
              this.deploy_state.deploy_icon = "";
              this.deploy_state.deploy_status = "success";
              this.$message({
                message: "应用部署成功",
                type: "success",
              });
            } else {
              this.deploy_state.active = 3;
              this.deploy_state.merge_status = "error";
              this.deploy_state.deploy_status = "error";
              this.deploy_state.deploy_icon = "";
              this.deploy_state.merge_icon = "";
              this.$message({
                message:
                  response.data.message + "，本次部署失败,请检查部署配置后再重试",
                type: "error",
              });
            }
          } else {
            this.$message({
              message: response.message,
              type: "error",
            });
          }
          this.LoadDeployedInfo();
        })
        .catch((response) => {
          console.log("fail to deploy", response);
          this.deployment_loading = false;
          this.$message.error(response.data.message);
        });
    },

    //获取部署信息
    async GetDeployedData() {
      let data;
      await this.axios({
        url: this.GLOBAL.baseUrl + "/appDeploy/deploy/" + this.appId,
        method: "get",
      })
        .then((resp) => {
          if (resp.status == 200) {
            data = resp.data;
          } else {
            console.log("fail to GetDeployedData", resp);
          }
        })
        .catch((resp) => {
          console.log("fail to GetDeployedData", resp);
        });
      return data;
    },

    //加载部署状态
    LoadDeployedInfo: function () {
      this.deployedData = [];
      this.deployeInfo[0].cur_run_image = "-";
      var index = getEnvNameIndex(this.deployment_env);
      this.GetDeployedData()
        .then((resp) => {
          if (resp.code == 200) {
            resp.data.forEach((element) => {
              if (element.appDeployK8s.envFlag == index) {
                var namespace = element.appDeployK8s.namespace;
                var service_name = element.appDeployK8s.serviceName;
                this.getDeployDetail(index, namespace, service_name)
                  .then((re) => {
                    if (re.status == 200) {
                      try {
                        // this.deployeInfo[0].cur_run_image = re.data.data.data.image;
                        this.deployeInfo[0].cur_run_image =
                          this.deployeInfo[0].cur_select_image;
                        if (re.data.data.data.pods != null) {
                          re.data.data.data.pods.forEach((pod) => {
                            let podInfo = {
                              pod_image: pod.image,
                              pod_name: pod.name,
                              pod_ip: pod.ip,
                              run_status: pod.status,
                              env: this.deployment_env,
                            };
                            if (
                              podInfo.pod_image !=
                              this.deployeInfo[0].cur_run_image
                            ) {
                              this.deployeInfo[0].cur_run_image =
                                podInfo.pod_image;
                            }
                            this.deployedData.push(podInfo);
                            this.deployedStatus = false;
                          });
                        }
                      } catch (er) {
                        console.log(er);
                      }
                    }
                    this.deployedStatus = false;
                  })
                  .catch((re) => {
                    console.log(re);
                    this.deployedStatus = false;
                  });
              }
            });
          }
        })
        .catch((resp) => {
          console.log("failt to get GetDeployedData ", resp);
          this.deployedStatus = false;
        });
    },
    changeNameSpace(namespace) {
      this.LoadDeployConfig(namespace);
    },

    changeServiceName(service) {
      if (this.appCode != service) {
        this.deploy_paramters.color = service.substring(
          service.lastIndexOf("-") + 1,
          service.length
        );
      } else {
        this.deploy_paramters.color = "default";
      }
      this.deploy_paramters.service_name = service;
      this.LoadDeployConfig(this.deploy_paramters.namespace);
    },

    //加载环境变量
    LoadEnvConfig(model) {
      var index = getEnvNameIndex(this.deployment_env);
      // if (!this.deploy_paramters.color) {
      //   this.deploy_paramters.color = "default";
      // }
      this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/appDeploy/env/variables/" +
          this.appId +
          "/" +
          model +
          "/" +
          index +
          "/" +
          this.deploy_paramters.color,
        method: "get",
      })
        .then((res) => {
          if (res.status == 200) {
            this.deploy_paramters.envs = [];
            this.vm_deploy_paramters.envs = [];
            if (res.data.data != null) {
              res.data.data.forEach((en) => {
                var env = {
                  value: en.value,
                  key: en.key,
                  time: en.key,
                };
                if (model === 1) {
                  this.deploy_paramters.envs.push(env);
                } else {
                  this.vm_deploy_paramters.envs.push(env);
                }
              });
            }
          }
        })
        .catch((res) => {});
    },

    //根据环境加载配置信息
    LoadDeployConfig(selectedNamespace) {
      var index = getEnvNameIndex(this.deployment_env);
      this.axios({
        method: "get",
        url:
          this.GLOBAL.baseUrl +
          "/cluster/teamns/" +
          index +
          "/" +
          this.appId +
          "/",
      })
        .then((response) => {
          if (response.status == 200) {
            this.deploy_namespace = response.data.data;
            if (this.deploy_namespace != null) {
              if (this.deploy_namespace.length > 0) {
                // for (var i = 0; i < this.deploy_namespace.length; i++) {
                //   if (this.deploy_namespace[i].isDefault) {
                //     selectedNamespace = this.deploy_namespace[i].isDefault;
                //     break;
                //   }
                // }
                if (selectedNamespace == "") {
                  selectedNamespace = this.deploy_namespace[0].name;
                }
                this.config_title =
                  "[已配置]默认选中命名空间" + selectedNamespace;
                this.deploy_paramters.namespace = selectedNamespace;
                var tempServiceName = this.appCode;
                // if (index == 1) {
                //   if (this.deploy_paramters.service_name == this.appCode) {
                //     tempServiceName = this.appCode + "-" + this.deploy_paramters.color;
                //   } else {
                //     tempServiceName = this.deploy_paramters.service_name;
                //   }
                // }
                this.GetK8sConfiguration(
                  this.deploy_paramters.namespace,
                  tempServiceName,
                  index
                )
                  .then((res) => {
                    if (res.code == 200) {
                      if (res.data != null) {
                        this.deploy_paramters.instance_cores = Number(
                          res.data.data.resourcesLimit.cpu
                        );
                        this.deploy_paramters.instance_mem_gb = Number(
                          res.data.data.resourcesLimit.cpu * 2
                        );
                        this.deploy_paramters.instance_num =
                          res.data.data.replicas;
                        // this.deploy_paramters.envs = [];
                        //  if (res.data.data.env != null) {
                        //   res.data.data.env.forEach((en) => {
                        //     var env = {
                        //       value: en.value,
                        //       key: en.key,
                        //       time: en.key,
                        //     };
                        //     this.deploy_paramters.envs.push(env);
                        //   });
                        // }
                        this.deploy_paramters.ports = [];
                        if (res.data.data.services.ingressServices != null) {
                          res.data.data.services.ingressServices.forEach(
                            (p) => {
                              let port = {
                                port: p.port,
                                node_port: p.node_port,
                                ingressDomain: p.ingressDomain,
                                key: p.ingressDomain + "-" + Date.now(),
                              };
                              this.deploy_paramters.ports.push(port);
                            }
                          );
                        }
                      } else {
                        this.deployedStatus = false;
                      }
                    }
                  })
                  .catch((re) => {
                    console.log(re);
                  });
              }
            } else {
              this.config_title = "[未配置]";
              this.deploy_namespace = [];
              this.deploy_paramters = {
                service_name: this.appCode,
                namespace: "",
                instance_num: 0,
                instance_cores: "",
                ports: [],
                envs: [],
              };
            }
          }
          this.LoadEnvConfig(1);
        })
        .catch((response) => {
          console.log("err", response);
        });

      //加载serviceNames
      // if (index == 1) {
      //   this.axios({
      //     method: "get",
      //     url:
      //             this.GLOBAL.baseUrl +
      //             "/appDeploy/servicenames/" +
      //             index +
      //             "/" +
      //             this.appId +
      //             "/",
      //   })
      //           .then((response) => {
      //             if (response.status == 200) {
      //               this.deploy_serviceNames = response.data.data;
      //               if (this.deploy_paramters.service_name == this.appCode) {
      //                 this.deploy_paramters.color = 'default';
      //               } else {
      //                 this.deploy_paramters.color = this.deploy_paramters.service_name.substring(
      //                         this.deploy_paramters.service_name.lastIndexOf('-')+1, this.deploy_paramters.service_name.length)
      //               }
      //               if (this.deploy_serviceNames.length == 0) {
      //                 this.deploy_serviceNames[0] = this.appCode;
      //                 this.deploy_paramters.color = 'default';
      //               }
      //             }
      //           })
      //           .catch((response) => {
      //             console.log("err", response);
      //           });
      // }
    },

    //增加端口填写事件
    AddPortChange: function (item) {
      // if ("DEV" == this.deployment_env) {
      //   item.ingressDomain = this.appCode + ".dev." + "ennewi.cn";
      // }
      // if ("FAT" == this.deployment_env) {
      //   item.ingressDomain = this.appCode + ".fat." + "ennewi.cn";
      // }
      // if ("UAT" == this.deployment_env) {
      //   item.ingressDomain = this.appCode + ".uat." + "ennewi.cn";
      // }
      // if ("PROD" == this.deployment_env) {
      //   item.ingressDomain = this.appCode + ".ennewi.cn";
      // }
      console.log("AddPortChange123");
      if(this.deploy_paramters.ports.length == 1){
           this.ingressIndexStr = "";
        }else{
          this.ingressIndexStr = "-" + (this.deploy_paramters.ports.length - 1);
        }
        item.ingressDomain = this.appCode + this.ingressIndexStr;
      if ("DEV" == this.deployment_env) {
        if (typeof this.devIngress != "undefined") {
          item.ingressDomain = item.ingressDomain + "." + this.devIngress;
        }
      }
      if ("FAT" == this.deployment_env) {
        if (typeof this.fatIngress != "undefined") {
          item.ingressDomain = item.ingressDomain + "." + this.fatIngress;
        }
      }
      if ("UAT" == this.deployment_env) {
        if (typeof this.uatIngress != "undefined") {
          item.ingressDomain = item.ingressDomain + "." + this.uatIngress;
        }
      }
      if ("PROD" == this.deployment_env) {
        if (typeof this.prodIngress != "undefined") {
          item.ingressDomain = item.ingressDomain + "." + this.prodIngress;
        }
      }
    },

    //检查 UAT环境和FAT环境
    CheckUATCFATPermission() {
      var roles = [];
      var roleStr = localStorage.getItem("roles");
      if ("" != roleStr) {
        roles = JSON.parse(roleStr);
      }
      if (roles.length != 0) {
        for (let index = 0; index < roles.length; index++) {
          var role = roles[index];
          console.log(role.roleName);

          if (
            role.roleName === "qa" ||
            role.roleName === "super-admin" ||
            role.roleName === "tanent-admin"
          ) {
            console.log("aaaa");
            this.isCanPublishUatFat = true;
            break;
          }
        }
      } else {
        this.isCanPublishUatFat = false;
      }

      console.log(this.isCanPublishUatFat);
    },
    // 弹出部署对话框
    ShowDeployment: async function (click_once) {
      this.CheckUATCFATPermission();
      this.click_once = click_once;
      if (
        this.imageAlreadyApproved === false &&
        this.imageInprogessApproved === false &&
        this.deployment_env === "PROD" &&
        this.isCurrentTenantCheck
      ) {
        this.disabelDeployBtn = true;
        this.CheckDeployPermission();
        return;
      }
      if (
        this.imageInprogessApproved &&
        this.deployment_env === "PROD" &&
        this.isCurrentTenantCheck
      ) {
        this.$notify.info({
          title: "提示",
          message: "即将进入工作流审批中心,请查看当前镜像审批所处节点",
        });
        this.$router.push("/taskCenter");
        return;
      }
      if (this.deployment_env === "FAT" || this.deployment_env === "UAT") {
        if (!this.isCanPublishUatFat) {
          this.$notify.error({
            title: "警告",
            message: "权限不足,非质量人员无法发布UAT和FAT环境",
          });
          return;
        }
      }
      // 检查制品是否打uat标签
      // if (this.deployment_env === "PROD") {
      //   const canDeploy = await this.CheckUATLables();
      //   if(!canDeploy){
      //     this.$notify.error({
      //       title: "警告",
      //       message: "制品未制作UAT环境标签,不能发布生产环境",
      //     });
      //     return;
      //   }
      // }
      if (this.deployment_env) {
        if (this.deployment_model == "1") {
          this.activeConfigNames = this.deployment_env;
          this.deploy_paramters.service_name = this.appCode;
          this.deployeInfo[0].name = this.appCode;
          this.deployeInfo[0].env = this.deployment_env;
          this.deployeInfo[0].cur_select_image = this.cur_version.image;
          this.dialogDeployment = true;

          this.deploy_paramters.branch = this.cur_version.branch;
          this.deploy_paramters.productName = this.cur_version.image;
          this.LoadDeployedInfo();
          this.GetDeployedData()
            .then((res) => {
              var envIndex = getEnvNameIndex(this.deployment_env);
              var selectedNameSpace = "";
              if (res.code == 200) {
                if (res.data != null) {
                  res.data.forEach((element) => {
                    if (element.envFlag == envIndex) {
                      selectedNameSpace = element.namespace;
                    }
                  });
                }
              }
              this.LoadDeployConfig(selectedNameSpace);
            })
            .catch((res) => {
              this.LoadDeployConfig("");
            });
        }
        if (this.deployment_model == "2") {
          this.VmDeployDialogTitle = "主机发布-容器化";
          this.selectedVms = [];
          var env_index = getEnvNameIndex(this.deployment_env);
          this.axios({
            url: this.GLOBAL.baseUrl + "/api/1.0/hosts/ips/env/" + env_index,
            method: "get",
          })
            .then((res) => {
              this.vm_deploy_paramters.envFlag = this.deployment_env;
              this.vm_deploy_paramters.app = this.appCode;
              this.vm_deploy_paramters.image = this.cur_version.image;
              this.vm_deploy_paramters.branch = this.cur_version.branch;
              this.vm_deploy_paramters.productName = this.cur_version.image;
              this.vmsOptions.length = 0;
              this.vmsOptions = [];
              if (res.status === 200) {
                if (res.data.code == 200) {
                  if (res.data.data != null) {
                    this.dialogvMDeployment = true;
                    this.LoadEnvConfig(2);
                    res.data.data.forEach((vm) => {
                      this.vmsOptions.push({
                        label: vm,
                        key: vm,
                      });
                    });
                  } else {
                    this.$message.error("无对应部署资源");
                  }
                }
              }
            })
            .catch((res) => {
              console.log(res);
              this.dialogvMDeployment = false;
              this.$message.error("虚机部署服务异常");
            });
        }
        if (this.deployment_model == "3") {
          this.VmDeployDialogTitle = "主机发布-非容器化";
          this.selectedVms = [];
          var env_index = getEnvNameIndex(this.deployment_env);
          this.axios({
            url: this.GLOBAL.baseUrl + "/api/1.0/hosts/ips/env/" + env_index,
            method: "get",
          })
            .then((res) => {
              this.vm_deploy_paramters.envFlag = this.deployment_env;
              this.vm_deploy_paramters.app = this.appCode;
              this.vm_deploy_paramters.image = this.cur_version.image;
              this.vm_deploy_paramters.branch = this.cur_version.branch;
              this.vm_deploy_paramters.productName = this.cur_version.image;
              this.vmsOptions.length = 0;
              this.vmsOptions = [];
              if (res.status === 200) {
                if (res.data.code == 200) {
                  if (res.data.data != null) {
                    this.dialogvMDeployment = true;
                    res.data.data.forEach((vm) => {
                      this.vmsOptions.push({
                        label: vm,
                        key: vm,
                      });
                    });
                  } else {
                    this.$message.error("无对应部署资源");
                  }
                }
              }
            })
            .catch((res) => {
              console.log(res);
              this.dialogvMDeployment = false;
              this.$message.error("虚机部署服务异常");
            });
        }
      } else {
        this.$message.warning("请选择发布环境.");
      }
      // console.log('this.cur_version:', this.cur_version)
    },

    // 开始部署按钮
    show_start_deployment: function () {
      this.show_start_deploy = false;
      this.show_deploy_check = true;
    },

    // 终止创建版本
    stop_ci: function (url) {
      this.stop_version_loading = true;
      let parms = {
        app_version: this.cur_version.app_version,
        appCode: this.cur_version.appCode,
      };
      this.axios({
        method: "PUT",
        url: url,
        data: parms,
      })
        .then((response) => {
          // console.log('stop_deploy:',response.data);
          if (response.data.status) {
            this.$message.success(response.data.message);
          } else {
            this.$message.error(response.data.error);
          }
          this.stop_version_loading = false;
        })
        .catch((response) => {
          this.stop_version_loading = false;
          this.$message.error(String(response));
        });
    },

    // 终止部署
    stop_deploy: function (url) {
      let parms = {
        env: this.deployment_info.env,
        appId: this.appCode,
        appCode: this.appCode,
        record_id: this.last_deployment.id,
      };
      this.axios({
        method: "PUT",
        url: url,
        data: parms,
      })
        .then((response) => {
          // console.log('stop_deploy:',response.data);
          if (response.data.status) {
            this.GetAppDeploymentData();
            this.$notify.success(response.data.message);
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$notify.error(String(response));
        });
    },

    // open terminal
    OpenTerminal: function () {
      // console.log('OpenTerminal:', this.pod)
      // return
      var options = {
        name: this.pod.metadata.name,
        namespace: this.pod.metadata.namespace,
        env: this.kube_env_id,
        lines: this.logSzie,
        container: this.container,
        follow: this.auto_refresh,
      };
      let terminalContainer = document.getElementById("terminal-container");
      document.getElementById("terminal-container").innerHTML = "";
      // if(terminalContainer){
      // }
      if (window.location.protocol == "https:") {
        var protocol = "wss://";
      } else {
        var protocol = "ws://";
      }
      let endpoint =
        protocol + window.location.host + this.$store.state.cicd.log_url;
      // let endpoint = 'ws://127.0.0.1:5000/api/kubernetes/pod-log.html';
      let term = new Terminal({
        // cols: 260,
        // rows: 60,
        useStyle: true,
        cursorBlink: true, // 光标闪烁
        // cursorStyle: "underline", // 光标样式  null | 'block' | 'underline' | 'bar'
        // tabStopWidth: 8, //制表宽度
        fontSize: 14,
        lineHeight: 1,
        convertEol: true,
        screenKeys: false,
        scrollback: 5000, //回滚
        visualBell: false,
        applicationCursor: true, // Needed for proper scrollback behavior in applications like vi
        mouseEvents: true,
      });
      term.open(terminalContainer);
      resize_term(term, websocket);
      //let websocket = new WebSocket(endpoint);//地址
      //this.websocket = websocket
      if (this.websocket === null || this.websocket.readyState !== 1) {
        this.websocket = new WebSocket(endpoint); //地址
        var websocket = this.websocket;
      } else if (this.websocket && this.websocket.readyState === 1) {
        this.websocket.close();
        this.websocket = new WebSocket(endpoint); //地址
        websocket = this.websocket;
      } else {
        return;
      }
      // websocket.binaryType = "arraybuffer";
      //连接成功
      websocket.onopen = function (ev) {
        websocket.send(JSON.stringify({ tp: "init", data: options }));
        //socket.send(JSON.stringify({"tp": "client", "data": "\r"}));
        term.writeln("Kubernetes Container Log...");
        term.writeln("By Ocean log...");
        //term.fit()
        resize_term(term, websocket);
      };
      //返回
      websocket.onmessage = function (ev) {
        var data = ev.data.toString();
        //console.log(data);
        term.write(data);
      };
      websocket.onclose = function (ev) {
        websocket.close();
        term.writeln("\r\n连接关闭");
        var shellprompt = "$ ";
        term.prompt = function () {
          term.write("\r\n" + shellprompt);
        };
        term.prompt();
        // console.log('websocket: close')
      };
      websocket.onerror = function (ev) {
        term.writeln("\r\nSocket on Error");
      };
      //选中 复制
      term.on("selection", function () {
        if (term.hasSelection()) {
          // console.log('selection:', term.getSelection())
          document.execCommand("Copy");
          // 几秒后消失
          document.getElementById("copyRemind").style.display = "block";
          setTimeout(function () {
            document.getElementById("copyRemind").style.display = "none";
          }, 3000);
        }
      });
      //粘贴 ctrl+v
      term.attachCustomKeyEventHandler(function (ev) {
        if (ev.keyCode == 86 && ev.ctrlKey) {
          websocket.send(new TextEncoder().encode("\x00" + this.copy));
        }
      });
      function resize_term(term, sock) {
        let c_height = terminalContainer.offsetHeight;
        let c_width = terminalContainer.offsetWidth;
        // console.log('w-h:', c_width, c_height)
        var innerHeight = c_height;
        var innerWidth = c_width;
        var cols = parseInt(innerWidth / 8) - 2;
        var rows = parseInt(innerHeight / 16);
        //console.log(innerHeight, innerWidth, Height);
        //console.log(cols, rows);
        // $(".show-size").text(innerWidth +" * "+innerHeight);
        // $(".show-size").show().delay(3000).fadeOut();
        term.resize(cols, rows);
        //sock.send(JSON.stringify({"tp": "resize", "data": {"cols": cols, "rows":rows}}));
      }
      window.onresize = function (ev) {
        if (term && websocket) {
          resize_term(term, websocket);
        }
      };
      // console.log('websocket finish.....')
    },

    // close terminal
    CloseTerminal: function () {
      if (this.websocket) {
        this.websocket.onclose();
        this.websocket = "";
      }
    },

    // 连接websocket 冻结按钮
    connectWS: function () {
      this.OpenTerminal();
      this.refresh_disabled = true;
      this.refresh_content = "3s刷新";
      let disabled_time = 3;
      let timeout = window.setInterval(() => {
        disabled_time--;
        this.refresh_content = disabled_time + "s刷新";
        if (disabled_time < 0) {
          window.clearInterval(timeout);
          this.refresh_content = "刷新";
          disabled_time = 3;
          this.refresh_disabled = false; //这里重新开启
        }
      }, 1000);
    },

    // 查看相关联的Events
    GetTgtEvent: function (url, row) {
      let field_selector =
        "involvedObject.kind=Pod,involvedObject.name=" +
        row.detail.metadata.name;
      this.axios({
        method: "GET",
        url: url,
        params: {
          env: this.kube_env_id,
          namespace: row.detail.metadata.namespace,
          field_selector: field_selector,
        },
      })
        .then((response) => {
          // console.log('GetTgtEvent:',response.data,);
          if (response.data.status) {
            this.tableDataEvents = response.data.rows;
            this.dialognTgtEvent = true;
          } else {
            this.$notify.error({ message: response.data.error });
          }
        })
        .catch((response) => {
          this.$notify.error({ message: String(response) });
        });
    },

    // 查看编译/sonar扫描日志
    showLog: function (_log) {
      this.dialogLog = true;
      this.axios({
        method: "GET",
        params: { historyId: this.cur_version.id },
        url: this.GLOBAL.pipeline_tag + "/v2/pipeline/log/",
      })
        .then((response) => {
          console.log("log", response);
          if (response.data) {
            console.log("get log path:", response);
            this.log =
              this.GLOBAL.devopsWebSocket +
              "/websocket/pipeline-log/" +
              response.data.buildHistoryId;
            this.init();
          } else {
            // console.log("logPath is empty, get again");
            // setTimeout(getLogPath, 5000);
          }
        })
        .catch((error) => {
          console.log("getLogPath error: " + error);
        });
    },

    // 查看容器日志
    showContainerLog: function (row) {
      // console.log('showContainerLog:', row)
      this.containers = row.detail.spec.containers;
      this.pod = row.detail;
      if (this.containers.length > 0) {
        this.container_log = true;
        this.container = this.containers[0].name;
        // this.OpenTerminal()
      } else {
        this.$notify.warning("Pod组中没有容器");
      }
    },

    // 当前时间换日期字符串
    getCurTime: function () {
      var now = new Date();
      var yy = now.getFullYear(); //年
      var mm = now.getMonth() + 1; //月
      var dd = now.getDate(); //日
      var hh = now.getHours(); //时
      var ii = now.getMinutes(); //分
      var ss = now.getSeconds(); //秒
      var clock = String(yy);
      if (mm < 10) clock += "0";
      clock += String(mm);
      if (dd < 10) clock += "0";
      clock += String(dd);
      if (hh < 10) clock += "0";
      clock += String(hh);
      if (ii < 10) clock += "0";
      clock += String(ii);
      if (ss < 10) clock += "0";
      clock += String(ss);
      return clock;
    },

    // kube pod目标状态信息
    statusInfo: function (detail) {
      //console.log("detail:", detail)
      let str_content = "";
      for (let i = 0; i < detail.status.conditions.length; i++) {
        str_content =
          str_content +
          '<div style="padding: 2px">' +
          detail.status.conditions[i]["type"] +
          ": " +
          detail.status.conditions[i]["status"] +
          "</div>";
      }
      str_content =
        str_content +
          '<div style="padding: 2px">Message: ' +
          detail.status.message || "-" + "</div>";
      str_content =
        str_content +
          '<div style="padding: 2px">Reason: ' +
          detail.status.reason || "-" + "</div>";
      return str_content;
    },

    // 跳转到变更记录列表
    goToCommits: function () {
      // this.$router.push(
      //   "/cicd/app/git-commits/?gitRepo=" +
      //     this.cur_version.gitRepo +
      //     "&branch=" +
      //     this.cur_version.branch +
      //     "&appCode=" +
      //     this.appCode +
      //     "&until=" +
      //     this.cur_version.ctime
      // );
      this.$router.push(
        "/cicd/app/git-commits/?buildNum=" +
          this.cur_version.id +
          "&gitRepo=" +
          encodeURI(this.pipeLineConfig.gitlabAddress) +
          "&branch=" +
          this.cur_version.branch +
          "&appCode=" +
          this.appCode
      );
    },

    // 跳转到对应sonar
    goToSonar: function () {
      let url =
        this.$store.state.cicd.sonar_url +
        this.cur_version.appCode +
        "_" +
        this.cur_version.branch;
      window.open(url, "_blank");
    },
    goToSec: function (sec_id) {
      let url =
        "http://scan-safe.ahotels.tech/report_form/?target_id=" + sec_id;
      window.open(url, "_blank");
    },

    // 跳转到对应sonar
    goToJenkinsSonarConsole: function () {
      // http://jenkins.ahotels.tech/view/all/job/sonar-scanner/308/console
      // this.cur_version.sonar_num
      if (this.cur_version_status.sonar_num) {
        let url =
          this.sonar_url + this.cur_version_status.sonar_num + "/console";
        window.open(url, "_blank");
      } else {
        this.$message.warning("Sonar扫描Number号还没生成，请稍候再试.");
      }
    },

    // 跳转到对应sonar
    goToJenkinsBuildConsole: function () {
      // http://jenkins.ahotels.tech/view/all/job/sonar-scanner/308/console
      // this.cur_version.sonar_num
      if (this.cur_version_status.makeNumber) {
        let url =
          this.sonar_url + this.cur_version_status.makeNumber + "/console";
        window.open(url, "_blank");
      } else {
        this.$message.warning("Build Number号还没生成，请稍候再试.");
      }
    },

    // 返回上一页
    goBack: function () {
      // window.history.back();
      this.$router.push("/cicd/app?appCode=" + this.appCode);
      clearInterval(this.version_timer);
      clearInterval(this.deploy_timer);
    },

    // 更新app的 产物路径、编译命令、project
    updataAppInfo: function (url) {
      let parms = {
        appid: this.AppData.appId,
        buildpath: this.newVersion.buildpath,
        make_args: this.AppData.make_args,
        project: this.newVersion.project,
        // 'git':'ssh://git@gitlab.infra.ahotels.tech:12422/iot/iot-construction.git'
      };
      // console.log('parms:', parms)
      this.Loading.service({ background: "rgba(0, 0, 0, 0.7)" });
      this.axios({
        method: "PUT",
        url: url,
        data: parms,
      })
        .then((response) => {
          // console.log('updataAppInfo:',response.data);
          if (response.data.code === 200) {
            // this.$notify({'type': 'success', 'message':response.data.msg})
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$notify.error("updataAppInfo: " + String(response));
        });
      this.Loading.service({ background: "rgba(0, 0, 0, 0.7)" }).close();
    },

    //  根据appId获取k8s的详细
    GetK8sAppData: function (url) {
      let parms = { appId: this.appId };
      this.axios({
        method: "GET",
        url: url,
        params: parms,
      })
        .then((response) => {
          // console.log('GetK8sAppData:',response.data);
          if (response.data.code === 200) {
            let temp = {};
            this.AppK8sData = response.data.data;
            if (response.data.data.list) {
              response.data.data.list.map(function (value, index, arr) {
                temp[value.env] = value;
              });
            }
            this.AppK8sDataDict = temp;
            // if(!this.AppK8sDataDict[this.deployment_env]){
            //   this.$notify.error('CMDB系统中上当前应用没有该环境k8s信息记录')
            //   this.dialogDeployment=false
            // }
            //console.log('AppK8sData:', this.AppK8sData)
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$notify.error("GetK8sAppData: " + String(response));
        });
    },
    closeSocket: function () {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },
    CloseDialogLog: function () {
      this.dialogLog = false;
    },
    stopBuild: function () {
      this.$confirm("是否确定停止此次构建?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            url:
              this.GLOBAL.pipeline_tag +
              "/v2/pipeline/stopPipeline/" +
              this.appId +
              "/" +
              this.cur_version.runId,
            method: "GET",
          })
            .then((response) => {
              console.log(response);
              if (response.status == 200) {
                this.cur_version_status.makeResult = "STOP";
                this.cur_version_status.version__finish = true;
                this.$message({
                  type: "success",
                  message: "操作成功",
                });
              }
            })
            .catch((response) => {
              console.log(response);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //check 该镜像是否已经审批
    checkImageAlreadyApproved: function () {
      var originTenantId = localStorage.getItem("originTenantId");

      if (this.GLOBAL.checkTenantIds.indexOf(originTenantId) > -1) {
        this.isCurrentTenantCheck = true;
      } else {
        this.isCurrentTenantCheck = false;
      }
      this.axios({
        method: "post",
        url: this.GLOBAL.baseUrl + "/publish/list/condition",
        data: JSON.stringify({
          appId: this.appCode,
          appImage: this.cur_version.image,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((result) => {
          console.log(result);
          if (result.status === 200) {
            if (result.data.code === 200) {
              if (JSON.stringify(result.data.data) != "{}") {
                if (result.data.data.approveStatus === 1) {
                  this.imageAlreadyApproved = true;
                } else if (result.data.data.approveStatus === 0) {
                  this.imageInprogessApproved = true;
                }
              } else {
                this.imageAlreadyApproved = false;
                this.imageInprogessApproved = false;
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
      getIngressSuffix() {
      //  console.log('getIngressSuffix-----getIngressSuffix');
      let url = this.GLOBAL.baseUrl + "/cluster/clusterIngress";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            this.devIngress = res.data.data.devIngressSuffix;
            this.fatIngress = res.data.data.fatIngressSuffix;
            this.uatIngress = res.data.data.uatIngressSuffix;
            this.prodIngress = res.data.data.prodIngressSuffix;
          }
        })
        .catch((err) => {});
    },
  },


  created() {},

  mounted() {
    showGuideInfo(appBuild, "appBuild", this.$driver);
    this.getCompileEnvList();
    this.getIngressSuffix();
    this.appCode = this.common.getUrlKey("appCode");
    this.appId = this.common.getUrlKey("appId");
    if (this.appId) {
      //this.updateVersionStatus();
      let AppDataUrl = this.GLOBAL.baseUrl + "/app/detail/" + this.appId;
      this.GetAppData(AppDataUrl);
      this.GetAppVersionData();
      // this.GetK8sAppData(this.k8s_app_url)
      //this.GetAppCiCdData(this.$store.state.cicd.app_resource_url);
    } else {
      this.$router.push("/cicd/app");
    }
  },

  components: {
    pagination: pagination,
    DeployHistory,
  },
  destroyed: function () {
    window.clearInterval(this.version_timer);
    window.clearInterval(this.deploy_timer);
    this.CloseTerminal();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },
};
</script>
<style scoped>
.main {
  height: calc(100% - 80px);
}
</style>

<style>
.main1 .el-card__body{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main1 .content{
  flex: 1;
  overflow-y: auto;
}
/deep/ .el-step__title.is-process {
  color: #409eff;
}
/deep/ .el-step__description.is-process {
  color: #409eff;
}
/deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 10px;
}
.el-transfer-panel {
  width: 300px;
}
.message_plain {
  height: 450px;
  overflow: auto;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
}
</style>

<style scoped>
/* 改版后的样式 */
.main {
  height: calc(100% - 80px);
}
.title-box {
  width: 100%;
  color: #343a40;
  font-size: 14px;
}
.title-box .bar {
  width: 4px;
  height: 14px;
  background: #0780ed;
  margin-right: 8px;
}
.back-box {
  font-size: 14px;
  color: #343a40;
  cursor: pointer;
}
.back-box .el-icon-arrow-left {
  margin-right: 8px;
  font-size: 16px;
}
.left-panel {
  padding: 24px;
  background: white;
  width: calc(100vw - 593px);
  margin-right: 24px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.left-panel.panel-isCollapse {
  width: calc(100vw - 748px);
}
.left-panel .header {
  margin-bottom: 25px;
}
.left-panel .table-box {
  flex: 1;
  overflow-y: auto;
}

.right-panel {
  height: 100%;
  flex-shrink: 0;
  width: 470px;
  overflow-y: auto;
}
.right-panel {
  flex-shrink: 0;
  width: 470px;
  overflow-y: auto;
}
.right-panel .box {
  flex: 1;
  padding: 24px;
  background: white;
  margin-bottom: 24px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.right-panel .version-step-box {
  background: #f8f9fa;
  border-radius: 4px;
  height: 100px;
  display: flex;
  align-items: center;
}
.right-panel .row {
  margin-bottom: 20px;
}
.right-panel .refresh-box {
  font-size: 14px;
  color: #0780ed;
  cursor: pointer;
  flex-shrink: 0;
}
.right-panel .item {
  margin-bottom: 20px;
}
.right-panel .item .label {
  color: #999;
  font-size: 14px;
  width: 70px;
  margin-right: 15px;
  flex-shrink: 0;
}
.right-panel .item .text {
  color: #000;
  font-size: 14px;
  word-break: break-all;
}
.right-panel .step-box {
  margin-bottom: 35px;
}
</style>
