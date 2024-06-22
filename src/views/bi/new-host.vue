<template>
    <div style="margin: 10px">
      <el-date-picker
        v-model="timestamp"
        type="datetime"
        value-format="timestamp"
        @change="changeTime"
        placeholder="选择日期时间">
      </el-date-picker>
      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 300px;float: right"></el-input>
      <el-button @click="exportExcel">exportExcel</el-button>
      <el-table border id="out-table"
        :data="tables.slice((page-1)*limit,page*limit)"
        style="width: 100%">
        <el-table-column label="instanceName" prop="instanceName"></el-table-column>
        <el-table-column sortable label="IP" prop="privateIp"></el-table-column>
        <el-table-column sortable label="hardware" prop="hardware"></el-table-column>
        <el-table-column sortable label="appCode" prop="appCode"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100, 500,1000]"
          :page-size="limit"
          layout="prev, pager, next, jumper, sizes, total"
          :total="total">
        </el-pagination>
      </div>

    </div>
</template>

<script>
  // 引入导出Excel表格依赖
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  export default {
    name: 'zabbix',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timestamp: new Date(new Date() - 3600 * 1000 * 24 * 7).getTime(),
        tableData: [],
        url: this.GLOBAL.service_tag+'/api/bi/new-host/',
        limit: 10,
        page: 1,
        total: 0,
        search: '',
      }
    },
    methods: {
      // 获取表格数据；
      InitGetTableData: function(url,page_size, page_index, conn) {
        // console.log("url:", this.baseURI)
        this.NProgress.start()
        const parms = {"timestamp": this.timestamp}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('aaa:',response.data.condition_config);
          if(response.data.status){
            this.tableData = response.data.data.rows
            this.total = response.data.data.total
            // this.total = response.data.total
            // this.condition = response.data.condition_config
            // this.global_dict = response.data.global_dict
          }else {this.$notify.error({message: response.data.error})}
          this.NProgress.done();
        }).catch((response) => {
          this.$notify.error({message: 'GetTableData Error: '+ JSON.stringify(response)});
          this.NProgress.done();
        });

      },

      handleSizeChange: function(val) {
        this.limit = val
      },

      handleCurrentChange: function(val) {
        this.page = val
      },
      changeTime: function() {
        this.InitGetTableData(this.url, this.limit, this.page)
      },

      //定义导出Excel表格事件
      exportExcel: function() {
        /* 从表生成工作簿对象 */
        const wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        /* 获取二进制字符串作为输出 */
        const wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            "sheetjs.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    },
    computed: {
      // 前端过滤
      tables () {
        // console.log("time_range:", this.time_range)
        const search = this.search
        if (search) {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      },

    },

    mounted () {
      this.InitGetTableData(this.url, this.limit, this.page)

    },
    watch: {
      // 检测表格数据过滤变化，自动跳到第一页
      tables () {
        this.page = 1
        this.total = this.tables.length
      }
    }
  }
</script>

<style>
  tr.expanded{
    background-color: #ebf7fd !important;
  }
</style>
