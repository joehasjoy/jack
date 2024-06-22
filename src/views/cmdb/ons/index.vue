<template>
    <div class="app-container">
        <div class="filter-container">
           <el-select v-model="region_value" placeholder="请选择region" clearable @change="switchRegion">
             <el-option v-for="(item, index) in region_options" :key="index" :label="item.regionname" :value="item.onsregionid"></el-option>
           </el-select>
          <el-button type="primary" @click="openCreateDialog" style="float:right;" 
            v-if="user_roles.includes('devops') || user_roles.includes('ons_w') || user_roles.includes('ons_r')">一键创建</el-button>
        </div>
        <div class="content">
          <el-row>
            <el-col :span="2">
              <el-menu 
              default-active="1" 
              @select="menuSelect"
              
              class="el-menu-vertical-demo">
                <el-menu-item index="1">
                  <span slot="title">实例详情</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title">Topic管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <span slot="title">Group管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <span slot="title">消息查询</span>
                </el-menu-item>
                <el-menu-item index="5" disabled>
                  <span slot="title"></span>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="22">
              <div v-if="checked_index === '1'">
                <el-select v-model="checked_instance" placeholder="请选择实例" clearable style="margin: 10px;">
                  <el-option v-for="item in instance_table" :key="item.instanceid" :label="item.instancename" :value="item.instanceid"></el-option>
                </el-select>
                <div v-for="(item, index) in instance_table" :key="index">
                  <el-form label-width="130px" v-if="item.instanceid === checked_instance">
                    <el-form-item label="实例ID">
                      <span>{{item.instanceid}}</span>
                    </el-form-item>
                    <el-form-item label="实例名称">
                      <span>{{item.instancename}}</span>
                    </el-form-item>
                    <el-form-item label="HTTP内网接入点">
                      <span v-if="item.httpinternalendpoint === null">无</span>
                      <span v-else>{{item.httpinternalendpoint}}</span>
                    </el-form-item>
                    <el-form-item label="HTTP公网接入点">
                      <span v-if="item.httpinternetendpoint === null">无</span>
                      <span v-else>{{item.httpinternetendpoint}}</span>
                    </el-form-item>
                    <el-form-item label="TCP接入点">
                      <span v-if="item.tcpendpoint === null">无</span>
                      <span v-else>{{item.tcpendpoint}}</span>
                    </el-form-item>
                    <el-form-item label="实例类型">
                      <span v-if="String(item.instancetype) === '1'">后付费实例</span>
                      <span v-if="String(item.instancetype) === '2'">铂金版实例</span>
                    </el-form-item>
                    <el-form-item label="实例状态">
                      <span v-if="item.instancestatus === '0'">铂金版实例部署中</span>
                      <span v-if="item.instancestatus === '2'">后付费实例已欠费</span>
                      <span v-if="item.instancestatus === '5'">服务中</span>
                      <span v-if="item.instancestatus === '7'">升级中</span>
                    </el-form-item>
                    <el-form-item label="备注">
                      <span>{{item.remark}}</span>
                    </el-form-item>
                  </el-form>
                </div>
            
              </div>
              <div v-if="checked_index === '2'">
                <el-select v-model="checked_instance" placeholder="请选择实例" clearable style="margin: 10px;" @change="switchTopicInstance">
                  <el-option v-for="item in instance_table" :key="item.instanceid" :label="item.instancename" :value="item.instanceid"></el-option>
                </el-select>
                <!-- <el-input style="width:300px;" v-model.trim="search_topic" placeholder="请输入topic" 
                @keyup.enter.native="topicFilter" clearable>
                </el-input> -->
                <el-select v-model="search_topic"
                style="width:20%;" 
                placeholder="请输入Topic"
                remote
                filterable
                clearable
                :remote-method="remoteSearchTopic"
                @keyup.enter.native="topicFilter">
                  <el-option v-for="(item, index) in topic_options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="medium" @click="topicFilter" style="margin-left:10px;">搜索</el-button>
                <el-button type="primary" size="medium" style="float:right;margin:10px;" @click="handleCreateDialog"
                 v-if="user_roles.includes('devops') || user_roles.includes('ons_w')">创建Topic</el-button>
                <el-table :data="topic_table">
                  <el-table-column label="Topic" prop="topic">
                  </el-table-column>
                  <el-table-column label="备注" prop="remark">
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" size="medium" @click="sendMessageDialog(scope.row)" 
                       v-if="user_roles.includes('devops') || user_roles.includes('ons_w') || user_roles.includes('ons_dev_w')">发送消息</el-button>
                      <el-button type="text" size="medium" @click="displaySub(scope.row)">订阅关系</el-button>
                      <el-dropdown @command="handleTopicCommand" v-if="user_roles.includes('devops')">
                        <span class="el-dropdown-link">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="{action: 'delete', data: scope.row}">删除</el-dropdown-item>
                          <el-dropdown-item :command="{action: 'permission', data: scope.row}">授权</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
                 <pagination v-show="topic_total>0" :total="topic_total" :page.sync="topic_page" :limit.sync="topic_limit"  @pagination="topicGetList" />
              </div>
              <div v-if="checked_index === '3'">
                <el-select v-model="checked_instance" placeholder="请选择实例" clearable style="margin: 10px;" @change="switchGroupcInstance">
                  <el-option v-for="item in instance_table" :key="item.instanceid" :label="item.instancename" :value="item.instanceid"></el-option>
                </el-select>
                <!-- <el-input style="width:300px;" 
                v-model.trim="search_group" 
                placeholder="请输入group" 
                @keyup.enter.native="groupFilter" 
                clearable>
                </el-input> -->
                <el-select v-model="search_group"
                style="width:30%;" 
                placeholder="请输入Group"
                remote
                filterable
                clearable
                :remote-method="remoteSearchGroup"
                @keyup.enter.native="groupFilter">
                  <el-option v-for="(item, index) in group_options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="medium" @click="groupFilter" style="margin-left:10px;">搜索</el-button>
                <el-button type="primary" size="medium" style="float:right;margin:10px;" @click="handleCreateGroupDialog"
                v-if="user_roles.includes('devops') || user_roles.includes('ons_w')">创建 Group ID</el-button>
                <el-table :data="group_table">
                  <el-table-column label="Group" prop="groupid"></el-table-column>
                  <el-table-column label="备注" prop="remark"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="subGroupDrawer(scope.row)">订阅关系</el-button>
                      <el-button type="text" @click="consumerDrawer(scope.row)">消费者状态</el-button>
                      <el-button type="text" @click="deleteGroupDialog(scope.row)" v-if="user_roles.includes('devops')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination v-show="group_total>0" :total="group_total" :page.sync="group_page" :limit.sync="group_limit"  @pagination="groupGetList" />
              </div>
              <div v-if="checked_index === '4'">
                <el-select v-model="checked_instance" placeholder="请选择实例" clearable style="margin: 10px;">
                  <el-option v-for="item in instance_table" :key="item.instanceid" :label="item.instancename" :value="item.instanceid"></el-option>
                </el-select>
                <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick" style="margin: 10px;">
                  <el-tab-pane label="按 Message ID 查询" name="msg">
                    <el-select v-model="message_search_form.topic" clearable filterable style="width:20%;" 
                    placeholder="请输入Topic进行搜索">
                      <el-option v-for="(item, index) in topic_options" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model.trim="message_search_form.msgId" style="width:25%;margin-left:15px;" 
                    placeholder="请输入Message ID进行搜索" clearable @keyup.enter.native="searchMessageById"></el-input>
                    <el-button type="primary" style="margin-left:15px;" 
                    v-if="message_search_form.topic != '' && message_search_form.msgId != ''" @click="searchMessageById">搜索</el-button>
                    <el-button  v-else-if="message_search_form.topic === '' || message_search_form.msgId === ''" disabled>搜索</el-button>
                    <el-table :data="message_by_id_table" v-loading="loading">
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form>
                            <el-form-item label="BornHost">
                              <span>{{scope.row.BornHost}}</span>
                            </el-form-item>
                            <el-form-item label="消息体大小(byte)">
                              <span>{{scope.row.StoreSize}}</span>
                            </el-form-item>
                            <el-form-item label="Userproperties">
                              <span>{{scope.row.proper}}</span>
                            </el-form-item>
                          </el-form>
                          <el-table :data="scope.row.trace" border>
                            <el-table-column label="Group ID" prop="ConsumerGroup"></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="props">
                                <el-button type="text" size="medium" @click="consumerValid(props.row, scope.row)">消费验证</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </el-table-column>
                      <el-table-column label="Message ID" prop="MsgId"></el-table-column>
                      <el-table-column label="Tag">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.TAGS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Key">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.KEYS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="存储时间">
                        <template slot-scope="scope">
                          <span>{{scope.row.StoreTimestamp}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="text" @click="messageTrack(scope.row)">消息轨迹</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="按 Message Key 查询" name="key">
                    <el-select v-model="message_search_form.topic" clearable filterable style="width:20%;" 
                    placeholder="请输入Topic进行搜索">
                      <el-option v-for="(item, index) in topic_options" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model.trim="message_search_form.key" style="width:25%;margin-left:15px;" 
                    placeholder="请输入Message Key进行搜索" clearable @keyup.enter.native="searchMessageByKey"></el-input>
                    <el-button type="primary" style="margin-left:15px;" 
                    v-if="message_search_form.topic != '' && message_search_form.key != ''" @click="searchMessageByKey">搜索</el-button>
                    <el-button  v-else-if="message_search_form.topic === '' || message_search_form.key === ''" disabled>搜索</el-button>
                    <el-table :data="message_by_key_table" v-loading="loading">
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form>
                            <el-form-item label="BornHost">
                              <span>{{scope.row.BornHost}}</span>
                            </el-form-item>
                            <el-form-item label="消息体大小(byte)">
                              <span>{{scope.row.StoreSize}}</span>
                            </el-form-item>
                            <el-form-item label="Userproperties">
                              <span>{{scope.row.proper}}</span>
                            </el-form-item>
                          </el-form>
                          <el-table :data="scope.row.trace" border>
                            <el-table-column label="Group ID" prop="ConsumerGroup"></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="props">
                                <el-button type="text" size="medium" @click="consumerValid(props.row, scope.row)">消费验证</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </el-table-column>
                      <el-table-column label="Message ID" prop="MsgId"></el-table-column>
                      <el-table-column label="Tag">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.TAGS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Key">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.KEYS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="存储时间">
                        <template slot-scope="scope">
                          <span>{{scope.row.StoreTimestamp}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="text" @click="messageTrack(scope.row)">消息轨迹</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="按 Topic 查询" name="topic">
                    <el-select v-model="message_search_form.topic" clearable filterable style="width:20%;" 
                      placeholder="请输入Topic进行搜索">
                      <el-option v-for="(item, index) in topic_options" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-date-picker v-model="message_date"
                    style="margin-left:15px;"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholde="开始日期"
                      end-placeholde="结束日期"
                      :picker-options="pickerOptions"
                      :default-time="defaultTime"
                      align="right"></el-date-picker>
                      <el-button type="primary" style="margin-left:15px;" 
                        v-if="message_search_form.topic != '' && message_date != ''" @click="searchMessageByDate">搜索</el-button>
                      <el-button style="margin-left:15px;" v-else-if="message_search_form.topic === '' || message_date === ''" disabled>搜索</el-button>
                      <el-table :data="message_by_date_table" v-loading="loading">
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form>
                            <el-form-item label="BornHost">
                              <span>{{scope.row.BornHost}}</span>
                            </el-form-item>
                            <el-form-item label="消息体大小(byte)">
                              <span>{{scope.row.StoreSize}}</span>
                            </el-form-item>
                            <el-form-item label="Userproperties">
                              <span>{{scope.row.proper}}</span>
                            </el-form-item>
                          </el-form>
                          <el-table :data="scope.row.trace" border>
                            <el-table-column label="Group ID" prop="ConsumerGroup"></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="props">
                                <el-button type="text" size="medium" @click="consumerValid(props.row, scope.row)">消费验证</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </el-table-column>
                      <el-table-column label="Message ID" prop="MsgId"></el-table-column>
                      <el-table-column label="Tag">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.TAGS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Key">
                        <template slot-scope="scope">
                          <span>{{scope.row.proper.KEYS}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="存储时间">
                        <template slot-scope="scope">
                          <span>{{scope.row.StoreTimestamp}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="text" @click="messageTrack(scope.row)">消息轨迹</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <pagination v-show="message_by_date_total>0" :total="message_by_date_total" :page.sync="message_by_date_page" :limit.sync="message_by_date_size"  @pagination="messageGetList" />
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div v-if="checked_index==='5'">
                <el-table :data="message_track_table" style="margin:10px;" border v-loading="loading">
                  <el-table-column type="expand">
                    <template>
                      <el-table :data="trace_consumer_table">
                        <el-table-column type="expand">
                          <template slot-scope="props">
                            <el-table :data="props.row.SubList.SubMapDo">
                              <el-table-column label="消费者Group ID" prop="SubGroupName"></el-table-column>
                              <el-table-column label="成功统计" prop="SuccessCount"></el-table-column>
                              <el-table-column label="失败统计" prop="FailCount"></el-table-column>
                              <el-table-column label="IP" prop="ClientHost"></el-table-column>
                              <el-table-column label="消费状态">
                                <template slot-scope="scope">
                                  <span>第</span>
                                  <span>{{scope.row.ReconsumeTimes}}</span>
                                  <span>次</span>
                                  <span v-if="scope.row.Status === 'CONSUME_SUCCESS'">消费成功</span>
                                  <span v-else>消费失败</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="耗时">
                                <template slot-scope="scope">
                                  <span>{{scope.row.CostTime}}</span>
                                  <span>毫秒</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="投递时间">
                                <template slot-scope="scope">
                                  <span>{{new Date(scope.row.SubTime).toLocaleString()}}</span>
                                </template>
                              </el-table-column>
                            </el-table>
                          </template>
                        </el-table-column>
                        <el-table-column label="Tag" prop="Tag"></el-table-column>
                        <el-table-column label="key" prop="MsgKey"></el-table-column>
                        <el-table-column label="发送状态">
                          <template slot-scope="props">
                            <span v-if="props.row.Status === 'SEND_SUCCESS'" style="color:green;">发送成功</span>
                            <span v-else style="color: red;">发送失败</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="发送时间">
                          <template slot-scope="props">
                            <span>{{new Date(props.row.PubTime).toLocaleString()}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="生产Group ID" prop="PubGroupName"></el-table-column>
                        <el-table-column label="发送耗时">
                          <template slot-scope="props">
                            <span>{{props.row.CostTime}}</span>
                            <span>毫秒</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="发送端Host" prop="BornHost"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column label="Topic" prop="Topic"></el-table-column>
                  <el-table-column label="Message ID" prop="MsgId"></el-table-column>
                  <el-table-column label="创建时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.CreateTime}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-dialog
        title="一键创建GID和TOPIC"
        :visible.sync="create_dialog"
        width="30%"
        >
         <el-form label-width="80px" :model="formData" ref="formData" :rules="formRules">
             <el-form-item label="应用名" prop="servername">
              <el-input v-model.trim="formData.servername"></el-input>
             </el-form-item>
             <el-form-item label="环境" prop="env">
               <el-select
                v-model.trim="formData.env"
                filterable
                clearable
                placeholder="请选择环境"
                style="width:100%;"
                >
                <el-option
                 v-for="item in env_options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
                ></el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="消息类型" prop="messtype">
                 <el-select
                 placeholder="请选择消息类型"
                 v-model="formData.messtype"
                 clearable
                 style="width:100%;">
                   <el-option
                   v-for="item in message_options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>

                 </el-select>
             </el-form-item>
             <el-form-item label="描述" prop="remark">
                 <el-input type="textarea" v-model="formData.remark"></el-input>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="create_dialog = false">取 消</el-button>
           <el-button type="primary" @click="createSubmit('formData')">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="已创建的Topic和Gid"
       :visible.sync="drawer_dialog"
       width="30%"
       >
         <el-form>
             <el-form-item v-for="item in topic_data" :key="item" label="Topic">
                 <span>{{item}}</span>
             </el-form-item>
             <el-form-item v-for="gid in gid_data" :key="gid" label="GID">
                 <span>{{gid}}</span>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="drawer_dialog = false">取 消</el-button>
           <el-button type="primary" @click="drawer_dialog = false">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="创建Topic"
       :visible.sync="post_dialog"
       width="35%"
       >
         <el-form :model="postData" ref="postData" :rules="postRules" label-width="80px">
           <el-form-item label="Topic" prop="topic">
             <el-input v-model.trim="postData.topic" maxlength="64" clearable></el-input>
           </el-form-item>
           <el-form-item label="消息类型" prop="messType">
             <el-select
                 placeholder="请选择消息类型"
                 v-model.trim="postData.messType"
                 clearable
                 style="width:100%;">
                   <el-option
                   v-for="item in message_options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>

                 </el-select>
           </el-form-item>
           <el-form-item label="描述" prop="remark">
                 <el-input type="textarea" v-model.trim="postData.remark"></el-input>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="post_dialog = false">取 消</el-button>
           <el-button type="primary" @click="postSubmit('postData')">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="⚠️警告"
       :visible.sync="exists_topic_dialog"
       width="20%"
       >
         <span>topic {{exists_topic}} 已存在</span>
         <span slot="footer" class="dialog-footer">
           <el-button @click="exists_topic_dialog = false">取 消</el-button>
           <el-button type="primary" @click="exists_topic_dialog = false">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="⚠️删除Topic"
       :visible.sync="delete_topic_dialog"
       width="30%"
       >
         <span>确定删除此 {{delete_topic}} Topic吗？</span>
         <span slot="footer" class="dialog-footer">
           <el-button @click="delete_topic_dialog = false">取 消</el-button>
           <el-button type="primary" @click="handleDeleteTopic">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="Topic授权"
       :visible.sync="perm_topic_dialog"
       width="30%"
       >
         <el-form :model="permData" ref="permData" :rules="permRules" label-width="80px">
           <el-form-item label="Topic" prop="topic">
             <el-input v-model="permData.topic" :readonly="true"></el-input>
           </el-form-item>
           <el-form-item label="授权类型" prop="perm">
             <el-select v-model="permData.perm" style="width:100%;">
               <el-option v-for="(item, index) in perm_options" :key="index" :label="item.label" :value="item.value"></el-option>
             </el-select>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="perm_topic_dialog = false">取 消</el-button>
           <el-button type="primary" @click="grantTopicPerm('permData')">确 定</el-button>
         </span>
      </el-dialog>
      <el-drawer
        title="订阅关系"
        size="40%"
        :visible.sync="sub_drawer"
        :direction="direction"
        custom-class="demo-drawer"
        style="font-size:22px;">
        <div v-loading="loading">
          <div class="drawer-content">
            <el-form style="margin-left:20px;">
              <el-form-item label="topic名称:">
                <span>{{drawerData.topic}}</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="drawer-bottom">
            <el-tooltip placement="top" effect="light">
              <div slot="content">实时查看已订阅该 Topic 的在线 Group ID, 非在线 Group ID 无法查看。</div>
              <span>订阅关系</span>
            </el-tooltip>
            <el-table :data="drawerTable">
              <el-table-column label="Group ID" prop="GroupId"></el-table-column>
              <el-table-column label="消费模式" prop="MessageModel">
                <template slot-scope="scope">
                  <span v-if="scope.row.MessageModel==='CLUSTERING'">集群模式</span>
                  <span v-else-if="scope.row.MessageModel === 'BROADCASTING'">广播模式</span>
                  <span v-else>未知</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="consumerDrawer(scope.row)">消费者状态</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
      <el-dialog
       title="创建Group ID"
       :visible.sync="post_group_dialog"
       width="40%"
       >
         <el-form :model="groupData" ref="groupData" :rules="groupRules" label-width="90px">
           <el-form-item label="Group ID" prop="groupId">
             <el-input v-model.trim="groupData.groupId" clearable minlength="7" maxlength="64"></el-input>
             <ol style="margin-left:15px;">
             <li>以 "GID_" 或者 "GID-" 开头，只能包含字母、数字、短横线（-）和下划线（_）；</li>
             <li>长度限制在 7-64 字节之间;</li>
             <li>Group ID 一旦创建, 将无法再修改。</li>
           </ol>
           </el-form-item>
           
           <el-form-item label="环境" prop="env">
             <el-select v-model="groupData.env" style="width:100%;">
               <el-option v-for="(item, index) in env_options" :key="index" :label="item.label" :value="item.value"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="备注" prop="remark">
             <el-input v-model.trim="groupData.remark" type="textarea" clearable></el-input>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="post_group_dialog = false">取 消</el-button>
           <el-button type="primary" @click="createGroupSubmit('groupData')">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="⚠️警告"
       :visible.sync="exists_group_dialog"
       width="20%"
       >
         <span>Group ID: {{exists_group}} 已存在</span>
         <span slot="footer" class="dialog-footer">
           <el-button @click="exists_group_dialog = false">取 消</el-button>
           <el-button type="primary" @click="exists_group_dialog = false">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
       title="⚠️删除Group ID"
       :visible.sync="delete_group_dialog"
       width="30%"
       >
         <span>确定删除Group ID: {{delete_group}} 吗？</span>
         <span slot="footer" class="dialog-footer">
           <el-button @click="delete_group_dialog = false">取 消</el-button>
           <el-button type="primary" @click="handleDeleteGroup">确 定</el-button>
         </span>
      </el-dialog>
      <el-drawer
        title="订阅关系"
        size="40%"
        :visible.sync="sub_group_drawer"
        :direction="direction"
        custom-class="demo-drawer"
        style="font-size:22px;">
        <div v-loading="loading">
          <div class="drawer-content">
            <el-table :data="groupSubStatus" border style="margin:20px 20px 0 20px;">
              <el-table-column label="条目" prop="title"></el-table-column>
              <el-table-column label="值" >
                <template slot-scope="scope">
                  <span v-if="scope.row.title === '是否在线' &&scope.row.val ===true" style="color: green;">是</span>
                  <span v-else-if="scope.row.title === '是否在线' &&scope.row.val ===false" style="color: red;">否</span>
                  <span v-else-if="scope.row.title === 'Group ID'">{{scope.row.val}}</span>
                  <span v-else-if="scope.row.title === '消费模式' && scope.row.val === null">未知</span>
                  <span v-else-if="scope.row.title === '消费模式' && scope.row.val ==='CLUSTERING'">集群模式</span>
                  <span v-else-if="scope.row.title === '消费模式' && scope.row.val === 'BROADCASTING'">广播模式</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="drawer-bottom">
            <el-tooltip placement="top" effect="light">
              <div slot="content">在线状态下，实时查看该 Group ID 订阅的 Topic; 若该 Group ID 不在线，则无法查看。</div>
              <span>订阅关系</span>
            </el-tooltip>
            <el-table :data="groupDrawerTable" border style="margin-top:20px;" max-height="460">
              <el-table-column label="Toic" prop="Topic"></el-table-column>
              <el-table-column label="过滤规则" prop="SubString"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
      <el-drawer 
      title="消费者状态"
      size="40%"
      :visible.sync="group_consumer_drawer"
      :direction="direction"
      custom-class="demo-drawer"
      style="font-size:22px;"
      >
        <div style="border-top: 1px solid #ebebeb;" v-loading="loading">
          <div class="consumer-head">
            <ul>
              <li>
                <span v-if="consumer_status_data.Online===true" style="color:green;">在线</span>
                <span v-else-if="consumer_status_data.Online===false" style="color:red;">离线</span>
              </li>
              <li>
                <p>实时消费速度</p>
                <p style="color:black;margin-top:5px;">
                  <span>{{consumer_status_data.ConsumeTps}}</span>
                  <span>条/秒</span>
                </p>
                
              </li>
              <li>
                <p>实时消息堆积量</p>
                <p style="color:black;margin-top:5px;">{{consumer_status_data.TotalDiff}}</p>
              </li>
              <li>
                <p>最近消费时间</p>
                <p style="color:black;margin-top:5px;">{{consumer_status_data.LastTimestamp}}</p>
              </li>
              <li>
                <p>消息延迟时间</p>
                <p style="color:black;margin-top:5px;">
                  <span>{{consumer_status_data.DelayTime}}</span>
                  <span>ms</span>
                </p>
              </li>
            </ul>
            
          </div>
          <div class="consumer-body">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="消费者名称">
                <span >{{consumer_status_data.GroupId}}</span>
              </el-form-item>
              <el-form-item label="消费模式">
                <span v-if="consumer_status_data.MessageModel === null">未知</span>
                <span v-else-if="consumer_status_data.MessageModel === 'CLUSTERING'">集群模式</span>
                <span v-else-if="consumer_status_data.MessageModel === 'BROADCASTING'">广播模式</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="consumer-footer">
            <p>连接信息</p>
            <el-table :data="consumer_connect_data" border style="margin-top:20px;" max-height="460" >
              <el-table-column label="客户端IP" prop="ClientAddr"></el-table-column>
              <el-table-column label="语言" prop="Language"></el-table-column>
              <el-table-column label="版本号" prop="Version"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="consumerStatusDialog(scope.row,consumer_status_data.GroupId)">详细信息</el-button>
                  <el-button type="text" @click="consumerJstackDialog(scope.row, consumer_status_data.GroupId)">堆栈信息</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
      <el-drawer
      title="连接详情"
      size="40%"
      :visible.sync="consumer_status_drawer"
      :direction="direction"
      custom-class="demo-drawer"
      style="font-size:22px;"
      >
        <div style="border-top: 1px solid #ebebeb;" v-loading="loading">
          <div class="consumer-status-head">
            <p>连接状态</p>
            <el-form label-width="120px" label-position="left" size="mini">
              <el-form-item label="消费者名称" size="mini">
                <span>{{consumer_status_form.GroupId}}</span>
              </el-form-item>
              <el-form-item label="消费类型" size="mini">
                <span>{{consumer_status_form.ConsumeType}}</span>
              </el-form-item>
              <el-form-item label="消费线程数" size="mini">
                <span>{{consumer_status_form.ThreadCount}}</span>
              </el-form-item>
              <el-form-item label="消费启动时间" size="mini">
                <span>{{consumer_status_form.StartTimeStamp}}</span>
              </el-form-item>
              <!-- <el-form-item label="最新消费时间" size="mini">
                <span>{{consumer_status_form.LastTimeStamp}}</span>
              </el-form-item> -->
            </el-form> 
          </div>
          <div class="consumer-status-body">
            <p>订阅关系</p>
            <el-table :data="consumer_status_sub_data" max-height="200" border size="mini">
              <el-table-column label="Topic" prop="Topic"></el-table-column>
              <el-table-column label="Tag" prop="SubString"></el-table-column>
            </el-table>
          </div>
          <div class="consumer-status-footer"> 
            <p>消费统计</p>
            <el-table :data="consumer_status_count_data" size="mini" max-height="200" border>
              <el-table-column label="Topic" prop="Topic" fixed min-width="230px"></el-table-column>
              <el-table-column label="处理时间(毫秒/条)" prop="Rt" min-width="120px"></el-table-column>
              <el-table-column label="失败总计(每小时)" prop="FailedCountPerHour" min-width="120px"></el-table-column>
              <el-table-column label="消息成功(条/秒)" prop="OkTps" min-width="120px"></el-table-column>
              <el-table-column label="消息失败(条/秒)" prop="FailedTps" min-width="120px"></el-table-column>
              <el-table-column label="消息堆积量" prop="TotalDiff" min-width="100px"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
      <el-drawer
      title="连接堆栈"
      size="40%"
      :visible.sync="consumer_jstack_dialog"
      :direction="direction"
      custom-class="demo-drawer"
      style="font-size:22px;">
        <div style="border-top: 1px solid #ebebeb;"> 
          <el-table :data="consumer_jstack_data" max-height="600" border style="margin:20px;" v-loading="loading">
            <el-table-column label="Thread" prop="item" fixed></el-table-column>
            <el-table-column label="Stack" prop="detail"></el-table-column>
          </el-table>
        </div>
      </el-drawer>
      <el-dialog
       title="发送消息"
       :visible.sync="send_message_dialog"
       width="40%"
       >
         <el-form :model="send_message_form" ref="send_message_form" :rules="send_message_rules" label-width="70px">
           <el-form-item label="Topic">
             <el-input v-model="send_message_form.topic" readonly></el-input>
           </el-form-item>
           <el-form-item label="Tag">
             <el-input v-model.trim="send_message_form.tag" clearable></el-input>
           </el-form-item>
           <el-form-item label="Key">
             <el-input v-model.trim="send_message_form.key" clearable></el-input>
           </el-form-item>
           <el-form-item label="消息体" prop="msg">
             <el-input v-model="send_message_form.msg" type="textarea" :rows="4" clearable></el-input>
           </el-form-item>
         </el-form>
         <span v-if="send_message_label === true" style="margin-left:70px; color:green;"> 消息发送成功 Message ID: {{send_message_callback_body}}</span>
         <span v-else-if="send_message_label === false" style="margin-left:70px; color:red;">消息发送失败</span>
         <span slot="footer" class="dialog-footer">
           <el-button @click="send_message_dialog = false">取 消</el-button>
           <el-button type="primary" @click="sendMessageSubmit('send_message_form')">确 定</el-button>
         </span>
      </el-dialog>
      <el-dialog
      title="消费验证"
      :visible.sync="consumer_valid_dialog"
      width="35%">
        <el-form :model="consumer_form" label-width="100px">
          <el-form-item label="Message ID:">
            <span>{{consumer_form.msgId}}</span>
          </el-form-item>
          <el-form-item label="Topic:">
            <span>{{consumer_form.topic}}</span>
          </el-form-item>
          <el-form-item label="Group ID:">
            <span>{{consumer_form.groupId}}</span>
          </el-form-item>
        </el-form>
        <el-radio-group v-model="consumer_form.clientId" v-if="consumer_form.clientIds.length != 0">
          <el-radio v-for="(item, index) in consumer_form.clientIds" :key="index" :label="item.ClientId" border style="display:block;margin:0;margin-top:20px;">{{item.ClientId}}</el-radio>
        </el-radio-group>
        <el-button v-else disabled>没有查询到符合条件的数据</el-button>
        <p class="span-border">这个功能只作为验证消费者应用是否能接收到消息所用，点击［确定］按钮后消息将会重新发送到指定IP上，可能会引起消息重复。</p>
        <span slot="footer" class="dialog-footer">
           <el-button @click="consumer_valid_dialog = false">取 消</el-button>
           <el-button v-if="consumer_form.clientIds.length ===0" disabled="">确定</el-button>
           <el-button v-else type="primary" @click="validMessagePush">确 定</el-button>
         </span>
      </el-dialog>
    </div>
</template>

<script>
import pagination from '@/components/Pagination/pagination'
import Validators from '@/utils/validators'

export default {
    name: 'ons_management',
    components: {
      pagination
    },
    data() {
        return {
          create_dialog: false,
          formData: {
              servername: '',
              env: '',
              messtype: '',
              remark: ''
          },
          env_options: [
              {value: 'dev', label: 'dev'},
              {value: 'test', label: 'test'},
              {value: 'sitNew', label: 'sitNew'},
              {value: 'uat', label: 'uat'},
              {value: 'prod', label: 'prod'}
          ],
          message_options: [
            {value: 0, label: '普通消息'},
            {value: 1, label: '分区顺序消息'},
            {value: 2, label: '全局顺序消息'},
            {value:4, label: '事务消息'},
            {value: 5, label: '定时/延时消息'}
          ],
          formRules: {
              servername: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              env: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              messtype: [
                  {required: true, message: '此为必选项', trigger: blur}
              ],
              remark: [
                  {required: true, message: '此为必填项', trigger: blur}
              ]
          },
          postData: {
            instanceId: '',
            regionId: '',
            topic: '',
            messType: '',
            remark: ''
          },
          postRules: {
            instanceId: [
              {required: true, message: '实例为必选项', trigger: blur}
            ],
            regionId: [
              {required: true, message: 'region为必选项', trigger: blur}
            ],
            topic: [
              {required: true, message: '此为必填项', trigger: blur}
            ],
            messType: [
              {required: true, message: '此为必填项', trigger: blur}
            ],
            remark: [
              {required: true, message: '此为比填项', trigger: blur}
            ]
          },
          permData: {
            instanceId: '',
            regionId: '',
            topic: '',
            perm: ''
          },
          perm_options: [
            {value: 2, label: '禁读'},
            {value:4, label: '禁写'},
            {value: 6, label: '读写'}
          ],
          permRules: {
            instanceId: [
              {required: true, message: '实例为必选项', trigger: blur}
            ],
            regionId: [
              {required: true, message: 'region为必选项', trigger: blur}
            ],
            topic: [
              {required: true, message: '此为必填项', trigger: blur}
            ],
            perm: [
              {required: true, message: '此为比选项', trigger: blur}
            ]
          },
          groupData: {
            instanceId: '',
            regionId: '',
            groupId: '',
            env: '',
            remark: ''
          },
          groupRules: {
            instanceId: [
              {required: true, message: '实例为必选项', trigger: blur}
            ],
            regionId: [
              {required: true, message: 'region为必选项', trigger: blur}
            ],
            groupId: [
              {validator: Validators.groupid, type: 'string', trigger: blur}
            ],
            env: [
              {required: true, message: '环境为必选项', trigger: blur}
            ],
            remark: [
              {required: true, message: '此为必填项', trigger: blur}
            ]         
          },
          topic_data: [],
          gid_data: [],
          drawer_dialog: false,
          region_options: [],
          region_value: 'mq-internet-access',
          checked_index: '1',
          instance_table: [],
          checked_instance: '',
          topic_table: [],
          topic_page:1,
          topic_limit: 10,
          topic_total: 0,
          search_topic: '',
          group_table: [],
          group_page: 1,
          group_limit: 10,
          group_total: 0,
          search_group: '',
          post_dialog: false,
          exists_topic: '',
          exists_topic_dialog: false,
          delete_topic: '',
          delete_topic_dialog: false,
          perm_topic_dialog: false,
          sub_drawer: false,
          direction: 'rtl',
          drawerData: {},
          drawerTable: [],
          post_group_dialog:false,
          exists_group: '',
          exists_group_dialog: false,
          delete_group: '',
          delete_group_dialog: false,
          sub_group_drawer: false,
          groupDrawerTable: [],
          groupSubStatus: [],
          group_consumer_drawer: false,
          consumer_status_data: {
            ConsumeTps: 0,
            DelayTime: 0,
            LastTimestamp: 0,
            Online: false,
            TotalDiff: 0,
            GroupId: '',
            MessageModel: null
          },
          consumer_connect_data: [],
          consumer_status_drawer: false,
          consumer_status_form:{},
          consumer_status_sub_data: [],
          consumer_status_count_data: [],
          consumer_jstack_data: [],
          consumer_jstack_dialog: false,
          consumer_jstack_data: [],
          loading: false,
          send_message_form: {
            instanceId: '',
            regionId: '',
            topic: '',
            key: '',
            tag: '',
            msg: ''
          },
          send_message_dialog: false,
          send_message_rules: {
            msg: [
              {required: true, message: '此为必填项', trigger: blur}
            ]
          },
          send_message_label: null,
          send_message_callback_body: '',
          activeName: 'msg',
          topic_options: [],
          message_search_form: {
            topic: '',
            key: '',
            msgId: '',
            instanceId: '',
            regionId: '',
            beginTime: '',
            endTime: ''
          },
          message_by_id_table: [],
          message_by_key_table: [],
          message_date: '',
          defaultTime: [],
          pickerOptions: {
            disabledDate(d) {
              
              const now = new Date()
              const diff = now.getTime() - d.getTime()
              const dst = 3600*24*3*1000
              if( diff > 0 &&diff < dst) {
                return false
              } else {
                return true
              }
            }
          },
          message_by_date_table: [],
          message_by_date_page: 1,
          message_by_date_size: 10,
          message_by_date_total: 0,
          consumer_form: {
            msgId: '',
            topic: '',
            groupId: '',
            clientIds: [],
            clientId: '',
            instanceId: '',
            regionId: ''
          },
          consumer_valid_dialog: false,
          create_trace_task_data: {
            topic: '',
            instanceId: '',
            beginTime: '',
            endTime: '',
            msgId: '',
            regionId: ''
          },
          message_track_table: [],
          trace_consumer_table: [],
          user_roles: [],
          topic_options: [],
          group_options: [],
        }
    },
    methods: {
      init(){
        this.getEnv()
        this.$store.dispatch('get_ons_region', {pageNumber:1, pageSize:100}).then(resp => {
          this.region_options = resp.data.data
        }).catch(err => {
          this.$message({message: '获取region数据失败 ' +err, type: 'error'})
        })
        if(this.region_value != '' && this.checked_index != ''){
          this.$store.dispatch('get_ons_instance', {region: this.region_value}).then(resp => {
            this.instance_table = resp.data.data
            this.checked_instance = this.instance_table[0].instanceid
          }).catch(err => {
            this.$message({message: '获取instance数据失败 ' +err, type: 'error'})
          })  
        } 
      },
      getEnv(){
        this.$store.dispatch('get_env').then(res => {
          if(res.data.code === 200 || res.data.code === 201){
            this.env_options = res.data.data.map(item => {
            return {value: item.code, label: item.code}
            })
          } else {
            this.$message({message: '获取数据失败 ' + res.data.msg, type: 'error'})
          }
          
          }).catch(err => {
            console.log(err)
            this.$message({message:'获取数据失败' + err, type: 'error'})
        })
      },
      menuSelect(index, indexPath){
        //切换menu
        this.checked_index = index
        if(this.checked_index === '1'){
          this.$store.dispatch('get_ons_instance', {region: this.region_value}).then(resp => {
            this.instance_table = resp.data.data
          }).catch(err => {
            this.$message({message: '获取instance数据失败 ' +err, type: 'error'})
          })  
        }
        if(this.checked_index === '2'){
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
            this.topic_table = resp.data.data
            this.topic_total = resp.data.total
          })
        }
        if(this.checked_index === '3') {
          this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
            this.group_table = resp.data.data
            this.group_total = resp.data.total
          })
        }
        if(this.checked_index === '4') {
          this.message_search_form.key = ''
          this.message_search_form.msgId = ''
          this.message_search_form.topic = ''
          this.topic_options = []
          this.message_by_id_table = []
          this.message_by_key_table = []
          this.message_by_date_table = []
          this.message_date = ''
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance, 
          pageSize:1000, pageNumber: 1}).then(resp => {  
            resp.data.data.map(item => {
              this.topic_options.push({label: item.topic, value: item.topic})
            })
            this.message_search_form.instanceId = this.checked_instance
            this.message_search_form.regionId = this.region_value
          }).catch(err => {
            this.$message({message: '获取topic信息失败', type: 'error'})
          })       
        }
      },
      switchRegion(val){
        //切换region
        this.$store.dispatch('get_ons_instance', {region: val}).then(resp => {
            this.instance_table = resp.data.data
            if(this.instance_table.length === 0){
              this.$message({message: '获取实例信息失败 ', type: 'error'})
            } else {
              this.checked_instance = this.instance_table[0].instanceid
            }
            
            if(this.checked_index === '2'){
              this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
                this.topic_table = resp.data.data
                this.topic_total = resp.data.total
              }).catch(err => {
                this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
              })
            }
            if(this.checked_index === '3') {
              this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
                this.group_table = resp.data.data
                this.group_total = resp.data.total
              }).catch(err => {
                this.$message({message: '获取group数据失败 ' +err, type: 'error'})
              })
            }
            if(this.checked_index === '4'){
              this.message_search_form.key = ''
              this.message_search_form.msgId = ''
              this.message_search_form.topic = ''
              this.topic_options = []
              this.message_by_id_table = []
              this.message_by_key_table = []
              this.message_by_date_table = []
              this.message_date = ''
              this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance, 
                pageSize:1000, pageNumber: 1}).then(resp => {  
                resp.data.data.map(item => {
                  this.topic_options.push({label: item.topic, value: item.topic})
                })
               
             }).catch(err => {
               this.$message({message: '获取topic信息失败', type: 'error'})
             })       
            }
          }).catch(err => {
            this.$message({message: '获取instance数据失败 ' +err, type: 'error'})
          })  
    
      },
      switchTopicInstance(val){
        //切换topic的实例
        this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: val}).then(resp => {
          this.topic_table = resp.data.data
          this.topic_total = resp.data.total
        }).catch(err => {
          this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
        })
      },
      topicGetList(){
        //topic分页查询
        this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance, pageNumber: this.topic_page, pageSize: this.topic_limit}).then(resp => {
          this.topic_table = resp.data.data
          this.topic_total = resp.data.total
        }).catch(err => {
          this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
        })
      },
      topicFilter(){
        //topic搜索
        if(this.search_topic != ''){
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance,  topic: this.search_topic}).then(resp => {
            this.topic_table = resp.data.data
            this.topic_total = resp.data.total
          }).catch(err => {
            this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
          })
        } else {
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
            this.topic_table = resp.data.data
            this.topic_total = resp.data.total
          }).catch(err => {
            this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
          })
        }
        
      },
      remoteSearchTopic(query){
        //topic名称远程搜索
        this.topic_options = []
        if(query !== ''){
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance,
          topic:query, searchMode: 1}).then(resp => {
            resp.data.data.map(ele => {
              this.topic_options.push({value: ele.topic, label: ele.topic})
            })
          }).catch(err => {
            this.$message({message: '获取topic数据失败 ' +err, type: 'error'})
          })
        } else {
          this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
            this.topic_table = resp.data.data
            this.topic_total = resp.data.total
          }).catch(err => {
            this.$message({message: '获取topic数据失败 ' + err, type: 'error'})
          })
        }
      },
      switchGroupcInstance(val) {
        //切换group的实例
        this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: val}).then(resp => {
          this.group_table = resp.data.data
          this.group_total = resp.data.total
        }).catch(err => {
          this.$message({message: '获取group数据失败 ' +err, type: 'error'})
        })
      },
      groupGetList(){
        //group查询分页
        this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance, pageNumber: this.group_page, pageSize: this.group_limit}).then(resp => {
          this.group_table = resp.data.data
          this.group_total = resp.data.total
        }).catch(err => {
          this.$message({message: '获取group数据失败 ' +err, type: 'error'})
        })
      },
      groupFilter(){
        //group搜索
        if(this.search_group != ''){
          this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance, groupId: this.search_group}).then(resp => {
            this.group_table = resp.data.data
            this.group_total = resp.data.total
          }).catch(err => {
            this.$message({message: '获取group数据失败 ' +err, type: 'error'})
          })
        } else {
          this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance}).then(resp => {
            this.group_table = resp.data.data
            this.group_total = resp.data.total
          }).catch(err => {
            this.$message({message: '获取group数据失败 ' +err, type: 'error'})
          })
        }
      },
      remoteSearchGroup(query){
        //远程搜索group
        this.group_options = []
        if(query !== ''){
          this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance, 
          groupId:query, searchMode:1}).then(resp => {
            resp.data.data.map(ele => {
              this.group_options.push({value: ele.groupid, label: ele.groupid})
            })
          })
        } else {
          this.group_options = []
        }
      },
      handleCreateDialog(){
        //打开topic创建的对话框 button事件
        this.postData.regionId = this.region_value
        this.postData.instanceId = this.checked_instance
        this.postData.topic = ''
        this.postData.remark = ''
        this.post_dialog = true

      },
      postSubmit(formName){
        //创建topic正式提交
        this.$refs[formName].validate((valid) => {
          if(valid){
            
            this.$store.dispatch('get_ons_topic', {region: this.postData.regionId, instanceId: this.postData.instanceId, topic: this.postData.topic}).then(resp => {
              if(resp.data.data.length > 0 ) {
                this.exists_topic = this.postData.topic
                this.exists_topic_dialog = true
              } else {
                this.$store.dispatch('create_topic', this.postData).then(resp => {
                  this.post_dialog = false
                  if(resp.data.code === 201 || res.data.code === 200) {
                    this.$message({message: '创建成功', type: 'success'})
                    this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance, topic: this.postData.topic}).then(resp => {
                      this.topic_table = resp.data.data
                      this.topic_total = resp.data.total
                    })
                  } else {
                    this.$message({message: '创建失败 '+ res.data.msg, typep: 'error'})
                  }
                }).catch(err => {
                  this.post_dialog = false
                  this.$message({message: '创建失败  '+err, type: 'error'})
                })
              }
            }).catch(err => {
              this.$message({message: '获取topic数据失败 ' +err, type: 'error'})
            })
          } else {
            this.$message({message: '非法数据', type: 'error'})
          }
        })
      },
      handleTopicCommand(command){
        //topic更多操作
        if(command.action === 'delete'){
          this.delete_topic = command.data.topic
          this.delete_topic_dialog = true  
        } else if (command.action === 'permission'){
          this.permData.instanceId = command.data.instanceid
          this.permData.regionId = command.data.region
          this.permData.topic = command.data.topic
          this.perm_topic_dialog = true
        }
      },
      handleDeleteTopic(){
        //确认删除topic
        this.$store.dispatch('delete_topic', {regionId: this.region_value, instanceId: this.checked_instance, topic: this.delete_topic}).then(resp => {
          this.delete_topic_dialog = false
          if(resp.data.code === 200|| resp.data.code === 201){
            this.$message({message: '删除成功', type: 'success'})
            this.$store.dispatch('get_ons_topic', {region: this.region_value, instanceId: this.checked_instance, topic: this.delete_topic}).then(resp => {
              this.topic_table = resp.data.data
              this.topic_total = resp.data.total
            })
          } else {
            this.$message({message: '删除失败 '+resp.data.msg, type: 'error'})
          }
        }).catch(err => {
          this.delete_topic_dialog = false
          this.$message({message: '删除失败 ' + err, type: 'error'})
        })
      },
      grantTopicPerm(formName){
        //给topic授权事件
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$store.dispatch('grant_topic_perm', this.permData).then(resp => {
              this.perm_topic_dialog = false
              if(resp.data.code === 200 || resp.data.code ===201){
                this.$message({message: '授权成功', type: 'success'})
                this.$store.dispatch('get_ons_topic', {region: this.permData.regionId, instanceId: this.permData.instanceId, topic: this.permData.topic}).then(resp => {
                  this.topic_table = resp.data.data
                  this.topic_total = resp.data.total
                })
              } else {
                this.$message({message: '授权失败 ' + resp.data.msg, type: 'error'})
              }
            }).catch(err => {
              this.perm_topic_dialog = false
              this.$message({message: '授权失败 '+err, type: 'error'})
            })
          } else {
            this.$message({message: '非法数据', type: 'error'})
          }
        })
      },
      displaySub(row){
        //topic订阅关系 打开抽屉按钮
        this.drawerData = row
        this.sub_drawer = true
        this.loading = true
        this.$store.dispatch('get_topic_sub', {instanceId: this.drawerData.instanceid,regionId: this.drawerData.region, topic: this.drawerData.topic}).then(resp => {
          this.drawerTable = resp.data.data.SubscriptionDataList.SubscriptionDataList
          for(let i=0; i< this.drawerTable.length; i++){
            this.drawerTable[i]['instanceid'] = this.drawerData.instanceid
            this.drawerTable[i]['region'] = this.drawerData.region
            this.drawerTable[i]['groupid'] = this.drawerTable[i]['GroupId']
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取toic订阅数据失败 ' +err, type: 'error'})
        })
      },
      handleCreateGroupDialog(){
        //打开创建group对话框
        this.groupData.instanceId = this.checked_instance
        this.groupData.regionId = this.region_value
        this.groupData.groupId = ''
        this.groupData.remark = ''
        this.groupData.env = ''
        this.post_group_dialog = true
      },
      createGroupSubmit(formName){
        //创建group正式提交事件
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$store.dispatch('get_ons_group', {region: this.groupData.regionId, instanceId: this.groupData.instanceId, groupId: this.groupData.groupId}).then(resp => {
              if(resp.data.data.length > 0){
                this.exists_group = this.groupData.groupId
                this.exists_group_dialog = true
              } else {
                this.$store.dispatch('create_group', this.groupData).then(resp => {
                  this.post_group_dialog = false
                  if(resp.data.code === 200||resp.data.code === 201) {
                    this.$message({message: '创建group成功', type: 'success'})
                    this.$store.dispatch('get_ons_group', {region: this.groupData.regionId, instanceId: this.groupData.instanceId, groupId: this.groupData.groupId}).then(resp => {
                      this.group_table = resp.data.data
                      this.group_total = resp.data.total
                    }).catch(err => {
                      this.$message({message: '获取group数据失败 ' +err, type: 'error'})
                    })
                  } else {
                    this.$message({message: '创建group失败 '+ resp.data.msg, type: 'error'})
                  }
                }).catch(err => {
                  this.post_group_dialog = false
                  this.$message({message: '创建group失败 '+err, type: 'error'})
                })
              }
            }).catch(err => {
              this.$message({message: '获取group数据失败 ' +err, type: 'error'})
            })
            
          } else {
            this.$message({message: '数据非法', type: 'error'})
          }
        })
      },
      deleteGroupDialog(row) {
        //打开删除group的dialog事件
        this.delete_group = row.groupid
        this.delete_group_dialog = true
        
      },
      handleDeleteGroup(){
        //删除group点击事件
        this.$store.dispatch('delete_group', {instanceId: this.checked_instance, regionId: this.region_value, groupId: this.delete_group}).then(resp => {
          this.delete_group_dialog = false
          if(resp.data.code ===200 || resp.data.code === 201) {
            this.$message({message: '删除group成功', type: 'success'})
            this.$store.dispatch('get_ons_group', {region: this.region_value, instanceId: this.checked_instance, groupId: this.delete_group}).then(resp => {
              this.group_table = resp.data.data
              this.group_total = resp.data.total
            }).catch(err => {
              this.$message({message: '获取group数据失败 ' +err, type: 'error'})
            })
          } else {
            this.$message({message: '删除group失败 ' + resp.data.msg, type: 'error'})
          }
        }).catch(err => {
          this.delete_group_dialog = false
          this.$message({message: '删除group失败 ' + err, type: 'error'})
        })
      },
      subGroupDrawer(row){
        //打开group 订阅关系的抽屉事件
        this.groupSubStatus = []
        this.loading = true
        this.sub_group_drawer = true
        this.$store.dispatch('get_group_sub', {instanceId: this.checked_instance, regionId: this.region_value, groupId: row.groupid}).then(resp => {
          const data = resp.data.data
          if(Object.keys(data).includes('MessageModel')){
            this.groupSubStatus.push({'title': 'Group ID', 'val': data.GroupId})
            this.groupSubStatus.push({'title': '是否在线', 'val': data.Online})
            this.groupSubStatus.push({'title': '消费模式', 'val': data.MessageModel})
          } else {
            this.groupSubStatus.push({'title': 'Group ID', 'val': data.GroupId})
            this.groupSubStatus.push({'title': '是否在线', 'val': data.Online})
            this.groupSubStatus.push({'title': '消费模式', 'val': null})
          }
          this.groupDrawerTable = data.SubscriptionDataList.SubscriptionDataList
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取group订阅数据失败 '+err, type: 'error'})
          
        })
        
        
      },
      consumerDrawer(row) {
        //group 消费者状态的打开抽屉事件
        this.consumer_connect_data = []
        this.group_consumer_drawer = true
        this.loading = true
        this.$store.dispatch('get_group_sub', {instanceId: row.instanceid, regionId: row.region, groupId: row.groupid}).then(res => {
          const group_data = res.data.data
          if(Object.keys(group_data).includes('MessageModel')){
            this.consumer_status_data.MessageModel = group_data.MessageModel
          } else {
            this.consumer_status_data.MessageModel = null
          }
          if(group_data.Online===true && this.consumer_status_data.MessageModel === 'CLUSTERING' ){
            this.$store.dispatch('get_consumer_detail', {instanceId: row.instanceid, regionId: row.region, groupId: row.groupid, detail: true}).then(resp => {
              const data = resp.data.data
              this.consumer_status_data.Online = data.Online
              this.consumer_status_data.ConsumeTps = data.ConsumeTps
              this.consumer_status_data.DelayTime = data.DelayTime
              this.consumer_status_data.TotalDiff = data.TotalDiff
              this.consumer_status_data.GroupId = group_data.GroupId
              if(data.LastTimestamp > 0){
                const d = new Date(data.LastTimestamp)
                this.consumer_status_data.LastTimestamp = d.toLocaleTimeString()
              } else {
                this.consumer_status_data.LastTimestamp = 0
              }
              this.loading = false
            }).catch(err => {
              this.loading = false
              this.$message({message: '获取消费者详细数据报错 '+err, type: 'error'})
            })
            this.$store.dispatch('get_consumer_connection', {instanceId: row.instanceid, regionId: row.region, groupId: row.groupid}).then(resp => {
              
              this.consumer_connect_data = resp.data.data.ConnectionList.ConnectionDo
            }).catch(err => {
              this.loading = false
              this.$message({message: '获取消费者链接数据失败 ' +err, type: 'error'})
            })
          } else {
            this.consumer_status_data.Online = group_data.Online
            this.consumer_status_data.ConsumeTps = 0
            this.consumer_status_data.DelayTime = 0
            this.consumer_status_data.TotalDiff = 0
            this.consumer_status_data.LastTimestamp = 0
            this.consumer_status_data.GroupId = group_data.GroupId
            this.loading = false
          }
          
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取消费者订阅数据失败 '+ err, type: 'error'})
          
        })
        
      },
      consumerStatusDialog(row,groupId){
        //消费者状态里的详细信息事件
        this.consumer_status_drawer = true
        this.loading = true
        this.$store.dispatch('get_consumer_status', {instanceId: this.checked_instance, 
        regionId: this.region_value, groupId: groupId, detail: true}).then(resp =>{
          const data = resp.data.data
          data.ConsumerConnectionInfoList.ConsumerConnectionInfoDo.map(item => {
            if(item.ClientId === row.ClientId){
              const start_time = new Date(item.StartTimeStamp)
              const last_time = new Date(item.LastTimeStamp)
              this.consumer_status_form['ConsumeType'] = item.ConsumeType
              this.consumer_status_form['StartTimeStamp'] = start_time.toLocaleString()
              this.consumer_status_form['LastTimeStamp'] = last_time.toLocaleString()
              this.consumer_status_form['ThreadCount'] = item.ThreadCount
              this.consumer_status_form['GroupId'] = groupId
              this.consumer_status_sub_data = item.SubscriptionSet.SubscriptionData
              this.consumer_status_count_data = item.RunningDataList.ConsumerRunningDataDo
            }
          })
          const topic_data = data.DetailInTopicList.DetailInTopicDo
          for (let i =0; i < this.consumer_status_count_data.length; i++){
            topic_data.forEach(el => {
              if(this.consumer_status_count_data[i].Topic === el.Topic){
                this.consumer_status_count_data[i]['DelayTime'] = el.DelayTime
                this.consumer_status_count_data[i]['TotalDiff'] = el.TotalDiff
              }
            });
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
          console.log(err)
          this.$message({message: '获取消费者状态数据失败 ' + err, type: 'error'})
        })

      },
      consumerJstackDialog(row, groupId){
        //消费者堆栈信息dialog事件
        this.consumer_jstack_dialog = true
        this.loading = true
        this.consumer_jstack_data = []
        this.$store.dispatch('get_consumer_status', {instanceId: this.checked_instance, 
        regionId: this.region_value, groupId: groupId, detail: true, needJsTack: true}).then(resp => {
          const data = resp.data.data
          data.ConsumerConnectionInfoList.ConsumerConnectionInfoDo.map(item => {
            if(item.ClientId === row.ClientId){
              item.Jstack.ThreadTrackDo.forEach(obj => {
                this.consumer_jstack_data.push({'item': obj.Thread, 'detail': obj.TrackList.Track.join('\n')})
              });
            }
          })
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取堆栈数据失败 '+ err, type: 'error'})
        })
     
      },
      sendMessageDialog(row) {
        //发送消息dialog事件
        this.send_message_form.instanceId = row.instanceid
        this.send_message_form.regionId = row.region
        this.send_message_form.topic = row.topic
        this.send_message_form.key = ''
        this.send_message_form.tag = ''
        this.send_message_form.msg = ''
        this.send_message_dialog = true
        this.send_message_label = null
      },
      sendMessageSubmit(formName){
        //发送消息正式提交事件
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$store.dispatch('send_message', this.send_message_form).then(resp => {
              if(resp.data.code === 200 || resp.data.code ===201){
                this.send_message_callback_body = resp.data.data.Data
                this.send_message_label = true
              } else {
                this.send_message_label = false
              }
            }).catch(err => {
              this.send_message_label = false
              console.log(err)
              
            })
          } else {
            this.$message({message: '非法数据', type: 'error'})
          }
        })
      },
      handleTabClick(tab,event){
        //消息tab点击事件
       
        this.message_search_form.topic = ''
        if(this.activeName === 'msg'){
          this.message_search_form.msgId = ''
          this.message_by_id_table = []
        } else if(this.activeName === 'key'){
          this.message_search_form.key = ''
          this.message_by_key_table = []
        } else if(this.activeName === 'topic') {
          this.message_by_date_table = []
          this.message_date = ''
          this.defaultTime = []
          const d = new Date()
          const default_time = d.getHours()+':'+d.getMinutes() +':'+d.getSeconds()
          this.defaultTime.push(default_time)
          this.defaultTime.push(default_time)
        }
      },
      searchMessageById(){
        //根据消息ID进行搜索
        this.message_by_id_table = []
        this.loading = true
        this.$store.dispatch('get_message_by_id', this.message_search_form).then(resp => {
          const data = resp.data.data
          const temp = {}
          data.PropertyList.MessageProperty.forEach(ele => {
            temp[ele.Name] = ele.Value
          });
          data['proper'] = temp
          data['StoreTimestamp'] = new Date(data.StoreTimestamp).toLocaleString()
          this.$store.dispatch('get_message_by_id_trace', {instanceId: this.message_search_form.instanceId,
          regionId: this.message_search_form.regionId, topic: this.message_search_form.topic, 
          msgId: this.message_search_form.msgId}).then(resp => {
            data['trace'] = resp.data.data.MessageTrack
          }).catch(err => {
            this.$message({message: '获取消息消费者数据失败 '+err, type: 'error'})
            data['trace'] = []
          })
          this.message_by_id_table.push(data)
          this.loading =  false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取消费者数据失败' +err, type: 'error'})
        })

        
      },
      searchMessageByKey(){
        //根据消息Key进行搜索
        this.message_by_key_table = []
        this.loading = true
        this.$store.dispatch("get_message_by_key", this.message_search_form).then(resp => {
          const data = resp.data.data.OnsRestMessageDo
          data.forEach(ele => {
            const temp = {}
            ele.PropertyList.MessageProperty.map(item => {
              temp[item.Name] = item.Value
            })
            ele['proper'] = temp
            ele['StoreTimestamp'] = new Date(ele.StoreTimestamp).toLocaleString()
            this.$store.dispatch('get_message_by_id_trace', {instanceId: this.message_search_form.instanceId,regionId: this.message_search_form.regionId, topic: this.message_search_form.topic, 
              msgId: ele.MsgId}).then(res => {
                ele['trace'] = res.data.data.MessageTrack
            }).catch(err => {
              this.$message({message: '获取消费者group ID失败' + err, type: 'error'})
              ele['trace'] = []
            })
            this.message_by_key_table.push(ele)
          })
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取消息数据失败 '+err, type: 'error'})
        })
      },
      searchMessageByDate(event=null,currentPage=1, pageSize=10){
        //消息按照topic和时间段搜索
        this.message_by_date_table = []
        this.message_search_form.beginTime = this.message_date[0].getTime()
        this.message_search_form.endTime = this.message_date[1].getTime()
        this.message_search_form['currentPage'] = currentPage
        this.message_search_form['pageSize'] = pageSize
        this.loading = true
        this.$store.dispatch('get_message_by_date', this.message_search_form).then(resp => {
          const data = resp.data.data.MsgFoundList.OnsRestMessageDo
          this.message_by_date_total = resp.data.data.MaxPageCount
          data.forEach(ele => {
            const temp = {}
            ele.PropertyList.MessageProperty.map(item => {
              temp[item.Name] = item.Value
            })
            ele['proper'] = temp
            ele['StoreTimestamp'] = new Date(ele.StoreTimestamp).toLocaleString()
            this.$store.dispatch('get_message_by_id_trace', {instanceId: this.message_search_form.instanceId,regionId: this.message_search_form.regionId, topic: this.message_search_form.topic, 
              msgId: ele.MsgId}).then(res => {
                ele['trace'] = res.data.data.MessageTrack
            }).catch(err => {
              this.$message({message: '获取消费者group ID失败' + err, type: 'error'})
              ele['trace'] = []
            })
            this.message_by_date_table.push(ele)
            
          });
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message({message: '获取数据失败 ' +err, type: 'error'})
          
        })
      },
      messageGetList(){
        //消息按照topic和时间段搜索分页
        this.searchMessageByDate(null, this.message_by_date_page, this.message_by_date_size)
      },
      consumerValid(row, msg_row){
        //消息搜索消费验证
        this.consumer_form.msgId = msg_row.MsgId
        this.consumer_form.topic = this.message_search_form.topic
        this.consumer_form.groupId = row.ConsumerGroup
        this.consumer_form.instanceId = this.message_search_form.instanceId
        this.consumer_form.regionId = this.message_search_form.regionId
        this.$store.dispatch('get_consumer_connection', {instanceId: this.message_search_form.instanceId, 
          regionId: this.message_search_form.regionId, groupId: row.ConsumerGroup}).then(resp => {
            this.consumer_form.clientIds = resp.data.data.ConnectionList.ConnectionDo
          }).catch(err => {
            this.consumer_form.clientIds = []
            this.$message({message: '获取消费者连接信息失败 '+err, type: 'error'})
          })
          
          this.consumer_valid_dialog = true
      },
      validMessagePush(){
        //消费验证提交事件
        this.$store.dispatch('push_message_by_id', {instanceId: this.consumer_form.instanceId, 
          regionId: this.consumer_form.regionId, topic: this.consumer_form.topic, groupId: this.consumer_form.groupId,
          clientId: this.consumer_form.clientId,msgId: this.consumer_form.msgId}).then(resp => {
            this.consumer_valid_dialog = false
            if(resp.data.code === 201 || resp.data.code === 200) {
              this.$message({message: '消息验证成功', type: 'success'})
            } else {
              this.$message({message: '消息验证失败', type: 'error'})
            }
          }).catch(err => {
            this.consumer_valid_dialog = false
            this.$message({message: '消息验证失败 '+err, type: 'error'})
          })
      },
      messageTrack(row){
        //消息轨迹查询事件
        this.checked_index = '5'
        this.message_track_table = []
        this.trace_consumer_table = []
        const d = new Date()
        this.create_trace_task_data.beginTime = d.getTime() -3*24*3600
        this.create_trace_task_data.endTime = d.getTime()
        this.create_trace_task_data.instanceId = this.checked_instance
        this.create_trace_task_data.topic = this.message_search_form.topic
        this.create_trace_task_data.regionId = this.region_value
        this.create_trace_task_data.msgId = row.MsgId
        //const queryId = '2553167520340266311571293916999'
        this.loading = true
        this.$store.dispatch('create_message_trace_task', this.create_trace_task_data).then(resp =>{
          const queryId = resp.data.data.QueryId
          this.$store.dispatch('get_trace_by_query_id', {regionId: this.message_search_form.regionId, 
               queryId: queryId}).then(resp => {
                 if(resp.data.data.Status === 'working') {
                   let timerId = setInterval(()=>{
                     this.$store.dispatch('get_trace_by_query_id', {regionId: this.message_search_form.regionId, 
                       queryId: queryId}).then(res => {
                         if(res.data.data.Status === 'finish'){
                           clearInterval(timerId)
                           const data = res.data.data
                           data.CreateTime = new Date(data.CreateTime).toLocaleString()
                           this.message_track_table.push(data)
                           data.TraceList.TraceMapDo.forEach(ele => {
                             ele.SubList.SubMapDo.forEach(item => {
                               const temp = item.ClientList.SubClientInfoDo[0]
                               item['ClientHost'] = temp.ClientHost
                               item['CostTime'] = temp.CostTime
                               item['ReconsumeTimes'] = temp.ReconsumeTimes
                               item['Status'] = temp.Status
                               item['SubTime'] = temp.SubTime
                             });
                             this.trace_consumer_table.push(ele)
                           });
                           this.loading = false
                          
                         }
                       })
                   }, 2000)
                 } else {
                   const data = resp.data.data
                   data.CreateTime = new Date(data.CreateTime).toLocaleString()
                   this.message_track_table.push(data)
                   data.TraceList.TraceMapDo.forEach(ele => {
                      ele.SubList.SubMapDo.forEach(item => {
                        const temp = item.ClientList.SubClientInfoDo[0]
                          item['ClientHost'] = temp.ClientHost
                          item['CostTime'] = temp.CostTime
                          item['ReconsumeTimes'] = temp.ReconsumeTimes
                          item['Status'] = temp.Status
                          item['SubTime'] = temp.SubTime
                      });
                        this.trace_consumer_table.push(ele)
                    });
                    this.loading = false
                 }
               }).catch(err => {
                 this.loading = false
                 this.$message({message: '获取轨迹数据失败 '+err, type: 'error'})
               })
          
        }).catch(err => {
          this.loading = false
          this.$message({message: '建立查询任务失败 '+err, type: 'error'})
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      openCreateDialog() {
          this.create_dialog = true
      },
      createSubmit(formName){
        this.$refs[formName].validate((valid) => {
            if(valid) {
                this.$store.dispatch('create_ons', this.formData).then(resp => {
                    this.create_dialog = false
                    if(resp.data.code == 201 || resp.data.code ==200) {
                      this.topic_data = resp.data.data.topic_list
                      this.gid_data = resp.data.data.gid_list
                      this.$message({message: '创建成功', type: 'success'})
                      this.drawer_dialog = true
                    } else {
                        this.$message({message: '创建失败', type: 'error'})
                    }
                }).catch(err => {
                    this.create_dialog = false
                    this.$message({message: '创建失败 ' + err, type: 'error'})
                })
            } else {
                this.create_dialog = false
               this.$message({message: '数据非法', type:' error'})   
            }
        })
      }
    },
    mounted() {
      this.init()
      this.user_roles = this.$store.getters.roles
      
    }
    
}
</script>

<style scoped>
   ul li {
     list-style: none;
   }
   .content {
     margin-top: 20px;
     border-top: 1px solid #ebebeb;
   }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .drawer-content {
    border-top: 1px solid #ebebeb;
    
  }
  .drawer-bottom {
    margin: 20px;
    font-size: 18px;
  }
  .consumer-head {
    font-size: 14px;
    height: 91px;
    color:#4a4a4a;
    margin: 20px;
    border: 1px solid#ebebeb;
  }
  
  .consumer-head ul li {
    float: left;
    width: 16%;
    margin-left: 20px;
    margin-top: 25px;
  }
  .consumer-body{
    margin-left:20px;
  }
  .consumer-footer {
    font-size: 20px;
    color: black;
    margin-left: 20px;
  }
  .consumer-footer el-table {
    margin-top:20px;
  }
  .consumer-status-head{
    margin: 20px;
  }
  .consumer-status-head p {
    font-size: 20px;
    color: black;
    margin-bottom: 15px;
  }
  .consumer-status-body {
    margin: 20px;
  }
  .consumer-status-body p {
    font-size: 20px;
    color: black;
    margin-bottom: 15px;
  }
  .consumer-status-footer {
    margin: 20px;
  }
  .consumer-status-footer p {
    font-size: 20px;
    color: black;
    margin-bottom: 15px;
  }
  .span-border {
    color: white;
    background: orange;
    height: 50px;
    line-height: 20px;
    font-size: 12px;
    margin-top: 15px;
    padding: 5px;
  }
  
</style>