<template>
		<div id="eff-config-sheet">
				<!-- 效能云平台访问一个entry下的两个路由会导致无法切换，在这里手动改路由跳转 -->
		</div>
</template>
<script>
import { loadMicroApp } from 'qiankun';
export default {
		name: "config",
		data : function() {
				return {
						microApp: null,
				};
		},
		created() {
				console.log(this.$router,'----------')
				
				this.$router.replace({ path: "/home-panel/config-sheet/#/home-panel/config-sheet" });
		},
		mounted : function(){
				this.microApp =	loadMicroApp({
						name: 'efficiency-manage-frontend',
						entry: window._env_.efficiencyDevops,
						// entry: "http://10.4.137.177:8090",
						container: '#eff-config-sheet',
						props:{
						
						}
				},{
						sandbox: {
								experimentalStyleIsolation: true,
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
