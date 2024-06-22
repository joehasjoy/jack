<template>
    <el-dialog title="日志" :visible.sync="dialogVisible" width="80%">
        <div class="message_plain" id="msg_end" style="overflow: auto; height: 70vh">
            <pre style=" white-space: pre-wrap;
                          word-wrap: break-word;
                          background: #333;
                          color: white;
                        ">{{ logContent }}</pre>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "PipeLineLog",
    data() {
        return {
            dialogVisible: false,
            logContent: ""
        };
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>
.message_plain {
    height: 450px;
    overflow: auto;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    margin: 0px;
    padding: 0px;
}
</style>
