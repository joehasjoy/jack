
<template>
  <div class="view">
    <el-input type="text" v-model="msg" style="width: auto"></el-input>
    <el-button @click="send">发言</el-button>
    <el-button @click="WSCon">Connect</el-button>
    <el-button @click="WSClose">Close</el-button>
    <div class="chat-title">聊天记录：</div>
    <div v-for="(item,index) in msgList" :key="index" class="chat-box">{{item}}</div>

  <div><el-button @click="OpenLog('log')">Connect log</el-button></div>
  <div><el-button @click="OpenLog('api/kubernetes/record')">Connect Record</el-button></div>
  <div><el-button @click="OpenTerminal('terminal')">Connect exec</el-button> <el-button @click="WSClose">Close</el-button></div>
  <div><el-button @click="OpenTerminal('ssh-ws')">Connect SSH</el-button> <el-button @click="WSClose">Close</el-button></div>
    <div class="container">
      <div id="terminal-container" style="height: 500px;width: 100%"></div>
      <div id="copyRemind" style="position: relative;z-index: 1000;top: 50%;left: 50%;transform: translate(-50%, -1000%);width: 160px;opacity:0.8;display: none;">
        <span style="background-color: #d5d5d5;color: black;font-size: 20px;border-radius: 10px;padding: 5px 10px" class="show-size">已复制</span>
      </div>
    </div>
  </div>
</template>

<script>
  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit';
  import * as webLinks from "xterm/lib/addons/webLinks/webLinks";
  import * as search from "xterm/lib/addons/search/search";

  export default {
    data() {
      return {
        msg: '',
        ws: '',
        msgList: [],
        websocket: null,
        term: "",
      }
    },
    methods: {
      // open terminal
      OpenLog: function(path) {
        var options = {
          // name: "name111",
          // namespace: "ns1",
          // env: "aa",
          // lines: 100,
          // // container:"dsfa",
          // follow: false,
        };
        document.getElementById('terminal-container').innerHTML = '';
        let terminalContainer = document.getElementById('terminal-container')

        if (window.location.protocol === 'https:') {
          var protocol = 'wss://';
        } else {
          var protocol = 'ws://';
        }
        // let endpoint = protocol + window.location.host + this.$store.state.cicd.log_url;
        let endpoint = 'ws://127.0.0.1:5005/'+path
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
        term.on("data", function (data) {
          _websocket.send(JSON.stringify({"tp": "client", "data": data}));
        });
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

      onWindowResize() {
        //console.log("resize")
        this.term.fit(); // it will make terminal resized.
      },

      OpenTerminal: function(path) {
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
        let protocol = 'ws://';
        if (window.location.protocol === 'https:') {
          protocol = 'wss://';
        }
        let endpoint = 'ws://127.0.0.1:3000/'+path
        // let endpoint = 'ws://192.168.21.138:5000/api/kubernetes/pod-terminal.html';
        // console.log('endpoint:', endpoint, this.log_url, window.location.protocol)
        let term = new Terminal({
          // cols: 260,
          // rows: 60,
          useStyle: true,
          cursorBlink: true, // 光标闪烁
          // cursorStyle: "underline", // 光标样式  null | 'block' | 'underline' | 'bar'
          // tabStopWidth: 8, //制表宽度
          fontSize: 18,
          // fontSize: 14,
          lineHeight: 1,
          convertEol: true,
          screenKeys: false,
          scrollback: 5000,   //回滚
          visualBell: false,
          applicationCursor: true, // Needed for proper scrollback behavior in applications like vi
          mouseEvents: true,
        });
        this.term = term
        term.open(terminalContainer)
        // resize_term(term, websocket)

        if(this.websocket===null || this.websocket.readyState!==1){
          this.websocket = new WebSocket(endpoint);//地址
          var _websocket = this.websocket
        }else if(this.websocket && this.websocket.readyState===1){
          this.websocket.close()
          this.websocket = new WebSocket(endpoint);//地址
          _websocket = this.websocket
        }else {return}
        // let websocket = new WebSocket(endpoint);//地址
        term.on("data", function (data) {
          _websocket.send(JSON.stringify({"tp": "client", "data": data}));
        });

        //连接成功
        _websocket.onopen = function (ev) {
          _websocket.send(JSON.stringify({"tp": "init", "data": options}));
          //socket.send(JSON.stringify({"tp": "client", "data": "\r"}));
          term.writeln('Kubernetes Container Terminal...');
          term.writeln('By Ocean...');
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
        _websocket.onerror = function (ev) {
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
          // var innerHeight= c_height
          // var cols= parseInt(c_width / 8) - 2;
          // var rows= parseInt(c_height / 16);
          var cols= parseInt(c_width / 8) - 2;
          var rows= parseInt(c_height / 8);
          //console.log(innerHeight, innerWidth, Height);
          term.resize(cols, rows);
          if(socket){
            socket.send(JSON.stringify({"tp": "resize", "data": {"cols": cols, "rows":rows}}));
          }
        }
        window.onresize = function (ev) {
          if(term && _websocket){resize_term(term, _websocket)}
        }
        // console.log('websocket finish.....')
      },

      send() {
        this.ws.send(this.msg)
        //this.ws.send(JSON.stringify({msg: this.msg}))
        this.msg = ''
      },

      WSCon: function() {
        this.ws = new WebSocket('ws://127.0.0.1:3000/ws')
        // 连接打开时触发
        this.ws.onopen = () => {
          console.log("Connection open ...")
        }
        // 接收到消息时触发
        this.ws.onmessage = (evt) => {
          console.log(evt)
          this.msgList.push(evt.data)
        }
        this.ws.onclose = () => {
          console.log('Connection close !!!')
        }
      },

      WSClose: function() {
        this.websocket.close()
      }
    },
    mounted() {

    },
    comments: {

    },

    // 关闭连接
    beforeDestroy() {
      this.ws.close()
    }
  }
</script>

<style scoped>
  /deep/ .view{
    width: 600px;
    margin: 0 auto;
    background-color:aliceblue;
    height: 500px;
    text-align: center;
    padding-top: 80px;
  }
  /deep/ .chat-title{
    text-align:left;
    margin-left:100px;
    margin-top:50px;
  }
  /deep/ .chat-box{
    background-color: white;
    width: 400px;
    margin: 0 auto;
  }
</style>
