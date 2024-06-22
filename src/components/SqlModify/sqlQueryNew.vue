<template>
	<div class="main">
		<el-container style="height: 100%;border: 1px solid #eee">
			<el-aside width="350px" style="background-color: rgb(238, 241, 246);position: relative">
				<div class="left">
					<span class="left_title">可访问数据库列表</span>
					
					<div class="left_data_table"
					     v-loading="loadingMenu"
					     element-loading-text="拼命加载中"
					     element-loading-spinner="el-icon-loading"
					     element-loading-background="rgba(0, 0, 0, 0.5)"
					>
						<ul v-for="(datas,i) in treeDatas" class="parent-class" :key="'env'+i">
							<li>
								<svg-icon icon-class="jurassic"/>
								<span class="parent-class-span" @click="envClick(datas,i)" ref="envCK">
									{{ datas.label }}
									<i :class="datas.envExpanded?'el-icon-arrow-down':'el-icon-arrow-up'" style="float: right;
    line-height: 45px;
    font-size: 20px;
    padding-right: 20px;color: #999"></i>
								</span>
								
								
								<transition name="fade">
										<span class="children-class" :key="'db'+i" v-show="datas.envExpanded"
										      style="transition: opacity .25s">
											<span v-if="datas.dbCount>0">
												<el-input
													v-model="datas.inputDBText"
													@input="dbInputChange(datas,i, datas.inputDBText)"
													placeholder="快速检索库名"
													clearable
													:key="i"
												>
												<i slot="prefix" class="el-input__icon el-icon-search"></i>
											</el-input>
											</span>
											<span v-if="datas.children.length">
												
												<ul v-for="(ch,ind) in datas.children">
														<li>
															<svg-icon icon-class="shujuku"/>
															<span class="children-class-span" :id="datas.label+ind"
															      @click="dbClick(ch,ind,datas.label+ind)" ref="dbCK">
																{{ ch.label }}
																<i :class="ch.dbExpanded?'el-icon-arrow-down':'el-icon-arrow-up'" style="float: right;
		    line-height: 45px;
		    font-size: 18px;
		    padding-right: 20px;color: #999"></i>
															</span>
															
															<!-- 三级菜单 -->
															<transition name="fade" v-loading="loadingTBMenu"
															            element-loading-text="拼命加载中"
															            element-loading-spinner="el-icon-loading"
															            element-loading-background="rgba(0, 0, 0, 0.5)">
																<span class="children-class children3" :key="'db'+i" v-show="ch.dbExpanded">
																	<span v-if="ch.children">
																		<el-input
																			v-model="ch.inputTBText"
																			@input="tbInputChange(ch, ind, ch.inputTBText)"
																			placeholder="快速检索表名"
																			clearable
																			:key="ind"
																		>
																		<i slot="prefix" class="el-input__icon el-icon-search"></i>
																	</el-input>
																	</span>
																	
																	<span v-if="ch.children && ch.children.length">
																		<ul v-for="(ch2,ind2) in ch.children">
																				<li>
																					<svg-icon icon-class="list(1)"/>
																					<span class="children-children-class-span" :id="datas.label+ch2.label+ind2"
																					      @click="tbClick(ch,ch2,ind2, datas.label+ch2.label+ind2)" ref="tbCK">
																						{{ ch2.label }}
																					</span>
																					
																				</li>
																		</ul>
																		</span>
																</span>
																<span v-if="ch.children && ch.children.length==0" style="color: #999">没有查询到数据</span>
															</transition>
															
														</li>
												</ul>
											</span>
										</span>
								</transition>
							</li>
						</ul>
					</div>
				</div>
				
				<div class="left_data_info">
					<el-table :data="leftDataInfo" :show-header="false" :stripe="true">
						<el-table-column prop="name" width="120">
							<template slot-scope="scope">
								<span v-if="scope.row.name==='当前库名'">
										<svg-icon icon-class="shujuku"/>
										{{ scope.row.name }}
								</span>
								<span v-if="scope.row.name==='当前表名'">
										<svg-icon icon-class="list(1)"/>
												{{ scope.row.name }}
								</span>
								<span v-if="scope.row.name==='当前环境'">
										<svg-icon icon-class="jurassic"/>
												{{ scope.row.name }}
								</span>
								<span v-if="scope.row.name==='授权有效期'">
									<svg-icon icon-class="time2"/>
									{{ scope.row.name }}
							</span>
								<span v-if="scope.row.name==='MySQL版本'">
									<svg-icon icon-class="tan"
									          style="font-size: 20px"/>
									{{ scope.row.name }}
							</span>
								<span v-if="scope.row.name==='属性信息'">
									<svg-icon icon-class="tan"
									          style="font-size: 20px"/>
									{{ scope.row.name }}
							</span>
							</template>
						</el-table-column>
						<el-table-column prop="value" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.value==='info'">
										<el-button
											size="mini"
											type="text"
											@click="lookInfo(scope.$index, scope.row)">点击查看
										</el-button>
								</span>
								
								<span v-else-if="scope.row.name==='当前表名'">
									<strong>
											{{ scope.row.value }}
									</strong>
								</span>
								
								<span v-else-if="scope.row.name==='当前环境'">
										<strong style="color: red">
												{{ scope.row.value.toUpperCase() }}
										</strong>
								</span>
								<span v-else>
									{{ scope.row.value }}
								</span>
							
							</template>
						</el-table-column>
					
					</el-table>
				
				</div>
			
			</el-aside>
			
			<el-container>
				<el-header class="right_header">
					<div class="right_top">
						<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" :stretch="true">
							<!-- <el-tab-pane label="在线数据查询" name="first"></el-tab-pane>-->
							<!-- <el-tab-pane label="新增数据库权限" name="second" disabled></el-tab-pane>-->
							<el-tab-pane label="我的常用SQL语句" name="third">
														 <span slot="label">
																 <svg-icon icon-class="xin1" v-if="activeName==='third'"></svg-icon>
																 <svg-icon icon-class="xin" v-else></svg-icon>
																 我的常用SQL语句
														 </span>
							</el-tab-pane>
							<!-- <el-tab-pane label="查询历史SQL" name="fourth"></el-tab-pane>-->
						</el-tabs>
					</div>
				
				
				</el-header>
				
				<el-main v-if="activeName === 'third' || activeName === '' || search_SQL_Form.length > 0"
				         class="search_form">
					<el-tabs v-model="editableTabsValue" type="border-card"
					         :editable="activeName!=='third'"
					         :closable="activeName!=='third'"
					         @edit="tabsEdit"
					         @tab-click="searchSentenceTabClick">
						<el-tab-pane
							v-for="(item, index) in search_SQL_Form"
							:key="index+''"
							:label="'数据查询'+ (index+1)"
							:name="index+''"
						>
							<!--														<span slot="label">
																							<el-button type="text" size="mini" plain icon="el-icon-document-copy"
																												 @click="copyDomain(leftDataInfo[1].value)"></el-button>
																							
																							 {{ leftDataInfo[1].value }}{{ index + 1 }}
																					 </span>-->
							
							<el-form ref="sql_modify" :model="item" label-position="left"
							         style="margin: 25px 30px" :rules="rules">
								<el-form-item prop="sql" class="content">
									<!-- 先隐藏行数 -->
									<!--	<div id="leftBox">

																			<textarea class="leftNum_text" :ref="'row'+index" wrap="off" cols="2"
																				          :id="'leftNum'+index"
																				          v-model="item.num"
																				          disabled></textarea>
									</div>-->
									<el-input prop="sql" type="textarea" :ref="'textarea'+index" rows="10" clearable
									          v-model="item.querySql"
									          placeholder="请输入SQL脚本" @input="handleTextareaInput"
									          :id="'textarea'+index"
									></el-input>
								</el-form-item>
								
								<el-form-item style="margin-top: 30px">
									<el-button
										:autofocus="false"
										@click="beautySql(item.querySql,index)">
										<svg-icon class="svg-magic" icon-class="line-magic"/>
										&nbsp;&nbsp;一键美化SQL
									</el-button>
									
									<el-button :loading="checkBtnStatus" type="primary" icon="el-icon-video-play"
									           @click="querySqlSubmit(item)" style="margin-left: 30px">执行查询
									</el-button>
								
								</el-form-item>
							</el-form>
						</el-tab-pane>
					</el-tabs>
					
					<div class="table_title" v-show="querySQL_tables.length>0">
												<span>
														<svg-icon icon-class="list(1)"/>
															 <strong>
																	 {{ querySQL_listName }}
															 </strong>
												</span>
						
						<span style="float: right;">
														<svg-icon icon-class="tan"/>
																查询用时
																<strong>{{ querySQL_times }}
																		ms</strong>
												</span>
					</div>
					
					<el-table
						size="mini"
						:header-cell-style="{background:'#d1deed'}"
						:header-row-style="{background:'red'}"
						:data="querySQL_tables.slice((currentPage - 1) * pageSize,  currentPage * pageSize)"
						stripe
						border
						:fit="true"
						max-height="800"
						style="width: 100%">
						<el-table-column v-for="item in querySQL_columns"
						                 :prop="item"
						                 :label="item"
						                 :key="item"
						                 :align="item==='node_ip' ? 'left' : 'center'"
						                 :width="flexColumnWidth(item,querySQL_tables)"
						>
						</el-table-column>
					</el-table>
					
					
					<div class="block" v-if="querySQL_tables.length>0">
												<span>结果总条数
														<strong>{{ querySQL_tables.length }}</strong>
														条</span>
						<span>
															<el-pagination
																@size-change="handleSizeChange"
																@current-change="handleCurrentChange"
																:current-page="currentPage"
																:page-sizes="[5,10, 20, 50, 100]"
																:page-size="pageSize"
																layout=" sizes, prev, pager, next, jumper"
																:total="querySQL_tables.length">
												</el-pagination>
												</span>
					
					</div>
				
				</el-main>
			</el-container>
		</el-container>
		
		
		<el-dialog
			title="属性信息"
			:visible.sync="dialogVisible"
			width="50%"
			max-height="500px"
			:before-close="handleClose" class="dialog_info">
			
			<el-tabs type="border-card" v-model="dialogActiveName" @tab-click="dialogTabClick">
				<el-tab-pane label="常规" name="1">
									<span v-if="queryInfoParams.tbName instanceof Array && queryInfoParams.tbName.length > 1">
													<el-table
														:header-cell-style="{background:'#f5f7fa'}"
														v-loading="loading"
														:data="multiple_DialogResponse"
														stripe
														border
														max-height="500"
														style="width: 100%">
														<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
														<el-table-column label="表名称" width="200" prop="Name" align="center"></el-table-column>
														<el-table-column label="数据库" width="180" align="center">
																<template slot-scope="scope">
																		{{ queryInfoParams.dbname }}
																</template>
														</el-table-column>
														<el-table-column label="总行数" width="180" prop="Rows" align="center"></el-table-column>
														<el-table-column label="引擎" width="100" prop="Engine" align="center"></el-table-column>
														<el-table-column label="自动递增数值" width="120" prop="Auto_increment"
														                 align="center"></el-table-column>
														<el-table-column label="行格式" width="150" prop="Row_format"
														                 align="center"></el-table-column>
														<el-table-column label="创建日期" width="200" prop="Create_time"
														                 align="center"></el-table-column>
														<el-table-column label="索引长度" width="150" prop="Index_length"
														                 align="center"></el-table-column>
														<el-table-column label="默认字符集" width="200" prop="Collation"
														                 align="center"></el-table-column>
														<el-table-column label="注释" prop="Comment" align="center"></el-table-column>
													</el-table>
										</span>
					
					<span v-else>
												<div class="content">
														<span>表名称</span>
														<span>{{ dialogInfoData.Name }}</span>
												</div>
												<div class="content">
														<span>数据库</span>
														<span>{{ queryInfoParams.dbname }}</span>
												</div>
												<div class="content">
														<span>总行数</span>
														<span>{{ dialogInfoData.Rows }}</span>
												</div>
												<div class="content">
														<span>引擎</span>
														<span>{{ dialogInfoData.Engine }}</span>
												</div>
												<div class="content">
														<span>自动递增数值</span>
														<span>{{ dialogInfoData.Auto_increment }}</span>
												</div>
												<div class="content">
														<span>行格式</span>
														<span>{{ dialogInfoData.Row_format }}</span>
												</div>
												<div class="content">
														<span>创建日期</span>
														<span>{{ dialogInfoData.Create_time }}</span>
												</div>
												<div class="content">
														<span>索引长度</span>
														<span>{{ dialogInfoData.Index_length }}</span>
												</div>
												<div class="content">
														<span>默认字符集</span>
														<span>{{ dialogInfoData.Collation }}</span>
												</div>
												<div class="content">
														<span>注释</span>
														<span>{{ dialogInfoData.Comment }}</span>
												</div>
										</span>
				
				</el-tab-pane>
				<el-tab-pane label="DDL" name="2">
										<span v-if="queryInfoParams.tbName instanceof Array && queryInfoParams.tbName.length > 1">
													<el-table
														:header-cell-style="{background:'#f5f7fa'}"
														v-loading="loading"
														:data="multiple_DialogResponse"
														stripe
														border
														max-height="500"
														style="width: 100%">
														<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
														<el-table-column label="应用表" width="200" prop="Table" align="center"></el-table-column>
														<el-table-column label="语句" prop="CreateTable" align="center"></el-table-column>
													</el-table>
										</span>
					<span v-else>
												<div class="content">
												<span>应用表</span>
												<span>{{ dialogInfoData.Table }}</span>
												</div>
												<div class="content">
														<span>语句</span>
														<span>
																<el-input
																	type="textarea"
																	:autosize="{ minRows: 10, maxRows: 10}"
																	v-model="dialogInfoData.CreateTable">
																</el-input>
														</span>
												</div>
										</span>
				
				</el-tab-pane>
				<el-tab-pane label="索引" name="3">
					<el-table
						:header-cell-style="{background:'#f5f7fa'}"
						v-loading="loading"
						:data="queryInfoParams.tbName instanceof Array && queryInfoParams.tbName.length > 1 ? multiple_DialogResponse : dialogInfoData_list"
						stripe
						border
						max-height="500"
						style="width: 100%">
						<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
						<el-table-column label="表名" width="200" prop="Table" align="center"></el-table-column>
						<el-table-column label="索引类型" prop="Index_type" align="center"></el-table-column>
						<el-table-column label="索引名称" width="180" prop="Key_name" align="center"></el-table-column>
						<el-table-column label="索引列" width="100" prop="Collation" align="center"></el-table-column>
						<el-table-column label="索引列名称" width="120" prop="Column_name" align="center"></el-table-column>
						<el-table-column label="索引列在索引的位置" width="150" prop="Seq_in_index"
						                 align="center">
						</el-table-column>
						<!-- 0表示该索引是唯一索引，1表示该索引不是唯一索引 -->
						<el-table-column label="是否唯一" prop="Non_unique" align="center">
							<template slot-scope="scope">
								<el-tag v-if="scope.row.Non_unique=='0'">是</el-tag>
								<el-tag type="warning" v-else>否</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="是否可为空" width="180" prop="Null" align="center">
							<template slot-scope="scope">
								<el-tag v-if="scope.row.Null=='YES'">{{ scope.row.Null }}</el-tag>
								<el-tag type="warning" v-else>{{ !scope.row.Null ? '-' : scope.row.Null }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="注释" width="200" prop="Comment" align="center">
							<template slot-scope="scope">
								{{ scope.row.Comment }}
								{{ scope.row.Index_comment }}
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="函数" name="4" disabled>函数</el-tab-pane>
				<el-tab-pane label="存储过程" name="5" disabled>存储过程</el-tab-pane>
				<el-tab-pane label="视图" name="6" disabled>视图</el-tab-pane>
			</el-tabs>
		
		</el-dialog>
	
	</div>
</template>
<script>

import sqlFormatter from "sql-formatter";
import {queryLibraryTables, queryDataBySql} from "@/api/SqlModify"
import JSONbig from 'json-bigint'
import {
	copyHandle
} from "@/utils/utils.js";

export default {
	name: "sqlModify",
	data() {
		return {
			inputDBText: '',
			inputTBText: '',
			placeholder: '请选择库或者表进行关键字检索',
			filterText: '',
			treeDatas_source: [],
			treeDatas: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			loadingMenu: false,
			loadingTBMenu: false,
			num: '1',
			multiple_DialogResponse: [],
			dialogVisible: false,
			dialogActiveName: '1',
			dialogInfoData: {},
			dialogInfoData_list: [],
			defaultOpeneds: ['0', '0-0'],
			menuDefaultOpeneds: '0-0-0',
			leftDataInfo: [{
				name: '当前库名',
				value: '-'
			}, {
				name: '当前表名',
				value: '-'
			}, {
				name: '当前环境',
				value: '-'
			}, {
				name: '授权有效期',
				value: '90天'
			}, {
				name: 'MySQL版本',
				value: '5.7.27'
			}, {
				name: '属性信息',
				value: 'info'
			}],
			queryInfoParams: {},
			activeName: '',
			leftDBList: [],
			leftDB_table_List: [],
			editableTabsValue: '0',
			editableTabs: [{
				title: '数据查询',
				name: '1',
				sql: ''
				
			}],
			frequentlyUsedSQL_list: [],  // 常用的sql list
			search_SQL_Form: [{
				querySql: '',
				num: null,
			}], // 需要查询的sql list
			querySQL_columns: [],
			querySQL_tables: [],
			querySQL_times: '0',
			querySQL_listName: '',
			currentPage: 1,
			pageSize: 5,
			loading: false,
			checkStatusIcon: "",
			checkBtnStatus: false,
			rules: {
				sql: [{
					required: false,
					message: "请输入需要执行SQL",
					trigger: "blur"
				},],
			},
			
			
			searchTable: [],
			checkMsg: "",
			canRequest: false,
			sql_modify: {
				appId: "",
				envFlag: "",
				dbName: "",
				host: "",
				sql: "",
			},
			defaultCheckedKeys: [],
			defaultExpandedKeys: [],
			clickTreeNodeId: '',
			clickTreeNodeLevel: '',
			treeId: '',
			idClass: '',
		};
	},
	mounted() {
		this.loadMain()
		this.handleTextareaInput()
		
		// 设置第一个行数的滚动
		this.$nextTick(() => {
			this.$refs.textarea0[0].$el.children[0].addEventListener('scroll', () => {
				this.$refs.row0[0].scrollTop = this.$refs.textarea0[0].$el.children[0].scrollTop
			});
		})
		
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		},
		defaultCheckedKeys(newVal, oldVal) {
			console.log(newVal, oldVal, '--==')
		},
	},
	
	methods: {
		dbInputChange(data, i, val) {
			this.treeDatas_source[i].inputDBText = val
			this.treeDatas = JSON.parse(JSON.stringify(this.treeDatas_source))
			this.treeDatas.forEach((item1, ind) => {
				if (data.label === item1.label) {
					let arr = []
					item1.children.map((item2, index) => {
						if (item2.label.indexOf(val) != -1) {
							arr.push(item2)
						}
					})
					item1.children = arr
				}
			})
			
			console.log(this.treeDatas, 'treeDatas')
		},
		
		tbInputChange(data, i, val) {
			this.treeDatas_source.forEach(item1 => {
				item1.children.forEach(item2 => {
					if (item2.appId === data.appId && data.label == item2.label) {
						item2.inputTBText = val
					}
				})
			})
			
			this.treeDatas = JSON.parse(JSON.stringify(this.treeDatas_source))
			
			this.treeDatas.forEach((item1, ind) => {
				// console.log(item1, '----444-')
				item1.children.forEach((item2, index) => {
					if (data.appId === item2.appId && data.label == item2.label) {
						let arr = []
						console.log(item2, '----444-')
						if (item2.children) {
							item2.children.forEach((item3, i) => {
								if (item3.label.indexOf(val) != -1) {
									arr.push(item3)
								}
							})
							item2.children = arr
						}
					}
					
				})
			})
			
			console.log(this.treeDatas_source, 'treeDatas')
		},
		
		envClick(data, i) {
			console.log(data, i)
			data.envExpanded = !data.envExpanded
			
			let refEnv = this.$refs.envCK
			refEnv.forEach((item, index) => {
				if (i == index) { //对比索引，这样就不会所有的元素都修改了
					item.style.background = "#e4a36ca8";
					item.style.color = "#303133";
				} else {
					item.style.background = "";
					item.style.color = "";
				}
			})
			if (this.idClass) {
				this.idClass.style.background = "";
				this.idClass.style.color = "";
			}
			
		},
		
		dbClick(data, i, idName) {
			
			data.dbExpanded = !data.dbExpanded
			let refEnv = this.$refs.envCK
			refEnv.forEach((item, index) => {
				item.style.background = "";
				item.style.color = "";
				
			})
			let dom = document.getElementById(idName)
			if (this.idClass === document.getElementById(idName)) {
			} else {
				if (this.idClass && this.idClass !== document.getElementById(idName)) {
					this.idClass.style.background = "";
					this.idClass.style.color = "";
				}
			}
			this.idClass = dom
			dom.style.background = "#e4a36ca8";
			dom.style.color = "#303133";
			
			//------------------
			let current = data
			// 点击的是库
			if (current.appId) {
				this.querySQL_tables = []
				this.querySQL_columns = []
				
				if (current.children && current.children.length > 0) {
					return false
				}
				this.queryDBTableList({
					"cluster_ip": current.ip,
					"dbname": current.dbName,
					"appId": current.appId,
				})
			}
		},
		
		tbClick(data, data2, i, idName) {
			let domFirst = document.getElementsByClassName('children-children-class-span')[0]
			domFirst.style.background = "";
			domFirst.style.color = "";
			
			let dom = document.getElementById(idName)
			if (this.idClass === document.getElementById(idName)) {
			} else {
				if (this.idClass && this.idClass !== document.getElementById(idName)) {
					this.idClass.style.background = "";
					this.idClass.style.color = "";
				}
			}
			this.idClass = dom
			dom.style.background = "#e4a36ca8";
			dom.style.color = "#303133";
			
			
			//------------------
			let current = data
			// 如果点击的是表
			this.activeName = "" // 清空顶部选择的tab
			this.querySQL_tables = []
			this.querySQL_columns = []
			this.search_SQL_Form = [{
				querySql: `select * from ${data2.label}`,
				num: 1,
			}]
			this.editableTabsValue = this.search_SQL_Form.length - 1 + ''
			
			// 渲染左下属性信息
			if (current.dbName !== this.leftDataInfo[0].value) {
				this.leftDataInfo[1].value = '-'
			}
			this.leftDataInfo[1].value = data2.label
			this.leftDataInfo[0].value = current.dbName
			this.leftDataInfo[2].value = current.env
			
			// 处理查询详情信息的参数
			this.queryInfoParams.tbName = data2.label
			this.queryInfoParams.dbname = current.dbName
			this.queryInfoParams.cluster_ip = current.ip
			this.queryInfoParams.appId = current.appId
		},
		// 复制服务域名
		copyDomain(name) {
			copyHandle(name, this);
		},
		
		handleTextareaInput(e) {
			if (e === undefined) {  // 首次调用是 undefined 避免报错
				return
			}
			let str = e
			str = str.replace(/\r/gi, "");
			str = str.split("\n");
			let n = str.length;
			this.search_SQL_Form.forEach((itemSql, index) => {
				
				itemSql.num = null;
				if (e == itemSql.querySql) {
					
					
					let num = 0;
					for (let i = 1; i <= n; i++) {
						if (document.all) {
							num = `${num + i}\r\n`;
							
						} else {
							num = `${num + i}\n`;
						}
					}
					itemSql.num = num
				}
			})
		},
		
		// 自适应表格列宽
		flexColumnWidth(str, arr1, flag = 'max') {
			// flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
			str = str + ''
			let columnContent = ''
			if (!arr1 || !arr1.length || arr1.length === 0) {
				return
			}
			if (!str || !str.length || str.length === 0) {
				return
			}
			if (flag === 'equal') {
				// 获取该列中第一个不为空的数据(内容)
				for (let i = 0; i < arr1.length; i++) {
					if (arr1[i][str].length > 0) {
						columnContent = arr1[i][str]
						break
					}
				}
			} else {
				// 获取该列中最长的数据(内容)
				let index = 0
				for (let i = 0; i < arr1.length; i++) {
					if (arr1[i][str] === null) {
						return
					}
					const now_temp = arr1[i][str] + ''
					const max_temp = arr1[index][str] + ''
					if (now_temp.length > max_temp.length) {
						index = i
					}
				}
				columnContent = arr1[index][str]
			}
			// console.log('该列数据[i]:', columnContent)
			// 以下分配的单位长度可根据实际需求进行调整
			let flexWidth = 0
			if (columnContent) {
				for (const char of columnContent) {
					if ((char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z')) {
						flexWidth += 1
					} else if (!(char >= 'A' && char <= 'Z') && (char >= 'a' && char <= 'z')) {
						// 如果是小写英文字符，为字符分配8个单位宽度
						flexWidth += 14
					} else if (char >= '\u4e00' && char <= '\u9fa5') {
						// 如果是中文字符，为字符分配15个单位宽度
						flexWidth += 20
					} else {
						// 其他种类字符，为字符分配8个单位宽度
						flexWidth += 12
					}
				}
			}
			
			if (flexWidth < 80) {
				// 设置最小宽度
				flexWidth = 180
			}
			return flexWidth + 'px'
		},
		
		dialogTabClick(val) {
			this.dialogInfoData = []
			this.dialogInfoData_list = []
			this.multiple_DialogResponse = []
			this.dialogActiveName = val.name
			
			if (this.queryInfoParams.tbName instanceof Array) {
				if (this.queryInfoParams.tbName.length > 1) {
					this.queryInfoParams.tbName.forEach(item => {
						this.queryDialogInfo(item)
					})
				} else {
					this.queryDialogInfo(this.queryInfoParams.tbName[0])
				}
			} else {
				this.queryDialogInfo()
			}
		},
		handleClose() {
			this.dialogVisible = false;
			this.dialogInfoData = []
			this.dialogInfoData_list = []
			this.multiple_DialogResponse = []
			this.dialogActiveName = '1'
		},
		lookInfo() {
			this.dialogInfoData = []
			this.dialogInfoData_list = []
			this.multiple_DialogResponse = []
			this.dialogVisible = true;
			
			if (this.queryInfoParams.tbName instanceof Array) {
				if (this.queryInfoParams.tbName.length > 1) {
					this.queryInfoParams.tbName.forEach(item => {
						this.queryDialogInfo(item)
					})
				} else {
					this.queryDialogInfo(this.queryInfoParams.tbName[0])
				}
			} else {
				this.queryDialogInfo()
			}
		},
		queryDialogInfo(tname) {
			let paramTb_name = this.queryInfoParams.tbName
			if (tname) {
				paramTb_name = tname
			}
			// 查询详情信息
			let url = `${this.GLOBAL.baseUrl}/middleware/middlewares/dms/showDataBase`
			this.axios({
				method: 'post',
				url: url,
				data: {
					"cluster_ip": this.queryInfoParams.cluster_ip,
					"dbname": this.queryInfoParams.dbname,
					"appId": this.queryInfoParams.appId,
					"type": this.dialogActiveName, //1:常规 2:DDL 3:索引
					"tbName": paramTb_name   // 表名
				}
			}).then((response) => {
				if (response.data.code == 200) {
					if (response.data.data.length) {
						this.dialogInfoData = response.data.data[0]
						this.dialogInfoData_list = response.data.data
					}
				}
			}).then(() => {
				// 处理多个表请求返回的数组
				if (this.dialogInfoData_list.length > 0) {
					this.multiple_DialogResponse = this.multiple_DialogResponse.concat(this.dialogInfoData_list)
				} else {
					this.multiple_DialogResponse = this.dialogInfoData_list
				}
			})
			
		},
		
		handleSizeChange(val) {
			this.pageSize = val
		},
		handleCurrentChange(val) {
			this.currentPage = val
		},
		
		
		// 调整 prod,uat,fat,dev 顺序
		itemtoArraytop(arr) {
			let list = [0, 0, 0, 0] // 先占位
			let list2 = []
			arr.forEach((item, index) => {
				if (item.env === 'prod') {
					list[0] = item
				} else if (item.env === 'uat') {
					list[1] = item
				} else if (item.env === 'fat') {
					list[2] = item
				} else if (item.env === 'dev') {
					list[3] = item
				} else {
					list2.push(item)
				}
			})
			return list.concat(list2)
		},
		// 初始化
		loadMain() {
			this.loadingMenu = true
			let url = `${this.GLOBAL.baseUrl}/dms/env/dbCount`
			this.axios({
				method: 'GET',
				url: url,
			}).then((response) => {
				if (response.data.code == 200) {
					this.loadingMenu = false
					if (response.data.data.length) {
						
						// 调整 prod,uat,fat,dev 顺序
						response.data.data = this.itemtoArraytop(response.data.data) // prod数据放在第一个
						
						// 处理成树数据
						this.treeDatas = response.data.data.map((item, i) => {
							return {
								bgColor: '',
								envExpanded: i === 0 ? true : false,
								id: 'env' + i,
								label: `${item.env.toUpperCase()} 共（${item.dbCount}）个库`,
								dbCount: item.dbCount,
								env: item.env,
								children: item.dbList.map((item2, i2) => {
									return {
										dbExpanded: i === 0 && i2 === 0 ? true : false,
										env: item.env,
										inputDB: i2 === 0 ? true : false,
										placeholder: '请根据库名检索',
										ip: item2.ip,
										appId: item2.appId,
										dbName: item2.dbName,
										id: "db" + i2,
										label: item2.dbName,
									}
								})
							}
						})
						
						this.leftDBList = this.treeDatas
						this.treeDatas_source = this.treeDatas
					}
				}
			}).then(() => {
				if (!this.leftDBList.length) return false;
				// 初始化成功之后设置默认请求第一个库表
				let params = {
					"cluster_ip": this.leftDBList[0].children.length ? this.leftDBList[0].children[0].ip : '',
					"dbname": this.leftDBList[0].children.length ? this.leftDBList[0].children[0].dbName : '',
					"appId": this.leftDBList[0].children.length ? this.leftDBList[0].children[0].appId : '',
				}
				if (!this.leftDBList[0].children.length) {
					return false
				}
				
				this.leftDataInfo[0].value = this.leftDBList[0].children[0].dbName
				this.leftDataInfo[2].value = this.leftDBList[0].env
				
				// 查询详情参数
				this.queryInfoParams.dbname = this.leftDBList[0].children[0].dbName
				this.queryInfoParams.cluster_ip = this.leftDBList[0].children[0].ip
				this.queryInfoParams.appId = this.leftDBList[0].children[0].appId
				this.queryDBTableList(params, 'first')
				
			})
		},
		
		// 查询库表
		queryDBTableList(params, flag) {
			this.loadingTBMenu = true
			let url = `${this.GLOBAL.baseUrl}/dms/execute/query/tables`
			
			this.axios({
				method: 'post',
				url: url,
				data: params
			}).then((response) => {
				if (response.data.success) {
					response.data.data = response.data.data.map((item, i) => {
						return {
							label: item,
							id: "table" + i,
							flag: 'table',
							inputTB: i === 0 ? true : false,
							placeholder: '请根据表名检索',
						}
					})
					this.leftDB_table_List = response.data.data
					this.defaultExpandedKeys.push('db0')
					// 需要把表数据处理进去到对应的库中
					this.handle_dbs_tables_datas(JSON.stringify(this.leftDB_table_List), params)
					
					
					if (flag === 'first') {
						this.leftDataInfo[1].value = this.leftDB_table_List[0].label
						this.queryInfoParams.tbName = this.leftDB_table_List[0].label
						this.search_SQL_Form[0].querySql = `select * from ${this.leftDB_table_List[0].label}`
						this.search_SQL_Form[0].num = 1
						
						this.$nextTick(() => {
							let dom = document.getElementsByClassName('children-children-class-span')[0]
							dom.style.background = "#e4a36ca8";
							dom.style.color = "#303133";
						})
						
					}
					
				}
			}).finally(() => {
				this.loadingTBMenu = false
			})
		},
		
		// 查询我的常用SQL
		queryFrequentlyUsedSQL() {
			let url = `${this.GLOBAL.baseUrl}/dms/sql/favList`
			
			this.axios({
				method: 'get',
				url: url,
			}).then((response) => {
				if (response.data.code === 200) {
					this.frequentlyUsedSQL_list = response.data.data
					this.search_SQL_Form = response.data.data
					this.editableTabsValue = '0'
					
					// 执行查询完毕之后给左侧属性信息赋值第一条数据
					this.frequentlyUsedSQL_list.forEach((item, i) => {
						if (i == 0) {
							let tbName = this.analysisSQL(item.querySql)
							this.leftDataInfo[0].value = item.dbName
							this.leftDataInfo[1].value = tbName.toString()
							this.leftDataInfo[2].value = item.env || '-'
							
							this.queryInfoParams.cluster_ip = item.clusterIp
							this.queryInfoParams.dbname = item.dbName
							this.queryInfoParams.tbName = this.analysisSQL(item.querySql)
							this.queryInfoParams.appId = item.appId
						}
					})
					
				}
			})
		},
		// 需要把表数据处理进去到对应的库中
		handle_dbs_tables_datas(tables, db_item) {
			tables = JSON.parse(tables)
			
			this.treeDatas.map(item => {
				return {
					...item,
					children: item.children.map(item2 => {
						if (item2.appId == db_item.appId && item2.ip == db_item.cluster_ip && item2.dbName == db_item.dbname) {
							item2.children = tables
						}
						return {
							...item2,
							children: item2.children
						}
						
					})
				}
			})
			
			this.treeDatas = JSON.parse(JSON.stringify(this.treeDatas))
			this.treeDatas_source = JSON.parse(JSON.stringify(this.treeDatas))
			
			this.$nextTick(() => {
				if (this.treeDatas[0].length > 0) {
					this.$refs.tree.setCurrentKey(this.treeDatas[0].children[0].children[0].id)
					this.defaultCheckedKeys.push(this.treeDatas[0].children[0].children[0].id)
				}
				
			})
		},
		
		// 我的常用
		myCommonlyUsed() {
			this.activeName === 'third' ? this.activeName = '' : this.activeName = 'third'
			
			// 我的常用sql
			if (this.activeName == 'third') {
				this.queryFrequentlyUsedSQL();
			}
		},
		// tab点击
		handleClick(tab, event) {
			this.activeName = tab.name
			this.querySQL_columns = []
			this.querySQL_tables = []
			this.menuDefaultOpeneds = ''
			this.defaultOpeneds = ['0']
			// 我的常用sql
			if (tab.name === 'third') {
				this.queryFrequentlyUsedSQL();
			}
			
		},
		
		analysisSQL(sql) {
			if (sql) {
				if (sql.indexOf('  ') != -1) {
					sql = sql.replace('  ', ' ')
				}
				let flag, selectOrFromFlag = false
				let tabs = []
				sql.split('\n').forEach((sql) => {
					sql.split(' ').map(n => {
						//关键字 select 到 from 中的表字段不遍历
						if (n === 'select' || n === 'Select' || n === 'SELECT' || n === 'SHOW' || n === '(select' || n === '(Select' || n === '(SELECT') selectOrFromFlag = false
						selectOrFromFlag = selectOrFromFlag || n === 'from' || n === 'From' || n === 'FROM' || n === 'TABLE'
						//selectOrFromFlag为true是遍历每行sql提取表名
						if ((flag || n.startsWith(',')) && selectOrFromFlag) {
							n.split(',').map(m => {
								m = m.indexOf(')') > 0 ? m.slice(0, m.indexOf(')')) : m
								m = m.indexOf('(') > -1 ? m.slice(m.indexOf('(') + 1, m.length) : m
								if (m !== '') {
									if (m.indexOf(';') != -1) {
										m = m.replace(';', '')
									}
									if (m.indexOf('\t') != -1) {
										m = m.replace('\t', '')
									}
									tabs.push(m)
									//去重
									let num = 0
									tabs.filter((value) => {
										//num 为 1 时 为重复出现
										num === 1 ? tabs.splice(-1) ? num = 0 : '' : m === value.tableNm ? num++ : ''
									})
									flag = false
								}
							})
						}
						//标记位
						flag = n === 'from' || n === 'From' || n === 'FROM' || n === 'join' || n === 'Join' || n === 'JOIN' || n === 'TABLE' || n.endsWith(',')
					})
				})
				return tabs.length === 0 ? [] : tabs
			} else {
				//文本框为空且失焦时执行
				return []
			}
		},
		
		// 查询语句 tabs 点击
		searchSentenceTabClick(tab, index) {
			this.querySQL_tables = []
			this.querySQL_columns = []
			this.querySQL_times = '0'
			// 将常用数据处理至左下属性信息
			this.frequentlyUsedSQL_list.forEach((item, i) => {
				if (i == tab.name) {
					
					let tbName = this.analysisSQL(item.querySql)
					this.leftDataInfo[0].value = item.dbName
					this.leftDataInfo[1].value = tbName.toString()
					this.leftDataInfo[2].value = item.env || '-'
					
					this.queryInfoParams.cluster_ip = item.clusterIp
					this.queryInfoParams.dbname = item.dbName
					this.queryInfoParams.tbName = this.analysisSQL(item.querySql)
					this.queryInfoParams.appId = item.appId
				}
			})
			
			// 处理行数
			this.search_SQL_Form.forEach((itemSql, i) => {
				if (i == tab.name) {
					this.handleTextareaInput(itemSql.querySql)
				}
			})
			
			
		},
		
		tabsEdit(targetName, action) {
			if (action === 'add') {
				this.search_SQL_Form.push({
					querySql: '',
					num: 1,
				});
				this.editableTabsValue = this.search_SQL_Form.length - 1 + ''
				
				// 设置行数和文本一起滚动
				this.$nextTick(() => {
					this.$refs[`textarea${this.editableTabsValue}`][0].$el.children[0].addEventListener('scroll', () => {
						this.$refs[`row${this.editableTabsValue}`][0].scrollTop = this.$refs[`textarea${this.editableTabsValue}`][0].$el.children[0].scrollTop
					});
				})
				
			}
			
			if (action === 'remove') {
				if (this.search_SQL_Form.length === 1) {
					this.$message({
						message: '至少保留一条查询',
						type: 'warning'
					});
					return false
				}
				
				this.search_SQL_Form.splice(targetName, 1)
				this.editableTabsValue = this.search_SQL_Form.length - 1 + ''
				
			}
		},
		
		
		/* 根据 sql 查询列表数据*/
		querySqlSubmit(param) {
			if (!param.querySql) {
				this.$message({
					message: 'SQL语句不能为空',
					type: 'warning'
				});
				return false
			}
			this.loading = true
			this.checkBtnStatus = true;
			this.checkStatusIcon = "el-icon-loading";
			
			if (this.activeName != "third") {
				param.clusterIp = this.queryInfoParams.cluster_ip
				param.dbName = this.queryInfoParams.dbname
				param.appId = this.queryInfoParams.appId
				param.querySql = param.querySql
				param.env = this.leftDataInfo[2].value
			}
			this.querySQL_listName = param.dbName  // 执行查询列表title 数据库名
			
			// 查询列表数据
			queryDataBySql({
				"cluster_ip": param.clusterIp,
				"dbname": param.dbName,
				"appId": param.appId,
				"sql": param.querySql,
				"env": param.env,
			}).then(res => {
				this.checkBtnStatus = false
				this.loading = false
				this.querySQL_columns = res.data.column
				res.data.value.forEach(item => {
					for (const key in item) {
						if (Object.hasOwnProperty.call(item, key)) {
							item[key] = String(item[key]);
						}
					}
				})
				this.querySQL_tables = res.data.value
				this.querySQL_times = res.data.consuming_time
				this.checkStatusIcon = "el-icon-success";
			}).catch(() => {
				onerror("校验SQL错误：未知错误");
				this.checkStatusIcon = "el-icon-error";
			})
		},
		
		beautySql(sql, i) {
			
			if (sql !== "" && sql !== undefined) {
				
				this.search_SQL_Form.forEach((item, index) => {
					if (i == index) {
						item.querySql = sqlFormatter.format(sql)
						this.handleTextareaInput(item.querySql)
						
					}
				})
				
				
				this.$message({
					message: "SQL美化成功",
					type: "success",
				});
			} else {
				this.$message({
					message: 'SQL语句不能为空',
					type: 'warning'
				});
				return false
			}
		},
		
		
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-icon-coin {
	color: #57a3f3;
}

/deep/ el-tabs--border-card > .el-tabs__header {
	background-color: #a7c8ec;
}

/deep/ .el-button--default {
	border-color: #dcdfe6;
	color: #444444c9;
}

/deep/ .el-dialog__body {
	padding: 0px;
}

.dialog_info {
	/deep/ .el-tabs__content {
		border: 1px solid #dcdfe6;
		padding: 0px;
		margin: 15px;
	}
	
	/deep/ .el-textarea__inner {
		border: none;
	}
	
	.content {
		display: flex;
		border-bottom: 1px solid #dcdfe6;
		line-height: 40px;
		padding: 0 0 0 15px;
		
		&:last-child {
			border-bottom: none;
		}
		
		span {
			&:first-child {
				width: 20%;
				border-right: 1px solid #dcdfe6;
			}
			
			&:last-child {
				width: 100%;
				padding: 0 0 0 15px;
			}
		}
	}
}

.right_header {
	text-align: left;
	font-size: 12px;
	
	/deep/ .el-tabs__content {
		padding: 0px;
	}
	
	.right_top {
		padding: 10px 0 0 0;
		color: black;
		width: 175px;
		
		/deep/ .el-tabs--border-card > .el-tabs__header {
			background-color: #d1e5ec;
			border-color: #d1e5ec;
		}
		
		/deep/ .el-tabs--border-card {
			border-color: #d1e5ec;
		}
		
		span {
			color: #2e2e2e;
		}
	}
}

.block {
	width: 100%;
	
	span {
		&:first-child {
			font-size: 14px;
			
			strong {
				color: #2d8cf0;
				font-size: 16px;
			}
		}
		
		&:last-child {
			float: right;
		}
	}
}

.table_title {
	height: 30px;
	font-size: 14px;
	border: 1px solid #c5c5c5b3;
	margin: 10px 0;
	padding: 5px 5px;
	box-shadow: 0 2px 4px 0 #0000001f;
	
	svg {
		font-size: 18px;
	}
	
	span {
		display: inline-block;
		position: relative;
	}
}

.ckbg {
	background: #e4a36ca8;
}

.search_form {
	.content {
		position: relative;
	}
	
	/deep/ .el-button.is-plain:focus, .el-button.is-plain:hover {
		border-color: white;
	}
	
	#leftBox {
		height: 100%;
		display: inline-block;
		position: absolute;
		width: 4%;
	}
	
	.leftNum_text {
		padding: 0px 4px 10px 4px;
		height: 100%;
		width: 100%;
		line-height: 22px;
		font-size: 12px;
		text-align: center;
		color: #999;
		font-weight: bold;
		resize: none;
		outline: none;
		overflow-y: hidden;
		overflow-x: hidden;
		border: 0;
		background: whitesmoke;
		box-sizing: border-box;
	}
	
	/deep/ .el-textarea {
		//width: 96%;
		float: right;
	}
	
	/deep/ .el-textarea__inner {
		//line-height: 22px;
	}
	
	/deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
		border-radius: 30px;
	}
	
	/deep/ .el-tabs__nav {
		padding: 3px;
	}
	
	/deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item {
		color: #2e2e2e;
	}
	
	/deep/ .el-tabs--border-card > .el-tabs__header {
		background-color: #a7c8ec;
	}
	
	/deep/ .el-tabs__new-tab {
		color: #818181;
		border: 1px solid #818181;
		margin: 12px 10px 9px 10px;
	}
	
	/deep/ .el-tabs--border-card > .el-tabs__content {
		padding: 0;
	}
}

.svg-magic {
	font-size: 28px;
	position: absolute;
	left: 3px;
	top: 5px;
}

/deep/ .el-aside {
	overflow: hidden;
}

.left {
	/deep/ .el-input {
		//top: 32px;
		outline: none;
		width: 97%;
	}
	
	/deep/ .el-input__inner {
		background: #f5f7fa;
		border-left-color: #c5c5c5;
		border-radius: 0;
		border-right-color: #c5c5c5;
	}
}

.left_title {
	display: block;
	position: fixed;
	z-index: 1;
	font-size: 14px;
	padding: 0 10px;
	line-height: 30px;
	width: 350px;
	background-color: #edf1f2;
	border: 1px solid #c5c5c5;
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
	border-bottom: none;
}

.left_data_table {
	border: 1px solid #c5c5c5;
	border-bottom-right-radius: 8px;
	border-bottom-left-radius: 8px;
	border-top: none;
	
	overflow: auto;
	position: absolute;
	z-index: 1;
	top: 32px;
	width: 100%;
	bottom: 290px;
	
	ul {
		line-height: 45px;
		font-size: 14px;
		margin-left: 10px;
		
		li {
			list-style: none;
		}
	}
	
	.parent-class {
		margin-top: 10px;
		
		.parent-class-span {
			display: inline-block;
			cursor: pointer;
			width: calc(100% - 20px);
			
			&:hover {
				color: #57a3f3;
			}
		}
	}
	
	.children-class {
		cursor: pointer;
		
		ul {
			margin-left: 30px;
		}
	}
	
	.children3 {
	}
	
	.children-class-span {
		width: 90%;
		display: inline-block;
	}
	
	.children-children-class-span {
		width: 90%;
		display: inline-block;
	}
	
	
	/deep/ .el-tree {
		background: none;
	}
	
	/deep/ .el-tree-node {
		padding-left: 10px;
	}
	
	/deep/ .el-tree-node__content {
		height: 50px !important;
		line-height: 50px !important;
		color: #303133;
	}
	
	/deep/ .el-tree-node__children {
		position: relative;
		padding-top: 50px;
	}
	
	/deep/ .el-tree-node__content > .el-tree-node__expand-icon {
		position: absolute;
		right: 0;
	}
	
	/deep/ .el-tree-node__expand-icon {
		//color: #7a7a7a;
		font-size: 18px;
	}
	
	/deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
		background-color: #e4a36ca8;
	}
	
	.filter-tree {
		.spanq1 {
			display: block;
			position: absolute;
			top: 0px;
		}
		
		.spanq2 {
			display: block;
		}
	}
	
	
	/deep/ .el-menu {
		background-color: #edf1f2;
	}
	
	/deep/ .el-menu-item.is-active {
		//background-color: #e4a36c;
		background-color: #e4a36ca8;
		//color: #a4622b;
		color: #854917;
	}
	
}

.left_data_info {
	position: absolute;
	bottom: 0px;
	width: 100%;
	height: 288px;
	border: 1px solid #c5c5c5;
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
	
	/deep/ .el-table--fit {
		border-radius: 8px;
	}
	
	/deep/ .cell {
		padding-right: 0px;
	}
}

/deep/ .el-card__header {
	padding: 6px 20px;
}

/deep/ .el-card {
	font-size: large;
}

/deep/ .el-card__body {
	//max-height: 680px;
	max-height: 446px;
	overflow: auto;
	//overflow-x: hidden;
}

/deep/ .el-form-item__content {
	margin-left: auto !important;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .2s
}

.fade-enter, .fade-leave-to {
	opacity: 0
}

.main {
	background-color: #f4f4f4;
	box-sizing: border-box;
	height: calc(100% - 80px);
	background: white;
	padding: 20px;
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
	border-radius: 8px;
	overflow: auto;
	font-family: sans-serif;
}

.bar {
	width: 4px;
	height: 14px;
	background: $primary;
	margin-right: 8px;
}

.table {
	border: 1 solid teal;
	overflow-x: auto;
}
</style>
