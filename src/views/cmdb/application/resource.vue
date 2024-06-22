<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName" >
        <el-tab-pane label="ECS资源" name="ecs">
          <div>
            <el-collapse v-if="ecs_data.length >0">
              <el-collapse-item v-for="(item, index) in ecs_data" :key="index" :title="item.name">
                <el-table :data="item.instanceInfo">
                  <el-table-column label="主机名" prop="hostname"></el-table-column>
                  <el-table-column label="IP" prop="ip"></el-table-column>
                  <el-table-column label="配置" prop="hardware"></el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
            <span v-else>无数据</span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="容器资源" name="docker">
          <el-collapse v-if="docker_data.length > 0">
            <el-collapse-item v-for="(item, index) in docker_data" :key="index" :title="item.name">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="NameSpace:">
                  <span>{{item.namespace}}</span>
                </el-form-item>
                <el-form-item label="CPU限制值:">
                  <span>{{item.limit_cpu}}</span>
                </el-form-item>
                <el-form-item label="内存限制值:">
                  <span>{{item.limit_memory}}</span>
                </el-form-item>
                <el-form-item label="CPU请求限制值:">
                  <span>{{item.request_cpu}}</span>
                </el-form-item>
                <el-form-item label="内存请求限制值:">
                  <span>{{item.request_memory}}</span>
                </el-form-item>
                <el-form-item label="副本数:">
                  <span>{{item.replicas}}</span>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <span v-else>无数据</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app_resource',
  data(){
    return {
      activeName: 'ecs',
      ecs_data: [],
      docker_data: []
    }
  },
  methods:{
    init(){
      this.$store.dispatch('get_app_resource_detail', {appCode: this.appCode}).then(resp => {
        this.ecs_data = resp.data.data[0].instances
        this.docker_data = resp.data.data[0].podInfo
      })
    }
  },
  mounted(){
    this.init()
  },
  computed: {
    appCode(){
      return this.$route.params.appId    
    }
  }
}
</script>