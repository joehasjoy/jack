<template>
	<div class="main">
		<el-container>
			<!-- header -->
			<el-header>
				<span>搜索工单（名称）</span>
				<el-input
					v-model="searchMode.name"
					placeholder="请输入"
					clearable
					@keyup.enter.native="SearchSource"
					style="width: 344px; margin-right: 20px"
				>
					<i slot="prefix" class="el-input__icon el-icon-search"></i>
				</el-input>

				<el-button type="primary" @click="SearchSource">查询</el-button>
			</el-header>

			<!--	content  -->
			<div class="title">可申请的工单信息</div>
			<el-main class="list" title="点击申请工单">
				<div class="list flex">

					<div class="item" v-for="(app, index) in apps" :key="index">
						<div class="item-wrap" @click="SearchSecondaryOrder(app.orderType)">
							<div class="img-box">
								<img v-if="app.orderType === 'opsOrder'" src="../../assets/source/4.png"/>
								<img v-if="app.orderType === 'oaOrder'" src="../../assets/source/oaorder.png"/>
							</div>
							<div class="name">{{ app.orderName }}</div>
						</div>
					</div>
				</div>

			</el-main>
		</el-container>
	</div>
</template>

<script>
import Card from '../../components/Card/Card'

export default {
	name: "dashbord",
	components: {Card},
	data() {
		return {
			searchMode: {
				name: "",
			},
			apps: [],
			orders: [],
		};
	},
	methods: {
		SearchSource() {
			this.apps = [];
			let url = this.GLOBAL.baseUrl + "/work/order/get?name=" + this.searchMode.name;
			this.axios({
				method: "GET",
				url: url,
			})
				.then((res) => {
					if (res.status === 200) {
						//所属业务域下拉列表
						res.data.data.forEach((element) => {
							this.apps.push({
								orderType: element.orderType,
								orderName: element.orderName,
							});
						});
						console.log(this.apps)
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		SearchSecondaryOrder(orderType) {
			this.$router.push(
				"/workorder/applyWorkOrder?orderType=" + orderType
			);
		},

		CallBpDesign(secondaryOrder, orderType) {
			this.$router.push(
				"/taskCenter#/zh-CN/personTasks/initiate/detail?appName=" + orderType +
				"&processKey=" +
				secondaryOrder.orderSecondaryType +
				"&processName=" +
				secondaryOrder.orderSecondaryName +
				"&current=1"
			);
		},
		History() {
			this.$router.push("/taskCenter");
		},
	},
	mounted() {
		this.SearchSource();
	},
};
</script>
<style lang="scss" scoped>
.main {
	background-color: #ffffff;
	box-sizing: border-box;
	height: calc(100% - 80px);
	padding: 20px;
	box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
	border-radius: 8px;
	overflow: auto;
}

.list {
	background: #fafafa;
	padding: 20px 10px;
	box-sizing: border-box;
	flex-flow: row wrap;
}

.list .item {
	margin: 0 10px 20px 10px;
	cursor: pointer;
	width: 14%;
}
.list .item:hover {
	-webkit-transform: translateY(-3px);
	-ms-transform: translateY(-3px);
	transform: translateY(-3px);
	-webkit-box-shadow:  0 5px 10px #cdcdcd;
	box-shadow: 0 5px 10px #cdcdcd;
	-webkit-transition: all .2s ease-out;
	transition: all .2s ease-out;
	border-radius: 8px;
}

.list .item .item-wrap {
	background: linear-gradient(33deg, #6CACFF, #8DEBFF);
	//background: #0000000d;
	box-shadow: 0 5px 10px #26448057;
	border-radius: 8px;
	border: 1px solid #c5c8ce59;
}

.list .item .img-box {
	width: 100%;
	padding-top: 35px;
	margin-bottom: 25px;
	text-align: center;
}

.list .item .img-box img {
	width: 100px;
	height: 100px;
}

.list .item .name {
	font-size: 14px;
	color: #333;
	font-weight: bold;
	padding-bottom: 22px;
	text-align: center;
}

.list .item .btn-box {
	background: #0D53FC;
	padding: 15px 20px;
	border-radius: 0 0 8px 8px;
	color: white;
	font-size: 12px;
	cursor: pointer;
}

.title {
	margin-top: 40px;
	color: 3333;
	font-weight: bold;
	font-size: 14px;
	margin-bottom: 20px;
}
</style>

