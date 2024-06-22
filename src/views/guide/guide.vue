<!--
 * @Author: penglyu
 * @Date: 2021-05-06 10:48:05
 * @LastEditTime: 2021-05-06 11:32:00
 * @LastEditors: Please set LastEditors
 * @Description: 运维3.0指导手册
 * @FilePath: \pass-frontend\src\views\guide\guid.vue
-->

<template>

  <el-card style="width: 98%; margin-left: 1%; margin-top: 10px">
  
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="开通账号" name="1">

           <ul class="ul_format">
          <li>开通租户账号：一个公司对应一个租户，租户ID全局唯一</li>
          <li>开通租户账号：一个公司对应一个租户，租户ID全局唯一</li>
          <li>开通租户账号：一个公司对应一个租户，租户ID全局唯一</li>
        </ul>
       
      </el-collapse-item>

      <el-collapse-item title="配置租户" name="2">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="环境管理" name="3">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="业务域管理" name="4">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="应用申请" name="5">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="创建项目" name="6">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="项目结构" name="7">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="配置中心配置" name="8">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="应用发布" name="9">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="日志平台" name="10">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="监控平台APM" name="11">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>

      <el-collapse-item title="告警平台" name="12">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      activeName: "0",
    };
  },
};
</script>

<style scoped>

.ul_format{
  list-style-type: circle;
}






</style>