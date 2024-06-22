<template>
		<div id="eff-test-sheet">
        <!-- 效能云平台访问一个entry下的两个路由会导致无法切换，在这里手动改路由跳转 -->
		</div>
</template>
<script>
import { loadMicroApp } from 'qiankun';
export default {
		name: "test",
		data : function() {
				return {
						microApp: null,
						locationPath: window.location.pathname,
				};
		},
		watch: {
				$route: function(to,form){
						console.log(this.$router,'------')
						if (form.hash === "#/home-panel/config-sheet" || to.hash ===  "#/home-panel/config-sheet"){
								this.$router.replace({ path: "/home-panel/test-sheet#/home-panel/test-sheet" });
						}
				}
		},
		created() {
				console.log(this.$router,'----------',this.locationPath)
				this.$router.replace({ path: "/home-panel/test-sheet#/home-panel/test-sheet" });
		},
		mounted : function(){
				this.microApp =	loadMicroApp({
								name: 'efficiency-manage-frontend',
								entry: window._env_.efficiencyDevops,
								// entry: "http://10.4.137.177:8090",
								container: '#eff-test-sheet',
								props:{
								
								}
						},{
								sandbox: {
										experimentalStyleIsolation: true
										// strictStyleIsolation: true,
								},
						});
				
		},
		
		beforeDestroy() {
				if (this.microApp){
						this.microApp.unmount()
				}
		}
		
}
</script>
<style scoped lang="scss">
/deep/ .el-message-box__header{
		background: white !important;
}
</style>
