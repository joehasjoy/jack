<template>
  <div class="app-container">
      <div class="filter-container">
          <el-select 
          v-model.trim="select_search.appName"
          filterable
          remote
          placeholder="请输入appId搜索"
          :loading="loading"
          :remote-method="searchApp"
          clearable
          @keyup.enter.native="handleFilter"
          >
            <el-option v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
          <el-input v-model="select_search.human" placeholder="请输入人名搜索" style="width:15%;margin-left:20px;"
          clearable
          @keyup.enter.native="handleFilter">
          </el-input>
          <el-button  class="filter-item search" type="primary" icon="el-icon-search" @click="handleFilter"
          >搜索</el-button>
          <el-button  style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">导出数据</el-button>
      </div>
      <div>
          <el-table
          :data="tableData"
          style="width:100%">
            <el-table-column
            prop="code"
            label="appCode"
            min-width="150"
            ></el-table-column>
            <el-table-column
            prop="name"
            label="应用名"
            min-width="180"
            ></el-table-column>
            <!-- <el-table-column
            prop="language"
            label="开发语言"
            ></el-table-column>  -->
            <el-table-column 
            prop="owner"
            label="开发负责人"
            ></el-table-column>
            <el-table-column
            prop="owner_leader"
            label="开发Leader"
            ></el-table-column>
            <!-- <el-table-column
            prop="qa_owner"
            label="QA负责人"
            ></el-table-column> -->
            <el-table-column 
            prop="test_owner"
            label="测试负责人"
            ></el-table-column>
            <el-table-column
            prop="test_leader"
            label="测试Leader"
            ></el-table-column>
            <el-table-column
            prop="esu_owner"
            label="ESU负责人"
            ></el-table-column>
            <el-table-column
            prop="esu_leader"
            label="ESU Leader"
            ></el-table-column>
            <el-table-column
            label="应用状态"
            >
              <template slot-scope="scope">
                  <span v-if="scope.row.enable ===0" style="color:#009900;">使用中</span>
                  <span v-else style="color:#FF9900;">已下线</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="parent_domain"
            label="所属域"
            ></el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            min-width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="watchResource(scope.row)">查看资源</el-button> 
                <!-- <el-button type="text" size="small" :disabled="disable">编辑</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
      </div>
  </div>
    
</template>

<script>
import pagination from '@/components/Pagination/pagination'
import { getToken } from '@/utils/auth'
export default {
    name: 'app_list',
    components: {
        pagination
    },
    data() {
        return {
            tableData: [],
            disable: true,
            total: 0,
            page: 1,
            limit: 10,
            select_search: {appName: '', human: ''},
            loading: false,
            options: []

        }
    },
    methods: {
        init() {
            this.$store.dispatch('search_app').then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
            }).catch(err => {
                console.log(err)
                this.$message({message: err, type: 'error'})
            })
        },
        handleClick(row) {
            this.$router.push({
                name: 'app_detail',
                params: {
                    appId: row.appId
                }
            })
        },
        getList(){
            const data = {}
            data['pageNumber'] = this.page
            data['pageSize'] = this.limit
            if(this.select_search.appName != ''){
              data['appName'] = this.select_search.appName
            }
            if(this.select_search.human != ''){
                data['human'] = this.select_search.human
            }
            this.$store.dispatch('search_app', data).then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
            }).catch(err => {
                console.log(err)
                this.$message({message: err, type: 'error'})
            })

        },
        searchApp(query){
            if (query !== ''){
              this.loading = true
              this.options = []
              this.$store.dispatch('search_app', {appName: query}).then(resp => {
                const data = resp.data.data
                for (let i=0; i< data.length; i++) {
                    this.options.push({label: data[i].code, value: data[i].code})
                }
                this.loading = false
              }).catch(err => {
                console.log(err)
                this.$message({message: err, type: 'error'})
              })
            }

        },
        handleFilter(){
            if(this.select_search == '') {
                this.$store.dispatch('search_app').then(resp => {
                this.tableData = resp.data.data
                this.total = resp.data.total
              }).catch(err => {
                  console.log(err)
                  this.$message({message: err, type: 'error'})
              })
            } else {
                this.$store.dispatch('search_app', this.select_search).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    console.log(err)
                    this.$message({message: err, type: 'error'})
                })
            }

        },
        watchResource(row){
            //查询资源点击事件跳转至资源详情
            this.$router.push({
                name: 'app_resource',
                params: {
                    appId: row.code
                }
            })
        },
        handleDownload(){
          //导出数据跳转
          const url = 'http://cmdb-ops.ahotels.tech/export/application/info/?token=' + getToken()
          window.open(url)
        },        
    },
    mounted () {
        this.init()
    }
}
</script>

<style scoped>
.search {
    margin: 10px;
  }
</style>
