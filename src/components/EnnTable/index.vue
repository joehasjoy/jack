<!-- Table表格 -->
<template>
  <el-table ref="table" :data="tableData" stripe style="width: 100%">
    <el-table-column
      :prop="item.prop"
      :label="item.label"
      v-for="(item, index) in tableColumn"
      :key="index"
      :width="item.width || 'auto'"
    >
      <template slot-scope="scope">
        <div v-if="item.prop === 'operationList'" class="flex">
          <el-button
            v-for="(subitem, subIndex) in scope.row.operationList"
            @click="handleOperationClick(scope.row, subitem.value)"
            :disabled="subitem.disable"
            :type="subitem.btnType || 'primary'"
            size="small"
            :key="subIndex"
            :plain="true"
          >
            {{ subitem.name }}</el-button
          >
        </div>
		
		      <span v-else-if="item.slot === true">
						<slot
							:name="item.slotName"
							:row="scope.row"
							:index="scope.$index"
						></slot>
					</span>
        <div class="row" :title="scope.row[item.prop]" v-else>
          {{ scope.row[item.prop] || "-" }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "ennTable",
  props: {
    // table数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // table th数据
    tableColumn: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    handleOperationClick(row, handleType) {
      this.$emit("handleOperationClick", { row: row, handleType: handleType });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

