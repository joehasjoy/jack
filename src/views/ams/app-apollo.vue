<template>
  <div class="card-panel flex-column">
    <div
      slot="header"
      class="flex flex-align-items-center header"
      @click="goBack"
    >
      <i class="el-icon-arrow-left"></i>
      <span>返回</span>
    </div>
    <el-tabs
      v-model="activeName"
      class="my-tab flex-column"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="env.label"
        :name="env.selectValue"
        class="flex-column my-pane"
        v-for="(env, eIndex) in envOptions"
        :key="eIndex"
      >

      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";
import EnnTable from "@/components/EnnTable/index";

import {
  hpaListApi,
} from "../../api/api";
export default{
  data() {
    return {
      activeName: '',
      envOptions: [], // 环境变量
    }
  },
  methods: {
    // 获取环境变量
    getEnvList() {
      let envOptions =  localStorage.getItem('envs')
      envOptions = JSON.parse(envOptions)
      if(envOptions.length > 0) {
        envOptions.map(item => {
          item.label = item.selectValue.toUpperCase()
          return item
        })
        this.envOptions = envOptions
      }
    },
    goBack() {
       this.$router.go(-1)
    },
    // 切换环境
    handleClick(e) {
      this.activeName = e.name
    }
  },
  mounted() {
    this.getEnvList()
  }
}

</script>

<style scoped lang="scss">
.edit-form .el-select {
  width: 100%;
}
.edit-form {
  flex: 1;
  overflow-y: auto;
}
.card-panel {
  background: white;
  padding: 24px;
  height: calc(100% - 80px);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  box-sizing: border-box;
}
.card-panel {
  /deep/ .el-tabs__content {
    height: 100%;
  }
}
.card-panel .footer {
  margin-top: 30px;
  justify-content: flex-end;
}
.header {
  margin-bottom: 15px;
  cursor: pointer;
}
.header .el-icon-arrow-left {
  font-size: 16px;
  margin-right: 8px;
  color: #343a40;
}
.header span {
  font-size: 14px;
  color: #343a40;
}
.my-tab,
.table-box {
  flex: 1;
  overflow-y: auto;
}
.my-pane {
  height: 100%;
}
</style>
