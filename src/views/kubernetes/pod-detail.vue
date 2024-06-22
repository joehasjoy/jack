<template>
    <div style="margin: 10px">
      <el-page-header @back="goBack" :content="name"></el-page-header>
      <el-divider></el-divider>
      <div class="base">
        <div style="width: 100%;margin-top:-15px;margin-bottom: 1px;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;">
          <span style="margin-left: 16px;font-size: 14px;color: #333333">基本信息</span>
        </div>
        <el-row style="margin: 10px;font-size: 14px">
          <el-col :span="12"><span>名称：</span><span>{{name}}</span></el-col>
          <el-col :span="12"><span>命令空间：</span><span>{{namespace}}</span></el-col>
        </el-row>
        <el-row style="margin: 10px;font-size: 14px">
          <el-col :span="12"><span>状态：</span><span>{{status}}</span></el-col>
          <el-col :span="12"><span>创建时间：</span><span>{{createTime}}</span></el-col>
        </el-row>
        <el-row style="margin: 10px;font-size: 14px">
          <el-col :span="12"><span>节点：</span><span>{{node}}</span></el-col>
          <el-col :span="12"><span>Pod IP：</span><span>{{podIP}}</span></el-col>
        </el-row>
        <el-row style="margin: 10px;font-size: 14px">
          <el-col :span="24"><span>标签：</span>
            <el-tag v-for="(key, value) in labels" type="info" :key="value" effect="dark" size="mini" style="margin-right: 5px">{{value}}: {{key}}</el-tag>
          </el-col>
        </el-row>
      </div>

      <div class="conditions">
        <div style="width: 100%;margin-top:10px;margin-bottom: 1px;line-height:38px;height:40px;background:#F5f6FA;border: 1px solid #e1e6eb;border-left: 4px solid #6d7781;">
          <span style="margin-left: 16px;font-size: 14px;color: #333333">现状</span>
        </div>
        <el-table :data="tableDataConditions" style="width: 100%" size="small">
          <el-table-column prop="type" label="类型" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="180"></el-table-column>
          <el-table-column prop="lastTransitionTime" label="更新时间"></el-table-column>
          <el-table-column prop="reason" label="原因"></el-table-column>
          <el-table-column prop="message" label="消息"></el-table-column>
        </el-table>
      </div>

      <div class="base-card">
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="容器" name="container">
            <el-table :data="tableDataContainer" style="width: 100%" size="mini">
              <el-table-column type="expand" style="background-color: #f8f8f8">
                <template slot-scope="props">
                  <el-row style="margin: 10px;font-size: 14px">
                    <el-col :span="4"><span>镜像拉取策略</span></el-col>
                    <el-col :span="20"><span>{{props.row.imagePullPolicy}}</span></el-col>
                  </el-row>
                  <el-row style="margin: 10px;font-size: 14px">
                    <el-col :span="4"><span>环境变量</span></el-col>
                    <el-col :span="20"><div v-for="(item,key) in props.row.env" :key="key">{{item.name}}:{{item.value}}</div></el-col>
                  </el-row>
                  <el-row style="margin: 10px;font-size: 14px">
                    <el-col :span="4"><span>命令</span></el-col>
                    <el-col :span="20"><span v-for="(item,key) in props.row.command" :key="key">{{item}} </span></el-col>
                  </el-row>
                  <el-row style="margin: 10px;font-size: 14px" v-if="props.row.resources.requests">
                    <el-col :span="4"><span>所需资源</span></el-col>
                    <el-col :span="20"><span>CPU: {{props.row.resources.requests.cpu}} Memory: {{props.row.resources.requests.memory}}</span></el-col>
                  </el-row>
                  <el-row style="margin: 10px;font-size: 14px" v-if="props.row.resources.limits">
                    <el-col :span="4"><span>资源限制</span></el-col>
                    <el-col :span="20"><span>CPU: {{props.row.resources.limits.cpu}} Memory: {{props.row.resources.limits.memory}}</span></el-col>
                  </el-row>
                  <!--                      <span>{{ props.row.shop }}</span>-->
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="300" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="image" label="镜像" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="message" label="端口" width="200px">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.ports" :key="index">{{item.containerPort}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="事件" name="event">
            <el-table :data="tableDataEvents" style="width: 100%" size="mini">
              <el-table-column prop="type" label="类型" width="120"></el-table-column>
              <el-table-column prop="reason" label="原因" width="140px"></el-table-column>
              <el-table-column prop="creation_timestamp" label="时间" width="180"></el-table-column>
              <el-table-column prop="from" label="来自" :show-overflow-tooltip="true" width="300px"></el-table-column>
<!--              <el-table-column prop="involvedObject" label="对象" :show-overflow-tooltip="true" width="300px"></el-table-column>-->
              <el-table-column prop="message" label="信息"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="创建者" name="creator">
            <el-table :data="tableDataInitContainer" style="width: 100%" size="mini">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="kind" label="类型"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="初始化容器" name="fourth">
            <h3>没有查询到符合条件的记录</h3>
          </el-tab-pane>
          <el-tab-pane label="存储" name="volume">
            <el-table :data="tableDataVolume" style="width: 100%" size="mini">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="" label="类型">
                <template slot-scope="props">
                  <span v-for="(item, key) in props.row" :key="key" v-if="key !== 'name'">{{key}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="详情">
                <template slot-scope="props">
                  <div v-for="(item, key) in props.row" :key="key" v-if="key !== 'name'">
                    <div v-for="(i, k) in item" :key="k">{{k}}: {{i}}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="日志" name="log">
            <div style="border: solid 1px #DDD; padding: 10px 20px; border-bottom: none">
              <div class="clearfix">
                <div class="pull-left" style="display: inline;float: left">
                  <span>容器：</span>
                  <el-select v-model="container" placeholder="请选择" size="mini" style="width: 200px" @change="OpenTerminal">
                    <el-option v-for="item in tgtData.spec.containers"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <span>显示行数：</span>
                  <el-select v-model="logSzie" placeholder="请选择" size="mini" style="width: 80px" @change="OpenTerminal">
                    <el-option label="50" value="50"></el-option>
                    <el-option label="100" value="100"></el-option>
                    <el-option label="200" value="200"></el-option>
                  </el-select>
                </div>
                <div class="pull-right" style="display: inline;float: right">
                  <el-checkbox v-model="auto_refresh" @change="OpenTerminal">自动刷新</el-checkbox>
                  <el-button size="mini" @click="connectWS" :disabled="refresh_disabled">{{refresh_content}}</el-button>
<!--                  <el-button size="mini" @click="closeWS">断开</el-button>-->
                </div>
              </div>
            </div>
            <div class="container">
              <div id="terminal-container" style="height: 500px;width: 100%"></div>
              <div id="copyRemind" style="position: relative;z-index: 1000;top: 50%;left: 50%;transform: translate(-50%, -1000%);width: 160px;opacity:0.8;display: none;">
                <span style="background-color: #d5d5d5;color: black;font-size: 20px;border-radius: 10px;padding: 5px 10px" class="show-size">已复制</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
</template>

<script>
  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm';
  import * as fit from 'xterm/lib/addons/fit/fit';

  export default {
    name: 'pod-detail',
    data(){
      return{
        auto_refresh: false,
        logSzie: 100,
        container: '',
        tgtData: {spec: {containers: []}},
        activeName: 'event',
        env: '',
        name: '',
        namespace: '',
        status: '',
        createTime: '',
        node: '',
        podIP: '',
        labels: [],
        url: this.GLOBAL.service_tag+'/api/kubernetes/pod/',
        event_url: this.GLOBAL.service_tag+'/api/kubernetes/event/',
        log_url: this.GLOBAL.service_tag+'/api/kubernetes/pod-log.html',
        tableDataConditions: [],
        tableDataEvents: [],
        tableDataContainer: [],
        tableDataInitContainer: [],
        tableDataVolume: [],
        terminal: {
          pid: 1,
          name: 'terminal',
          cols: 1000,
          rows: 1000
        },
        websocket: null,
        refresh_disabled: false,
        refresh_content: '刷新',
      }
    },
    methods: {
      goBack: function() {
        // window.history.back();
        this.$router.push('/kubernetes/pod.html')
      },

      handleTabClick(tab, event) {
        // console.log('handleTabClick',tab.name);
        if(tab.name==='log'){this.OpenTerminal()}
      },

      // 获取目标信息
      GetPodData: function(url) {
        this.namespace = this.common.getUrlKey('namespace');
        this.env = this.common.getUrlKey('env');
        let parms = {"env": this.env, "namespace": this.namespace, "name": this.name}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('GetPodData:',response.data,);
          if(response.data.status){
            // this.content = response.data.data
            this.status = response.data.rows.status.phase
            this.createTime = response.data.rows.status.startTime
            this.node = response.data.rows.status.hostIP
            this.podIP = response.data.rows.status.podIP
            this.labels = response.data.rows.metadata.labels
            this.tableDataConditions = response.data.rows.status.conditions
            this.tableDataContainer = response.data.rows.spec.containers
            this.tableDataInitContainer = response.data.rows.metadata.ownerReferences
            this.tableDataVolume = response.data.rows.spec.volumes
            this.tgtData = response.data.rows
            if(this.tgtData.spec.containers.length>=1){this.container=this.tgtData.spec.containers[0].name}
            this.GetTgtEvent(this.event_url)
          }else {this.$notify.error(response.data.error)}
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      // 查看相关联的Events
      GetTgtEvent: function(url) {
        let field_selector = "involvedObject.kind="+this.tgtData.kind+",involvedObject.name="+this.name;
        this.axios({
          method: 'GET',
          url: url,
          params: {'env': this.env, "namespace": this.namespace,"field_selector":field_selector},
        }).then((response)=>{
          // console.log('GetTgtEvent:',response.data,);
          if(response.data.status){
            this.tableDataEvents = response.data.rows
          }else {this.$notify.error( response.data.error)}
        }).catch((response) => {
          this.$notify.error(String(response));
        });
      },

      // open terminal
      OpenTerminal: function() {
        var options = {
          name: this.name,
          namespace: this.namespace,
          env: this.env,
          lines: this.logSzie,
          container:this.container,
          follow: this.auto_refresh,
        };
        document.getElementById('terminal-container').innerHTML = '';
        let terminalContainer = document.getElementById('terminal-container')

        if (window.location.protocol === 'https:') {
          var protocol = 'wss://';
        } else {
          var protocol = 'ws://';
        }
        let endpoint = protocol + window.location.host + this.$store.state.cicd.log_url;
        // let endpoint = 'ws://127.0.0.1:5000/api/kubernetes/pod-log.html';
        // console.log('endpoint:', endpoint, this.log_url, window.location.protocol)
        let term = new Terminal({
          // cols: 260,
          // rows: 60,
          useStyle: true,
          cursorBlink: true, // 光标闪烁
          // cursorStyle: "underline", // 光标样式  null | 'block' | 'underline' | 'bar'
          // tabStopWidth: 8, //制表宽度
          fontSize: 14,
          lineHeight: 1,
          convertEol: true,
          screenKeys: false,
          scrollback: 5000,   //回滚
          visualBell: false,
          applicationCursor: true, // Needed for proper scrollback behavior in applications like vi
          mouseEvents: true,
        });
        term.open(terminalContainer)
        resize_term(term, _websocket)
        //console.log('wsssss', this.websocket, window.WebSocket)
        if(this.websocket===null || this.websocket.readyState!==1){
          this.websocket = new WebSocket(endpoint);//地址
          var _websocket = this.websocket
        }else if(this.websocket && this.websocket.readyState===1){
          this.websocket.close()
          this.websocket = new WebSocket(endpoint);//地址
          _websocket = this.websocket
        }else {return}
        //_websocket.close()
        // websocket.binaryType = "arraybuffer";

        //连接成功
        _websocket.onopen = function (ev) {
          _websocket.send(JSON.stringify({"tp": "init", "data": options}));
          //socket.send(JSON.stringify({"tp": "client", "data": "\r"}));
          term.writeln('Kubernetes Container Log...');
          term.writeln('By Ocean log...');
          //term.fit()
          resize_term(term, _websocket)
        };
        //返回
        _websocket.onmessage = function (ev) {
          var data = ev.data.toString();
          //console.log(data);
          term.write(data);
        };
        _websocket.onclose = function (ev) {
          //if(_websocket){_websocket.send(JSON.stringify({"tp": "quit", "data": options}));}
          _websocket.close()
          term.writeln("ws is close");
          var shellprompt = '$ ';
          term.prompt = function () {
            term.write('\r\n' + shellprompt);
          };
          //term.writeln('Warning : please check this container status !!!');
          term.prompt();

        };
        _websocket.onerror = function (ev) {
          _websocket.close()
          term.writeln('\r\nSocket close');
        };
        //选中 复制
        term.on("selection", function() {
          if (term.hasSelection()) {
            // console.log('selection:', term.getSelection())
            document.execCommand("Copy")
            // 几秒后消失
            document.getElementById('copyRemind').style.display = 'block'
            setTimeout(function(){ document.getElementById('copyRemind').style.display = 'none' }, 3000)
          }
        });
        //粘贴 ctrl+v
        term.attachCustomKeyEventHandler(function(ev) {
          if (ev.keyCode == 86 && ev.ctrlKey) {
            _websocket.send(new TextEncoder().encode("\x00" + this.copy));
          }
        });
        function resize_term(term, sock) {
          let c_height=terminalContainer.offsetHeight;
          let c_width=terminalContainer.offsetWidth;
          // console.log('w-h:', c_width, c_height)
          var innerHeight= c_height
          var innerWidth= c_width
          var cols= parseInt(innerWidth / 8) - 2;
          var rows= parseInt(innerHeight / 16);
          //console.log(innerHeight, innerWidth, Height);
          //console.log(cols, rows);
          // $(".show-size").text(innerWidth +" * "+innerHeight);
          // $(".show-size").show().delay(3000).fadeOut();
          term.resize(cols, rows);
          //sock.send(JSON.stringify({"tp": "resize", "data": {"cols": cols, "rows":rows}}));
        }
        window.onresize = function (ev) {
          if(term && _websocket){resize_term(term, _websocket)}
        }

        window.onbeforeunload = function(event) {
          console.log("关闭WebSocket连接！");
          _websocket.close();
        }
        // _websocket.close()
        // console.log('websocket finish.....')
      },

      // 关闭WS
      closeWS: function() {
        var options = {
          name: this.name,
          namespace: this.namespace,
          env: this.env,
          lines: this.logSzie,
          container:this.container,
          follow: this.auto_refresh,
        };
        this.websocket.send(JSON.stringify({"tp": "quit", "data": options}));
      },
      // 连接websocket
      connectWS: function() {
        this.OpenTerminal()
        this.refresh_disabled = true
        this.refresh_content = '3s刷新'
        let disabled_time = 3
        let clock = window.setInterval(() => {
          disabled_time--
          this.refresh_content = disabled_time + 's刷新'
          if (disabled_time < 0) {
            window.clearInterval(clock)
            this.refresh_content = '刷新'
            disabled_time = 3
            this.refresh_disabled = false  //这里重新开启
          }
        },1000)
      },

    },
    mounted(){
      this.name = this.common.getUrlKey('name');
      this.GetPodData(this.url);
      let active_name = this.common.getUrlKey('activeName');
      if(active_name){this.activeName=active_name}
      if(active_name==='log'){this.OpenTerminal()}
    },
    destroyed: function() {
      if(this.websocket!==null && this.websocket.readyState===1){
        this.websocket.close();
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-tabs__item.is-top.is-active{
    border-top: solid 3px #00A2CA;
  }
</style>
