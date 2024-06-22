<template>
  <div class="app-container">
      <div class="filter-container">
          <el-select 
          v-model.trim="select_search"
          filterable
          remote
          placeholder="请输入关键字搜索"
          :loading="loading"
          :remote-method="searchApp"
          clearable
          >
            <el-option v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
          <el-select
          v-model.trim="env"
          filterable
          clearable
          placeholder="请选择环境"
          style="margin-left:20px;"
          @change="queryConfig(env)">
            <el-option
            v-for="item in env_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            ></el-option>
          </el-select>
      </div>
      <div>
          <el-table
          :data="tableData"
          style="width:100%;">
          <el-table-column
          label="appCode">
            <template slot-scope="scope">
                <span>{{scope.row.appcode }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="域代号">
            <template slot-scope="scope">
                <span>{{scope.row.project }}</span>
            </template>
          </el-table-column>
           <el-table-column
          label="cpu配额">
            <template slot-scope="scope">
                <span>{{scope.row.cpu }}</span>
            </template>
          </el-table-column>
           <el-table-column
          label="内存配额">
            <template slot-scope="scope">
                <span>{{scope.row.memory }}</span>
            </template>
          </el-table-column>
           <el-table-column
          label="环境">
            <template slot-scope="scope">
                <span>{{scope.row.env }}</span>
            </template>
          </el-table-column>
           <el-table-column
          label="命名空间">
            <template slot-scope="scope">
                <span>{{scope.row.namespace }}</span>
            </template>
          </el-table-column>
           <el-table-column
          label="副本数">
            <template slot-scope="scope">
                <span>{{scope.row.replicas }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
               size="mini"
               type="text"
               @click="handleEdit(scope.$index, scope.row)">编辑yaml</el-button>
              </template>
          </el-table-column>

          </el-table>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <editor v-model="content" 
            @init="editorInit" 
            lang="javascript" theme="chrome" 
            width="700" height="300"
            ></editor>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitYaml">更新</el-button>
            </span>
          </el-dialog>
      </div>
  </div>
    
</template>

<script>
export default {
    name: 'app_config',
    components: {
        editor: require('vue2-ace-editor'),
    },
    data() {
        return {
            select_search: '',
            loading: false,
            options: [],
            env: '',
            env_options: [],
            tableData: [],
            dialogVisible: false,
            content: ''
               
        }
    },
    methods: {
        init() {
            this.$store.dispatch('get_env').then(res => {
                this.env_options = res.data.data.map(item => {
                    return {value: item.code, label: item.code}
                })
            }).catch(err => {
                console.log(err)
                this.$message({message: err, type: 'error'})
            })
        },
        editorInit: function () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/mode/javascript')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('brace/snippets/javascript') //snippet
        },
        searchApp(query) {
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
        queryConfig(query){
            if(this.select_search == '' || query == '') {
                this.$message({message: '应用名或环境不能为空', type: 'error'})
            } else {
              this.tableData = []
                this.$store.dispatch('get_app_config', {env: query, appCode: this.select_search}).then(resp => {
                    let data = resp.data.data
                    if(typeof(data) === Array){
                      this.$message({message: '没有数据', type: 'warning'}) 
                    } else {
                      let temp = data.list[0]
                      Object.keys(temp).map(k => {
                        data[k] = temp[k]
                      })
                      this.tableData.push(data)
                    }
                    
                    
                }).catch(err => {
                    this.$message({message: err, type: 'error'})
                })
            }
        },
        handleEdit(index, rows) {
            this.dialogVisible = true
            this.content = this.jsonToYaml(rows.deployyaml)

        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        jsonToYaml(str){
            //json转换成yaml字符串
          var json2yaml = require('js-yaml')
          return json2yaml.dump(json2yaml.load(str))
        },
        yamlToJson(str) {
          //yaml字符串转换成json对象
          var yaml2json = require('js-yaml')
          return yaml2json.load(str)
        },
        submitYaml(){
            this.$store.dispatch('put_app_config', this.yamlToJson(this.content)).then(resp => {
                
                if(resp.data.code == 201) {
                    this.$message({message: '修改成功', type: 'success'})
                    this.dialogVisible = false
                } else {
                    this.$message({message: '修改失败', type: 'error'})
                    this.dialogVisible = false
                }
            }).catch(err => {
                this.$message({message: err, type: 'error'})
            })
        }

    },
    mounted() {
        this.init()

    }
}
</script>

