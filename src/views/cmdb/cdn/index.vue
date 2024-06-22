<template>
    <div class="app-container">
        <div class="filter-container">
            <el-tabs v-model="activeName" type="card" @tab-click="switchActive">
                <el-tab-pane label="刷新" name="refresh">
                    <div style="width:60%;">
                        <el-form :model="refresh_form" ref="refresh_form" :rules="refresh_rules" label-width="120px">
                            <el-form-item label="刷新类型" prop="object_type">
                                <el-select v-model="refresh_form.object_type" style="width:50%;">
                                    <el-option v-for="(item, index) in refresh_options" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="URL" prop="object_path">
                                <p>
                                <span>每日url刷新上限{{cdn_quota.UrlQuota}}</span>,
                                <span>目录刷新上限{{cdn_quota.DirQuota}}</span>,
                                <span>预热上限{{cdn_quota.PreloadQuota}}</span>,
                                <span>今日url剩余数{{cdn_quota.UrlRemain}}</span>,
                                <span>目录剩余数{{cdn_quota.DirRemain}}</span>,
                                <span>预热剩余数{{cdn_quota.PreloadRemain}}</span>
                            </p>
                            <el-input v-model="refresh_form.object_path" type="textarea" 
                            :autosize="{minRows:10}" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="refreshSubmit('refresh_form')">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="预热" name="preload">
                    <div style="width:60%;">
                      <el-form :model="preload_form" ref="preload_form" :rules="preload_rules" label-width="120px">
                        <el-form-item label="预热区域" prop="area">
                            <el-select v-model="preload_form.area" style="width:50%;" clearable>
                                <el-option v-for="(item, index) in area_options" :key="index" :label="item.label"
                                 :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="URL" prop="object_path">
                            <p>
                                <span>每日url刷新上限{{cdn_quota.UrlQuota}}</span>,
                                <span>目录刷新上限{{cdn_quota.DirQuota}}</span>,
                                <span>预热上限{{cdn_quota.PreloadQuota}}</span>,
                                <span>今日url剩余数{{cdn_quota.UrlRemain}}</span>,
                                <span>目录剩余数{{cdn_quota.DirRemain}}</span>,
                                <span>预热剩余数{{cdn_quota.PreloadRemain}}</span>
                            </p>
                            <el-input v-model="preload_form.object_path" type="textarea" 
                            :autosize="{minRows:10}" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="preloadSubmit('preload_form')">提交</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="record">
                  <el-form :inline="true" :model="get_form_data" class="demo-form-inline">
                    <el-form-item label="时间范围">
                      <el-date-picker
                        v-model="date_time"
                        value-format="yyyy-MM-dd HH:mm:ss" 
                        type="datetimerange"
                        range-separator="至"
                        start-placeholde="开始日期"
                        end-placeholde="结束日期"
                        :picker-options="pickerOptions"
                        :default-time="defaultTime"
                        align="right"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="任务类型">
                      <el-select v-model="get_form_data.object_type" clearable style="width:150px;">
                        <el-option v-for="(item, index) in type_options" :key="index" :label="item.label" :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="任务状态">
                      <el-select v-model="get_form_data.status" clearable style="width:150px;">
                        <el-option v-for="(item, index) in task_status" :key="index" :label="item.label" :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="search_content" style="width:100%;" placeholder="按域名或URL查询"
                      clearable @keyup.enter.native="getTasks"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="URL">
                      <el-input v-model="get_form_data.object_path" style="width:100%;" placeholder="按URL查询"
                      clearable></el-input>
                    </el-form-item> -->
                    <el-form-item>
                       <el-button type="primary" @click="getTasks">查询</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table :data="tableData">
                      <el-table-column label="开始时间" prop="CreationTime"></el-table-column>
                      <el-table-column label="路径" prop="ObjectPath"></el-table-column>
                      <el-table-column label="刷新类型">
                          <template slot-scope="scope">
                              <span v-if="scope.row.ObjectType === 'file'">文件</span>
                              <span v-else-if="scope.row.ObjectType === 'path'">路径</span>
                              <span v-else-if="scope.row.ObjectType === 'preload'">预热</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="进度" prop="Process"></el-table-column>
                      <el-table-column label="状态" >
                          <template slot-scope="scope">
                              <span v-if="scope.row.Status === 'Complete'" style="color: green;">完成</span>
                              <span v-else-if="scope.row.Status === 'Refreshing'" style="color: orange;">刷新中</span>
                              <span v-else-if="scope.row.Status === 'Failed'" style="color:red;">失败</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="任务ID" prop="TaskId"></el-table-column>
                  </el-table>
                   <pagination v-show="total>0" :total="total" :page.sync="page" 
                       :limit.sync="limit"  @pagination="getList" />
                </el-tab-pane>
            </el-tabs>
          
        </div>
        <div></div>
    </div>
</template>
<script>
import { isValidUrl } from '@/utils/validate'
import pagination from '@/components/Pagination/pagination'
export default {
    name: "cdn_management",
    components: {
        pagination
    },
    data() {
        return {
          get_form_data: {
              object_type: 'file',
              status: 'Complete'
          },
          type_options: [
              {label: '文件刷新', value: 'file'},
              {label: '路径刷新', value: 'path'},
              {label: '预热', value: 'preload'}
          ],
          task_status: [
              {label: '完成', value: 'Complete'},
              {label: '刷新中', value: 'Refreshing'},
              {label: '刷新失败', value: 'Failed'}
          ],
          date_time: '',
          pickerOptions: {
            disabledDate(d) {
              
              const now = new Date()
              const diff = now.getTime() - d.getTime()
              const dst = 3600*24*4*1000
              if( diff > 0 &&diff < dst) {
                return false
              } else {
                return true
              }
            }
          },
          defaultTime: [],
          activeName: 'refresh',
          tableData: [],
          total: 0,
          page: 1,
          limit: 10,
          search_content: '',
          area_options: [
              {label: '国内', value: 'domestic'},
              {label: '海外', value: 'overseas'}
          ],
          preload_form: {
              object_path: '',
              area: ''
          },
          preload_rules: {
              object_path: [
                  {required: true, message: '此为必填项', trigger: blur}
              ]
          },
          cdn_quota: {},
          refresh_form: {
              object_path: '',
              object_type: 'File'
          },
          refresh_rules: {
              object_path: [
                  {required: true, message: '此为必填项', trigger: blur}
              ]
          },
          refresh_options: [
              {label: '文件', value: 'File'},
              {label: '目录', value: 'Directory'}
          ]
        }
    },
    methods: {
        getTasks(event, page=1, limit=10){
            //查询click事件
            this.tableData = []
            if (this.date_time != '' && this.date_time != null){
               this.get_form_data.start_time = this.date_time[0]
               this.get_form_data.end_time = this.date_time[1]
            } 
            if(isValidUrl(this.search_content) && this.search_content != ''){
              this.get_form_data.object_path = this.search_content.trim()
            }
            if(!isValidUrl(this.search_content) && this.search_content != ''){
                this.get_form_data.domain_name = this.search_content.trim()
            }
            this.get_form_data.page_number = page
            this.get_form_data.page_size = limit
            if(this.search_content != '' || this.get_form_data.status != ''){
              if(!isValidUrl(this.search_content)){
                  if(this.get_form_data.object_type === ''){
                      this.$message({message: '当指定域名或者任务状态时，任务类型不能为空', type: 'error'})
                  } else {
                    this.$store.dispatch('get_tasks', this.get_form_data).then(resp => {
                      if(resp.data.code === 200 || resp.data.code === 201){
                          this.total = resp.data.data.TotalCount
                          resp.data.data.Tasks.CDNTask.map(item => {
                              item.CreationTime = new Date(item.CreationTime).toLocaleString()
                              this.tableData.push(item)
                          })

                      } else {
                          this.$message({message:  resp.data.msg, type: 'error'})
                      }
                    }).catch(err => {
                        this.$message({message: '获取数据失败 '+ err, type: 'error'})
                    })
                  }
              } else {
                this.$store.dispatch('get_tasks', this.get_form_data).then(resp => {
                    if(resp.data.code === 200 || resp.data.code === 201){
                        this.total = resp.data.data.TotalCount
                        resp.data.data.Tasks.CDNTask.map(item => {
                            item.CreationTime = new Date(item.CreationTime).toLocaleString()
                            this.tableData.push(item)
                        })

                    } else {
                        this.$message({message:  resp.data.msg, type: 'error'})
                    }
                }).catch(err => {
                    this.$message({message: '获取数据失败 '+ err, type: 'error'})
                })
              }
            } else {
              this.$store.dispatch('get_tasks', this.get_form_data).then(resp => {
                if(resp.data.code === 200 || resp.data.code === 201){
                    this.total = resp.data.data.TotalCount
                    resp.data.data.Tasks.CDNTask.map(item => {
                        item.CreationTime = new Date(item.CreationTime).toLocaleString()
                        this.tableData.push(item)
                    })

                } else {
                    this.$message({message:  resp.data.msg, type: 'error'})
                }
              }).catch(err => {
                this.$message({message: '获取数据失败 '+ err, type: 'error'})
              })
            }
            
            
        },
        getList(){
            //分页
            this.getTasks('', this.page, this.limit)
        },
        switchActive(ele){
            //标签页切换事件
            if(this.activeName === 'refresh' || this.activeName === 'preload'){
                this.$store.dispatch('get_cdn_quota').then(resp => {
                    if(resp.data.code === 200 || resp.data.code ===201){
                        this.cdn_quota = resp.data.data
                    } else {
                        this.$message({message: '获取cdn额度数据失败 ' + resp.data.msg, type: 'error'})
                    }
                }).catch(err => {
                    this.$message({message: '获取阿里云cdn额度数据失败 '+ err, type: 'error'})
                })
            }
        },
        preloadSubmit(formName){
            //预热提交事件
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.$store.dispatch('push_cdn_cache', this.preload_form).then(resp => {
                        if(resp.data.code === 200 || resp.data.code === 201){
                            this.$message({message: '预热提交成功,可以根据域名或者URL查询进度', type: 'success'})
                        } else {
                            this.$message({message: '预热失败 '+ resp.data.msg, type: 'error'})
                        }
                    }).catch(err => {
                        this.$message({message: '预热失败 ' +err, type: 'error'})
                    })
                } else {
                    this.$message({message: '数据非法', type: 'error'})
                }
            })
        },
        refreshSubmit(formName){
            //刷新提交事件
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.$store.dispatch('refresh_cdn_cache', this.refresh_form).then(resp => {
                        if(resp.data.code === 200 || resp.data.code ===201){
                            this.$message({message: '刷新提交成功, 可以根据域名或URL查询进度', type: 'success'})
                        } else {
                            this.$message({message: '刷新失败 '+resp.data.msg, type: 'error'})
                        }
                    }).catch(err => {
                        this.$message({message: '刷新失败 '+err, type: 'error'})
                    })
                } else {
                    this.$message({message: '数据非法', type: 'error'})
                }
            })
        }
    },
    mounted() {
        const d = new Date()
        const default_time = d.getHours()+':'+d.getMinutes() +':'+d.getSeconds()
        this.defaultTime.push(default_time)
        this.defaultTime.push(default_time)
    }
}
</script>