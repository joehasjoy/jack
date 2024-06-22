<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="请输入工单号" v-model.trim="search_data.ticket_id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="请输入工作流名称" v-model.trim="search_data.workflow_name"  class="filter-item search-input" @keyup.enter.native="handleFilter"/>
      <el-button  class="filter-item search" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    
    </div>

  <el-table
    :data="tableData"
    style="width: 100%; margin-top:30px">
    <el-table-column
      label="工单号"
      width="220" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.sn }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="工作流"
      width="160" align="center" >
      <template slot-scope="scope">
        <span>{{ scope.row.workflow.workflow_name }}</span>
      </template>
    </el-table-column>
    <el-table-column
     label="当前状态" 
     width="160" align="center">
      <template slot-scope="scope">
        <span style="margin:0, auto"> {{ scope.row.state.state_name }}</span>
      </template>
    </el-table-column>
    <el-table-column
     label="申请人" 
     width="160" align="center">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>手机号: {{ scope.row.creator }}</p>
          <p>邮箱: {{ scope.row.creator_info.email }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.creator_info.alias }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
     label="创建时间"
     width="220" align="center">
       <template slot-scope="scope">
         <p>{{ scope.row.gmt_created }}</p>
       </template>
    </el-table-column>
    <el-table-column 
     label="更新时间"
     width="220" align="center">
      <template slot-scope="scope">
        <p>{{ scope.row.gmt_modified }}</p>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="warning"
          @click="ticketDetail(scope.$index, scope.row)">查看详情</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="searchParam(scope.$index, scope.row)">查看参数</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getList" />
  <el-dialog title="工单申请数据" :visible.sync="dialogVisible">
    <el-table :data="dialogData">
      <el-table-column
       label="name"
       width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
       label="key"
       width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
       label="value"
       width="320" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.v }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/Pagination/pagination'

  export default {
    name: 'myself',
    components: {
      pagination
    },
    data() {
      return {
        search_data: {
          'ticket_id': '',
          'workflow_name': ''
        },
        tableData: [],
        total: 0,
        page: 1,
        limit: 10,
        dialogVisible: false,
        dialogData: [],
        paramsData: ''
      }
    },
    methods: {
      ticketDetail(index, row) {
        this.$router.push({name: 'detail', params: {id: row.id}})
      },
      searchParam(index, row) {
        this.dialogData = []
        this.$store.dispatch('get_ticket_flowlog', row.id).then(resp => {
          if (resp.data.data.value.length >= 1) {
            this.paramsData = resp.data.data.value[0]
            Object.keys(this.paramsData.field_choice[0]).forEach(k =>{
              if (this.paramsData.field_choice[0][k]['field_choice'] == "{}" && [5, 10, 15, 20, 25, 30, 55].includes(this.paramsData.field_choice[0][k]['field_type_id'])) {
                this.dialogData.push({'name': this.paramsData.field_choice[0][k]['name'],
                                      'key': k,
                                      'v': this.paramsData.ticket_data[k]})
              
              } else if ([35, 45, 60].includes(this.paramsData.field_choice[0][k]['field_type_id'])) {
                const temp = JSON.parse(this.paramsData.field_choice[0][k]['field_choice'])
                this.dialogData.push({'name': this.paramsData.field_choice[0][k]['name'],
                                      'key':k,
                                      'v': temp[this.paramsData.ticket_data[k]]})
              } else if ([40, 50, 70].includes(this.paramsData.field_choice[0][k]['field_type_id'])) {
                const t1 = JSON.parse(this.paramsData.field_choice[0][k]['field_choice'])
                const re = /\[|\]/
                const list1 = this.paramsData.ticket_data[k].replace(re,'').replace(re,'').split(',')
                const query = []
                for (let i=0; i< list1.length; i++){
                  let a = list1[i].trim()
                  if (Object.keys(t1).includes(a)){
                    query.push(t1[a])
                  
                  } else {
                    const b = a.replace("'", "").replace("'", "")
                    query.push(t1[b])
                  }
                }
                this.dialogData.push({'name':this.paramsData.field_choice[0][k]['name'],
                                      'key': k,
                                      'v': query.join(',') })
              }
            })
            this.dialogVisible = true
          } else {
            this.$message({message: '此工单没有数据，可能数据被损坏', type: 'error'})
          }
        }).catch(err => {
          console.log(err)
          this.$message({message: '此工作流参数配置不正确', type: 'error'})
        })
      },
      handleFilter(){
        this.$store.dispatch('get_ticket_list', {category: 'owner', is_end: '0', sn: this.search_data.ticket_id, workflow_name: this.search_data.workflow_name, page: this.page, per_page: this.limit}).then(resp => {
          this.tableData = resp.data.data.value
          this.total = resp.data.data.total
        })
      },
      init(){
        this.$store.dispatch('get_ticket_list', {category: 'owner', is_end: '0'}).then(resp => {
          this.tableData = resp.data.data.value
          this.total = resp.data.data.total
        }).catch(err => {
          console.log(err)
        })
      },
      getList(){
        this.$store.dispatch('get_ticket_list', {category: 'owner', is_end: '0', page: this.page, per_page: this.limit}).then(resp => {
          this.tableData = resp.data.data.value
          this.total = resp.data.data.total
        }).catch(err => {
          console.log(err)
        })

      }
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
  .search-input {
   width: 200px;
   margin-left: 20px;
  }
  
</style>
