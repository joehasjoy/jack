<template>
  <div style="width: 100%">
    <!--table 表格-->
    <el-table :data="tableData" border @selection-change="handleSelectionChange" :size="table_size">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column type="index" :index="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column
        v-for="(item,key) in tableKey"
        v-if="!item.hide"
        :key="key"
        :prop="item.value"
        :label="item.name"
        :width="item.width"
        :align="item.align"
        :sortable="item.hasSort"
        :resizable="item.resizable"
        :show-overflow-tooltip="item.ShowOverflowTooltip"
        :formatter="item.formatter"
      >
        <template slot-scope="scope">
          <template v-if="item.formatter">
            <span v-html="item.formatter(scope.row, scope.row[item.value],'','')"></span>
          </template>
          <template v-else>{{scope.row[item.value]}}</template>
        </template>
      </el-table-column>
      <el-table-column :width="operates.width" :label="operates.label" :align="operates.align">
<!--        <template slot="header" slot-scope="scope">-->
<!--          <el-input size="mini" placeholder="输入关键字搜索"/>-->
<!--        </template>-->
        <template slot-scope="scope">
          <template v-for="(btn, key) in operates.list">
              <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" :disabled="btn.disabled" v-if="btn.show"
                         :plain="btn.plain" @click.native.prevent="btn.method(scope.row,key)">{{ btn.label }}
              </el-button>

          </template>
        </template>
      </el-table-column>

    </el-table>
    <!--end table-->
    <!--region 分页-->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleIndexChange"
                   :page-size.sync="pageSize"
                   :current-page.sync="currentPage"
                   :page-sizes="pageSizes"
                   :layout="layout"
                   :total="total"></el-pagination>
    <!--endregion-->
  </div>

</template>

<script>
    export default {
      name: "tableTemp",
      data(){
        return {
          // tableData: [],
          // currentPage: 0,
          // total: 0,
        }
      },
      props:{
        table_size: {default: ''},    // {default: 'mini'},
        tableData:{default() { return []}},
        tableKey:{require:true,default:[]},
        operates: {},
        pageSizes:{
          require:true,
          default() {
            return [5, 10, 25, 50, 100]
          }},
        // pageSize:{default: 10},
        // currentPage:{default() { return 1}},
        limit:{default: 10},
        page:{default() { return 1}},
        total: {default: 0},
        layout: {
          type: String,
          default: 'prev, pager, next, jumper,sizes,total'
        },
        background: {
          type: Boolean,
          default: true
        },
        url: {
          type: String,
          require: true
        }
      },
      created: function(){
        // this.currentPage=1;
      },
      computed: {
        currentPage: {
          get() {
            return this.page
          },
          set(val) {
            this.$emit('update:page', val)
          }
        },
        pageSize: {
          get() {
            return this.limit
          },
          set(val) {
            this.$emit('update:limit', val)
          }
        }
      },
      methods: {
        index(val){
          // console.log('index:', val, this.currentPage, this.pageSize)
          return (this.currentPage - 1)*this.pageSize + val + 1
        },
        handleSizeChange: function (val) {
          // console.log("handleSizeChange:", val, this.page, this.currentPage)
          this.$emit('pagination', { page: this.currentPage, limit: val })
        },
        handleIndexChange: function (val) {
          // console.log("handleIndexChange:", val, this.pageSize)
          this.$emit('pagination', { page: val, limit: this.pageSize })
        },
        // 选中行
        handleSelectionChange (val) {
          console.log('val:', val)
        },
        // 编辑
        handleEdit (index, row) {
          console.log(' index:', index)
          console.log(' row:', row)
        },
        // 删除
        handleDel (index, row) {
          console.log(' index:', index)
          console.log(' row:', row)
        },

      }
    }

</script>


<style scoped>

</style>
