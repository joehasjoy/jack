<template>
    <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false" size="20%">
        <el-card style="height:100%;overflow: auto;">
            <div slot="header" class="list-card-header">
                <div class="list-card-header-slot"></div>
                <span style="margin-left: 5px">人工卡点</span> &nbsp;
                <i class="el-icon-s-check"></i>
                <el-button class="list-card-header-slot-btn" @click="close" icon="el-icon-close">
                </el-button>
            </div>
            <div style="height:30vh;" v-if="mode == 'check'">
                <el-steps direction="vertical" :active="2">
                    <el-step icon="el-icon-success">
                        <template slot="title">
                            <el-button type="text" size="mini">发起流程审批</el-button>
                        </template>

                    </el-step>
                    <el-step title="审批" icon="el-icon-loading">
                        <span slot="description">
                            待{{checkUser}}审批
                        </span>
                    </el-step>
                    <el-step title="结束"></el-step>
                </el-steps>
            </div>
            <div style="height:30vh;" v-if="mode == 'request'">
                <el-descriptions :column="1" direction="horizontal" border>
                    <el-descriptions-item label="镜像">{{ image }}</el-descriptions-item>
                    <el-descriptions-item label="审批人">{{ checkUser }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-card>
        <div class="drawer-footer" v-if="mode == 'check'">
            <el-button type="primary" icon="el-icon-success" size="small" @click="viewFlow"
                style="width:70%;">查看流程</el-button>
        </div>
        <div class="drawer-footer" v-if="mode == 'request'">
            <el-button type="danger" icon="el-icon-s-promotion" size="small" @click="requestFlow"
                style="width:70%;">发起流程</el-button>
        </div>
    </el-drawer>
</template>

<script>
export default {
    name: "PersonCheck",
    data() {
        return {
            mode: 'request',
            show: false,
            index: 0,
            dataInfo: {},
            param: {}
        }
    },
    computed: {
        image: function () {
            return JSON.parse(this.dataInfo.info.params).buildImage
        },
        branch: function () {
            return "master"
        },
        checkUser: function () {
            return JSON.parse(this.dataInfo.info.params).checkRoleName
        }
    },
    methods: {
        close() {
            this.show = false;
        },
        viewFlow() {
            this.$router.push("/taskCenter");
        },
        requestFlow() {

            this.$confirm("确定发起人工卡点流程吗？", "提示", {
                distinguishCancelAndClose: true,
                cancelButtonText: "关闭",
                confirmButtonText: "发起",
            })
                .then(() => {
                    let url = this.GLOBAL.baseUrl + "/access_control/pipeline/deploy/request";
                    this.$message({ message: "流程发起成功", type: "success" });
                    this.axios({
                        method: 'POST',
                        url: url,
                        data: this.dataInfo
                    }).then(res => {

                    }).catch(err => {

                    })
                })
                .catch((action) => { });
            this.close();
        }
    }
}
</script>

<style lang="scss" scoped>
.list-card-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
}

.list-card-header-slot {
    height: 14px;
    width: 5px;
    background: #1989fa;
}

.list-card-header-slot-btn {
    margin-left: auto;
    padding: 3px 0;
    height: 20px;
    width: 20px;
    border-radius: 20px;
}

.drawer-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 0px;
    padding: 10px;
    border-top: 1px solid #efefef;
}
</style>