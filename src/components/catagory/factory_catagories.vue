<template>
	<div class="factory_catagories">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>系统设置</el-breadcrumb-item>
			<el-breadcrumb-item>厂家列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="factoriesList" border style="width: 100%">
				<el-table-column align="center" type="index" label="#" width="80"/>
				<el-table-column align="center" prop="id" label="厂家id" width="80"/>
				<el-table-column align="center" prop="name" label="厂家名称" width="180"></el-table-column>
								 
				<el-table-column prop="categories" v-slot="scope" label="产品集合">
					<span v-for="item in scope.row.categories" :key="item.id">{{item.name}}&nbsp; </span><br>
				</el-table-column>
				<el-table-column align="center" label="操作" width="160">
					<template v-slot="scope">
						<!-- 新增按钮 -->
						<el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="dialogFormVisibleAdd = true" />
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)" />
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 新增厂家弹出框 -->	
			<el-dialog title="新增厂家" :visible.sync="dialogFormVisibleAdd" width="50%">
			  <el-form :model="addDataForm" :rules="rules" ref="addManuRef">
			    <el-form-item label="厂家名称" label-width="120" prop="name">
			      <el-input v-model="addDataForm.name" style="width: 218px;"></el-input>
			    </el-form-item>
				<el-form-item label="排序级别" label-width="120" prop="sortedOrder">
				  <el-input v-model="addDataForm.sortedOrder" style="width: 218px;"></el-input>
				</el-form-item>
			    <el-form-item label="产品集合" label-width="120" prop="categoryIdList">
			      <el-select  multiple v-model="addDataForm.categoryIdList" placeholder="请选择所生产产品类别">
			        <el-option v-for="(item, index) in parentsCatagories" :key="index" :label="item.name" :value="item.id" ></el-option>
			      </el-select>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
			    <el-button type="primary" @click="addFactory">确 定</el-button>
			  </div>
			</el-dialog>
			<!-- 分页 -->
			<el-pagination background @current-change="getPageData" layout="prev, pager, next" :page-size="6" :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				total: 0,
				pageNum: 1,
				addDataForm: {},
				pageCurrent: 1,
				factoriesList: [],
				dialogFormVisibleAdd: false,
				parentsCatagories: [],
				
				// 校验
				rules: {
					name: [{
						required: true,
						message: "厂家名称不能为空哦！"
					}],
					categoryIdList: [{
						required: true,
						message: "产品集合不能为空哦！"
					}],
					sortedOrder: [{
						required: true,
						message: "排序规则不能为空哦！"
					}]
				
				}
			}
		},
		mounted() {
			this.getFactoryList(this.pageNum)
			let parentsCatagories = sessionStorage.getItem('parentsCatagories') || ''
			if (parentsCatagories) {
				this.parentsCatagories = JSON.parse(parentsCatagories)
			} else {
				this.getParentsCatagories()
			}
		},
		methods:{
			// 获取所有厂家
			async getFactoryList(pageNum){
				let res = await this.$http.get(`/admin/brands?pageNum=${pageNum}&pageSize=6`)
				this.total = res.data.data.total
				this.factoriesList = res.data.data.list
				// 更新缓存
				
			},
			
			// 添加厂家
			async addFactory(){
				this.$refs.addManuRef.validate(async valid=>{
					if(!valid){return}
					let res = await this.$http.post('/admin/brands', this.addDataForm)
					if(res.data.msg){
						this.dialogFormVisibleAdd = false
						this.getFactoryList(this.pageCurrent)
						return this.$message.success(res.data.msg)
					}
				})
				
			},
			
			// 获取父级分类
			async getParentsCatagories() {
				let res = await this.$http.get('/')
				// 父级分类列表
				this.parentsCatagories = res.data.data.categories
				
				sessionStorage.setItem('parentsCatagories', JSON.stringify(this.parentsCatagories))
			},
			
			// 分页
			getPageData(e){
				this.pageCurrent = e
				this.getFactoryList(this.pageCurrent)
			},
			
			// 删除该厂家
			async handleDelete(e){
				let id = e.id
				let {data: res} = await this.$http.delete(`/admin/brands/${id}`)
				if(res.status !== 0){
					return this.$message.error(res.msg)
				}
				this.getFactoryList(this.pageNum)
				return this.$message.success('删除成功！')
			}
		}
	}
</script>

<style>
</style>
