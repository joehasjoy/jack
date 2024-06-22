<template>
  <div class="app-container">
      <div class="filter-container">
        <el-radio-group v-model="dns" @change="queryDns">
          <el-radio v-for="(item,index) in dns_options" :key="index" :label="item.value">{{ item.label}}</el-radio>         
        </el-radio-group>
        <el-input placeholder="请输入域名" v-model="search_data" clearable style="width:20%;margin-left:20px;" 
                  @keyup.native.enter="filterSearch"></el-input>
        <el-button type="primary" style="margin-left:20px;" @click="filterSearch">搜索</el-button>
        <!-- <el-button type="warning" size="mini" style="float:right;" v-if="dns==='PrivateZone'">添加域名</el-button> -->
      </div>
      <div>
          <el-table
          :data="tableData"
          style="width:100%;"
          v-if="dns==='PublicZone'">
            <el-table-column label="域名" min-width="180">
                <template slot-scope="scope">
                    <a @click="setDns(scope.row)">{{ scope.row.domainname }}</a>
                </template>
            </el-table-column>
            <el-table-column label="解析条数" min-width="80" prop="recordcount"
            ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="setDns(scope.row)">解析设置</el-button>
                </template>
            </el-table-column>
          </el-table>
          <el-table 
          v-if="dns==='PrivateZone'" 
          :data="tableData"
          style="width:100%;">
          <el-table-column label="域名" min-width="180">
              <template slot-scope="scope">
                  <a @click="setDns(scope.row)">{{ scope.row.zonename }}</a>
              </template>
          </el-table-column>
          <el-table-column label="解析条数" min-width="80" prop="recordcount"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="setDns(scope.row)">解析设置</el-button>
              </template>
          </el-table-column>
          </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
  </div>
    
</template>
<script>
import pagination from '@/components/Pagination/pagination'
export default {
    name: 'dns_list',
    components: {
      pagination
    },
    data() {
        return {
            dns_options: [
                {value: 'PublicZone', label: '公网域名'},
                {value: 'PrivateZone', label: '内网域名'}
            ],
            dns: 'PrivateZone',
            tableData: [],
            total: 0,
            page:1,
            limit: 10,
            search_data: ''

        }
    },
    methods: {
        init(){
          if (this.dns === 'PublicZone'){
                this.$store.dispatch('get_public_zone').then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                    this.page = resp.data.pageNumber
                    this.limit = resp.data.pageSize
                }).catch(err => {
                    this.$message({message: '获取数据失败 '+ err, type: 'error'})
                })                
            } else if (this.dns === 'PrivateZone') {
                this.$store.dispatch('get_private_zone').then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                    this.page = resp.data.pageNumber
                    this.limit = resp.data.pageSize
                }).catch(err => {
                    this.$message({message: '获取数据失败 ' +err, type: 'error'})
                })
            }
        },
        queryDns(query) {
            this.tableData = []
            this.search_data = ''
            if(query == '') {
                this.$message({message: '请先选择内网域名或者外网域名', type: 'error'})
            } else if (query === 'PublicZone'){
                this.$store.dispatch('get_public_zone').then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                    this.page = resp.data.pageNumber
                    this.limit = resp.data.pageSize
                }).catch(err => {
                    this.$message({message: '获取数据失败 '+ err, type: 'error'})
                })                
            } else if (query === 'PrivateZone') {
                this.$store.dispatch('get_private_zone').then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                    this.page = resp.data.pageNumber
                    this.limit = resp.data.pageSize
                }).catch(err => {
                    this.$message({message: '获取数据失败 ' +err, type: 'error'})
                })
            }
        },
        cellSelfStyle(row, column, rowIndex, columnIndex){
          if(row.columnIndex == 2) {
              
              if(row.row.status == 'ENABLE'){
                  return 'normal_status'
              } else {
                  return 'error_status'
              }
          }

        },
        getList(){
            this.tableData = []
            if (this.dns === 'PublicZone'){
                this.$store.dispatch('get_public_zone', {pageSize: this.limit, pageNumber: this.page}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败 '+ err, type: 'error'})
                })                
            } else if (this.dns === 'PrivateZone') {
                this.$store.dispatch('get_private_zone', {pageSize: this.limit, pageNumber: this.page}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败 ' + err, type: 'error'})
                })
            }
        },
        setDns(row) {
          this.$router.push({
              name: 'dns_detail',
              params:  {
                  zone_type: this.dns,
                  rowData: row
              }
          })
        },
        filterSearch(){
          //域名搜索
          if (this.dns === 'PublicZone'){
                this.$store.dispatch('get_public_zone', {domainName: this.search_data}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败 '+ err, type: 'error'})
                })                
            } else if (this.dns === 'PrivateZone') {
                this.$store.dispatch('get_private_zone', {zoneName: this.search_data}).then(resp => {
                    this.tableData = resp.data.data
                    this.total = resp.data.total
                }).catch(err => {
                    this.$message({message: '获取数据失败 ' + err, type: 'error'})
                })
            }

        },
    },
    mounted() {
        this.init()
    }
}
</script>
<style >
 .normal_status {
      color: #009900;
  }
  .error_status {
      color: #ff9900;
  }
</style>

