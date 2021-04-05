<template>
	<div class="goods_catagories">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>系统设置</el-breadcrumb-item>
			<el-breadcrumb-item>分类列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 父级分类，添加分类 -->
			<el-row :gutter="20">
				<el-col :span="5">
					<el-select @change="changeParentCatagory" v-model="valueParent" loading-text filterable allow-create
					 default-first-option placeholder="选择父级分类">
						<el-option 
						v-for="item in parentsCatagories" 
						:key="item.id" :label="item.name"
						:value="item.id">
						 <span style="float: left">{{ item.name }}</span>
						 <i @click="deleteParentCategory(item.id)" style="float: right; color: #8492a6; font-size: 13px;margin-top: 0.625rem;" class="el-icon-error"></i>
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="3">
					<el-button type="primary" @click="dialogFormVisibleParent = true">
						添加父级分类
					</el-button>
				</el-col>
				<el-col :span="1">
					<el-button type="primary" :disabled="valueParent == '' " @click="dialogFormVisibleAddChild = true">
						添加子级分类
					</el-button>
				</el-col>
			</el-row>
			<el-table :data="childCatagories" border style="width: 50%">
				<el-table-column align="center" type="index" label="#" width="80"/>
				<el-table-column align="center" prop="id" label="分类id" width="80" />
				<el-table-column align="center" prop="name" label="分类名称"></el-table-column>
				<el-table-column  label="操作" width="200" align="center">
					<template v-slot="scope">
						<!-- 新增按钮 -->
						<!-- <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="dialogFormVisibleAddChild = true" /> -->
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogVisibleUpdateChild(scope.row)" />
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCatagory(scope.row)"/>
					</template>
				</el-table-column>
			</el-table>
			<!-- 添加父级分类 -->
			<el-dialog title="添加父级分类" :visible.sync="dialogFormVisibleParent" width="50%">
				<el-form :model="addParentCatagoryForm" :rules="rules" ref="addParentRef">
					<el-form-item label="父级名称" label-width="120" prop="name">
						<el-input v-model="addParentCatagoryForm.name" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="排列等级" label-width="120" prop="sortedOrder">
						<el-input v-model="addParentCatagoryForm.sortedOrder" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleParent = false">取 消</el-button>
					<el-button type="primary" @click="addParentCatagory">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 添加子分类 -->
			<el-dialog title="添加子级分类" :visible.sync="dialogFormVisibleAddChild" width="50%">
				<el-form :model="addChildCatagoryForm" :rules="rules" ref="addChildRef">
					<el-form-item label="分类名称" label-width="120" prop="name">
						<el-input v-model="addChildCatagoryForm.name" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="排列等级" label-width="120" prop="sortedOrder">
						<el-input v-model="addChildCatagoryForm.sortedOrder" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleAddChild = false">取 消</el-button>
					<el-button type="primary" @click="addChildCatagory">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 修改子分类弹出框 -->
			<el-dialog title="修改子级分类" :visible.sync="dialogFormVisibleUpdateChild" width="50%">
				<el-form :model="updateChildCatagoryForm" :rules="rules" ref="updateChildRef">
					<el-form-item label="分类名称" label-width="120" prop="name">
						<el-input v-model="updateChildCatagoryForm.name" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="排列等级" label-width="120" prop="sortedOrder">
						<el-input v-model="updateChildCatagoryForm.sortedOrder" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleUpdateChild = false">取 消</el-button>
					<el-button type="primary" @click="updateChildCatagory">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisibleParent: false,
				valueParent: '',
				parentsCatagories: [],
				childCatagories: [],
				addParentCatagoryForm: {},
				dialogFormVisible: false,
				dialogFormVisibleAddChild: false,
				dialogFormVisibleUpdateChild: false,
				addChildCatagoryForm: {},
				updateChildCatagoryForm: {},
				
				// 校验
				rules: {
					name: [{
						required: true,
						message: "分类名不能为空哦！"
					}],
					sortedOrder: [{
						required: true,
						message: "排序规则不能为空哦！"
					}]
				}
			}
		},
		mounted() {
			let parentsCatagories = sessionStorage.getItem('parentsCatagories') || ''
			let manufactors = sessionStorage.getItem('manufactors') || ''
			if (parentsCatagories && manufactors) {
				this.parentsCatagories = JSON.parse(parentsCatagories)
				this.manufactors = JSON.parse(manufactors)
			} else {
				this.getParentsCatagories()
			}
		},
		methods: {
			// 获取父级分类
			async getParentsCatagories() {
				let res = await this.$http.get('/')
				// 父级分类列表
				this.parentsCatagories = res.data.data.categories

				sessionStorage.setItem('parentsCatagories', JSON.stringify(this.parentsCatagories))
				
			},

			// 监听父级分类选框
			changeParentCatagory(id) {
				this.valueParent = id
				this.parentsCatagories.forEach(v => {
					if (v.id === id) {
						this.childCatagories = v.subCategories
					}
				})
			},

			// 添加父级分类
			async addParentCatagory() {
				this.addParentCatagoryForm.parentId = 0
				this.$refs.addParentRef.validate(async valid=>{
					if(!valid){return}
					let {data: res} = await this.$http.post('/admin/category', this.addParentCatagoryForm)
					this.dialogFormVisibleParent = false
					if (res.status !==0 ) {
						return this.$message.success(res.msg)
					}
					this.getParentsCatagories()
					this.addParentCatagoryForm = {}
					return this.$message.success('添加成功！')
				})
			},

			// 添加子分类
			async addChildCatagory() {
				this.addChildCatagoryForm.parentId = this.valueParent
				this.$refs.addChildRef.validate(async valid=>{
					if(!valid){return}
					let res = await this.$http.post('/admin/category', this.addChildCatagoryForm)
					this.dialogFormVisibleAddChild = false
					if (res.data.msg) {
						this.getParentsCatagories()
						return this.$message.success(res.data.msg)
					}
				})
			},

			//  修改子分类
			dialogVisibleUpdateChild(e) {
				this.updateChildCatagoryForm = e
				this.dialogFormVisibleUpdateChild = true
			},

			// 修改子分类
			async updateChildCatagory() {
				this.$refs.updateChildRef.validate(async valid=>{
					if(!valid){return}
					let res = await this.$http.patch('/admin/category', this.updateChildCatagoryForm)
					this.dialogFormVisibleUpdateChild = false
					if (res.data.msg) {
						this.getParentsCatagories()
						return this.$message.success(res.data.msg)
					}
				})
			},
			
			// 删除子分类
			async deleteCatagory(e){
				let id = e.id
				let {data: res} = await this.$http.delete(`/admin/category/${id}`)
				console.log(res)
				if(res.status !== 0){
					return this.$message.error(res.msg)
				}
				this.$message.success('删除成功！')
				this.getParentsCatagories()
				
			},
			
			// 删除父级分类
			async deleteParentCategory(id){
				let {data: res} = await this.$http.delete(`/admin/category/${id}`)
				if(res.status !== 0){
					return this.$message.error(res.msg)
				}
				this.$message.success('删除成功！')
				this.getParentsCatagories()
			}
			
		}
	}
</script>

<style>
</style>
