<template>
    <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false" size="20%">
        <el-card style="height:100%;overflow: auto;">
            <div slot="header" class="list-card-header">
                <div class="list-card-header-slot"></div>
                <span style="margin-left: 5px">指定文件上传</span>
                <el-link :underline="false" @click="removeStep">
                    <el-tooltip content="点击删除" placement="right">
                        <i class="el-icon-delete"></i>
                    </el-tooltip>
                </el-link>
                <el-button class="list-card-header-slot-btn" @click="close" icon="el-icon-close">
                </el-button>
            </div>
            <el-form ref="form" :model="form" label-position="top" label-width="80px">
                <el-form-item label="文件名称" :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur' }]">
                    <el-input v-model="form.name"  placeholder="请输入需要用户上传的文件名" clearable></el-input>
                </el-form-item>
                <div class="drawer-footer">
                    <el-button type="primary" size="small" @click="saveCurrentStep">保存</el-button>
                    <el-button size="small" style="margin-left:80px;">取消</el-button>
                </div>
            </el-form>
        </el-card>
    </el-drawer>
</template>

<script>

export default {
    name: "StepUploadItem",
    data() {
        return {
            show: false,
            index:0,
            form: {
                name: '',
            }
        }
    },
    methods: {
        close() {
            this.show = false;
        },
        removeStep() {
            var data={
                index:this.index,
                step:this.form
            }
            this.$emit("RemoveStep", data);
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
    justify-content:center;
    align-items: center;
    margin-bottom: 0px;
    padding: 10px;
    border-top: 1px solid #efefef;
}
</style>