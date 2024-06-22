<template>
	<div>
		<el-card class="box-card" :shadow="shadow">
			<div slot="header" class="clearfix" v-if="title">
				<span>{{ title }}</span>
				<span style="float: right; padding: 3px 0">
					<slot name="header-right" style="float: right; padding: 3px 0">
					</slot>
				</span>
			</div>
			<div>
				<slot name="content"></slot>
			</div>
		</el-card>

	</div>
</template>

<script>
export default {
	name: "Card",
	props: {
		title: {
			default: '',
		},
		shadow:{
			default: 'always',
		}
	},
	computed: {},
}
</script>

<style lang="scss" scoped>
.box-card {
	border-radius: 8px;
	padding: 0 5px;
	margin-bottom: 10px;
}
/deep/ .el-card__body{
	padding: 0px 10px 30px 10px;
}
.clearfix {
	height: 36px;
	line-height: 28px;
}

/deep/ .el-card__header {
	padding: 10px;
	border: none;
}
</style>