<template>
    <div>
      <el-card style="margin: 10px">
        <div style="border-bottom: 1px solid #e8e8e8;padding: 0 15px;height: 50px;align-items:center;line-height: 50px;width: 100%; margin-bottom: 10px">
          <div style="font-size: 14px;display: inline;">
            <el-input placeholder="任务名" v-model="formSearch.name" @keyup.enter.native="getTaskData"
                      style="width: auto;margin-left: -10px" size="mini"></el-input>
            <el-select v-model="formSearch.task_status" placeholder="任务状态" size="mini" @change="getTaskData">
              <el-option value="all" label="所有任务"></el-option>
              <el-option :value="false" label="任务未完成"></el-option>
              <el-option :value="true" label="任务已完成"></el-option>
            </el-select>
            <el-select v-model="formSearch.deleted" placeholder="任务状态" size="mini" @change="getTaskData">
              <el-option :value="false" label="未删除"></el-option>
              <el-option :value="true" label="已删除"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="getTaskData">查询</el-button></div>
          <div style="font-size: 14px;display: inline;float: right">
            <el-button type="primary" plain style="" @click="showNewTask" size="small">新建任务</el-button>
            <el-button type="warning" plain style="" @click="showDebug" size="small">调试模式</el-button>
          </div>
        </div>
<!--
        <el-card class="box-card" style="width: 240px;display: inline-block" >
          <div slot="header" class="clearfix">
            <span>任务一</span>
            <Icon type="md-square" size="18" style="float: right;cursor: pointer" v-if="false" />
            <Icon type="md-play" size="18" style="float: right;cursor: pointer" title="开始" />
          </div>
          <div>
            <el-button type="warning" size="mini" plain>编辑</el-button>
            <el-button type="primary" size="mini" plain>状态</el-button>
            <el-button type="danger" size="mini" plain>删除</el-button>
          </div>
        </el-card>
-->

        <el-card class="box-card" style="width: 240px;display: inline-block;margin-right: 5px" v-for="(item,index) in task_list" :key="index">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button type="success" icon="el-icon-video-play" circle size="mini" style="float: right" title="开始"
                       @click="executeTask({task_id: item.id})" v-if="item.ready && !item.finish && !item.deleted" :disabled="item.deleted"></el-button>
            <el-button type="danger" icon="el-icon-video-pause" circle size="mini" title="停止" style="float: right"
                       v-if="!item.ready && !item.finish" @click="stopRollBackTask({task_id: item.id, operation: 'cancel'})"></el-button>
            <el-button type="text" icon="el-icon-loading" circle size="mini" style="float: right"
                       v-if="!item.ready && !item.finish"></el-button>
          </div>
          <div>
            <el-button type="warning" size="mini" plain @click="showEditTask(item)">编辑</el-button>
            <el-button type="primary" size="mini" plain @click="showTaskStatus(item)">状态</el-button>
            <el-button type="danger" size="mini" plain @click="confirmDeleteTask(item)" :disabled="item.deleted">删除</el-button>
          </div>
        </el-card>
        <div class="block">
          <pagination :total="task_total" :page.sync="task_page" :limit.sync="task_limit" @pagination="getTaskData"></pagination>
        </div>
      </el-card>


      <!-- 新建task -->
      <el-dialog :title="newTitle" :visible.sync="dialognewTaskForm" :close-on-click-modal="false" width="80%" @close="closeTaskEdit">
        <el-form size="small" label-width="120px" :rules="newRules" :model="newRow" ref="newRow" label-position="right">
          <el-form-item hidden>
            <el-input v-model="newRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="任务名" prop="name" :rules="[{required:true,message:'请输入名称', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model.trim="newRow.name" style="width: 240px" :disabled="disabled_task_name"></el-input>
          </el-form-item>
          <el-form-item label="异常处理" prop="exception" :rules="[{required:true,message:'请选择异常处理方式.', trigger: 'blur'}]">
            <div><el-radio v-model="newRow.exception" label="stop" >执行过程中有发布单元异常，则发布中断（默认）</el-radio></div>
<!--            <div><el-radio v-model="newRow.exception" label="rollback">执行过程中有发布单元异常，则发布任务整体回退至发布前状态</el-radio></div>-->
            <div><el-radio v-model="newRow.exception" label="continue">执行过程中有发布单元异常，发布继续执行</el-radio></div>
          </el-form-item>
          <el-form-item label="发布单元">
            <el-button icon="el-icon-plus" @click="showTaskUnit" style="margin-bottom: 5px" :disabled="newRow.deleted">添加</el-button>
            <el-table border :data="unit_list" size="mini" highlight-current-row ref="singleTaskUnit" class="task-unit" :row-key="rowKey" :default-sort="{prop: 'order_id'}">
              <el-table-column label="序号" fixed width="50" align="center" prop="order_id"></el-table-column>
              <el-table-column label="应用代码" prop="appCode" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="环境" prop="env" width="50"></el-table-column>
<!--              <el-table-column label="镜像" prop="image" :show-overflow-tooltip="true"></el-table-column>-->
              <el-table-column label="部署版本" prop="app_version"></el-table-column>
              <el-table-column label="当前运行版本" prop="running_version"></el-table-column>
              <el-table-column label="回退目标版本" prop="rollback_version"></el-table-column>
              <el-table-column label="回滚" prop="" width="60" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.rollback" size="mini" type="primary">是</el-tag><el-tag v-else size="mini" type="warning">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="新版本" prop="new_version" width="60" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.new_version" size="mini" type="primary">是</el-tag><el-tag v-else size="mini" type="warning">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                  <Button loading v-if="scope.row.ready===false && scope.row.finish===false"></Button>
                  <Button type="success" icon="md-play" title="发布" @click="executeTask({task_id: newRow.id, release_id: scope.row.id})"
                          :disabled="scope.row.finish || !newRow.id || scope.row.rollback || !scope.row.id" v-if="scope.row.ready && !newRow.deleted"></Button>
                  <Button type="warning" icon="ios-undo" title="回滚上一个版本" @click="stopRollBackTask({task_id: newRow.id, release_id: scope.row.id,operation: 'rollback'})"
                          :disabled="!scope.row.rollback_version || scope.row.rollback || !scope.row.ready || !newRow.id || !scope.row.finish ||
                          scope.row.running_version===scope.row.rollback_version || newRow.deleted"></Button>
                  <Button type="default" icon="ios-options-outline" title="状态" @click="showTaskStatus(newRow)" :disabled="!newRow.id"></Button>
                  <Button type="error" icon="ios-trash-outline" title="删除" @click="confirmDeleteUnit(scope.row)" :disabled="scope.row.finish || !scope.row.ready || scope.row.rollback"></Button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="saveTask('POST')" v-if="!newRow.id">保 存</el-button>
          <el-button @click="dialognewTaskForm = false">取 消</el-button>
        </div>
      </el-dialog >


      <!-- 编辑task -->
      <el-dialog :title="newTitle" :visible.sync="dialogEditTaskForm" :close-on-click-modal="false" width="80%" @close="closeTaskEdit">
        <el-form size="small" label-width="120px" :rules="newRules" :model="taskEditRow" ref="taskEditRow" label-position="right">
          <el-form-item hidden>
            <el-input v-model="taskEditRow.id" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="任务名" prop="name" :rules="[{required:true,message:'请输入名称', trigger: 'blur'}]">
            <el-input autocomplete="off" v-model.trim="taskEditRow.name" style="width: 240px" :disabled="disabled_task_name"></el-input>
          </el-form-item>
          <el-form-item label="异常处理" prop="exception" :rules="[{required:true,message:'请选择异常处理方式.', trigger: 'blur'}]">
            <div><el-radio v-model="taskEditRow.exception" label="stop" >执行过程中有发布单元异常，则发布中断（默认）</el-radio></div>
            <!--            <div><el-radio v-model="taskEditRow.exception" label="rollback">执行过程中有发布单元异常，则发布任务整体回退至发布前状态</el-radio></div>-->
            <div><el-radio v-model="taskEditRow.exception" label="continue">执行过程中有发布单元异常，发布继续执行</el-radio></div>
          </el-form-item>
          <el-form-item label="发布单元">
            <el-button icon="el-icon-plus" @click="showTaskUnit" style="margin-bottom: 5px" :disabled="taskEditRow.deleted">添加</el-button>
            <el-table border :data="edit_unit_list" size="mini" highlight-current-row ref="singleTaskUnit" class="task-unit" :row-key="rowKey" :default-sort="{prop: 'order_id'}">
              <el-table-column label="序号" fixed width="50" align="center" prop="order_id"></el-table-column>
              <el-table-column label="应用代码" prop="appCode" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="环境" prop="env" width="50"></el-table-column>
              <!--              <el-table-column label="镜像" prop="image" :show-overflow-tooltip="true"></el-table-column>-->
              <el-table-column label="部署版本" prop="app_version"></el-table-column>
              <el-table-column label="当前运行版本" prop="running_version"></el-table-column>
              <el-table-column label="回退目标版本" prop="rollback_version"></el-table-column>
              <el-table-column label="回滚" prop="" width="60" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.rollback" size="mini" type="primary">是</el-tag><el-tag v-else size="mini" type="warning">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="新版本" prop="new_version" width="60" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.new_version" size="mini" type="primary">是</el-tag><el-tag v-else size="mini" type="warning">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                  <Button loading v-if="scope.row.ready===false && scope.row.finish===false"></Button>
                  <Button type="primary" icon="md-play" title="发布" @click="executeTask({task_id: taskEditRow.id, release_id: scope.row.id})"
                          :disabled="scope.row.finish || !taskEditRow.id || scope.row.rollback || !scope.row.id" v-if="scope.row.ready && !taskEditRow.deleted"></Button>
                  <Button type="warning" icon="ios-undo" title="回滚上一个版本" @click="stopRollBackTask({task_id: taskEditRow.id, release_id: scope.row.id,operation: 'rollback'})"
                          :disabled="!scope.row.rollback_version || scope.row.rollback || !scope.row.ready || !taskEditRow.id || !scope.row.finish ||
                          scope.row.running_version===scope.row.rollback_version || taskEditRow.deleted"></Button>
                  <Button type="default" icon="ios-options-outline" title="状态" @click="showTaskStatus(taskEditRow)" :disabled="!taskEditRow.id"></Button>
                  <Button type="error" icon="ios-trash-outline" title="删除" @click="confirmDeleteUnit(scope.row)" :disabled="scope.row.finish || !scope.row.ready || scope.row.rollback"></Button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" plain="plain" @click="UpdateTask('PUT')" v-if="taskEditRow.id && !taskEditRow.finish && !is_deployed && !taskEditRow.deleted" :disabled="!taskEditRow.ready">更 新</el-button>
          <el-button @click="dialogEditTaskForm = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- 新task 单元 -->
      <el-dialog :title="taskTitle" :visible.sync="dialognewTaskUnit" :close-on-click-modal="false" width="80%">
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" size="mini" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="formSearch.appCode" placeholder="AppCode" @keyup.enter.native="GetAppTableData()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetAppTableData()">查询</el-button>
          </el-form-item>
          <el-button style="float: right" @click="GetAppTableData()" size="mini">刷新</el-button>
        </el-form>
        <el-table border :data="app_list" size="mini" highlight-current-row ref="singleAppCode" @row-click="ClickAppRow">
          <el-table-column label="应用代码" prop="code" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column sortable label="开发语言" prop="" align="" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.language}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="应用名称" prop="">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="所属人" prop="">
            <template slot-scope="scope">
              <span>{{scope.row.owner}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="父域" prop="">
            <template slot-scope="scope">
              <span>{{scope.row.parent_domain}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetAppTableData()"></pagination>
        </div>

        <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;">
          <span style="margin-left: 16px;font-size: 14px;color: #333333">已经选中的应用</span>
        </div>
        <div>
          <el-row style="margin: 10px;font-size: 14px"><el-col :span="5">appId</el-col><el-col :span="19">{{select_app.appId}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 14px"><el-col :span="5">appCode</el-col><el-col :span="19">{{select_app.code}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 14px"><el-col :span="5">Git地址</el-col><el-col :span="19">{{select_app.git}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 14px"><el-col :span="5">产物路径</el-col><el-col :span="19">{{select_app.buildpath}}</el-col></el-row>
        </div>
        <div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="showCreateAppVersion">创建新版本</el-button>
          <el-button type="primary" plain="plain" @click="showAppVersion">选择已有版本</el-button>
          <el-button @click="dialognewTaskUnit = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- 应用选择已有版本 -->
      <el-dialog :title="appVersionTitle" :visible.sync="dialogAppVersion" :close-on-click-modal="false" width="80%">
        <!-- 搜索 -->
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" size="mini" @submit.native.prevent>
          <el-form-item label="应用名"><el-input v-model="select_app.code" disabled></el-input></el-form-item>
          <el-form-item label="版本"><el-input v-model="formSearch.app_version" placeholder="版本" @keyup.enter.native="GetAppVersionData"></el-input></el-form-item>
<!--          <el-form-item>-->
<!--            <el-select v-model="formSearch.env" placeholder="请选择环境" size="mini" clearable>-->
<!--              <el-option v-for="(item, index) in env_list" :key="index" :value="item.name" :label="item.name"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="GetAppVersionData()">查询</el-button>
          </el-form-item>
          <el-button style="float: right" @click="GetAppVersionData()" size="mini">刷新</el-button>
        </el-form>
        <el-table border :data="app_version_list" size="mini" highlight-current-row ref="singleAppVersion" @row-click="ClickAppVersionRow" v-loading="ver_loading">
          <el-table-column label="版本" prop="app_version">
            <template slot-scope="scope">
              <span>{{scope.row.app_version}}</span>
              <span v-for="(item,key) in running_list" :key="key">
                <el-tag size="small" style="margin-left: 5px" v-if="scope.row.app_version === item.running_version && item.env ==='prod'">{{item.env}}</el-tag>
                <el-tag size="small" style="margin-left: 5px" v-else-if="scope.row.app_version === item.running_version && item.env ==='uat'" type="success">{{item.env}}</el-tag>
                <el-tag size="small" style="margin-left: 5px" v-else-if="scope.row.app_version === item.running_version && item.env ==='test'" type="warning">{{item.env}}</el-tag>
                <el-tag size="small" style="margin-left: 5px" v-else-if="scope.row.app_version === item.running_version && item.env ==='dev'" type="danger">{{item.env}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="分支" prop="branch"></el-table-column>
          <el-table-column label="镜像" prop="image" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="已部署过环境">
            <template slot-scope="scope">
              <span v-for="(item,key) in scope.row.records " :key="key">
                <el-tag size="small" style="margin-left: 5px" type="primary">{{item.env}}</el-tag>
<!--                <el-tag size="small" style="margin-left: 5px" type="danger" v-else>{{item.env}}</el-tag>-->
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop="creator" width="80" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <pagination :total="ver_total" :page.sync="ver_page" :limit.sync="ver_limit" @pagination="GetAppVersionData()"></pagination>
        </div>
        <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
          <span style="margin-left: 16px;font-size: 14px;color: #333333">基础信息</span>
        </div>
        <!-- 基础信息 -->
        <div>
          <el-row style="margin: 10px;font-size: 12px">
            <el-col :span="5">创建时间</el-col><el-col :span="8">{{select_app_version.ctime}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">开发语言</el-col><el-col :span="8">{{select_app_version.code_type}}</el-col>
          </el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">Git地址</el-col><el-col :span="19">{{select_app_version.gitRepo}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">commitId</el-col><el-col :span="19">{{select_app_version.commitId}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">分支</el-col><el-col :span="19">{{select_app_version.branch}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">产物路径</el-col><el-col :span="19">{{select_app_version.package}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">制品信息</el-col><el-col :span="19">{{select_app_version.image}}</el-col></el-row>
          <el-row style="margin: 10px;font-size: 12px"><el-col :span="5">sonar扫描</el-col><el-col :span="19" v-if="select_app_version">
            <span v-if="select_app_version.sonar_scanner">是</span><span v-else-if="select_app_version.sonar_scanner===false">否</span><span v-else></span>
          </el-col></el-row>
        </div>

        <el-row style="margin: 10px;padding-top:10px;font-size: 12px;border-top: 1px solid #e8e8e8;width: 100%;display: inline-block">
          <el-col :span="4" style="align-items:center;line-height: 28px">部署环境</el-col><el-col :span="8">
          <el-select v-model="deployment_env" placeholder="请选择" size="mini" clearable  @change="envChange">
            <el-option v-for="(item, index) in AppCiCdData" :key="index" :value="item.env" :label="item.env"></el-option>
          </el-select>
        </el-col>
          <el-col :span="4" style="align-items:center;line-height: 28px">应用启动超时时间(s)</el-col>
          <el-col :span="7">
            <el-slider v-model="select_app.startuptimeout" :max="600" :step="10" input-size="mini"></el-slider>
          </el-col>
        </el-row>
        <el-row style="margin: 10px;font-size: 12px;width: 100%;">
          <el-col :span="4" style="align-items:center;line-height: 28px">更新模式</el-col><el-col :span="8">
          <el-radio v-model="update_mode" label="Recreate">全量更新</el-radio>
          <el-radio v-model="update_mode" label="RollingUpdate">滚动更新</el-radio>
        </el-col>
          <el-col :span="4" style="align-items:center;line-height: 28px">单次滚动更新数量(%)</el-col>
          <el-col :span="7">
            <el-slider v-model="maxSurge" :max="50" :min="1" :step="1" input-size="mini" :disabled="update_mode==='Recreate'"></el-slider>
<!--            <el-input v-model="maxSurge" style="width: auto" size="mini" :disabled="update_mode==='Recreate'"></el-input>-->
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="checkBranch(deployment_env, select_app_version.branch, addUnit)">确 定</el-button>
<!--          <el-button type="primary" plain="plain" @click="addUnit">确 定</el-button>-->
          <el-button @click="dialogAppVersion = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- 选择应用创建新版本 -->
      <el-dialog :title="createAppVersionTitle" :visible.sync="dialogCreateAppVersion" :close-on-click-modal="false" width="80%">
        <el-form label-position="right" label-width="80px" :model="newVersion" style="width: 70%;margin-left:auto; margin-right:auto;"
                 size="small" ref="newVersion">
          <el-form-item label="仓库地址">
            <el-input v-model="newVersion.gitRepo" readonly></el-input>
          </el-form-item>
          <el-form-item label="分支" prop="branch" :rules="[{required:true,message:'请选择分支.', trigger: 'blur'}]" v-if="!ali_code">
            <el-select v-model="newVersion.branch" filterable placeholder="分支" @change="branchChange()">
              <el-option :label="item.name" :value="item.name" v-for="(item,index) in branch_list" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分支" prop="branch" :rules="[{required:true,message:'请输入分支.', trigger: 'blur'}]" v-if="ali_code">
            <el-input v-model.trim="newVersion.branch" @change="branchChange()"></el-input>
          </el-form-item>
          <el-form-item label="commitId">
            <el-input v-model.trim="newVersion.commitId"></el-input>
          </el-form-item>
          <el-form-item label="版本" prop="app_version" :rules="[{required:true,message:'请输入版本.', trigger: 'blur'}]">
            <el-input v-model="newVersion.app_version" readonly></el-input>
          </el-form-item>
          <el-form-item label="产物路径" prop="buildpath" :rules="[{required:true,message:'请输入产物路径.', trigger: 'blur'}]">
            <el-input v-model="newVersion.buildpath"></el-input>
          </el-form-item>
          <el-form-item label="编译命令" prop="make_args" v-if="!make_arg_hide">
            <el-input v-model="newVersion.make_args"></el-input>
          </el-form-item>
          <el-form-item label="业务域" prop="project" :rules="[{required:true,message:'请输入项目名称.', trigger: 'blur'}]">
            <el-input v-model="newVersion.project" readonly></el-input>
          </el-form-item>
          <el-form-item label="Sonar扫描" prop="sonar_scanner">
            <el-switch v-model="newVersion.sonar_scanner"></el-switch>
            <el-link v-if="newVersion.sonar_scanner" type="danger" :underline="false">可能会对测试环境产生影响，如需取消，请关闭.</el-link>
          </el-form-item>
          <el-form-item label="部署配置" prop="sonar_scanner">
            <el-row style="font-size: 12px;width: 100%">
              <el-col :span="4" style="align-items:center;line-height: 28px">部署环境</el-col><el-col :span="8">
              <el-select v-model="deployment_env" placeholder="请选择" size="mini" clearable @change="envChange">
                <el-option v-for="(item, index) in AppCiCdData" :key="index" :value="item.env" :label="item.env"></el-option>
              </el-select>
            </el-col>
              <el-col :span="4" style="align-items:center;line-height: 28px">应用启动超时时间(s)</el-col>
              <el-col :span="8">
                <el-slider v-model="select_app.startuptimeout" :max="600" :step="10" input-size="mini">600</el-slider>
              </el-col>
            </el-row>
            <el-row style="font-size: 12px;width: 100%;">
              <el-col :span="4" style="align-items:center;line-height: 28px">更新模式</el-col><el-col :span="8">
              <el-radio v-model="update_mode" label="Recreate">全量更新</el-radio>
              <el-radio v-model="update_mode" label="RollingUpdate">滚动更新</el-radio>
            </el-col>
              <el-col :span="4" style="align-items:center;line-height: 28px">单次滚动更新数量(%)</el-col>
              <el-col :span="8">
                <el-slider v-model="maxSurge" :max="50" :min="1" :step="1" input-size="mini" :disabled="update_mode==='Recreate'"></el-slider>
<!--                <el-input v-model="maxSurge" style="width: auto" size="mini" :disabled="update_mode==='Recreate'"></el-input>-->
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain="plain" @click="checkBranch(deployment_env, newVersion.branch, addCreateUnit)">确 定</el-button>
<!--          <el-button type="primary" plain="plain" @click="addCreateUnit">确 定</el-button>-->
          <el-button @click="dialogCreateAppVersion = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- 任务执行状态 -->
      <el-dialog :title="taskStatus" :visible.sync="dialogTaskStatus" :close-on-click-modal="false" width="600">
        <el-table :data="edit_unit_list" :default-sort="{prop: 'order_id'}">
          <el-table-column label="序号" fixed width="50" align="center" prop="order_id"></el-table-column>
          <el-table-column label="应用代码" prop="appCode" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="环境" prop="env" width=""></el-table-column>
          <el-table-column label="步骤" prop="current_step" width="" align="center">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.current_step==='ci'">创建中</el-tag>
              <el-tag type="primary" v-else-if="scope.row.current_step==='cd'">部署中</el-tag>
              <el-tag type="primary" v-else-if="scope.row.current_step==='rollback'">回滚中</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="" icon="el-icon-loading" v-if="!scope.row.ready && !scope.row.finish"></el-button>
              <el-tag type="success" size="small" v-else-if="scope.row.success && scope.row.finish && !scope.row.rollback">发布成功</el-tag>
              <el-tag type="danger" size="small" v-else-if="!scope.row.success && scope.row.finish && !scope.row.rollback">发布失败</el-tag>
              <el-tag type="success" size="small" v-else-if="scope.row.success && scope.row.finish && scope.row.rollback">回滚成功</el-tag>
              <el-tag type="danger" size="small" v-else-if="!scope.row.success && scope.row.finish && scope.row.rollback">回滚失败</el-tag>
              <el-tag type="info" size="small" v-else>待执行</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="详细" prop="" width="" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showTaskUnitStatus(scope.row)">详细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" icon="el-icon-video-pause" size="" title="停止"
                     v-if="!taskEditRow.ready && !taskEditRow.finish" @click="stopRollBackTask({task_id: taskEditRow.id, operation: 'cancel'})">停止</el-button>
          <el-button @click="dialogTaskStatus = false">取 消</el-button>
        </div>
      </el-dialog >

      <!-- log -->
      <el-dialog title="编译日志" :close-on-click-modal="true"
                 :visible.sync="dialogLog" top="10px"
                 width="80%" style="top: 10px;bottom: 10px">
        <div style="position: relative;top: 0px; bottom: 10px">
          <pre style="white-space: pre-wrap;word-wrap: break-word;">{{version_log}}</pre>
        </div>
      </el-dialog>

      <!-- 任务单元执行状态 -->
      <el-dialog :title="taskUnitTitle" :close-on-click-modal="true" :visible.sync="dialTaskUnitStatus" width="600">
        <div v-if="select_unit.new_version">
          <div style="width: 100%;line-height:40px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none;align-items:center;">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">创建版本状态</span>
            <el-button type="primary" @click="showCiLog(select_unit)" style="float: right;margin-top: 5px;" size="mini">详细信息</el-button>
          </div>
          <div style="margin: 10px;">
            <!--            <i class="el-icon-loading" v-if="!cur_version.finish"></i>-->
            <el-steps space="30%" style="width: 80%" :active="cur_version_status.steps" finish-status="success" align-left>
              <el-step title="拉取代码失败" :description="cur_version_status.gitPullStatus+' '+cur_version_status.gitPullDuration/1000+'s'" status="error" v-if="error_list.indexOf(cur_version_status.gitPullStatus) >= 0 || cur_version_status.steps===0 && cur_version_status.version__finish"></el-step>
              <el-step title="拉取代码成功" :description="cur_version_status.gitPullStatus+' '+cur_version_status.gitPullDuration/1000+'s'" status="success" v-else-if="cur_version_status.gitPullStatus==='SUCCESS'"></el-step>
              <el-step icon="el-icon-loading" title="拉取代码中" :description="cur_version_status.gitPullStatus+' '+cur_version_status.gitPullDuration/1000+'s'" status="process" v-else-if="cur_version_status.steps===0 && !cur_version_status.version__finish"></el-step>
              <el-step icon="el-icon-download" title="拉取代码" description="" status="" v-else></el-step>
              <template v-if="!make_arg_hide">
                <el-step title="编译失败" :description="cur_version_status.makeStatus+' '+cur_version_status.makeDuration/1000+'s'" status="error" v-if="error_list.indexOf(cur_version_status.makeStatus) >= 0"></el-step>
                <el-step title="编译成功" :description="cur_version_status.makeStatus+' '+cur_version_status.makeDuration/1000+'s'" status="success" v-else-if="cur_version_status.makeStatus==='SUCCESS'"></el-step>
                <el-step icon="el-icon-loading" title="编译中" :description="cur_version_status.makeStatus+' '+cur_version_status.makeDuration/1000+'s'" status="process" v-else-if="cur_version_status.steps===1 && !cur_version_status.version__finish"></el-step>
                <el-step icon="el-icon-connection" title="编译" description="" status="" v-else></el-step>
              </template>
              <el-step title="生成镜像失败" :description="cur_version_status.makeImageStatus+' '+cur_version_status.makeImageDuration/1000+'s'" status="error" v-if="
              error_list.indexOf(cur_version_status.makeImageStatus) >= 0 && !make_arg_hide || error_list.indexOf(cur_version_status.makeImageStatus) >= 0  && make_arg_hide"></el-step>
              <el-step title="生成镜像成功" :description="cur_version_status.makeImageStatus+' '+cur_version_status.makeImageDuration/1000+'s'" status="success" v-else-if="cur_version_status.makeImageStatus==='SUCCESS'"></el-step>
              <el-step icon="el-icon-loading" title="生成中" :description="cur_version_status.makeImageStatus+' '+cur_version_status.makeImageDuration/1000+'s'" status="process" v-else-if="
              cur_version_status.steps===2 && !cur_version_status.version__finish  && !make_arg_hide || cur_version_status.steps===1 && !cur_version_status.version__finish && make_arg_hide"></el-step>
              <el-step icon="el-icon-upload" title="生成镜像" description="" status="" v-else></el-step>
            </el-steps>
            <!--          <i class="el-icon-notebook-2" style="float: right;margin-top: -50px;cursor: pointer;color: #1482f0" title="编译日志" @click="">日志</i>-->
          </div>
        </div>

        <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
          <span style="margin-left: 16px;font-size: 14px;color: #333333">发布状态</span>
        </div>
        <el-table :data="status_deployment.step_list">
          <el-table-column label="角色" prop="role" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.role==='check'">验证版本</span>
              <span v-else-if="scope.row.role==='master'">常规版本</span>
            </template>
          </el-table-column>
          <el-table-column label="日志" prop="log" width=""></el-table-column>
          <el-table-column label="结果" prop="result" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.result==='success'" size="mini" type="success">成功</el-tag>
              <el-tag v-else-if="scope.row.result==='failed' && scope.row.finish" size="mini" type="danger">失败</el-tag>
<!--              <icon v-else class="el-icon-loading"></icon>-->
              <el-tag v-else size="mini" type="primary">部署中</el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column label="耗时(s)" prop="duration" width="100"></el-table-column>-->
<!--          <el-table-column label="成功" prop="success" width="50" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <i class="el-icon-circle-check" style="color: rgb(51, 203, 1)" v-if="scope.row.success"></i>-->
<!--              <i class="el-icon-circle-close" style="color: red" v-else></i>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="结束" prop="finish" width="80" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.finish===true" size="mini" type="primary">是</el-tag>
<!--              <el-tag v-else size="mini" type="">否</el-tag>-->
              <icon v-else class="el-icon-loading"></icon>
<!--              <el-tag type="">否</el-tag>-->
            </template>
          </el-table-column>
        </el-table>
        <div v-if="select_unit.rollback">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">回滚状态</span>
          </div>
          <el-table :data="status_rollback.step_list">
            <el-table-column label="角色" prop="role" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.role==='check'">验证版本</span>
                <span v-else-if="scope.row.role==='master'">常规版本</span>
              </template>
            </el-table-column>
            <el-table-column label="日志" prop="log" width=""></el-table-column>
            <el-table-column label="结果" prop="result" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.result==='success'" size="mini" type="success">成功</el-tag>
                <el-tag v-else-if="scope.row.result==='failed' && scope.row.finish" size="mini" type="danger">失败</el-tag>
<!--                <icon v-else class="el-icon-loading"></icon>-->
                <el-tag v-else size="mini" type="primary">部署中</el-tag>
              </template>
            </el-table-column>
<!--            <el-table-column label="耗时(s)" prop="duration" width="100"></el-table-column>-->
            <!--          <el-table-column label="成功" prop="success" width="50" align="center">-->
            <!--            <template slot-scope="scope">-->
            <!--              <i class="el-icon-circle-check" style="color: rgb(51, 203, 1)" v-if="scope.row.success"></i>-->
            <!--              <i class="el-icon-circle-close" style="color: red" v-else></i>-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <el-table-column label="结束" prop="finish" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.finish===true" size="mini" type="primary">是</el-tag>
                <icon v-else class="el-icon-loading"></icon>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-dialog>

      <!-- 调试模式 -->
      <el-dialog title="调试模式" :close-on-click-modal="true" :visible.sync="dialDebug" width="80%">
        <div>
          <!-- 表格 -->
          <el-form :inline="true" :model="formSearch" class="demo-form-inline" size="mini" @submit.native.prevent>
            <el-form-item>
              <el-input v-model="formSearch.appCode" placeholder="AppCode" @keyup.enter.native="GetAppTableData()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetAppTableData()">查询</el-button>
            </el-form-item>
            <el-button style="float: right" @click="GetAppTableData()" size="mini">刷新</el-button>
          </el-form>
          <el-table id="out-table" v-loading="app_loading" :data="app_list" style="width: 100%;border: 1px solid #EBEEF5">
            <el-table-column label="应用代码" prop="code" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable label="开发语言" prop="" align="" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.language}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="应用名称" prop="">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="所属人" prop="">
              <template slot-scope="scope">
                <span>{{scope.row.owner}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="父域" prop="">
              <template slot-scope="scope">
                <span>{{scope.row.parent_domain}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="操作" prop="" align="center">
              <template slot-scope="scope">
                <el-button type="primary"  size="mini" @click="buildClick(scope.row)" :plain="true" v-if="common.hasPermission($store.state.user.roles,['task'])">构建</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetAppTableData"></pagination>
          </div>
        </div>

      </el-dialog>
    </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  import Sortable from 'sortablejs'
  import YAML from 'yaml'

  export default {
    name: 'tasks-other',
    data(){return{
      error_list: ['ABORTED', 'FAILED'],
      taskUnitTitle: '',
      dialogLog: false,
      ali_code: false,
      dialTaskUnitStatus: false,
      dialDebug: false,
      version_log: '',
      execute_progress: false,
      unit_progress: false,
      task: {id: '', name: '', 'exception': 'stop', unit_list: []},
      task_list: [],
      unit_list: [],
      edit_unit_list: [],
      deployment_env: '',
      dialogTaskStatus: false,
      make_arg_hide: false,
      disabled_task_name: false,
      newVersion: {getRepo: '', branch: '', commitId: '', app_version: '', packeage: '', buildpath:'',
        project: '', sonar_scanner: true},
      ver_loading: false,
      app_loading: false,
      startuptimeout: 180,
      maxSurge: 25,
      update_mode: 'RollingUpdate',
      app_version_search: '',
      select_app: {},
      select_app_version: {},
      formSearch: {deleted: false, finish: false, task_status: 'all'},
      taskStatus: '任务执行状态',
      newTitle: '新建任务',
      taskTitle: '任务单元',
      appVersionTitle: '',
      createAppVersionTitle: '',
      newRules: {},
      newRow: {id: '', name: '', 'exception': 'stop', unit_list: [], ready: true, finish: false},
      taskEditRow: {id: '', name: '', 'exception': 'stop', unit_list: [], ready: true, finish: false},
      dialognewTaskForm: false,
      dialogEditTaskForm: false,
      dialognewTaskUnit: false,
      dialogAppVersion: false,
      dialogCreateAppVersion: false,
      // deployment_steps: [],
      env_list: [],
      task_unit_list: [],
      app_list: [],
      app_version_list: [],
      branch_list: [],
      running_list: [],
      AppCiCdData: [],
      AppCiCdDataDict: {},
      //状态
      cur_version_status: {version__finish: true, sonar_result: '' },
      cur_version: {finish: true, sonar_scanner: false, sonar_result: ''},   // 新建版本状态
      select_unit: {},
      status_deployment: {finish: true, id: '',step_list: []},
      status_rollback: {finish: true, id: '',step_list: []},
      version_timer: '',
      unit_cd: false,
      is_deployed: false,

      yaml_json: '',
      total: 0,
      page: 1,
      limit: 10,

      ver_total: 0,
      ver_page: 1,
      ver_limit: 10,

      task_total: 0,
      task_page: 1,
      task_limit: 25,
      task_timer: '',
      task_unit_timer: '',
      deploy_timer: '',
    }},
    watch: {
      'cur_version_status.version__finish': function() {
        // let task_refresh
        if(!this.cur_version_status.version__finish){
          this.version_timer = window.setInterval(this.GetVersionStatus,5000)
          // if(this.cur_version.finish & !this.cur_version.sonar_scanner)
        }
        else if(this.cur_version_status.version__finish && this.cur_version.sonar_scanner && this.cur_version_status.sonar_result){
          this.getTaskUnitCiLog()
          clearInterval(this.version_timer)}
        else if(this.cur_version_status.version__finish && !this.cur_version.sonar_scanner){this.getTaskUnitCiLog();clearInterval(this.version_timer)}
        // else {{clearInterval(this.version_timer)}}
      },

      'cur_version_status.sonar_result': function() {
        if(this.cur_version_status.version__finish && this.cur_version.sonar_scanner && this.cur_version_status.sonar_result){
          this.getTaskUnitCiLog()
          setTimeout(this.getTaskUnitCDLog, 3000)
          clearInterval(this.version_timer)
        }
      },

      'select_unit.current_step': function() {
        // console.log('this.select_unit.current_step:', this.select_unit.current_step)
        if(this.select_unit.current_step==='cd'){
          this.getTaskUnitCDLog()
        }
      },

      'status_deployment.finish': function() {
        if(!this.status_deployment.finish){
          this.deploy_timer = window.setInterval(this.getTaskUnitCDLog,3000)
        }else {
          clearInterval(this.deploy_timer)
        }
      },

      'status_rollback.finish': function() {
        if(!this.status_rollback.finish){
          this.deploy_timer = window.setInterval(this.getTaskUnitRollbackCDLog,3000)
        }else {
          clearInterval(this.deploy_timer)
        }
      },

      'unit_list': function() {
        if(this.unit_list instanceof Array && this.unit_list.length>=2 && this.dialognewTaskForm){
          setTimeout(this.rowDrop, 500 )
        }
      },
      // 监控任务自动刷新动作
      'execute_progress': function() {
        // console.log('execute_progress:', this.execute_progress)
        if(this.execute_progress){
          this.task_timer = setInterval(this.getTaskData, 3000 )
        }else {clearInterval(this.task_timer)}
      },
      // 监控任务单元自动刷新动作
      'unit_progress': function() {
        if(this.unit_progress){
          this.task_unit_timer = setInterval(this.getTaskUnit, 3000 )
        }else {this.getTaskData();clearInterval(this.task_unit_timer)}
      },

    },
    methods: {

      rowKey: function(row){
        return row.appCode + '-' +row.env
      },

      // 停止任务
      stopRollBackTask: function(params){
        this.axios({
          method: 'PUT',
          url: this.$store.state.cicd.execute_url,
          data: params,
        }).then((response)=>{
          // console.log('executeTask:',response.data);
          if(response.data.status){
            if(params.release_id ? params.release_id: null){this.getTaskUnit()}else {this.getTaskData()}
            // this.$message.success(response.data.message)
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      // 执行任务
      executeTask: function(params){
        this.axios({
          method: 'POST',
          url: this.$store.state.cicd.execute_url,
          data: params,
        }).then((response)=>{
          // console.log('executeTask:',response.data);
          if(response.data.status){
            if(params.release_id ? params.release_id: null){this.getTaskUnit()}else {this.getTaskData()}
            // this.$message.success(response.data.message)
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      showEditTask: function(row){
        this.taskEditRow.id = row.id
        this.newTitle = '编辑任务'
        this.getTaskUnit()
        this.dialogEditTaskForm = true
        this.disabled_task_name = true
      },

      //获取任务单元的版本日志
      getTaskUnitCDLog: function(){
        // console.log("params",  row, row.app_version)
        let parms = {'record_id': this.select_unit.deploy_record};
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.deployment_version_url,
          params: parms,
        }).then((response)=>{
          // console.log('getTaskUnitCDLog:',response.data.data);
          if(response.data.status){
            if(response.data.data.length>0){
              this.status_deployment = response.data.data[0]
              // this.deployment_steps=response.data.data[0].step_list
            }else {this.$message.error('部署记录不存在，可能还没有部署.')}
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      //获取任务单元的版本日志
      getTaskUnitRollbackCDLog: function(){
        // console.log("params",  row, row.app_version)
        let parms = {'record_id': this.select_unit.rollback_record};
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.deployment_version_url,
          params: parms,
        }).then((response)=>{
          // console.log('getTaskUnitCDLog:',response.data.data);
          if(response.data.status){
            if(response.data.data.length>0){
              this.status_rollback = response.data.data[0]
            }else {this.$message.error('回滚记录不存在.')}
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      //获取任务单元的版本日志
      getTaskUnitCiLog: function(){
        // console.log('GetVersionStatus:', this.select_unit.app_version);
        let parms = {'app_version': this.select_unit.app_version};
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_version_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetVersionStatus:', this.select_unit.app_version, response);
          if(response.data.status){
            if(response.data.data.length>0){
              this.cur_version=response.data.data[0]
              // this.version_log =this.cur_version.log
              this.GetVersionStatus()
            }else {this.$message.error('该版本不存在，可能还没创建.')}
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      //获取编辑任务单元
      getTaskUnit: function(){
        let parms = {'id': this.taskEditRow.id};
        // console.log("params", params, row)
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.task_url,
          params: parms,
        }).then((response)=>{
          // console.log('getTaskUnit:',response.data);
          if(response.data.status){
            this.taskEditRow.id = response.data.data.id
            this.taskEditRow.name = response.data.data.name
            this.taskEditRow.ready = response.data.data.ready
            this.taskEditRow.exception = response.data.data.strategy
            this.taskEditRow.finish = response.data.data.finish
            this.taskEditRow.deleted = response.data.data.deleted
            this.edit_unit_list = response.data.data.unit_list
            if(this.edit_unit_list instanceof Array){
              let progress_count=0
              let finish_count = 0
              for(let i=0;i<this.edit_unit_list.length;++i){
                if(!this.edit_unit_list[i].ready){progress_count=progress_count+1}
                if(this.edit_unit_list[i].id===this.select_unit.id){this.select_unit=this.edit_unit_list[i]}
                if(this.edit_unit_list[i].finish){finish_count=finish_count+1}
              }
              this.is_deployed = finish_count > 0;
              this.unit_progress = progress_count > 0;
            }
            // console.log(this.unit_list)
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      //编辑任务
      deleteTask: function(row){
        let parms = {'id': row.id};
        // console.log("params", params, row)
        this.axios({
          method: 'DELETE',
          url: this.$store.state.cicd.task_url,
          data: parms,
        }).then((response)=>{
          // console.log('getTaskUnit:',response.data);
          if(response.data.status){
            this.getTaskData()
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      closeTaskEdit: function(){
        this.unit_progress = false
      },

      // 获取任务列表
      getTaskData: function(){
        let params = {"pageSize": this.task_limit, "pageNumber": this.task_page, deleted: this.formSearch.deleted,
          name: this.formSearch.name,'finish': this.formSearch.task_status, 'env': 'other'};
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.task_url,
          params: params,
        }).then((response)=>{
          // console.log('getTaskData:',response.data);
          if(response.data.status){
            this.task_list = response.data.data
            this.task_total = response.data.total
            // console.log('this.task_list:', this.task_list)
            if(this.task_list instanceof Array){
              let progress_count = 0
              for(let i=0;i<this.task_list.length;++i){
                if(!this.task_list[i].ready){progress_count=progress_count+1}
              }
              this.execute_progress = progress_count > 0;
            }
            // console.log('execute_progress:', this.execute_progress)
          }else {this.$message.error(response.data.error)}
        }).catch((response) => {
          this.$message.error(String(response));
        });
      },

      // 保存任务
      saveTask: function(method){
        this.$refs.newRow.validate(valid =>{
          if(valid){
            let parms = {'name': this.newRow.name, 'strategy': this.newRow.exception, 'unit_list': this.unit_list, 'env': 'other'}
            // console.log('parms:', parms)
            this.axios({
              method: method,
              url: this.$store.state.cicd.task_url,
              data: parms,
            }).then((response)=>{
              // console.log('saveUpdateTask:',response.data);
              if(response.data.status){
                // this.app_version_list = response.data.data
                this.$message.success('提交成功！')
                this.getTaskData(this.$store.state.cicd.task_url)
                this.dialognewTaskForm = false
              }else {this.$message.error(response.data.error)}
            }).catch((response) => {
              this.$message.error(String(response));
            });

          }
          else {this.$message.warning('请输入完整数据')}
        })

      },

      UpdateTask: function(method){
        this.$refs.taskEditRow.validate(valid =>{
          if(valid){
            let parms = {'name': this.taskEditRow.name, 'strategy': this.taskEditRow.exception, 'unit_list': this.edit_unit_list, 'env': 'other'}
            if(method==="PUT"){parms.id=this.taskEditRow.id}
            // console.log('parms:', parms)
            this.axios({
              method: method,
              url: this.$store.state.cicd.task_url,
              data: parms,
            }).then((response)=>{
              // console.log('saveUpdateTask:',response.data);
              if(response.data.status){
                // this.app_version_list = response.data.data
                this.$message.success('提交成功！')
                this.getTaskData(this.$store.state.cicd.task_url)
                this.dialogEditTaskForm = false
              }else {this.$message.error(response.data.error)}
            }).catch((response) => {
              this.$message.error(String(response));
            });

          }
          else {this.$message.warning('请输入完整数据')}
        })

      },

      // 添加已经版本应用发布单元
      addUnit: function(){
        let running_version = ''
        let temp_list = this.unit_list
        if(this.dialogEditTaskForm===true){
          temp_list = this.edit_unit_list
        }
        for(let i=0;i<this.running_list.length;i++){
          if(this.running_list[i].env===this.deployment_env){running_version=this.running_list[i].running_version}
        }
        if(this.select_app_version.app_version && this.deployment_env && this.select_app.startuptimeout){
          let temp = {order_id:temp_list.length+1,appCode: this.select_app.code, // appId: this.select_app.appId,
            app_version: this.select_app_version.app_version,   // current_version: this.select_app_version.id,
            image: this.select_app_version.image,
            env: this.deployment_env, start_timeout: this.select_app.startuptimeout,
            running_version: running_version,rollback_version: running_version,
            buildType: this.AppCiCdDataDict[this.deployment_env].build_type,
            branch: this.select_app_version.branch,commitId: this.select_app_version.commitId,git_repo: this.select_app_version.gitRepo,
            make_args: this.select_app_version.make_args,sonr_scan: this.select_app_version.sonar_scanner,
            package_path: this.select_app_version.package,
            update_type: this.update_mode, update_count:this.maxSurge+'%',
            new_version: false, enable: true, ready: true,
          }
          for(let i=0;i<temp_list.length;i++){
            if(this.select_app.code===temp_list[i].appCode && this.deployment_env===temp_list[i].env){
              this.$message.warning('该应用对应的发布已经存在.')
              return
            }
          }
          if(this.dialogEditTaskForm===true){
            this.edit_unit_list.push(temp)
          }else {
            this.unit_list.push(temp)
          }
          this.dialogAppVersion = false
          this.dialognewTaskUnit = false

          // console.log('unit_list:', this.unit_list)
        }else {
          this.$message.warning('请选择应用版本或环境和设定应用启动超时时间.')
        }
      },

      // 添加新创版本应用发布单元
      addCreateUnit: function() {
        let running_version = ''
        let temp_list = this.unit_list
        if(this.dialogEditTaskForm===true){
          temp_list = this.edit_unit_list
        }
        for(let i=0;i<this.running_list.length;i++){
          if(this.running_list[i].env===this.deployment_env){running_version=this.running_list[i].running_version}
        }
        this.$refs.newVersion.validate(valid =>{
          if(valid && this.deployment_env && this.select_app.startuptimeout){
            let temp = {order_id:temp_list.length+1, appCode: this.select_app.code, // appId: this.select_app.appId,
              env: this.deployment_env, start_timeout: this.select_app.startuptimeout,
              running_version: running_version,rollback_version: running_version,app_version: this.newVersion.app_version,
              buildType: this.AppCiCdDataDict[this.deployment_env].build_type,
              branch: this.newVersion.branch,commitId: this.newVersion.commitId,git_repo: this.newVersion.gitRepo,
              make_args: this.newVersion.make_args,sonr_scan: this.newVersion.sonar_scanner,
              package_path: this.newVersion.buildpath,project: this.newVersion.project,
              update_type: this.update_mode, update_count:this.maxSurge+'%',
              new_version: true, enable: true, ready: true}
            for(let i=0;i<temp_list.length;i++){
              if(this.select_app.code===temp_list[i].appCode && this.deployment_env===temp_list[i].env){
                this.$message.warning('该应用对应的发布已经存在.')
                return
              }
            }
            if(this.dialogEditTaskForm===true){
              this.edit_unit_list.push(temp)
            }else {
              this.unit_list.push(temp)
            }
            this.dialogCreateAppVersion = false
            this.dialognewTaskUnit = false
          }
          else {this.$message.warning('请输入完整数据，如环境或设定应用启动超时时间')}
        })
      },

      // 检查uat/prod发布的分支
      checkBranch: function(env, branch, callback){
        if((env==='uat' || env==='prod') && branch!=='release-prod'){
          this.$confirm('该版本并非从release-prod分支建立，发布生产后将无法自动合并至Master，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback()
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消' });
          });
        }else {
          callback()
        }
      },

      confirmDeleteTask: function(row){
        this.$confirm('此操作将删除该发布任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteTask(row)
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
      },

      confirmDeleteUnit: function(row){
        this.$confirm('此操作将删除该发布单元, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUnit(row)
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
      },

      deleteUnit: function(row){
        // console.log('deleteUnit:', row)
        let temp_list = this.unit_list
        if(this.dialogEditTaskForm===true){
          temp_list = this.edit_unit_list
        }
        for(let i=0;i<temp_list.length;i++){
          if(temp_list[i].order_id===row.order_id){temp_list.splice(i, 1)}
        }
        if(this.dialogEditTaskForm===true){
          for(let i=0;i<this.edit_unit_list.length;i++){
            this.edit_unit_list[i].order_id=i+1
          }
        }else {
          for(let i=0;i<this.unit_list.length;i++){
            this.unit_list[i].order_id=i+1
          }
        }
        this.$message({ type: 'success', message: '删除成功!' });
      },

      // 选中app
      ClickAppVersionRow: function(row,column) {
        // console.log("row-click:", row, column)
        this.select_app_version = row
      },

      // 选中app
      ClickAppRow: function(row,column) {
        // console.log("row-click:", row, column)
        this.select_app = row
      },

      // 获取app表格数据；
      GetAppTableData: function() {
        const parms = {"pageSize": this.limit, "pageNumber": this.page, 'appCode': this.formSearch.appCode}
        this.loading = true
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data);
          if(response.data.status){
            this.app_list = response.data.data
            this.total = response.data.total
          }else {this.$notify.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$notify.error(String(response));
        });
      },

      // 获取appId的app version详细
      GetAppVersionData: function() {
        this.ver_loading = true
        let parms={"pageSize": this.ver_limit, "pageNumber": this.ver_page,'appId': this.select_app.appId,
          'app_version': this.app_version_search, 'app_version__include': this.formSearch.app_version}
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_version_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetAppVersionData:',response.data);
          if(response.data.status){
            this.app_version_list = response.data.data
            if(this.app_version_list.length>0){
              this.newVersion.branch=this.app_version_list[0].branch
              this.newVersion.app_version = this.getCurTime() + '-' + this.newVersion.branch
              // console.log('this.last_branch:', this.last_branch)
            }
            this.running_list = response.data.running_list
            this.ver_total = response.data.total
          }else {this.$message.error(response.data.error)}
          this.ver_loading = false
        }).catch((response) => {
          this.ver_loading = false
          this.$message.error(String(response));
        });
      },

      // 获取版本的构建信息
      GetVersionStatus: function() {
        this.$store.dispatch('GetVersionStatus', {'app_version_id': this.cur_version.id}).then(response=>{
          // console.log('GetVersionStatus:',response.data, this.cur_version);
          if(response.data.status){
            if(response.data.data){
              this.cur_version_status = response.data.data
              this.version_log =this.cur_version_status.log
            }else {this.cur_version_status={version__finish: true, sonar_result: '' }}
          }else {this.$message.error(response.data.error)}
        }).catch(error => {
          this.$message.error({message: String(error)});
        });
      },

      //  根据appId获取发布相关信息 app-resource
      GetAppCiCdData: function() {
        let parms={'appId': this.select_app.appId}
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_resource_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetAppCiCdData:',response.data);
          if(response.data.status){
            let temp={}
            let temp_list = []
            this.env_list = response.data.envs
            if(response.data.data){
              response.data.data.map(function(value, index, arr){
                if(value.env!=='prod'){temp_list.push(value)}
                temp[value.env] = value
              })
            }
            this.AppCiCdData = temp_list
            this.AppCiCdDataDict = temp
            //console.log('AppK8sData:', this.AppK8sData)
          }else {this.$notify.error(response.data.error)}
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      //  根据appId和环境获取kube信息
      GetAppCiCdKube: function() {
        let parms={'appId': this.select_app.appId, 'env': this.deployment_env}
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_resource_kube_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetAppCiCdKube:',response.data);
          if(response.data.status){
            if(response.data.data.length>0){
              let yaml_json = YAML.parse(response.data.data[0].deploy_yaml, {})
              this.update_mode = yaml_json.spec.strategy.type
              if(this.update_mode==='RollingUpdate'){
                // console.log('yaml_json:', this.update_mode, yaml_json.spec.strategy.type)
                // this.maxSurge=Number(25)
                if(yaml_json.spec.strategy.rollingUpdate.maxSurge){this.maxSurge = Number(yaml_json.spec.strategy.rollingUpdate.maxSurge.replace("%", ''))}
                else {this.maxSurge=25; yaml_json.spec.strategy.rollingUpdate.maxSurge= 25}
                // this.maxSurge = yaml_json.spec.strategy.rollingUpdate.maxSurge ? yaml_json.spec.strategy.rollingUpdate.maxSurge: 25
              }
            }else {
              this.deployment_env = ''
              this.$notify.error('当前应用环境，缺少初始容器化配置！')
            }
          }else {this.$notify.error(response.data.error)}
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      // 通过k8s api获取 deployment pod
      GetKubeDeploymentPod: function() {
        let parms={'env': this.deployment_env, 'label_selector': "appid="+this.select_app.code+',env='+this.deployment_env}
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.kube_app_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetKubeDeploymentPod:',response.data);
          if(response.data.status){

          }else {
            this.deployment_env = ''
            this.$notify.error(response.data.error)
          }
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      // 获取git 的分支列表
      GetGitRepoBranch: function() {
        let parms={'gitRepo': this.select_app.git}
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.git_branch_url,
          params: parms,
        }).then((response)=>{
          // console.log('GetGitRepoBranch:',response.data);
          if(response.data.status){
            this.branch_list = response.data.data
            if(this.branch_list.length>0){
              this.newVersion.branch = this.branch_list[0].name
              this.newVersion.commitId=this.branch_list[0]['commit'].id
              this.newVersion.app_version = this.getCurTime() + '-' + this.branch_list[0]['name'].replace('/', '-')
            }else {this.$notify.error('没有分支信息！')}
          }else {this.$notify.error(response.data.error)}
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      envChange: function(){
        if(this.deployment_env){
          this.GetAppCiCdKube()
          this.GetKubeDeploymentPod()
        }

      },

      // 分支变化
      branchChange: function(){
        // console.log('branchChange:',)
        if(!this.ali_code){
          for(let i=0;i<this.branch_list.length;++i){
            if(this.branch_list[i]['name']===this.newVersion.branch){
              this.newVersion.commitId=this.branch_list[i]['commit'].id
              this.newVersion.app_version = this.getCurTime() + '-' + this.branch_list[i]['name'].replace('/', '-')
            }
          }
        }else {this.newVersion.app_version = this.getCurTime() + '-' + this.newVersion.branch}
      },

      // 显示任务执行状态
      showTaskStatus: function(row){
        this.dialogTaskStatus = true
        let parms = {'id': row.id};
        this.taskEditRow.id = row.id
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.task_url,
          params: parms,
        }).then((response)=>{
          if(response.data.status){
            this.taskStatus = row.name
            this.edit_unit_list = response.data.data.unit_list
            if(this.edit_unit_list instanceof Array){
              let progress_count=0
              for(let i=0;i<this.edit_unit_list.length;++i){if(!this.edit_unit_list[i].ready){progress_count=progress_count+1}}
              this.unit_progress = progress_count > 0;
            }
          }else {{this.$message.error(response.data.error)}}
        }).catch((response)=>{this.$message.error(String(response));})
      },

      // 显示新建任务
      showNewTask: function() {
        this.newTitle = '新建任务'
        this.dialognewTaskForm = true
        this.disabled_task_name=false
        this.newRow.id = ''
        this.newRow.name = ''
        this.newRow.exception = 'stop'
        this.newRow.finish = false
        this.unit_list = []
      },

      // 显示新建任务单元
      showTaskUnit: function() {
        this.GetAppTableData()
        this.taskTitle = '任务单元'
        this.dialognewTaskUnit = true
        this.select_app = {}
      },

      showDebug: function(){
        this.GetAppTableData()
        this.dialDebug=true
      },

      // 显示app 已有版本
      showAppVersion: function() {
        if(this.select_app.code){
          this.select_app_version = {}
          this.deployment_env=''
          this.GetAppVersionData()
          this.GetAppCiCdData()
          this.appVersionTitle = '选择 '+this.select_app.code+' 现有版本并建立新的发布单元'
          this.dialogAppVersion = true
          this.startuptimeout=this.select_app.startuptimeout
          this.deployment_env = ''
        }else {this.$message.warning('请选择应用')}

      },

      // 显示app 创建新版本
      showCreateAppVersion: function() {
        if(this.select_app.code){
          this.newVersion.commitId=''
          this.GetAppVersionData()
          if(this.select_app.git.indexOf('code.aliyun.com')>=0){
            this.ali_code = true
            // this.newVersion.branch = this.select_app.branch
            this.newVersion.app_version = this.getCurTime() + '-' + this.newVersion.branch
          }else {
            this.ali_code = false
            this.GetGitRepoBranch(this.$store.state.cicd.git_branch_url)
          }
          //this.GetGitRepoBranch()
          this.GetAppCiCdData()
          let make_hide_list = ['python', 'php', 'static']
          if(make_hide_list.indexOf(this.select_app.language.toLowerCase())>=0){
            this.make_arg_hide=true
          }
          if(this.select_app.language==='JAVA' && !this.select_app.make_args){this.select_app.make_args='mvn -B -f pom.xml clean package -Dmaven.test.skip=true -am -U'}
          else if(['JS', 'NODEJS'].indexOf(this.select_app.language)>=0 && !this.select_app.make_args){this.select_app.make_args='npm install && npm run build '}
          this.createAppVersionTitle = '创建 '+this.select_app.code+' 新版本并建立发布单元'
          this.newVersion.gitRepo = this.select_app.git
          this.newVersion.buildpath = this.select_app.buildpath
          this.newVersion.project = this.select_app.project
          this.newVersion.make_args = this.select_app.make_args
          this.dialogCreateAppVersion = true
          this.deployment_env = ''
        }else {this.$message.warning('请选择应用')}

      },

      // 显示任务单元执行状态
      showTaskUnitStatus: function(row){
        // console.log('row:', row)
        this.dialTaskUnitStatus=true
        this.taskUnitTitle = row.appCode+' '+row.env+' 信息'
        this.cur_version = {finish: true, sonar_scanner: false, sonar_result: ''}
        this.status_deployment= {finish: true, id: '',step_list: []}
        this.select_unit = row
        this.getTaskUnitCiLog()
        if(row.deploy_record){this.getTaskUnitCDLog()}
        if(row.rollback_record){this.getTaskUnitRollbackCDLog()}
      },

      showCiLog: function(row){
        this.select_unit = row
        this.version_log = ''
        this.getTaskUnitCiLog()
        this.dialogLog = true
      },

      // 当前时间换日期字符串
      getCurTime: function() {
        var now = new Date();
        var yy = now.getFullYear();      //年
        var mm = now.getMonth() + 1;     //月
        var dd = now.getDate();          //日
        var hh = now.getHours();         //时
        var ii = now.getMinutes();       //分
        var ss = now.getSeconds();       //秒
        var clock = String(yy);
        if(mm < 10) clock += "0";
        clock += String(mm);
        if(dd < 10) clock += "0";
        clock += String(dd);
        if(hh < 10) clock += "0";
        clock += String(hh);
        if (ii < 10) clock += '0';
        clock += String(ii);
        if (ss < 10) clock += '0';
        clock += String(ss);
        return clock
      },

      // 跳转构建页面
      buildClick: function(row){
        // console.log('row, column, cell, event', row)
        this.$router.push('/cicd/app/build/?appId='+row.appId+'&appCode='+row.code)
      },

      //行拖拽
      rowDrop() {
        const tbody = document.querySelector('.task-unit tbody')
        // console.log('tbody', tbody)
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            if(_this.unit_list instanceof Array){
              const currRow = _this.unit_list.splice(oldIndex, 1)[0]
              _this.unit_list.splice(newIndex, 0, currRow)
              for(let i=0;i<_this.unit_list.length;i++){
                _this.unit_list[i].order_id=i+1
              }
            }
          }
        })
      },

      //列拖拽
      columnDrop() {
        const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
        this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          onEnd: evt => {
            const oldItem = this.dropCol[evt.oldIndex]
            this.dropCol.splice(evt.oldIndex, 1)
            this.dropCol.splice(evt.newIndex, 0, oldItem)
          }
        })
      },
    },

    computed: {},
    mounted () {

      // let appCode = this.common.getUrlKey('appCode');
      // if (appCode){this.formSearch.appCode=appCode}
      // this.InitGetTableData(this.app_url, this.limit, this.page)
      this.getTaskData()
    },
    components: {
      pagination: pagination,
    },

    destroyed: function() {
      window.clearInterval(this.task_unit_timer)
      window.clearInterval(this.task_timer)
      window.clearInterval(this.version_timer)
      window.clearInterval(this.deploy_timer)
    }
  }
</script>

<style scoped>
  /deep/ .button-c {
    cursor: pointer;
  }
  /deep/ .el-step__title.is-process {
    color: #409eff;
  }
  /deep/ .el-step__description.is-process{
    color: #409eff;
  }
</style>
