<template>
	<div class="main">
		<el-page-header @back="goBack" content="工单列表">
		</el-page-header>

		<el-container>
			<!--	content  -->
			<el-main class="list" title="点击发起工单">
				<div class="list flex">

					<div class="item" v-for="(order, index) in orders" :key="index">
						<div class="item-wrap" @click="CallBpDesign(order)">
							<div class="img-box">
								<img src="../../assets/source/3.png"/>
							</div>
							<div class="name">{{ order.orderSecondaryName }}</div>
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
	name: "applyWorkOrder",
	components: { Card },
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
		goBack(){
			this.$router.push(
				"/workorder/workorder"
			);
		},
		SearchSource() {
			this.orders = [];
			let url = this.GLOBAL.baseUrl + "/work/order/get/secondary?orderType=" + this.$route.query.orderType;
			this.axios({
				method: "GET",
				url: url,
			})
				.then((res) => {
					if (res.status === 200 && res.data.data !== undefined) {
						//所属业务域下拉列表
						res.data.data.forEach((element) => {
							this.orders.push({
								orderSecondaryType: element.processKey,
								orderSecondaryName: element.processName,
							});
						});
						console.log(this.orders)
					} else {
						this.$message('请联系该工单管理员进行配置');
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		CallBpDesign(secondaryOrder) {
			this.$router.push(
				"/taskCenter#/zh-CN/personTasks/initiate/detail?appName=" + this.$route.query.orderType +
				"&processKey=" +
				secondaryOrder.orderSecondaryType +
				"&processName=" +
				secondaryOrder.orderSecondaryName +
				"&current=1"
			);
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
	-webkit-box-shadow: 0 0 6px #2644807d;
	box-shadow:0 5px 10px 0 #cdcdcd;
	-webkit-transition: all .2s ease-out;
	transition: all .2s ease-out;
	border-radius: 8px;
}

.list .item .item-wrap {
	background: linear-gradient(33deg, #6CACFF, #8DEBFF);
	//background: #0000000d;
	box-shadow: 0 5px 10px #26448021;
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

