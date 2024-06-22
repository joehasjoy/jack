<!--
 * @Author: your name
 * @Date: 2021-07-01 17:28:14
 * @LastEditTime: 2021-07-28 16:35:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\cicd\app-build-mobile.vue
-->
<template>
  <el-card
    style="
      background-color: #f5f5f5;
      margin-left: -15px;
      height: 100%;
      overflow: auto;
      margin-bottom: 60px;
    "
  >
    <div style="position: relative">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最近运行" name="build">
          <el-row>
            <el-col :span="8" class="build-left-info">
              <el-row
                class="build-left-info-item"
                style="color: #409eff; font-size: 14px"
              >
                <el-col :span="24" style="font-size: 14px"
                  >#{{ lastBuildInfo.buildNum }} &nbsp;

                  <span v-if="lastBuildInfo.buildStatus === 'SUCCESS'"
                    >构建成功</span
                  >
                  <span v-if="lastBuildInfo.buildStatus === 'FAILURE'"
                    >构建失败</span
                  >
                  <span v-if="lastBuildInfo.buildStatus === 'BUILDING'"
                    >构建中</span
                  >
                  <span v-if="lastBuildInfo.buildStatus === 'CREATED'"
                    >准备中</span
                  >
                  <span v-if="lastBuildInfo.buildStatus === 'ABORTED'"
                    >终止</span
                  >

                  &nbsp;&nbsp;

                  <i
                    style="color: #15ad31; font-size: 18px"
                    class="el-icon-success"
                    v-if="lastBuildInfo.buildStatus === 'SUCCESS'"
                  ></i>
                  <i
                    style="color: red; font-size: 18px"
                    class="el-icon-error"
                    v-if="lastBuildInfo.buildStatus === 'FAILURE'"
                  ></i>
                  <i
                    style="color: #409eff; font-size: 18px"
                    class="el-icon-loading"
                    v-if="lastBuildInfo.buildStatus === 'BUILDING'"
                  ></i>
                  <i
                    style="color: #8c8c8c; font-size: 18px"
                    class="el-icon-time"
                    v-if="lastBuildInfo.buildStatus === 'CREATED'"
                  ></i>
                  <i
                    style="color: red; font-size: 18px"
                    class="el-icon-circle-close"
                    v-if="lastBuildInfo.buildStatus === 'ABORTED'"
                  ></i>
                  <el-button
                    v-if="lastBuildInfo.buildStatus === 'BUILDING'"
                    size="mini"
                    style="
                      float: right;
                      margin-right: 5px;
                      width: 70px;
                      color: white;
                    "
                    type="primary"
                    @click="StopBuild"
                    icon="el-icon-turn-off"
                    >终止</el-button
                  >
                </el-col>
              </el-row>
              <el-row class="build-left-info-item">
                <el-col :span="5">运行人</el-col>
                <div class="build-left-info-item-right">
                  <div class="user_avator">
                    <span
                      style="font-size: 8px; -webkit-transform: scale(0.7)"
                      >{{ lastBuildInfo.executor }}</span
                    >
                  </div>
                </div>
              </el-row>

              <el-row class="build-left-info-item">
                <el-col :span="5">开始时间</el-col>
                <div class="build-left-info-item-right">
                  {{ lastBuildInfo.buildStarTime }}
                </div>
              </el-row>

              <el-row
                class="build-left-info-item"
                v-if="
                  lastBuildInfo.buildStatus != 'BUILDING' &&
                  lastBuildInfo.buildStatus != 'CREATED'
                "
              >
                <el-col :span="5">持续时间</el-col>
                <div class="build-left-info-item-right">
                  {{ lastBuildInfo.buildDuration }}秒
                </div>
              </el-row>

              <el-row class="build-left-info-item">
                <el-col :span="5">产物</el-col>
                <div class="build-left-info-item-right" target="_blank">
                  <el-link :underline="false" :href="lastBuildInfo.productLink">
                    <span v-if="lastBuildInfo.productLink === ''"> 0项</span>
                    <span v-if="lastBuildInfo.productLink != ''"> 1项</span>
                  </el-link>
                </div>
              </el-row>
              <div style="height: 270px; width: 280px; margin-top: 10px">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="appData.logo"
                  fit="fit"
                ></el-image>
                <el-row class="info_row">
                  <el-col :span="6">应用名称</el-col>
                  <el-col :span="18">{{ appData.name }}</el-col>
                </el-row>
                <el-row class="info_row">
                  <el-col :span="6">发布代号</el-col>
                  <el-col :span="18">{{ appData.code }}</el-col>
                </el-row>
                <el-row class="info_row">
                  <el-col :span="6">发布渠道</el-col>
                  <el-col :span="18">{{ distributePort }}</el-col>
                </el-row>
                <el-row class="info_row">
                  <el-col :span="6">负责人</el-col>
                  <el-col :span="18">{{ appData.bizMgrName }}</el-col>
                </el-row>
                <el-row class="info_row">
                  <el-col :span="6">创建时间</el-col>
                  <el-col :span="18">{{ appData.insertTime }}</el-col>
                </el-row>
              </div>
            </el-col>
            <div class="build-work-place">
              <div
                class="build-work-place-item"
                v-for="(step, index) in current_steps"
                :key="step.id"
              >
                <div class="build-work-place-header">{{ step.title }}</div>
                <el-card
                  class="build-card-item"
                  shadow="hover"
                  v-if="lastBuildProcessArry[index] != undefined"
                  :style="
                    lastBuildProcessArry[index].stepStatus == 'SUCCESS' ||
                    lastBuildProcessArry[index].stepStatus == 'IN_PROGRESS'
                      ? 'border-top: 5px solid #15ad31'
                      : lastBuildProcessArry[index].stepStatus == 'FAILED' ||
                        lastBuildProcessArry[index].stepStatus == 'ABORTED'
                      ? 'border-top: 5px solid red'
                      : 'border-top: 5px solid #8c8c8c'
                  "
                >
                  <div slot="header">
                    <i
                      class="el-icon-success"
                      v-if="
                        lastBuildProcessArry[index].stepStatus === 'SUCCESS'
                      "
                      style="color: #15ad31; font-size: 18px"
                    ></i>
                    <i
                      class="el-icon-loading"
                      v-if="
                        lastBuildProcessArry[index].stepStatus === 'IN_PROGRESS'
                      "
                      style="color: #15ad31; font-size: 18px"
                    ></i>

                    <i
                      class="el-icon-error"
                      v-if="
                        lastBuildProcessArry[index].stepStatus === 'FAILED' ||
                        lastBuildProcessArry[index].stepStatus === 'ABORTED'
                      "
                      style="color: red; font-size: 18px"
                    ></i>

                    <i
                      class="el-icon-time"
                      v-if="lastBuildProcessArry[index].stepStatus === ''"
                      style="color: #8c8c8c; font-size: 18px"
                    ></i>
                    <span class="build-card-item-header">{{ step.name }}</span>
                  </div>
                  <div class="build-content-item">
                    <div class="build-content-item-center">
                      <span
                        v-if="
                          lastBuildProcessArry[index].stepStatus === 'FAILED'
                        "
                        >{{ step.title }}失败
                      </span>
                      <span
                        v-if="
                          lastBuildProcessArry[index].stepStatus === 'ABORTED'
                        "
                        >{{ step.title }}终止</span
                      >
                      <span
                        v-if="
                          lastBuildProcessArry[index].stepStatus === 'SUCCESS'
                        "
                        >{{ step.title }}成功</span
                      >
                      <span
                        v-if="
                          lastBuildProcessArry[index].stepStatus ===
                          'IN_PROGRESS'
                        "
                        >{{ step.title }}中</span
                      >
                      <span v-if="lastBuildProcessArry[index].stepStatus === ''"
                        >等待中</span
                      >
                    </div>
                    <div class="build-content-item-bottom">
                      <el-link
                        v-if="index == lastBuildProcessArry.length - 1"
                        :underline="false"
                        :href="lastBuildInfo.productLink"
                        target="_blank"
                        style="font-size: 11px; -webkit-transform: scale(1)"
                      >
                        产物地址 <i class="el-icon-link"></i>
                      </el-link>
                      &nbsp;&nbsp;
                      <el-link
                        @click="showLog(step.name)"
                        :underline="false"
                        style="font-size: 11px; -webkit-transform: scale(1)"
                      >
                        日志 <i class="el-icon-collection"></i>
                      </el-link>
                      <el-link
                        :underline="false"
                        style="
                          font-size: 11px;
                          -webkit-transform: scale(1);
                          margin-left: auto;
                        "
                      >
                        {{ lastBuildProcessArry[index].duration }}秒
                      </el-link>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="运行历史" name="history">
          <el-empty v-if="historyData.length === 0"></el-empty>
          <el-table
            v-if="historyData.length > 0"
            :data="historyData"
            stripe
            style="
              width: 100%;
              height: 60vh;
              background-color: white;
              overflow: auto;
            "
          >
            <el-table-column
              prop="buildNum"
              label="运行记录"
              width="180"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              sortable
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.status === 'FAILURE'"
                  class="el-icon-error"
                  style="color: red; font-size: 18px"
                ></i>
                <i
                  v-if="scope.row.status === 'ABORTED'"
                  class="el-icon-circle-close"
                  style="color: red; font-size: 18px"
                ></i>
                <i
                  v-if="scope.row.status === 'SUCCESS'"
                  class="el-icon-success"
                  style="color: #15ad31; font-size: 18px"
                ></i>
                <i
                  v-if="
                    scope.row.status === 'IN_PROGRESS' ||
                    scope.row.status === 'CREATED' ||
                    scope.row.status === 'BUILDING'
                  "
                  class="el-icon-loading"
                  style="color: #15ad31; font-size: 18px"
                ></i>
                <i
                  v-if="scope.row.status === ''"
                  class="el-icon-success"
                  style="color: #15ad31; font-size: 18px"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="codeCommit"
              sortable
              label="代码信息"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="codeBranchTag"
              sortable
              label="分支/Tag"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  >{{ scope.row.codeBranchTag }}/{{ scope.row.codeType }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="executorName"
              sortable
              label="运行人"
              align="center"
            >
            </el-table-column>
            <el-table-column sortable label="持续时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.duration }}秒
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              sortable
              label="开始时间"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="showSelect(scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center" v-if="historyData.length > 0">
            <pagination
              :small="false"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              @pagination="LoadHistory"
            ></pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="selectLabel"
          name="selectbuild"
          v-if="showSelectBuild"
        >
          <el-row>
            <el-col :span="8" class="build-left-info">
              <el-row
                class="build-left-info-item"
                style="color: #409eff; font-size: 14px"
              >
                <el-col :span="24" style="font-size: 14px"
                  >#{{ selectBuildInfo.buildNum }} &nbsp;

                  <span v-if="selectBuildInfo.buildStatus === 'SUCCESS'"
                    >构建成功</span
                  >
                  <span v-if="selectBuildInfo.buildStatus === 'FAILURE'"
                    >构建失败</span
                  >
                  <span v-if="selectBuildInfo.buildStatus === 'BUILDING'"
                    >构建中</span
                  >
                  <span v-if="selectBuildInfo.buildStatus === 'CREATED'"
                    >准备中</span
                  >
                  <span v-if="selectBuildInfo.buildStatus === 'ABORTED'"
                    >终止</span
                  >

                  &nbsp;&nbsp;

                  <i
                    style="color: #15ad31; font-size: 18px"
                    class="el-icon-success"
                    v-if="selectBuildInfo.buildStatus === 'SUCCESS'"
                  ></i>
                  <i
                    style="color: red; font-size: 18px"
                    class="el-icon-error"
                    v-if="selectBuildInfo.buildStatus === 'FAILURE'"
                  ></i>
                  <i
                    style="color: #409eff; font-size: 18px"
                    class="el-icon-loading"
                    v-if="selectBuildInfo.buildStatus === 'BUILDING'"
                  ></i>
                  <i
                    style="color: #8c8c8c; font-size: 18px"
                    class="el-icon-time"
                    v-if="selectBuildInfo.buildStatus === 'CREATED'"
                  ></i>
                  <i
                    style="color: red; font-size: 18px"
                    class="el-icon-circle-close"
                    v-if="selectBuildInfo.buildStatus === 'ABORTED'"
                  ></i>
                  <el-button
                    v-if="selectBuildInfo.buildStatus === 'BUILDING'"
                    size="mini"
                    style="
                      float: right;
                      margin-right: 5px;
                      width: 70px;
                      color: white;
                    "
                    type="primary"
                    @click="StopBuild"
                    icon="el-icon-turn-off"
                    >终止</el-button
                  >
                </el-col>
              </el-row>
              <el-row class="build-left-info-item">
                <el-col :span="5">运行人</el-col>
                <div class="build-left-info-item-right">
                  <div class="user_avator">
                    <span
                      style="font-size: 8px; -webkit-transform: scale(0.7)"
                      >{{ selectBuildInfo.executor }}</span
                    >
                  </div>
                </div>
              </el-row>

              <el-row class="build-left-info-item">
                <el-col :span="5">开始时间</el-col>
                <div class="build-left-info-item-right">
                  {{ selectBuildInfo.buildStarTime }}
                </div>
              </el-row>

              <el-row
                class="build-left-info-item"
                v-if="
                  selectBuildInfo.buildStatus != 'BUILDING' &&
                  selectBuildInfo.buildStatus != 'CREATED'
                "
              >
                <el-col :span="5">持续时间</el-col>
                <div class="build-left-info-item-right">
                  {{ selectBuildInfo.buildDuration }}秒
                </div>
              </el-row>

              <el-row class="build-left-info-item">
                <el-col :span="5">产物</el-col>
                <div class="build-left-info-item-right" target="_blank">
                  <el-link
                    :underline="false"
                    :href="selectBuildInfo.productLink"
                  >
                    <span v-if="selectBuildInfo.productLink === ''"> 0项</span>
                    <span v-if="selectBuildInfo.productLink != ''"> 1项</span>
                  </el-link>
                </div>
              </el-row>
              <el-collapse accordion style="margin-top: 10px">
                <el-collapse-item>
                  <template slot="title">
                    基本信息<i class="header-icon el-icon-info"></i>
                  </template>
                  <el-card style="height: 250px; width: 280px">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="appData.logo"
                      fit="fit"
                    ></el-image>

                    <el-row class="info_row">
                      <el-col :span="6">应用名称</el-col>
                      <el-col :span="18">{{ appData.name }}</el-col>
                    </el-row>
                    <el-row class="info_row">
                      <el-col :span="6">发布代号</el-col>
                      <el-col :span="18">{{ appData.code }}</el-col>
                    </el-row>
                    <el-row class="info_row">
                      <el-col :span="6">发布渠道</el-col>
                      <el-col :span="18">{{ distributePort }}</el-col>
                    </el-row>
                    <el-row class="info_row">
                      <el-col :span="6">负责人</el-col>
                      <el-col :span="18">{{ appData.bizMgrName }}</el-col>
                    </el-row>
                    <el-row class="info_row">
                      <el-col :span="6">创建时间</el-col>
                      <el-col :span="18">{{ appData.insertTime }}</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
              </el-collapse>
            </el-col>
            <div class="build-work-place">
              <div
                class="build-work-place-item"
                v-for="(step, index) in current_steps"
                :key="step.id"
              >
                <div class="build-work-place-header">{{ step.title }}</div>
                <el-card
                  class="build-card-item"
                  shadow="hover"
                  v-if="selectBuildProcessArry[index] != undefined"
                  :style="
                    selectBuildProcessArry[index].stepStatus == 'SUCCESS' ||
                    selectBuildProcessArry[index].stepStatus == 'IN_PROGRESS'
                      ? 'border-top: 5px solid #15ad31'
                      : selectBuildProcessArry[index].stepStatus == 'FAILED' ||
                        selectBuildProcessArry[index].stepStatus == 'ABORTED'
                      ? 'border-top: 5px solid red'
                      : 'border-top: 5px solid #8c8c8c'
                  "
                >
                  <div slot="header">
                    <i
                      class="el-icon-success"
                      v-if="
                        selectBuildProcessArry[index].stepStatus === 'SUCCESS'
                      "
                      style="color: #15ad31; font-size: 18px"
                    ></i>
                    <i
                      class="el-icon-loading"
                      v-if="
                        selectBuildProcessArry[index].stepStatus ===
                        'IN_PROGRESS'
                      "
                      style="color: #15ad31; font-size: 18px"
                    ></i>

                    <i
                      class="el-icon-error"
                      v-if="
                        selectBuildProcessArry[index].stepStatus === 'FAILED' ||
                        selectBuildProcessArry[index].stepStatus === 'ABORTED'
                      "
                      style="color: red; font-size: 18px"
                    ></i>

                    <i
                      class="el-icon-time"
                      v-if="selectBuildProcessArry[index].stepStatus === ''"
                      style="color: #8c8c8c; font-size: 18px"
                    ></i>
                    <span class="build-card-item-header">{{ step.name }}</span>
                  </div>
                  <div class="build-content-item">
                    <div class="build-content-item-center">
                      <span
                        v-if="
                          selectBuildProcessArry[index].stepStatus === 'FAILED'
                        "
                        >{{ step.title }}失败
                      </span>
                      <span
                        v-if="
                          selectBuildProcessArry[index].stepStatus === 'ABORTED'
                        "
                        >{{ step.title }}终止</span
                      >
                      <span
                        v-if="
                          selectBuildProcessArry[index].stepStatus === 'SUCCESS'
                        "
                        >{{ step.title }}成功</span
                      >
                      <span
                        v-if="
                          selectBuildProcessArry[index].stepStatus ===
                          'IN_PROGRESS'
                        "
                        >{{ step.title }}中</span
                      >
                      <span
                        v-if="selectBuildProcessArry[index].stepStatus === ''"
                        >等待中</span
                      >
                    </div>
                    <div class="build-content-item-bottom">
                      <el-link
                        v-if="index == selectBuildProcessArry.length - 1"
                        :underline="false"
                        :href="selectBuildInfo.productLink"
                        target="_blank"
                        style="font-size: 11px; -webkit-transform: scale(1)"
                      >
                        产物地址 <i class="el-icon-link"></i>
                      </el-link>
                      &nbsp;&nbsp;
                      <el-link
                        @click="showLog(step.name)"
                        :underline="false"
                        style="font-size: 11px; -webkit-transform: scale(1)"
                      >
                        日志 <i class="el-icon-collection"></i>
                      </el-link>
                      <el-link
                        :underline="false"
                        style="
                          font-size: 11px;
                          -webkit-transform: scale(1);
                          margin-left: auto;
                        "
                      >
                        {{ selectBuildProcessArry[index].duration }}秒
                      </el-link>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-button
        size="mini"
        type="warning"
        style="position: absolute; right: 110px; top: 5px; width: 90px"
        icon="el-icon-menu"
        @click="GoProcess"
        >构建流程</el-button
      >
      <el-button
        size="mini"
        style="position: absolute; right: 10px; top: 5px; width: 90px"
        icon="el-icon-s-tools"
        @click="GoConfigure"
        >构建参数</el-button
      >
      <el-button
        size="mini"
        style="position: absolute; right: 210px; top: 5px; width: 90px"
        type="primary"
        @click="StartRun"
        icon="el-icon-video-play"
        >构建运行</el-button
      >
    </div>

    <!--构建日志弹窗-->
    <el-dialog
      title="构建日志"
      center
      width="70%"
      :visible.sync="logDialogVisible"
      style="height: 900px"
    >
      <el-tabs tab-position="left" v-model="showLogIndex">
        <el-tab-pane
          :label="step.title"
          :name="step.name"
          v-for="(step, index) in current_steps"
          :key="step.id"
        >
          <div class="log_content">
            <div class="log_content-header">
              <span>{{ step.title }}日志</span>
              <el-link
                :underline="false"
                style="margin-left: auto; margin-right: 5px"
                >下载日志</el-link
              >
            </div>
            <pre
              v-if="
                lastBuildProcessArry[index] != undefined &&
                selectBuildProcessArry[index] != undefined
              "
              class="log_content-center"
              >{{
                activeName === "build"
                  ? lastBuildProcessArry[index].logTxt
                  : selectBuildProcessArry[index].logTxt
              }}</pre
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--构建配置选择-->

    <el-dialog
      title="运行配置"
      center
      width="45%"
      :visible.sync="selectConfigDialogVisible"
      style="height: 700px"
    >
      <el-form :model="SelectConfigModel" label-position="top">
        <div class="line" style="margin-top: -20px"></div>
        <el-form-item label="代码源">
          <el-cascader
            style="width: 300px"
            v-model="SelectConfigModel.codeSelect"
            :options="branchTagOptions"
            placeholder="请选择代码分支或Tag"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="运行备注">
          <el-input
            type="textarea"
            rows="5"
            v-model="SelectConfigModel.note"
            placeholder=""
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="StartBuild" type="primary">运 行</el-button>
          <el-button @click="selectConfigDialogVisible = false"
            >取 消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
import { getUseLanguageName } from "@/utils/pipeline.js";
import pagination from "@/components/Pagination/pagination";

export default {
  data() {
    return {
      current_steps: [],
      lastBuildProcessArry: [],
      selectBuildProcessArry: [],
      status_timer_arry: [],
      select_status_timer_arry: [],
      selectLabel: "",
      showSelectBuild: false,
      total: 10,
      page: 1,
      limit: 10,
      appData: {},
      appId: 0,
      appCode: "",
      showLogIndex: "",

      countSeconds: 0,
      lastBuildInfo: {
        id: 0,
        buildNum: 0,
        buildStatus: "",
        buildDes: "",
        buildStarTime: "0000-01-01 00:00:00",
        buildDuration: 0,
        executor: "ENN",
        productLink: "",
      },

      selectBuildInfo: {
        id: 0,
        buildNum: 0,
        buildStatus: "",
        buildDes: "",
        buildStarTime: "0000-01-01 00:00:00",
        buildDuration: 0,
        executor: "ENN",
        productLink: "",
      },

      lastCodeAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 1,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      selectCodeAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 1,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      lastBuildAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 2,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      selectBuildAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 2,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      lastUploadAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 3,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      selectUploadAction: {
        duration: 0,
        logTxt: "",
        stepName: "",
        stepOrder: 3,
        stepStatus: "",
        header_css: "border-top: 5px solid #64d16d",
      },
      branchTagOptions: [
        {
          value: "branch",
          label: "分支",
          children: [
            {
              value: "master",
              label: "master",
            },
            {
              value: "release",
              label: "release",
            },
          ],
        },
        {
          value: "tag",
          label: "Tag",
          children: [
            {
              value: "v 1.0",
              label: "v 1.0",
            },
            {
              value: "v 2.0",
              label: "v 2.0",
            },
          ],
        },
      ],
      SelectConfigModel: {
        codeSelect: ["branch", "master"],
      },
      selectConfigDialogVisible: false,
      log_txt: "",
      logDialogVisible: false,
      activeName: "build",
      historyData: [],
    };
  },
  computed: {
    headerCss() {
      return function (status) {
        return "";
      };
    },
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
              this.current_steps = result.data.data;
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
    // 更新应用基础信息
    updateApp: function (url) {
      this.$refs.Row.validate((valid) => {
        if (valid) {
          this.Row.ignoreverifyresult = !this.heath_check;
          this.axios({
            method: "PUT",
            url: url,
            data: this.Row,
          })
            .then((response) => {
              // console.log('updateApp:',response.data);
              if (response.data.status) {
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.error);
              }
            })
            .catch((response) => {
              this.$message.error(String(response));
            });
        } else {
          this.$message.warning("请输入合法数据");
        }
      });
    },

    showSelect(val) {
      this.initBuildStatus();
      this.showSelectBuild = true;
      this.activeName = "selectbuild";
      this.selectLabel = "构建 #" + val.buildNum;
      this.selectBuildInfo.id = val.id;
      this.selectBuildInfo.buildNum = val.buildNum;
      this.selectBuildInfo.buildStatus = val.status;
      this.selectBuildInfo.buildStarTime = val.createTime;
      this.selectBuildInfo.buildDuration = val.duration;
      this.selectBuildInfo.executor = val.executorName;
      this.selectBuildInfo.productLink = val.productInfo;
      //加载分步详细详情
      this.LoadBuildInfos(val.id);
    },
    //初始化页面状态
    initBuildStatus() {
      this.status_timer_arry.forEach((timer) => {
        window.clearInterval(timer);
      });
      this.select_status_timer_arry.forEach((timer) => {
        window.clearInterval(timer);
      });

      this.lastBuildProcessArry = [];
      this.selectBuildProcessArry = [];

      for (var i = 0; i < this.current_steps.length; i++) {
        this.lastBuildProcessArry.push({
          duration: 0,
          logTxt: "",
          stepName: "",
          stepOrder: i,
          stepStatus: "",
        });
        this.selectBuildProcessArry.push({
          duration: 0,
          logTxt: "",
          stepName: "",
          stepOrder: i,
          stepStatus: "",
        });
      }
      this.lastBuildInfo = {
        id: 0,
        buildNum: 0,
        buildStatus: "",
        buildDes: "",
        buildStarTime: "0000-01-01 00:00:00",
        buildDuration: 0,
        executor: "ENN",
        productLink: "",
      };
    },

    LoadHistory() {
      this.axios({
        url: this.GLOBAL.baseUrl + "/mobile/build/list",
        method: "post",
        data: {
          pageSize: this.limit,
          pageNumber: this.page,
          appId: this.appId,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.historyData = res.data.data.list;
            this.total = res.data.data.total;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleClick(tab, event) {
      this.initBuildStatus();
      if (tab.name === "history") {
        this.LoadHistory();
      } else if (tab.name === "build") {
        this.CheckLastBuild();
      } else {
        this.LoadBuildInfos(this.selectBuildInfo.id);
      }
    },
    showLog: function (val) {
      this.logDialogVisible = true;
      this.showLogIndex = val;
    },
    StartBuild: function () {
      var that = this;
      this.initBuildStatus();
      this.axios({
        url: this.GLOBAL.baseUrl + "/mobile/build/start",
        method: "POST",
        data: {
          executorName: localStorage.getItem("name"),
          executorId: localStorage.getItem("userName"),
          appId: this.common.getUrlKey("appId"),
          appCode: this.common.getUrlKey("appCode"),
          branchTag:
            this.SelectConfigModel.codeSelect.length > 0
              ? this.SelectConfigModel.codeSelect[0]
              : "branch",
          codeType:
            this.SelectConfigModel.codeSelect.length > 0
              ? this.SelectConfigModel.codeSelect[1]
              : "master",
        },
      })
        .then((response) => {
          this.selectConfigDialogVisible = false;
          if (response.data.code === 200) {
            this.$message({
              message: "构建任务创建成功,请耐心等待后续构建结果...",
              type: "success",
            });
            this.lastBuildInfo.buildNum = response.data.data.buildNum;
            this.lastBuildInfo.buildStarTime = response.data.data.createTime;
            this.lastBuildInfo.buildStatus = response.data.data.status;
            this.lastBuildInfo.id = response.data.data.id;
            that.countSeconds = 0;
          }
        })
        .catch((error) => {
          this.selectConfigDialogVisible = false;
          this.$message.error("操作失败,请检查构建配置");
        });
    },
    StopBuild: function () {
      var id = 0;
      if (this.activeName === "selectbuild") {
        id = this.selectBuildInfo.id;
      } else {
        id = this.lastBuildInfo.id;
      }
      this.$confirm("此操作将终止构建, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            url: this.GLOBAL.baseUrl + "/mobile/build/stop/" + id,
            method: "POST",
          })
            .then((response) => {
              if (response.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                });
              }
            })
            .catch((error) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消终止操作",
          });
        });
    },
    StartRun: function () {
      if (this.current_steps.length == 0) {
        this.$notify({
          title: "警告",
          message: "请先配置构建流程后再构建",
          type: "warning",
        });
        return;
      }
      this.selectConfigDialogVisible = true;
      this.activeName = "build";
    },
    CheckLastBuild: function () {
      this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/mobile/build/last/" +
          this.common.getUrlKey("appId"),
        method: "get",
      }).then((response) => {
        if (response.data.code === 200) {
          this.LoadBuildInfos(response.data.data);
        }
      });
    },
    LoadBuildInfos: function (id) {
      this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/mobile/build/process/" +
          id +
          "/" +
          this.common.getUrlKey("appId"),
        method: "get",
      })
        .then((response) => {
          if (response.data.code === 200) {
            if (this.activeName == "selectbuild") {
              this.selectBuildInfo.buildStatus = response.data.data.info.status;
              //为分步数据赋值
              //为分步数据赋值
              if (response.data.data.process.length > 0) {
                this.selectBuildProcessArry = [];
                for (var i = 0; i < this.current_steps.length; i++) {
                  var process = response.data.data.process[i];
                  if (process != undefined) {
                    this.selectBuildProcessArry.push(process);
                  } else {
                    this.selectBuildProcessArry.push({
                      duration: 0,
                      logTxt: "",
                      stepName: "",
                      stepOrder: i,
                      stepStatus: "",
                    });
                  }
                }
              }
            } else {
              this.lastBuildInfo.buildStatus = response.data.data.info.status;
              this.lastBuildInfo.id = response.data.data.info.id;
              if (
                this.lastBuildInfo.buildStatus === "SUCCESS" ||
                this.lastBuildInfo.buildStatus === "FAILURE" ||
                this.lastBuildInfo.buildStatus === "ABORTED"
              ) {
                this.lastBuildInfo.buildDuration =
                  response.data.data.info.duration;
              }

              this.lastBuildInfo.buildNum = response.data.data.info.buildNum;
              this.lastBuildInfo.productLink =
                response.data.data.info.productInfo;
              this.lastBuildInfo.buildStarTime =
                response.data.data.info.createTime;
              this.lastBuildInfo.executor =
                response.data.data.info.executorName;

              //为分步数据赋值
              if (response.data.data.process.length > 0) {
                this.lastBuildProcessArry = [];
                for (var i = 0; i < this.current_steps.length; i++) {
                  var process = response.data.data.process[i];
                  if (process != undefined) {
                    this.lastBuildProcessArry.push(process);
                  } else {
                    this.lastBuildProcessArry.push({
                      duration: 0,
                      logTxt: "",
                      stepName: "",
                      stepOrder: i,
                      stepStatus: "",
                    });
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    CheckBuildStatus: function () {
      this.LoadBuildInfos(this.lastBuildInfo.id);
    },
    GoConfigure: function () {
      this.$router.push(
        "/cicd/app/mobile-config?appId=" +
          this.common.getUrlKey("appId") +
          "&tabName=parms&app_code=" +
          this.common.getUrlKey("appCode")
      );
    },
    GoProcess: function () {
      this.$router.push(
        "/cicd/app/mobile-config?appId=" +
          this.common.getUrlKey("appId") +
          "&tabName=process&app_code=" +
          this.common.getUrlKey("appCode")
      );
    },
    getAppData: function () {
      this.axios({
        method: "GET",
        url: this.GLOBAL.baseUrl + "/app/detail/" + this.appId,
      })
        .then((response) => {
          if (response.data.code == 200) {
            console.log(response.data.data);
            this.appData = response.data.data;
          } else {
            this.$notify.error(response.data.error);
          }
        })
        .catch((response) => {
          this.$notify.error(String(response));
        });
    },
  },
  mounted() {
    this.appCode = this.common.getUrlKey("appCode");
    this.appId = this.common.getUrlKey("appId");
    this.CheckLastBuild();
    this.getAppData();
    this.initBuildStatus();
    this.LoadHistory();
    this.loadBuildSteps();
  },
  computed: {
    distributePort: function () {
      return getUseLanguageName(this.appData.useLanguage);
    },
  },
  watch: {
    "lastBuildInfo.buildStatus": function () {
      var that = this;
      if (
        this.lastBuildInfo.buildStatus != "SUCCESS" &&
        this.lastBuildInfo.buildStatus != "FAILURE" &&
        this.lastBuildInfo.buildStatus != "ABORTED"
      ) {
        if (this.activeName === "build") {
          var timer = window.setInterval(function () {
            that.CheckBuildStatus();
          }, 2000);
          this.status_timer_arry.push(timer);
        }
      } else {
        setTimeout(function () {
          that.status_timer_arry.forEach((timer) => {
            console.log(timer);
            window.clearInterval(timer);
          });
        }, 3000);
      }
    },
    "selectBuildInfo.buildStatus": function () {
      var that = this;
      if (
        this.selectBuildInfo.buildStatus != "SUCCESS" &&
        this.selectBuildInfo.buildStatus != "FAILURE" &&
        this.selectBuildInfo.buildStatus != "ABORTED"
      ) {
        if (this.activeName === "selectbuild") {
          var timer = window.setInterval(function () {
            that.CheckBuildStatus();
          }, 2000);
          this.select_status_timer_arry.push(timer);
        }
      } else {
        setTimeout(function () {
          that.select_status_timer_arry.forEach((timer) => {
            window.clearInterval(timer);
          });
        }, 2000);
      }
    },
  },
  components: {
    pagination: pagination,
  },
};
</script>

<style >
.build-left-info {
  border-radius: 10px;
  height: 70vh;
  background-color: #ffffff;
  width: 300px;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 10px;
  padding-top: 5px;
  font-size: 14px;
}
.build-left-info-item {
  margin-top: 20px;
  font-size: 14px;
}
.build-left-info-item-right {
  float: right;
  margin-right: 15px;
}
.build-work-place {
  height: 70vh;
  line-height: 88rpx;
  font-size: 30rpx;
  display: flex;
  overflow-x: auto;
}

.build-work-place-item {
  flex-basis: 172rpx;
  flex-shrink: 0;
  width: 300px;
  white-space: nowrap;
  background-color: #ffffff;
  border-right: #e5e5e5 solid 1px;
  margin-left: 4px;
  border-radius: 10px;
}
.user_avator {
  height: 30px;
  width: 30px;
  border-radius: 30px;
  color: #ffffff;
  background-color: #c48bd0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.build-work-place-header {
  font-size: 15px;
  margin-left: 12px;
  margin-top: 10px;
  color: #8c8c8c;
}
.build-card-item {
  width: 260px;
  margin-left: 20px;
  height: 200px;
  margin-top: 4px;
  border-top: 5px solid #8c8c8c;
}
.build-card-item-header {
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  color: #262626;
  color: var(--gray-08, #262626);
  font-weight: 500;
}
.build-content-item {
  height: 130px;
  width: 100%;
  margin-top: -15px;
}
.build-content-item-center {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.build-content-item-bottom {
  height: 30px;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  font-size: 12px;
}
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
.log_content {
  height: 600px;
  width: 100%;
  background-color: black;
}
.log_content-header {
  width: 100%;
  height: 40px;
  color: white;
  border-bottom: 1px solid white;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 5px;
}
.log_content-center {
  height: 800px;
  overflow: auto;
  margin: 0px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  color: white;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.line {
  width: 100%;
  height: 2px;
  border-top: 1px solid #8c8c8c;
}
.info_row {
  margin-top: 5px;
  border-bottom: 0.1px dashed #e5e5e5;
}
</style>