<!--
 * @Author: your name
 * @Date: 2021-05-08 16:22:05
 * @LastEditTime: 2021-06-18 10:03:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\property\apply.vue
-->
<template>
  <div class="main">
    <!-- header -->
    <div class="searhBar flex flex-align-items-center">
      <span>搜索资源（信息）</span>
      <el-input
        v-model="searchMode.name"
        placeholder="请输入"
        clearable
        @keyup.enter.native="SearchSource"
        style="width: 344px; margin-right: 20px"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button type="primary" @click="SearchSource">查询</el-button>
    </div>

    <!-- content -->
    <div class="content">
      <div class="title">可申请的资源信息</div>
      <div class="list flex" v-show="appcount">
        <div class="item" v-for="(app, index) in apps" :key="index">
          <div class="item-wrap">
            <div class="img-box">
              <img v-if="app === 'Mysql'" src="../../assets/source/mysql.png" />
              <img v-if="app === 'Redis'" src="../../assets/source/redis.png" />
            </div>
            <div class="name">{{ app }}</div>
            <div class="btn-box flex-center-between">
              <span @click="ApplySource(app)">申请资源</span>
              <span @click="History">申请记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dashbord",
  data() {
    return {
      searchMode: {
        name: "",
      },
      apps: [],
      appcount: 0,
    };
  },
  methods: {
    SearchSource() {
      if (this.searchMode.name === "") {
        this.LoadMyApps();
        return;
      }
      let tempApp = this.apps;
      this.apps = [];
      tempApp.forEach((ap) => {
        if (this.searchMode.name.toLowerCase() === ap.toLowerCase()) {
          this.apps.push(ap);
        }
      });
    },
    //创建项目
    createProject() {
      this.$router.push(
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=appAply&processName=appAply&current=1"
      );
    },
    //构建
    goBuild(item) {
      this.$router.push(
        "/cicd/app/build/?appId=" + item.id + "&appCode=" + item.code
      );
    },
    //跳转到所有项目
    GoToAllProject() {
      this.$router.push("/cicd/app");
    },
    //加载app信息
    LoadMyApps() {
      this.apps = ["Mysql", "Redis"];
      this.appcount = this.apps.length;
    },
    History() {
      this.$router.push("/taskCenter");
    },
    ApplySource(app) {
      var applyKey = "";
      if (app === "Mysql") {
        applyKey = "dbApply_com";
      }
      if (app === "Redis") {
        applyKey = "redisApply";
      }
      this.$router.push(
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant" +
          "&processKey=" +
          applyKey +
          "&processName=" +
          applyKey +
          "&current=1"
      );
    },
  },
  mounted() {
    this.LoadMyApps();
  },
};
</script>
<style  scoped>
.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.list {
  background: #fafafa;
  padding: 20px 10px;
  box-sizing: border-box;
}
.list .item {
  padding: 0 10px;
  
  width: 25%;
}
.list .item .item-wrap{
  background: #ffffff;
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.list .item .img-box {
  width: 100%;
  padding-top: 35px;
  margin-bottom: 25px;
  text-align: center;
}
.list .item .img-box img{
  width: 80px;
  height: 80px;
}
.list .item .name{
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-bottom: 22px;
  text-align: center;
}
.list .item .btn-box{
  background: #0D53FC;
  padding: 15px 20px;
  border-radius:0 0 8px 8px ;
  color: white;
  font-size: 12px;
  cursor: pointer;
}
.title {
  margin-top: 40px;
  color: 3333;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>


