<template>
    <div id="consoleBody" class="xterm" @resize="resize()" />
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

class RetryAttachAddon {
    _socketCreater;
    _terminal;
    socket;
    attachAddon;
    count = 0;
    loading = false;
    constructor (socketCreater) {
        this._socketCreater = socketCreater
    }

    async activate(terminal) {
        this._terminal = terminal
        await this.updateAttachAddon()
        this._terminal.onData((data)=>{
            if (this.socket.readyState > WebSocket.OPEN) {
                this.updateAttachAddon()
            }
        })
    }

    dispose() {
        if (this.attachAddon != null) {
            this.attachAddon.dispose()
            this.attachAddon = null
        }
        if(this.socket!=null){
            this.socket.close()
            this.socket == null
        }
    }

    async updateAttachAddon() {
        if (this.loading){
            return;
        }
        this.loading = true
        this.count++
        this.dispose()
        this.socket = await this._socketCreater()
        window.socket = this.socket
        this.attachAddon = new AttachAddon(this.socket)
        this.attachAddon.activate(this._terminal)
        this.loading = false
    }

}

export default {
    name: 'webconsole',
    data: function(){
        return {
            term : null,
            fitAddon: null,
        }
    },
    mounted : async function() {
        await this.init()
    },
    beforeDestroy() {
        this.term.dispose()
    },
    methods: {
        resize(){
            console.log("resize")
        },
        initTerm() {
            this.term = new Terminal({
                fontSize: 18,
                cursorBlink: true
            });
            window.term = this.term
            const attachAddon = new RetryAttachAddon(async () => await this.createSocket());
            this.fitAddon = new FitAddon();
            this.term.loadAddon(attachAddon);
            this.term.loadAddon(this.fitAddon);
            this.term.open(document.getElementById('consoleBody'));
            this.fitAddon.fit();
            this.term.focus();
        },

        createSocket : function (){
            return new Promise((resolve, reject)=>{
                let socket = new WebSocket(window._env_.webConsoleUrl);
                socket.onopen = () => {
                    socket.send(JSON.stringify({
                        tenantId :localStorage.getItem("originTenantId"),
                        envFlag : this.$route.query.env,
                        namespace : this.$route.query.namespace,
                        pod : this.$route.query.pod,
                        appId : this.$route.query.appId,
                    }))
                    resolve(socket)
                }
            })
        },
        init: function() {
            this.initTerm()
        }
    }
}
</script>
<style>
    .xterm {
        height: calc(100% - 80px);
    }
</style>
