<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="dark"
        content="新建版本"
        placement="top"
        id="new-version"
      >
        <el-button
          size="mini"
          circle
          icon="el-icon-plus"
          @click="addNewVersion()"
        />
      </el-tooltip>
		    
      <el-tooltip
        class="item"
        effect="dark"
        content="显隐列"
        placement="top"
        v-if="columns"
      >
        <el-button
          size="mini"
          circle
          icon="el-icon-menu"
          @click="showColumn()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="发布历史" placement="top">
        <el-button size="mini" circle icon="el-icon-date" @click="getHistory"/>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body width="740px">
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "部署环境显示/隐藏",
      // 是否显示弹出层
      open: false,
    };
  },
  props: {
    columns: {
      type: Array,
    },
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item));
      }
    }
  },
  methods: {
    // 创建新版本
    addNewVersion() {
      this.$emit("addNewVersion");
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (var item in this.columns) {
        const key = this.columns[item].key;
        this.columns[item].visible = !data.includes(key);
      }
      localStorage.setItem("columns", JSON.stringify(this.columns));
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true;
    },

    // 获取发布历史
    getHistory() {
      this.$emit('getHistoryHandle')
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
