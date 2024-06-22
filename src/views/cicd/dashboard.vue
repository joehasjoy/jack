<template>
    <div style="margin: 20px">
      <!--  实时和总数统计    -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-card style="text-align: center; background-color: rgb(213,118,38)">
            <div style="font-weight: bolder;opacity:0.7;">当前创建版本中</div>
            <div style="font-weight: bold;font-size: 18px">{{current_app_version_count}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="text-align: center; background-color: rgb(211,74,58)">
            <div style="font-weight: bolder;opacity:0.7;">当前部署中</div>
            <div style="font-weight: bold;font-size: 18px">{{current_deployment_step_count}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="text-align: center; background-color: rgb(40,157,69)">
            <div style="font-weight: bolder;opacity:0.7;">版本总计</div>
            <div style="font-weight: bold;font-size: 18px">{{total_version}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="text-align: center; background-color: #15a9f0">
            <div style="font-weight: bolder;opacity:0.7;">部署总计</div>
            <div style="font-weight: bold;font-size: 18px">{{total_deployment}}</div>
          </el-card>
        </el-col>
      </el-row>

      <!--  实时列表    -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">当前创建版本中</span>
          </div>
          <el-table :data="current_app_versions">
            <el-table-column label="应用" prop="appCode" align="" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="版本" prop="app_version" align="" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="创建者" prop="creator" align="center" width="100"></el-table-column>
            <el-table-column label="创建时间" prop="ctime" align="" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">当前部署中</span>
          </div>
          <el-table :data="current_deployment_steps">
            <el-table-column label="应用" prop="deploy_record__app_version__appCode" align="" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="版本" prop="deploy_record__app_version__app_version" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="环境" prop="deploy_record__env" width="50" align="center"></el-table-column>
            <el-table-column label="部署者" prop="deploy_record__creator" width="120" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="ctime" align="" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!--  应用统计列表    -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="24">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">最近
              <el-select v-model="days" @change="GetRunningTotal" size="mini" style="width: 60px">
                <el-option :label="item" :value="item" v-for="(item,key) in day_range" :key="key"></el-option>
              </el-select>天按应用统计版本/部署次数</span>
            <div style="float: right;margin-right: 5px">
              <el-select v-model="env" clearable filterable placeholder="请选择环境" @change="GetRunningTotal" size="mini">
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in env_list" :key="index"></el-option>
              </el-select>
            </div>
          </div>

        </el-col>

        <el-col :span="12">
          <div ref="version_month" id="app_version_count" style="width: 100%; height: 260px;"></div>
        </el-col>
        <el-col :span="12">
          <div ref="deployment_month" id="app_deployment_count" style="width: 100%; height: 260px;"></div>
        </el-col>
      </el-row>

      <!--  近一个月统计列表    -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="24">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">最近
              <el-select v-model="days" @change="GetRunningTotal" size="mini" style="width: 60px">
                <el-option :label="item" :value="item" v-for="(item,key) in day_range" :key="key"></el-option>
              </el-select>
              天版本/部署次数统计</span>
            <div style="float: right;margin-right: 5px">
              <el-select v-model="appCode" clearable filterable placeholder="请选择应用" @change="GetRunningTotal" size="mini">
                <el-option :label="item.code" :value="item.code" v-for="(item, index) in app_list" :key="index"></el-option>
              </el-select>
              <el-select v-model="env" clearable filterable placeholder="请选择环境" @change="GetRunningTotal" size="mini">
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in env_list" :key="index"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div ref="version_day" id="version_day" style="width: 100%; height: 260px;"></div>

        </el-col>
        <el-col :span="12">
          <div ref="deployment_day" id="deployment_day" style="width: 100%; height: 260px;"></div>
        </el-col>
      </el-row>

      <!--  近一年统计列表    -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="24">
          <div style="width: 100%;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;border-bottom: none">
            <span style="margin-left: 16px;font-size: 14px;color: #333333">近一年按月版本/部署次数统计</span>
            <div style="float: right;margin-right: 5px">
              <el-select v-model="env" clearable filterable placeholder="请选择环境" @change="GetRunningTotal" size="mini">
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in env_list" :key="index"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div ref="version_month" id="version_month" style="width: 100%; height: 260px;"></div>
        </el-col>
        <el-col :span="12">
          <div ref="deployment_month" id="deployment_month" style="width: 100%; height: 260px;"></div>
        </el-col>
      </el-row>


    </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'
  import echarts from 'echarts'
  import  'echarts/theme/macarons.js'
  import  'echarts/theme/dark.js'
  import  'echarts/theme/roma.js'
  import  'echarts/theme/shine.js'
  import  'echarts/theme/vintage.js'
  import  'echarts/theme/infographic.js'
  export default {
    name: 'dashboard',
    data(){return{
      current_app_version_count: 0,
      current_deployment_step_count: 0,
      current_app_versions: [],
      current_deployment_steps: [],
      app_version_day: [],
      deployment_day: [],
      app_version_month: [],
      deploy_record_month: [],
      app_version_count: [],
      app_deployment_count: [],
      app_list: [],
      env_list: [],
      total_version: 0,
      total_deployment: 0,
      total_application: 0,
      url: this.GLOBAL.service_tag+'/api/ams/dashboard/',
      loading: false,

      env: '',
      appCode: '',
      days: 30,
      day_range: [1, 7, 15, 30, 60, 90],

      timer: ''
    }},

    created: function(){},
    watch: {

    },

    methods: {
      // 获取；
      GetRunningTotal: function() {
        const parms = {env: this.env, appCode:this.appCode,days: this.days}
        this.loading = true
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.dashboard_url,
          params: parms,
        }).then((response)=>{
          //console.log('aaa:',response.data);
          if(response.data.status){
            this.current_app_versions = response.data.current_app_versions
            this.current_deployment_steps = response.data.current_deployment_steps
            this.current_app_version_count = this.current_app_versions.length
            this.current_deployment_step_count = this.current_deployment_steps.length
            this.total_version = response.data.total_app_version
            this.total_deployment = response.data.total_deployment
            this.total_application = response.data.total_application
            this.app_version_day = response.data.app_version_day
            this.deployment_day = response.data.deployment_day
            this.app_version_month = response.data.app_version_month
            this.deploy_record_month = response.data.deploy_record_month
            this.app_version_count = response.data.app_version_count
            this.app_deployment_count = response.data.app_deployment_count
            this.DayLine()
            this.MonthLine()
            this.AppBar()
          }else {this.$message.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$message.error(String(response));
        });
      },

      // APP list获取；
      GetAppList: function() {
        const parms = {pageSize: 0}
        this.loading = true
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.app_url,
          params: parms,
        }).then((response)=>{
          //console.log('GetAppList:',response.data);
          if(response.data.status){
            this.app_list = response.data.data
          }else {this.$message.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$message.error(String(response));
        });
      },

      // APP list获取；
      GetEnvList: function() {
        const parms = {pageSize: 0}
        this.loading = true
        this.axios({
          method: 'GET',
          url: this.$store.state.cicd.env_url,
          params: parms,
        }).then((response)=>{
          //console.log('GetEnvList:',response.data);
          if(response.data.status){
            this.env_list = response.data.data
          }else {this.$message.error(response.data.error)}
          this.loading = false
        }).catch((response) => {
          this.loading = false
          this.$message.error(String(response));
        });
      },

      // 天折线图
      DayLine: function() {
        let day_deployment = [], count_deployment = [], count_deployment_failed = []
        let day_time_version = [], count_time_version = [], count_version_failed = []
        for (let i=0;i<this.app_version_day.length;++i){
          day_time_version.push(this.app_version_day[i]['date'])
          count_time_version.push(this.app_version_day[i]['count'])
          count_version_failed.push(this.app_version_day[i]['failed_count'])
        }
        for (let i=0;i<this.deployment_day.length;++i){
          day_deployment.push(this.deployment_day[i]['date'])
          count_deployment.push(this.deployment_day[i]['count'])
          count_deployment_failed.push(this.deployment_day[i]['failed_count'])
        }
        //console.log('count_version_failed:', count_version_failed)
        let version_day_option = {
          legend: { data:['版本总计','版本失败数量'] },
          tooltip : {
            trigger: 'axis',
            confine: false,
            extraCssText: {},
            // formatter: function(params) {
            //   return params[0].name + '<br/>'
            //     + params[0].seriesName + ' : ' + Math.floor(params[0].value * 10000) / 10000 + ' Core<br/>'
            // }
          },
          xAxis : [
            {
              type : 'category',
              data: day_time_version
            }
          ],
          yAxis : [
            {
              //name : '次数',
              type : 'value',
            }
          ],
          series : [
            { name:'版本总计', type:'line', data: count_time_version, label: {normal: {show: false}} },
            { name:'版本失败数量', type:'line', data: count_version_failed, label: {normal: {show: false}} },
            ],
          grid:{ x:50, y:24, x2:30, y2:30, borderWidth:0 },
        }
        let deployment_day_option = {
          legend: { data:['部署总计', '部署失败数量'] },
          tooltip : {
            trigger: 'axis',
            confine: false,
            extraCssText: {},
            // formatter: function(params) {
            //   return params[0].name + '<br/>'
            //     + params[0].seriesName + ' : ' + Math.floor(params[0].value * 10000) / 10000 + ' Core<br/>'
            // }
          },
          xAxis : [
            {
              type : 'category',
              data: day_deployment
            }
          ],
          yAxis : [
            {
              //name : '次数',
              type : 'value',
            },
          ],
          series : [
            { name:'部署总计', type:'line', data: count_deployment, label: {normal: {show: false}} },
            { name:'部署失败数量', type:'line', data: count_deployment_failed, label: {normal: {show: false}} },

            ],
          grid:{ x:50, y:24, x2:30, y2:30, borderWidth:0 },
        }
        let version_day_obj = echarts.init(document.getElementById('version_day'), 'macarons');
        let deployment_day_obj = echarts.init(document.getElementById('deployment_day'), 'macarons');

        version_day_obj.setOption(version_day_option);
        deployment_day_obj.setOption(deployment_day_option);
      },

      // 月折线图
      MonthLine: function() {
        let month_deployment = [], count_deployment = [], count_deployment_failed = []
        let month_version = [], count_version = [], count_version_failed = []
        for (let i=0;i<this.app_version_month.length;++i){
          month_version.push(this.app_version_month[i]['year']+'-'+this.app_version_month[i]['month'])
          count_version.push(this.app_version_month[i]['count'])
          count_version_failed.push(this.app_version_month[i]['failed_count'])
        }
        for (let i=0;i<this.deploy_record_month.length;++i){
          month_deployment.push(this.deploy_record_month[i]['year']+'-'+this.deploy_record_month[i]['month'])
          count_deployment.push(this.deploy_record_month[i]['count'])
          count_deployment_failed.push(this.deploy_record_month[i]['failed_count'])
        }
        //console.log()
        let version_day_option = {
          legend: { data:['版本总计','版本失败数量'] },
          tooltip : {
            trigger: 'axis',
            confine: false,
            extraCssText: {},
          },
          xAxis : [
            { type : 'category', data: month_version }
          ],
          yAxis : [
            {
              //name : '次数',
              type : 'value',
            },
          ],
          series : [
            { name:'版本总计', type:'line', data: count_version, label: {normal: {show: false}} },
            { name:'版本失败数量', type:'line', data: count_version_failed, label: {normal: {show: false}} },
          ],
          grid:{ x:50, y:24, x2:30, y2:30, borderWidth:0 },
        }
        let deployment_day_option = {
          legend: { data:['部署总计', '部署失败数量'] },
          tooltip : {
            trigger: 'axis',
            confine: false,
            extraCssText: {},
          },
          xAxis : [
            {
              type : 'category',
              data: month_deployment
            }
          ],
          yAxis : [
            {
              //name : '次数',
              type : 'value',
            },
          ],
          series : [
            { name:'部署总计', type:'line', data: count_deployment, label: {normal: {show: false}} },
            { name:'部署失败数量', type:'line', data: count_deployment_failed, label: {normal: {show: false}} },
            ],
          grid:{ x:50, y:24, x2:30, y2:30, borderWidth:0 },
        }
        let version_obj = echarts.init(document.getElementById('version_month'), 'macarons');
        let deployment_obj = echarts.init(document.getElementById('deployment_month'), 'macarons');

        version_obj.setOption(version_day_option);
        deployment_obj.setOption(deployment_day_option);
      },

      // 应用柱状图
      AppBar: function() {
        let app_deployment = [], count_deployment = [], count_deployment_failed = []
        let app_version_list = [], count_version = [], count_version_failed = []
        for (let i=0;i<this.app_version_count.length;++i){
          app_version_list.push(this.app_version_count[i]['appCode'])
          count_version.push(this.app_version_count[i]['count'])
          count_version_failed.push(this.app_version_count[i]['failed_count'])
        }
        for (let i=0;i<this.app_deployment_count.length;++i){
          app_deployment.push(this.app_deployment_count[i]['app_version__appCode'])
          count_deployment.push(this.app_deployment_count[i]['count'])
          count_deployment_failed.push(this.app_deployment_count[i]['failed_count'])
        }
        //console.log()
        let app_version_count_option = {
          legend: { data:['版本总计','版本失败数量'] },
          toolbox: {
            feature: {
              //magicType: {type: ['line', 'bar', 'pie']},
            }
          },
          tooltip : {},
          xAxis : [{ type : 'category', data: app_version_list }],
          yAxis : [{ type : 'value',},],    //name : '次数',
          series : [
            { name:'版本总计', type:'bar', data: count_version, label: {normal: {show: false}} },
            { name:'版本失败数量', type:'bar', data: count_version_failed, label: {normal: {show: false}} },
          ],
          grid:{ x:50, y:24, x2:20, y2:70, borderWidth:0 },
          dataZoom: { type: '', startValue: 0, endValue: 20, height: 10 },
        }
        let deployment_count_option = {
          legend: { data:['部署总计', '部署失败数量'] },
          tooltip : {
            trigger: 'axis',
            confine: false,
            extraCssText: {},
          },
          xAxis : [{ type : 'category', data: app_deployment, }],
          yAxis : [{ type : 'value', },],  //name : '次数',
          series : [
            { name:'部署总计', type:'bar', data: count_deployment, label: {normal: {show: false}} },
            { name:'部署失败数量', type:'bar', data: count_deployment_failed, label: {normal: {show: false}} },
          ],
          grid:{ x:50, y:24, x2:30, y2:70, borderWidth:0 },
          dataZoom: { type: '', startValue: 0, endValue: 20, height: 10 },
        }
        let version_obj = echarts.init(document.getElementById('app_version_count'),'macarons');
        let deployment_obj = echarts.init(document.getElementById('app_deployment_count'), 'macarons');

        version_obj.setOption(app_version_count_option);
        deployment_obj.setOption(deployment_count_option);
      },
    },



    computed: {},
    mounted () {
      this.GetRunningTotal()
      this.GetAppList()
      this.GetEnvList()
      // this.editPermission()
      this.timer = window.setInterval(this.GetRunningTotal,60000)
    },
    components: {
      pagination: pagination,
    },
    destroyed: function() {
      window.clearInterval(this.timer)
    }

  }
</script>

<style scoped>

</style>
