<template>
    <div style="margin: 10px;">
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
            <span>在</span>
            <span>{{name}}</span>
          </div>
        </div>
      </div>
      <div class="container">
        <div id="terminal-container" style="height: 300px;width: 100%;"></div>
        <div id="copyRemind" style="position: relative;z-index: 1000;top: 50%;left: 50%;transform: translate(-50%, -1000%);width: 160px;opacity:0.8;display: none;">
          <span style="background-color: #d5d5d5;color: black;font-size: 20px;border-radius: 10px;padding: 5px 10px" class="show-size">已复制</span>
        </div>
      </div>
    </div>
</template>

<script>
  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm';
  import * as fit from 'xterm/lib/addons/fit/fit';
  export default {
    name: 'pod-terminal',
    data(){
      return{
        name: '',
        container: '',
        tgtData: {spec: {containers: []}},
        url: this.GLOBAL.service_tag+'/api/kubernetes/pod/',
        term_url: this.GLOBAL.service_tag+'/api/kubernetes/pod-terminal.html',
      }
    },
    methods: {
      // 获取目标信息
      GetTgtData: function(url) {
        this.namespace = this.common.getUrlKey('namespace');
        this.env = this.common.getUrlKey('env');
        const parms = {"env": this.env, "namespace": this.namespace, "name": this.name}
        this.axios({
          method: 'GET',
          url: url,
          params: parms,
        }).then((response)=>{
          // console.log('GetTgtData:',response.data,);
          if(response.data.status){
            this.tgtData = response.data.rows
            if(this.tgtData.spec.containers.length>=1){this.container=this.tgtData.spec.containers[0].name}
            this.OpenTerminal()
          }else {this.$message.error({message: response.data.error})}
        }).catch((response) => {
          this.$message.error({message: String(response)});
        });
      },

      // open terminal
      OpenTerminal: function() {
        var options = {
          name: this.name,
          namespace: this.namespace,
          env: this.env,
          container:this.container,
        };
        // console.log("options:", options)
        // return
        document.getElementById('terminal-container').innerHTML = '';
        let terminalContainer = document.getElementById('terminal-container')
        // document.getElementById('terminal-container').setAttribute("height",300)
        if (window.location.protocol == 'https:') {
          var protocol = 'wss://';
        } else {
          var protocol = 'ws://';
        }
        let endpoint = protocol + window.location.host + this.$store.state.cicd.term_url;
        // let endpoint = 'ws://192.168.21.138:5000/api/kubernetes/pod-terminal.html';
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
        // resize_term(term, websocket)

        let websocket = new WebSocket(endpoint);//地址
        term.on("data", function (data) {
          websocket.send(JSON.stringify({"tp": "client", "data": data}));
        });

        //连接成功
        websocket.onopen = function (ev) {
          websocket.send(JSON.stringify({"tp": "init", "data": options}));
          //socket.send(JSON.stringify({"tp": "client", "data": "\r"}));
          term.writeln('Kubernetes Container Terminal...');
          term.writeln('By Ocean...');
          //term.fit()
          resize_term(term, websocket)
        };
        //返回
        websocket.onmessage = function (ev) {
          var data = ev.data.toString();
          //console.log(data);
          term.write(data);
        };
        websocket.onclose = function (ev) {
          term.writeln("连接关闭");
          var shellprompt = '$ ';
          term.prompt = function () {
            term.write('\r\n' + shellprompt);
          };
          //term.writeln('Welcome to xterm.js');
          term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
          term.writeln('Warning : please check this container status !!!');
          term.prompt();

        };
        websocket.onerror = function (ev) {
          term.writeln('Socket on Error');
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
            // websocket.send(new TextEncoder().encode("\x00" + this.copy));
            // console.log('copy:',document.execCommand('paste'))
          }
        });
        function resize_term(term, socket) {
          document.getElementById("terminal-container").style.height=(window.innerHeight - 120)+"px";
          let c_height=terminalContainer.offsetHeight;
          let c_width=terminalContainer.offsetWidth;
          // console.log('w-h:', c_width, c_height)
          var innerHeight= c_height
          var innerWidth= c_width
          var cols= parseInt(innerWidth / 8) - 2;
          var rows= parseInt(innerHeight / 16);
          //console.log(innerHeight, innerWidth, Height);
          term.resize(cols, rows);
          if(socket){
            socket.send(JSON.stringify({"tp": "resize", "data": {"cols": cols, "rows":rows}}));
          }
        }
        window.onresize = function (ev) {
          if(term && websocket){resize_term(term, websocket)}
        }
        // console.log('websocket finish.....')
      }
    },
    mounted(){
      this.name = this.common.getUrlKey('name');
      this.GetTgtData(this.url);
      // console.log('terminal:', window.innerHeight, window.innerWidth)

    }
  }
</script>

<style scoped>

</style>
