<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col :span="4">
        <el-input placeholder="请输入公网IP或者后端IP" v-model.trim="search_data" clearable @keyup.enter.native="handleFilter"/>
      </el-col>
      <el-button class="filter-item search" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    
    </div>
      <div>
        <el-table
        :data="tableData"
        style="width:100%"
        :cell-class-name="cellSelfStyle">
        <el-table-column
        prop="address"
        label="公网IP"
        ></el-table-column>
        <el-table-column
        prop="loadbalancername"
        label="负载均衡名称"
        min-width="120"></el-table-column>
        <el-table-column
        prop="status"
        label="状态"></el-table-column>
        <el-table-column
        prop="upstream_server"
        label="后端服务地址"
        min-width="300"></el-table-column>
        <el-table-column
        prop="弹性IP"
        label="eip"
        ></el-table-column>
         
        </el-table>
         <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
      </div>
  </div>
    
</template>
<script>
import pagination from '@/components/Pagination/pagination'
export default {
    name: 'slb_list',
    components: {
        pagination
    },
    data() {
        return {
            tableData: [],
            total: 0,
            page: 1,
            limit: 10,
            search_data: ''

        }
    },
    methods: {
        init(){
            this.$store.dispatch("get_slb").then(resp => {
                resp.data.data.map(item => {
                    item.upstream_server = item.upstream_server.join(',')
                    this.tableData.push(item)
                })
                this.total = resp.data.total
                
                
            })
        },
        getList(){
            this.tableData = []
            this.$store.dispatch("get_slb", {pageSize: this.limit, pageNumber: this.page}).then(resp => {
                resp.data.data.map(item => {
                    item.upstream_server = item.upstream_server.join(',')
                    this.tableData.push(item)
                })
                this.total = resp.data.total
            })

        },
        cellSelfStyle(row, column, rowIndex, columnIndex){
            if(row.columnIndex == 2) {
              if(row.row.status == 'active'){
                  return 'normal_status'
              } else {
                  return 'error_status'
              }
          }
        },
        handleFilter(){
            if(this.search_data != '') {
                this.tableData = []
              this.$store.dispatch('get_slb', {backendIp: this.search_data}).then(resp => {
                  if(resp.data.data == '') {
                      this.$store.dispatch('get_slb', {lbIp:this.search_data}).then(res => {
                          res.data.data.map(item => {
                            item.upstream_server = item.upstream_server.join(',')
                            this.tableData.push(item)
                          })
                          this.total = res.data.total
                      }).catch(err => {
                          this.$message({message: err, type: 'error'})
                      })
                  } else {
                      resp.data.data.map(item => {
                        item.upstream_server = item.upstream_server.join(',')
                        this.tableData.push(item)
                      })
                      this.total = resp.data.total
                  }
              }).catch(er => {
                  this.$message({message: er, type: 'error'})
              })
            } else {
                this.init()
            }

        }

    },
    mounted(){
        this.init()

    }
}
</script>

<style>
  .normal_status {
      color: #009900;
  }
  .error_status {
      color: #ff9900;
  }
  .search {
      margin-left: 20px;
  }
</style>


