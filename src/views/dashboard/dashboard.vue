<!--
 * @Author: your name
 * @Date: 2021-04-14 14:05:01
 * @LastEditTime: 2021-07-13 20:43:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\dashboard\dashboard.vue
-->
<template>
  <div class="main flex-column">
    <div class="flex info-box">
      <div class="left-panel flex flex-justify-content-between">
        <div class="enniu-img">
          <img src="../../assets/img/enniu.png" alt="" />
        </div>

        <div
          class="flex-column flex-justify-content-center"
          style="margin-left: 192px"
        >
          <div class="flex">
            <img src="../../assets/enn.jpg" alt="" class="header-img" />
            <div>
              <div class="text">{{ noon }}好，{{ username }}</div>
              <div class="text1">欢迎使用研发工作台！</div>
            </div>
          </div>
          <div class="flex flex-align-items-center btn">
            <!-- <el-button round size="small" @click="toGetToken"
              >获取Token</el-button
            > -->
          </div>
        </div>
      </div>

      <div class="flex-column project-panel">
        <div class="wrap">
          <div class="flex-center-between">
            <div class="text">项目数</div>
            <img src="../../assets/img/icon_project.png" alt="" class="img" />
          </div>
          <div class="text1">Number</div>
          <div class="num" title="查看项目" @click="jumpProject">{{ appcount }}</div>
        </div>
      </div>

      <div class="center-panel">
        <div class="wrap">
          <div class="row-header flex flex-align-items-center">
            <img
              src="@/assets/img/release.gif"
              alt=""
              style="width: 50px; height: 50px; padding: 10px"
            />
            <div class="flex-column">
              <div class="text">新特性</div>
              <div class="time"></div>
            </div>
          </div>
          <vue-seamless-scroll
            :data="releaseData"
            class="seamless-warp"
            :class-option="optionSingleHeightTime"
          >
            <ul class="item">
              <li
                v-for="(item, index) in releaseData"
                :key="index"
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  font-size: 13px;
                  pading: 10px;
                  word-wrap: break-word;
                  margin-bottom: 5px;
                "
              >
                <div
                  style="word-wrap: break-word; font-weight: bold"
                  v-if="item.type === 'title'"
                >
                  {{ item.releaseContent }}
                </div>

                <div
                  style="word-wrap: break-word"
                  v-if="item.type === 'content'"
                >
                  &nbsp; &nbsp;{{ item.releaseContent }}
                </div>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>

      <div class="right-panel">
        <div class="wrap">
          <div class="row-header flex flex-align-items-center">公告信息</div>
          <div class="row flex-center-between">
            <div class="flex flex-align-items-center">
              <img src="@/assets/img/icon_zhinan.png" alt="" class="icon-img" />
              <el-link
                target="_blank"
                :underline="false"
                href="https://lfrz1.stor.enncloud.cn/ennew-pro/public/devops/devops_guide.mp4"
              >
                <span class="text">DevOps平台操作指南</span>
                <span class="new">New</span>
              </el-link>
            </div>
            <i class="el-icon-right"></i>
          </div>
          <div class="row flex-center-between">
            <div class="flex flex-align-items-center">
              <img src="@/assets/img/icon_doc.png" alt="" class="icon-img" />
              <!-- <el-link
                target="_blank"
                :underline="false"
                id="document"
                href="#"
              ></el-link> -->
		            <el-link
			            target="_blank"
			            :underline="false"
			            href="https://lfrz1.stor.enncloud.cn/ennew-dev/public/qT8I30Ep8LClHsA9/devops-portal-service-com/Devops接入文档2022.pdf"
		            >
				            <span class="text">接入文档</span>
				            <span class="new">New</span></el-link
		            >
            </div>
            <i class="el-icon-right"></i>
          </div>
          <div class="row flex-center-between">
            <div class="flex flex-align-items-center">
              <img
                src="@/assets/img/icon_feedback.png"
                alt=""
                class="icon-img"
              />
              <el-link
                id="feedback"
                target="_blank"
                :underline="false"
                :href="feedbackJump"
              >
                <span class="text">用户反馈</span>
                <span class="new">Hot</span></el-link
              >
            </div>
            <i class="el-icon-right"></i>
          </div>
          <img src="../../assets/img/msg_bg.png" alt="" class="bg" />
        </div>
      </div>
    </div>

    <!-- 开发人员dashborad -->
    <div class="content box" v-if="!isTanentAdmin">
      <div class="row">
        <div class="text">DevOps研发交付流程</div>
      </div>
      <div class="step-list flex-start-center">
        <div
          class="step-item flex flex-align-items-center"
          :class="index === activeStep ? 'active' : ''"
          v-for="(item, index) in devopsStep"
          :key="index"
          @click="changeStep(index)"
        >
          <div class="btn">{{ item }}</div>
          <!-- <i class="el-icon-arrow-right"></i> -->
          <div
            class="right-icon"
            v-show="index !== devopsStep.length - 1"
          ></div>
          <img
            src="../../assets/devops_guide/right.gif"
            alt=""
            class="gif"
            v-show="index !== devopsStep.length - 1"
          />
        </div>
      </div>
      <div
        class="deveops-item flex flex-center create"
        v-show="activeStep === 0"
      >
        <img :src="manage1" alt="" class="img" @click="lookView(manage1)" />
        <i class="el-icon-right"></i>
        <img :src="manage2" alt="" class="img" @click="lookView(manage2)" />
      </div>
      <div
        class="deveops-item flex flex-center create"
        v-show="activeStep === 1"
      >
        <img :src="create1" alt="" class="img" @click="lookView(create1)" />
        <i class="el-icon-right"></i>
        <img :src="create2" alt="" class="img" @click="lookView(create2)" />
      </div>
      <div
        class="deveops-item flex flex-center struct"
        v-show="activeStep === 2"
      >
        <img :src="struct1" alt="" class="img" @click="lookView(struct1)" />
        <i class="el-icon-right"></i>
        <img :src="struct2" alt="" class="img" @click="lookView(struct2)" />
        <i class="el-icon-right"></i>
        <img :src="struct3" alt="" class="img" @click="lookView(struct3)" />
      </div>
      <div
        class="deveops-item flex flex-center publish"
        v-show="activeStep === 3"
      >
        <img :src="publish1" alt="" class="img" @click="lookView(publish1)" />
        <i class="el-icon-right"></i>
        <img :src="publish2" alt="" class="img" @click="lookView(publish2)" />
        <i class="el-icon-right"></i>
        <img :src="publish3" alt="" class="img" @click="lookView(publish3)" />
        <i class="el-icon-right"></i>
      </div>
    </div>

    <div class="content content1 flex-column" v-if="!isTanentAdmin">
      <div
        class="
          row
          flex flex-justify-content-between flex-justify-content-center
        "
      >
        <div class="text">进行中的项目</div>
        <div class="text1" @click="GoToAllProject">全部项目</div>
      </div>
      <div class="list flex-wrap" v-if="appcount > 0">
        <div class="item" v-for="(app, index) in apps" :key="index">
          <div class="item-wrap">
            <div class="info flex-center-between">
              <div class="name">{{ app.code }}</div>

              <img :src="app.appImg" alt="" />
            </div>
            <div class="text-item">
              <span class="label">应用名</span>
              <span class="text">{{ app.name }}</span>
            </div>
            <div class="text-item">
              <span class="label">业务域</span>
              <span class="text">{{ app.teamName }}</span>
            </div>
            <div class="flex flex-justify-content-end">
              <el-button type="primary" @click="goBuild(app)">构建</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="no_projects" v-else>
        <div class="no_porject_item_top">当前无应用信息</div>
        <div class="no_porject_item_btn">
          <el-button type="primary" @click="createProject" id="create"
            >快速创建<i class="el-icon-right el-icon--right"></i
          ></el-button>
        </div>
      </div>
    </div>

    <!-- 运维人员dashborad -->
    <div class="content flex" v-else>
      <div class="left">
        <div class="box" style="padding-left: 10px; padding-right: 10px">
          <div class="title-box flex flex-align-items-center">
            {{
              curDomain
                ? curDomain + "资源占用"
                : curCluster.name
                ? curCluster.name + "资源占用"
                : "资源占用总览"
            }}
          </div>
          <div class="flex dashboard-box">
            <div class="item flex-1">
              <div class="wrap">
                <div class="flex-center-between title">
                  <div class="text">Cpu</div>
                  <img src="../../assets/img/icon_cpu.png" alt="" />
                </div>
                <div class="flex">
                  <div class="flex-1 flex-center" style="position: relative">
                    <el-progress
                      class="in"
                      type="circle"
                      :percentage="dashboardInfo.cpuReservedPercent"
                      :width="circleWidthObj.in"
                      :stroke-width="10"
                      color="#79DFFF"
                      :show-text="false"
                    ></el-progress>
                    <el-progress
                      class="out"
                      type="circle"
                      :percentage="dashboardInfo.cpuUsedPercent"
                      :width="circleWidthObj.out"
                      :stroke-width="10"
                      color="#0D53FC"
                      :show-text="false"
                    ></el-progress>
                  </div>
                  <div class="flex-1 flex-column flex-justify-content-center">
                    <div class="note-box flex-column in-note-box">
                      <div class="em">Used</div>
                      <div class="text">
                        {{ dashboardInfo.cpuUsedPercent }}%
                      </div>
                    </div>
                    <div class="note-box note-box1 flex-column in-note-box">
                      <div class="em">Reserved</div>
                      <div class="text">
                        {{ dashboardInfo.cpuReservedPercent }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item flex-1 flex-justify-content-center">
              <div class="wrap">
                <div class="flex-center-between title">
                  <div class="text">Memory</div>
                  <img src="../../assets/img/icon_memory.png" alt="" />
                </div>
                <div class="flex">
                  <div class="flex-1 flex-center" style="position: relative">
                    <el-progress
                      class="in"
                      type="circle"
                      :percentage="dashboardInfo.memReservedPercent"
                      :width="circleWidthObj.in"
                      :stroke-width="10"
                      color="#FFCF25"
                      :show-text="false"
                    ></el-progress>
                    <el-progress
                      class="out"
                      type="circle"
                      :percentage="dashboardInfo.memUsedPercent"
                      :width="circleWidthObj.out"
                      :stroke-width="10"
                      color="#0D53FC"
                      :show-text="false"
                    ></el-progress>
                  </div>
                  <div class="flex-1 flex-column flex-justify-content-center">
                    <div class="note-box flex-column in-note-box">
                      <div class="em">Used</div>
                      <div class="text">
                        {{ dashboardInfo.memUsedPercent }}%
                      </div>
                    </div>
                    <div class="note-box note-box2 flex-column out-note-box">
                      <div class="em">Reserved</div>
                      <div class="text">
                        {{ dashboardInfo.memReservedPercent }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item flex-1 flex-justify-content-center">
              <div class="wrap">
                <div class="flex-center-between title">
                  <div class="text">Pods</div>
                  <img src="../../assets/img/icon_pods.png" alt="" />
                </div>
                <div class="flex">
                  <div class="flex-1 flex-center" style="position: relative">
                    <el-progress
                      class="out"
                      type="circle"
                      :percentage="dashboardInfo.podUsedPercent"
                      :width="circleWidthObj.out"
                      :stroke-width="10"
                      color="#0D53FC"
                      :show-text="false"
                    ></el-progress>
                  </div>
                  <div class="flex-1 flex-column flex-justify-content-center">
                    <div class="note-box flex-column out-note-box">
                      <div class="em">Used</div>
                      <div class="text">
                        {{ dashboardInfo.podUsedPercent }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box" v-show="showChart">
          <div class="title-box flex flex-align-items-center">资源占用详情</div>
          <div class="chart-box flex">
            <div class="item flex-1 flex-center">
              <my-echart
                title="CPU占用"
                :seriesList="seriesListCpu"
                :xData="xData"
              ></my-echart>
            </div>
            <div class="item flex-1 flex-center">
              <my-echart
                title="内存占用"
                :seriesList="seriesListMemory"
                :xData="xData"
              ></my-echart>
            </div>
            <div class="item flex-1 flex-center">
              <my-echart
                title="POD占用"
                :seriesList="seriesListPods"
                :xData="xData"
              ></my-echart>
            </div>
          </div>
        </div>

        <div
          class="box"
          v-show="showTableData"
          style="height: 500px; overflow-y: auto"
        >
          <div class="title-box flex flex-align-items-center">
            {{ this.curCluster.name }}业务域资源占用
          </div>
          <div style="padding: 0 20px; box-sizing: border-box">
            <enn-table
              :tableColumn="tableColumn"
              :tableData="tableData"
              @handleOperationClick="handleOperationClick"
            ></enn-table>
          </div>
        </div>
      </div>
      <div class="right box" style="max-height: 864px">
        <div class="title-box flex flex-align-items-center flex-center-between">
          <div class="flex flex-align-items-center">
            <span>基本信息</span>
          </div>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-arrow-left"
            v-show="showTableData && !showTableDeTailData"
            @click="goBackAll('all')"
            >返回总览</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-arrow-left"
            v-show="!showTableData && showTableDeTailData"
            @click="goBackAll('cluster')"
            >返回{{ curCluster.name }}集群</el-button
          >
        </div>
        <div class="info-item">
          <div class="label flex flex-align-items-center">
            <img src="../../assets/img/icon_group.png" alt="" />
            {{ !showTableData && showTableDeTailData ? "业务域：" : "集群：" }}
          </div>
          <div class="text" v-if="!showTableData && showTableDeTailData">
            {{ curDomain }}
          </div>
          <div class="flex flex-align-items-center flex-wrap" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="'点击可查看' + item.name + '集群资源详情'"
              placement="top"
              v-for="(item, index) in clusterList"
              :key="index"
            >
              <div
                class="btn-item flex-center"
                :class="curCluster.name === item.name ? 'active' : ''"
                @click="changeCluster(item)"
              >
                {{ item.name }}
              </div>
            </el-tooltip>
          </div>
        </div>

        <div class="group-item flex-center-between">
          <div class="flex flex-align-items-center">
            <img src="../../assets/img/icon_cpu.png" alt="" />
            <div>
              <div class="label">CPU</div>
              <div class="text">Central Processing Unit</div>
            </div>
          </div>
          <div class="count">{{ dashboardInfo.cpuCount }}C</div>
        </div>
        <div class="group-item flex-center-between">
          <div class="flex flex-align-items-center">
            <img src="../../assets/img/icon_memory.png" alt="" />
            <div>
              <div class="label">内存</div>
              <div class="text">Memory</div>
            </div>
          </div>
          <div class="count">{{ dashboardInfo.memCount }}G</div>
        </div>
        <div class="group-item flex-center-between">
          <div class="flex flex-align-items-center">
            <img src="../../assets/img/icon_pods.png" alt="" />
            <div>
              <div class="label">POD数</div>
              <div class="text">Pods</div>
            </div>
          </div>
          <div class="count">{{ dashboardInfo.podConut }}</div>
        </div>
      </div>
    </div>
    <el-dialog title="我的Token" :visible.sync="tokenInfoVisible" width="40%">
      <el-form ref="addTeamForm" :model="tokenInfoForm" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Token:">
              <el-input disabled v-model="tokenInfoForm.token"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="copyToClip(tokenInfoForm.token)"
            >复制到剪切板</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="查看图片" :visible.sync="imgVisible" width="70%">
      <img :src="imgUrl" alt="" class="dialog-img" />
    </el-dialog>
  </div>
</template>

<script>
import { GoToPipeline } from "@/utils/pipeline.js";
import { showGuideInfo } from "@/utils/guide.js";
import "driver.js/dist/driver.min.css";
import dashboard from "@/guide/dashboard.js";
import javaImg from "../../assets/language/java.png";
import pythonImg from "../../assets/language/python.png";
import goImg from "../../assets/language/go.png";
import nodejsImg from "../../assets/language/nodejs.png";
import androidImg from "../../assets/language/android.png";
import iosImg from "../../assets/language/ios.png";
import flutterImg from "../../assets/language/flutter.png";
import miniProgramImg from "../../assets/language/mini-program.png";
import myEchart from "./components/ChartComponent.vue";
import EnnTable from "../../components/EnnTable/index.vue";
import create1 from "../../assets/devops_guide/create1.png";
import create2 from "../../assets/devops_guide/create2.png";
import manage1 from "../../assets/devops_guide/manage1.png";
import manage2 from "../../assets/devops_guide/manage2.png";
import publish1 from "../../assets/devops_guide/publish1.png";
import publish2 from "../../assets/devops_guide/publish2.png";
import publish3 from "../../assets/devops_guide/publish3.png";
import struct1 from "../../assets/devops_guide/struct1.png";
import struct2 from "../../assets/devops_guide/struct2.png";
import struct3 from "../../assets/devops_guide/struct3.png";
import {
  getMyAppsApi,
	getMyAppsRole,
  getTokenApi,
  getDashboardInfoApi,
  singleDataApi,
  appDetailApi,
} from "../../api/dashboard";
import releaseNote from "@/utils/releasenote.js";
import { copyHandle } from "@/utils/utils.js";
export default {
  name: "dashbord",
  data() {
    return {
      create1,
      create2,
      manage1,
      manage2,
      publish1,
      publish2,
      publish3,
      struct1,
      struct2,
      struct3,
      devopsStep: ["业务域管理", "创建应用", "应用构建", "应用发布"],
      imgVisible: false,
      imgUrl: "",
      activeStep: -1,
      releaseData: releaseNote,
      username: localStorage.getItem("username"),
      apps: [],
      guidelink: "./src/views/plop-templates/guide/guide.html",
      noon: "上午",
      appcount: 0,
      tokenInfoVisible: false, //token信息弹框
      tokenInfoForm: {
        token: "",
      },
      isTanentAdmin: false, // 是否是租户管理员
      seriesListCpu: [],

      seriesListMemory: [],
      seriesListPods: [],
      xData: [],
      showChart: true, // 是否显示资源占用柱状图
      showTableData: false, // 是否显示业务资源占用
      tableColumn: [
        { label: "业务域名称", prop: "teamName" },
        { label: "负责人", prop: "personName" },
        { label: "cpu", prop: "cpuUsedLv" },
        { label: "内存", prop: "memuUsedLv" },
        { label: "pod数", prop: "podUsedConut" },
        // { label: "操作", prop: "operationList" },
      ],
      tableData: [], // 资源占用table数据
      showTableDeTailData: false, // 是否显示应用列表数据
      tableColumnDetail: [
        { label: "AppId", prop: "appCode" },
        { label: "负责人", prop: "personName" },
        { label: "cpu", prop: "cpuUsed" },
        { label: "内存", prop: "memUsed" },
        { label: "pod数", prop: "podUsed" },
      ],
      tableDataDetail: [],
      dashboardInfo: {},
      clusterList: [], // 集群
      curCluster: {}, // 当前集群
      curDomain: "", // 当前业务域
	    feedbackJump: ''
    };
  },
  components: {
    myEchart,
    EnnTable,
  },
  methods: {
		// 点击项目数跳转
	  jumpProject(){
			if (this.appcount !== 0){
				this.$router.push('/cicd/app');
			}
	  },
    // 切换步骤
    changeStep(index) {
      this.activeStep = index;
    },
    lookView(imgUrl) {
      this.imgVisible = true;
      this.imgUrl = imgUrl;
    },
    //创建项目
    createProject() {
      this.$router.push(
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=appAply&processName=appAply&current=1"
      );
    },
    //构建
    goBuild(item) {
      let row = {
        id: item.id,
        code: item.code,
        groupIdStr: item.teamName,
        useLanguage: item.appType,
      };
      GoToPipeline(row, this.GLOBAL, this.$router);
    },
    //跳转到所有项目
    GoToAllProject() {
      this.$router.push("/cicd/app");
    },
    //加载app信息
    async getMyApps() {
		    //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
		    if (this.$store.getters.authLoginToken){
						
				    let url = '';
				    let parms = {};
				    let resParam = this.common.handleAuthLoginParams(parms,`/home-page/apps/role/`)
				    parms = resParam.parms;
				    url = resParam.url;
				    await this.axios({
						    url: url,
						    params: parms,
						    method: "get",
				    })
					  .then((result) => {
						   this.appcount = result.data.data.countApps
						   this.feedbackJump = `https://feedback-workorder-customer-web.ennew.com?channel=cyz&secretKey=K000000087669steldj&userId=${this.$store.getters.authLoginUserId}` // 用户反馈跳转
					  })
			      // 超管加载资源面板不需要myapps
		    } else {
				    // 查询应用数
				    let result = await getMyAppsRole();
				    this.feedbackJump = `https://feedback-workorder-customer-web.ennew.com?channel=cyz&secretKey=K000000087669steldj&userId=${result.data.acountInfo.userId}`  // 用户反馈跳转
				    this.appcount = result.data.countApps;
				    let res = await getMyAppsApi();
				    let { code, data } = res;
				    if (code === 200) {
						    let urlMap = {
								    1: javaImg,
								    2: pythonImg,
								    3: goImg,
								    4: nodejsImg,
								    5: nodejsImg,
								    6: androidImg,
								    7: iosImg,
								    8: flutterImg,
								    9: miniProgramImg,
						    };
						    let apps = data;
						    if (apps.length) {
								    apps.map((item) => {
										    item.appImg = urlMap[item.appType];
								    });
								    this.apps = apps;
						    }
				    }
		    }
    },
    //加载上下午信息
    loadNoonInfo() {
      var d = parseInt(new Date().getHours());
      if (6 > d && d >= 0) {
        this.noon = "凌晨";
      }
      if (12 > d && d >= 6) {
        this.noon = "上午";
      }
      if (18 > d && d >= 12) {
        this.noon = "下午";
      }
      if (24 > d && d >= 18) {
        this.noon = "晚上";
      }
    },
    //打开获取Token
    async toGetToken() {
      let res = await getTokenApi();
      let { code, data } = res;
      if (code === 200) {
        this.tokenInfoForm.token = data;
        this.tokenInfoVisible = true;
      }
    },
    // 复制
    copyToClip(content) {
      copyHandle(content, this);
      this.tokenInfoVisible = false;
    },

    // 判断是否租户管理员，展示相对应dashboard
    dealRoles() {
	    //   处理与参与者中心解耦 - 降级判断如果是超级管理员加载资源面板
	    if (this.$store.getters.authLoginToken){
		    this.isTanentAdmin = true
		    this.getDashboardInfo();
	    }
			
      let roles = localStorage.getItem("roles");
      if (roles) {
        roles = JSON.parse(roles);
        this.isTanentAdmin = roles.some((item) => {
          return item.roleName === "tanent-admin";
        });

        this.getMyApps();
        // 租户管理员权限 获取dashboard数据
        if (this.isTanentAdmin) {
          this.getDashboardInfo();
        }
      } else {
		      //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
		      if (this.$store.getters.authLoginToken){
				      this.getMyApps();
		      }
      }
    },

    // 返回资源总览
    goBackAll(type) {
      if (type === "all") {
        this.curCluster = {};
        this.showChart = true;
        this.showTableData = false;
        this.getDashboardInfo();
      } else {
        this.curDomain = "";
        this.showTableData = true;
        this.showTableDeTailData = false;
        this.getCluster();
      }
    },

    // 获取dashboard数据
    async getDashboardInfo() {
	    //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
	    let res = null;
	    if (this.$store.getters.authLoginToken){
		    let url = '';
		    let parms = {};
		    let resParam = this.common.handleAuthLoginParams(parms,`/dashboard/cluster/info`)
		    parms = resParam.parms;
		    url = resParam.url;
		     res =  await this.axios({
			    url: url,
			    params: parms,
			    method: "get",
		    })
			    .then((result) => {
						return result.data
			    })
				
	    }else {
         res = await getDashboardInfoApi();
	    }
			
	    let { code, data } = res;
	    if (code === 200) {
		    this.dashboardInfo = { ...data };
		    let chartData = data.data;
		    this.clusterList = data.data;
		    let xData = [],
			    cpuUsedData = [],
			    memoryUsedData = [],
			    podUsedData = [],
			    cpuReversedData = [],
			    memoryReversedData = [];
		    if (chartData.length > 0) {
			    chartData.forEach((item) => {
				    xData.push(item.name);
				    cpuUsedData.push({
					    value: item.cpu.used,
					    id: item.id,
					    name: item.name,
					    type: "cpu",
				    });
				    memoryUsedData.push({
					    value: item.mem.used,
					    id: item.id,
					    name: item.name,
					    type: "memory",
				    });
				    podUsedData.push({
					    value: item.pod.used,
					    id: item.id,
					    name: item.name,
					    type: "pod",
				    });
				
				    cpuReversedData.push({
					    value: item.cpu.reserved,
					    id: item.id,
					    name: item.name,
					    type: "cpu",
				    });
				    memoryReversedData.push({
					    value: item.mem.reserved,
					    id: item.id,
					    name: item.name,
					    type: "memory",
				    });
			    });
			    this.seriesListCpu = [
				    {
					    name: "Used",
					    data: cpuUsedData,
					    color: "#0D53FC",
				    },
				    {
					    name: "Reserved",
					    data: cpuReversedData,
					    color: "#79DFFF",
				    },
			    ];
			    this.seriesListMemory = [
				    {
					    name: "Used",
					    data: memoryUsedData,
					    color: "#0D53FC",
				    },
				    {
					    name: "Reserved",
					    data: memoryReversedData,
					    color: "#FFCF25",
				    },
			    ];
			    this.seriesListPods = [
				    {
					    name: "Used",
					    data: podUsedData,
					    color: "#0D53FC",
				    },
			    ];
			    this.xData = xData;
		    }
	    }
    },
    // 点击柱状图事件
    changeCluster(e) {
      this.showChart = false;
      this.showTableData = true;

      this.curCluster = {
        id: e.id,
        name: e.name,
      };
      this.getCluster();
    },

    async getCluster() {
      let params = [this.curCluster];
	    //   处理与参与者中心解耦 - 降级判断，参数 URL 处理
	    let res = null;
	    if (this.$store.getters.authLoginToken){
		    let url = '';
		    let parms = '';
		    let resParam = this.common.handleAuthLoginParams(parms,`/dashboard/cluster/info/single`,'post')
		    url = resParam.url;
		    res =  await this.axios({
			    url: url,
			    data: params,
			    method: "post",
		    })
			    .then((result) => {
				    return result.data
			    })
		
	    }else {
		     res = await singleDataApi(params);
	    }
      let { data, code } = res;
      if (code === 200) {
        this.dashboardInfo = { ...data };
        let tableData = data.data || [];
        if (tableData.length > 0) {
          tableData.map((item) => {
            item.cpuUsedLv = `${item.cpuUsedLv}%`;
            item.memuUsedLv = `${item.memuUsedLv}%`;
            // item.operationList = [
            //   {
            //     name: "应用资源占用详情",
            //     value: "detail",
            //   },
            // ];
          });
        }
        this.tableData = tableData;
      }
    },

    // 应用资源占用详情
    async handleOperationClick(e) {
      this.showTableDeTailData = true;
      this.showTableData = false;
      let { row } = e;
      this.curDomain = row.teamName;
      let params = {
        domainId: row.id,
        domainName: row.teamName,
        clusterId: this.curCluster.id,
      };
      let res = await appDetailApi(params);
      let { data, code } = res;
      if (code === 200) {
        this.dashboardInfo = { ...data };
        this.tableDataDetail = data.data || [];
      }
    },
  },
  computed: {
    optionSingleHeightTime() {
      return {
        singleHeight: 90,
        waitTime: 1500,
        step: 1,
      };
    },

    // 适配
    circleWidthObj() {
      let circleWidth = {
        out: 108,
        in: 56,
      };
      if (window.document.body.clientWidth > 1440) {
        circleWidth = {
          out: 168,
          in: 116,
        };
      }
      return circleWidth;
    },
  },
  mounted() {
    this.loadNoonInfo();
    this.dealRoles();
    showGuideInfo(dashboard, "dashboard", this.$driver);
    this.$EventBus.$on("token", (msg) => {
      this.toGetToken();
    });
  },
};
</script>

<style scoped  lang="scss">
.main {
  padding: 0;
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.no_projects {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-items: center;
}
.no_porject_item_top {
  width: 100%;
  height: 100px;
  text-align: center;
  margin-bottom: 6px;
  font-size: 36px;
  color: rgb(143, 146, 152);
  line-height: 30px;
  margin-top: 30px;
}
.no_porject_item_btn {
  width: 100%;
  height: 100px;
  text-align: center;
  margin-bottom: 6px;
  font-size: 36px;
  line-height: 30px;
  margin-top: 25px;
}
.new {
  box-sizing: border-box;
  padding: 0 6px;
  border-radius: 4px 8px 0 0;
  font-style: oblique;
  font-size: 12px;
  font-family: DIN-MediumItalic;
  color: white;
  position: relative;
  float: right;
  top: -5px;
  left: 5px;
  background: linear-gradient(180deg, #ee3238 0%, #ff6368 100%);
}

/* 改版后的样式 */
.info-box {
  margin-top: 20px;
  margin-bottom: 15px;
}
.left-panel {
  flex: 3;
  background-image: url(../../assets/img/bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: white;
  position: relative;
  margin-left: -10px;
  height: 194px;
}
.left-panel .enniu-img {
  width: 152px;
  height: 222px;
  position: absolute;
  left: 18px;
  top: -20px;
}
.left-panel .enniu-img img {
  width: 100%;
  height: 100%;
}
.left-panel .header-img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin-right: 12px;
}
.left-panel .text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}
.left-panel .btn {
  margin-top: 14px;
  margin-left: 64px;
}
.project-panel {
  flex: 1;
  margin-left: 10px;
  padding: 10px 0;
  box-sizing: border-box;
}
.project-panel .wrap {
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  height: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  position: relative;
}
.project-panel .img {
  width: 24px;
  height: 24px;
}
.project-panel .text {
  font-size: 16px;
  font-weight: bold;
}
.project-panel .text1 {
  color: #999999;
  font-size: 14px;
}
.project-panel .num {
  font-size: 50px;
  font-weight: bold;
  position: absolute;
  left: 20px;
  bottom: 4px;
	cursor: pointer;
}
.project-panel .num:hover {
	font-size: 55px;
}

.center-panel {
  flex: 2;
  padding: 10px 0;
  box-sizing: border-box;
  margin-left: 16px;
}
.center-panel .wrap {
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
}

.center-panel .text {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.center-panel .row-header img {
  width: 44px;
  height: 44px;
  margin-left: 10px;
}
.seamless-warp {
  height: 120px;
  overflow: hidden;
  padding-left: 15px;
}
.right-panel {
  flex: 2;
  padding: 10px 0;
  margin-left: 16px;
  box-sizing: border-box;
  position: relative;
}
.right-panel .bg {
  width: 70px;
  height: 70px;
  position: absolute;
  right: 0px;
  top: -20px;
}
.right-panel .wrap {
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
}

.right-panel .row-header {
  padding-left: 20px;
  padding-top: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.right-panel .row {
  margin-bottom: 16px;
  padding: 0 20px;
}
.right-panel .row .el-icon-right {
  font-size: 18px;
  font-weight: bold;
}
.right-panel .row .text {
  color: #666;
  font-size: 14px;
}
.right-panel .row .icon-img {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* 内容 */
.content1 {
  background: white;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  min-height: 400px;
  flex: 1;
  overflow-y: auto;
}
.content .left {
  flex: 2.6;
  // flex: 1;
  margin-right: 20px;
}
.content .right {
  // min-width: 320px;
  // max-width: 360px;
  flex: 1;
}
.content .row {
  padding: 19px;
  font-weight: bold;
}
.content .row .text {
  font-size: 14px;
  color: #000000;
}
.content .row .text1 {
  font-size: 14px;
  color: $primary;
  font-weight: bold;
  cursor: pointer;
}
.content .list {
  padding: 0 5px;
  box-sizing: border-box;
}
.content .list .item {
  width: 33.33%;
  padding-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 20px;
}
.content .list .item .item-wrap {
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0 0 6px 6px;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}
.content .list .item::after {
  content: "";
  width: calc(100% - 30px);
  height: 12px;
  background: $primary;
  position: absolute;
  top: -6px;
  left: 15px;
  border-radius: 12px;
  z-index: 1;
}
.content .list .item::before {
  content: "";
  width: calc(100% - 70px);
  height: 12px;
  background: rgba(15, 85, 250, 0.2);
  position: absolute;
  bottom: 12px;
  left: 35px;
  border-radius: 12px;
  z-index: 1;
}

.content .list .item .text-item {
  margin-bottom: 20px;
}
.content .list .item .text-item .label {
  color: #666;
  font-size: 14px;
  margin-right: 20px;
  font-weight: bold;
}
.content .list .item .text-item .text {
  color: #999;
  font-size: 14px;
}

.content .list .item .info {
  margin-bottom: 20px;
}
.content .list .item img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}
.content .list .item .name {
  font-size: 20px;
  color: #333;
  font-weight: bold;
}
.content .list .item .text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 18px;
  margin-bottom: 16px;
}

.box {
  border-radius: 8px;
  padding-bottom: 20px;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
}
.content .title-box {
  width: 100%;
  color: #343a40;
  font-size: 14px;
  line-height: 60px;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
}
.group-item {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 76px;
  border-radius: 10px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  border: 2px solid rgba(13, 83, 252, 0.3);
}
.group-item img {
  width: 26px;
  height: 26px;
  margin-right: 14px;
}
.group-item .label {
  color: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 4px;
}
.group-item .text {
  color: #999999;
  font-size: 12px;
}
.group-item .count {
  color: $primary;
  font-size: 20px;
  font-weight: bold;
}

.content .info-item {
  padding-left: 20px;
  // padding-right: 20px;
  box-sizing: border-box;
  margin-bottom: 30px;
}
.info-item img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.content .info-item .label {
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.content .info-item .text {
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.content .btn-item {
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
  height: 28px;
  color: #606266;
  font-size: 14px;
  border-radius: 5px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: #f9f9f9;
}
.content .btn-item.active {
  background: $primary;
  color: white;
}
.content .btn-item:nth-child(5n) {
  margin-left: 0 !important;
}
.content .dashboard-box .item {
  position: relative;
  padding: 0 10px;
  box-sizing: border-box;
}
.content .dashboard-box .item .wrap {
  background: #fafafa;
  border-radius: 5px;
  width: 100%;
  position: relative;
  padding: 12px 15px 20px 15px;
  box-sizing: border-box;
  /* display: flex;
  justify-content: center; */
}
.dashboard-box .item .title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.dashboard-box .item .title img {
  width: 24px;
  height: 24px;
}
.content .dashboard-box .in {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content .dashboard-box .note-box {
  color: #666;
  font-size: 12px;
  font-weight: bold;
  margin-left: 40px;
}
.dashboard-box .note-box .text {
  color: #333;
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
}

.content .dashboard-box .note-box .em {
  position: relative;
  padding-left: 20px;
}
.content .dashboard-box .note-box .em::before {
  content: "";
  width: 8px;
  height: 8px;
  background: #0d53fc;
  border-radius: 8px;
  margin-right: 12px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -4px;
}
.content .dashboard-box .note-box1 .em::before {
  background: #79dfff;
}
.content .dashboard-box .note-box2 .em::before {
  background: #ffcf25;
}

.content .dashboard-box .note-box.in-note-box {
  margin-bottom: 14px;
}
.content .panel1 {
  border: 1px solid #ededed;
  padding: 0px;
  width: calc(100% - 48px);
  margin: 0 auto;
  margin-bottom: 24px;
}
.content .chart-box .item {
  min-height: 420px;
  flex-shrink: 0;
}

.step-list {
  padding: 0 20px;
}
.step-item {
  position: relative;
}
.step-item .btn {
  padding: 9px 35px;
  border: 1px solid $primary;
  border-radius: 30px;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  min-width: 102px;
  text-align: center;
  background: white;
  position: relative;
  z-index: 1;
  margin-left: -2px;
  cursor: pointer;
}
.step-item.active .btn {
  color: white;
  background: $primary;
}

.step-item .right-icon {
  width: 100px;
  height: 21px;
  background: #409eff;
  opacity: 0.2;
  margin-left: -4px;
}
.step-item .gif {
  width: 60px;
  height: 20px;
  margin-left: -100px;
}
.step-item .el-icon-arrow-right {
  position: absolute;
  top: 14px;
  right: 24px;
  color: #409eff;
}

.create .img {
  width: 45%;
}
.struct .img,
.publish .img {
  width: 30%;
}
.deveops-item {
  padding: 20px;
}
.deveops-item .img {
  cursor: pointer;
  border-radius: 8px;
}
.deveops-item .el-icon-right {
  font-size: 30px;
  color: $primary;
  margin: 0 20px;
}
.dialog-img {
  width: 100%;
  height: auto;
}
</style>

<style>
.bs-sysMsg {
  position: relative;
  display: flex;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 2px;
  color: #e6a23c;
  background-color: #fdf6ec;
  overflow: hidden;
  opacity: 1;
  align-items: center;
  transition: opacity 0.2s;
}
.bs-sysMsg .msg__content {
  display: table-cell;
  padding: 0 8px;
  width: 100%;
}
.bs-sysMsg .msg__content a.item {
  color: #e6a23c;
  font-size: 14px;
  opacity: 0.75;
}
.bs-sysMsg .msg__content a.item:hover {
  text-decoration: underline;
}
</style>
