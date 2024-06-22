<template>
    <div class="main flex-column">
        <el-page-header @back="goBack" :content="content"> </el-page-header>
        <div class="panel-tab">

            <el-card style="margin: 10px">
                <el-form ref="form" :model="config" label-width="120px">
                    <el-form-item label="全部应用接入">
                        <el-switch @change="changeEnableNotice($event, item)" v-model="config.isAll"></el-switch>
                    </el-form-item>
                    <el-form-item label="指定应用接入" v-show="!config.isAll">
                        <el-select style="width:100%" v-model="config.injectApps" filterable placeholder="请输入应用ID"
                            multiple>
                            <el-option v-for="(i, index) in apps" :key="index" :label="i.code" :value="i.id * 1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="onSubmit(item)">更新配置</el-button>
                    </el-form-item>
                    <el-alert title="注意" type="warning" show-icon>
                        <template v-slot="description">
                            <p>1、如果全部应用接入启动，指定应用接入无效 </p>
                            <p>2、指定应用接入仅未启用全部应用有效</p>
                        </template>

                    </el-alert>
                </el-form>

            </el-card>

        </div>

    </div>
</template>

<script>
import moment from "moment";
import {
    v4 as uuidv4
} from 'uuid';
import {
    queryEnvs
} from "@/api/black_list"
export default {
    data() {
        return {
            loading: false,
            uuid: undefined,
            templateName: undefined,
            id: undefined,
            status: undefined,
            apps: [],
            config: {
                injectApps: [],
                isAll: false
            }

        };
    },
    created: function () {
        this.uuid = this.common.getUrlKey("uuid");
        this.id = this.common.getUrlKey("id");
        this.status = this.common.getUrlKey("status");
        this.templateName = this.common.getUrlKey("templateName");
        this.content = this.templateName + "应用配置"
        this.loadApp();
    },
    components: {},
    methods: {
        loadPipelineDetail() {
            let url = this.GLOBAL.baseUrl + "/access_control/pipeline/" + this.uuid;
            this.axios({
                method: "get",
                url: url
            }).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data.appIds!="") {
                        this.config.injectApps = res.data.data.appIds.split(",")
                        this.config.injectApps = this.config.injectApps.map(u => Number(u))
                    }else{
                        this.config.injectApps=[]
                    }
                    this.config.isAll = res.data.data.allowAll == '0' ? false : true
                } else {
                    this.$message.error("加载失败");
                }
            }).catch(err => {
                console.log(err)
            })
        },
        loadApp() {
            let url = this.GLOBAL.baseUrl + "/access_control/pipeline/loadAllApps";
            this.axios({
                method: "get",
                url: url
            }).then(res => {
                if (res.data.code == 200) {
                    this.apps = res.data.data
                    console.log(this.apps)
                    this.loadPipelineDetail()
                } else {
                    this.$message.error("应用信息加载失败");
                }
            }).catch(err => {
                console.log(err)
            })
        },
        goBack: function () {
            window.history.back();
        },
        onSubmit() {
            this.loading = true
            this.axios({
                method: "POST",
                url: this.GLOBAL.baseUrl + "/access_control/pipeline/update",
                data: {
                    id: this.id,
                    status: this.status,
                    allowAll: this.config.isAll ? "1" : "0",
                    appIds: this.config.injectApps.join(",")
                }
            }).then(res => {
                this.loading = false
                if (res.data.code == 200) {
                    this.$message.success("操作成功")
                    this.GetTableList();
                }
            }).catch(err => {
                console.log(err)
                this.loading = false
            })
        }
    }
};
</script>

<style scoped>
.main {
    height: calc(100% - 80px);
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.panel-tab {
    flex: 1;
    margin-top: 10px;
    overflow-y: auto;
}
</style>
