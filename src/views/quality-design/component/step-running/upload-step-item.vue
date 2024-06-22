<template>
    <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false" size="20%">
        <el-card style="height:100%;overflow: auto;">
            <div slot="header" class="list-card-header">
                <div class="list-card-header-slot"></div>
                <span style="margin-left: 5px">测试报告上传</span> &nbsp;
                <i class="el-icon-document"></i>
                <el-button class="list-card-header-slot-btn" @click="close" icon="el-icon-close">
                </el-button>
            </div>
            <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div class="drawer-footer">
                <el-button type="primary" size="small" @click="saveCurrentStep">保存</el-button>
                <el-button size="small" style="margin-left:60px;">取消</el-button>
            </div>
    
        </el-card>
    </el-drawer>
</template>

<script>
export default {
    name: "TestReport",
    data() {
        return {
            show: false,
            fileList:[],
            branchOptions: ["release-test", "release-prod"],
            index: 0,
            form: {
                name: '',
            }
        }
    },
    methods: {
        close() {
            this.show = false;
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },
        submitUpload(){

        },
        handlePreview(){

        },
        handleRemove(){

        },
        saveCurrentStep() {
            this.$message({ message: "保存成功", type: "success" });
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