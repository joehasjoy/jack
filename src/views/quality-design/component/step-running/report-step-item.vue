<template>
    <el-drawer :visible.sync="show" direction="rtl" :with-header="false" :modal="false" size="20%">
        <el-card style="height:100%;overflow: auto;">
            <div slot="header" class="list-card-header">
                <div class="list-card-header-slot"></div>
                <span style="margin-left: 5px">报告详情</span> &nbsp;
                <i class="el-icon-document"></i>
                <el-button class="list-card-header-slot-btn" @click="close" icon="el-icon-close">
                </el-button>
            </div>
            <el-empty style="margin-top: 30vh;" description="无内容"></el-empty>
           
        </el-card>
    </el-drawer>
</template>

<script>
export default {
    name: "TestReport",
    data() {
        return {
            show: false,
            branchOptions: ["release-test", "release-prod"],
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
    justify-content: center;
    align-items: center;
    margin-bottom: 0px;
    padding: 10px;
    border-top: 1px solid #efefef;
}
</style>