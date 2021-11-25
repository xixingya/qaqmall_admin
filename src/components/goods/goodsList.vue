<template>
	<div class="goodsList">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 下拉框 -->
			<el-row :gutter="18">
				<!-- 下拉父级目录-->
				<el-col :span="5">
					<el-select @change="changeParentCatagory" v-model="valueParent" loading-text filterable allow-create
					 default-first-option placeholder="选择父级分类">
						<el-option v-for="item in parentsCatagories" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<!-- 下拉子级目录搜索框  -->
				<el-col :span="5">
					<el-select @change="changeChildCatagory" v-model="valueChild" loading-text filterable allow-create
					 default-first-option placeholder="选择子级分类">
						<el-option v-for="item in childCatagories" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" :disabled="valueChild ==''" @click="dialogFormVisible = true">
						添加商品
					</el-button>
				</el-col>
			</el-row>

			<!-- 商品列表 -->
			<el-table :data="goodsList" border style="width: 100%">
				<el-table-column prop="id" label="#" width="60" />
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
				<el-table-column prop="subtitle" label="副标题" width="220"></el-table-column>
<!--				<el-table-column prop="cName" label="商品分类" width="180"></el-table-column>-->
<!--				<el-table-column prop="mName" label="生产厂家"></el-table-column>-->
				<el-table-column prop="price" label="价格" width="120px"></el-table-column>
				<el-table-column prop="mainImage" label="图片" width="100px">
					<!-- 商品图片处理 -->
					<template v-slot="scope">
						<img style="width: 100%;height: 3.125rem" :src=scope.row.mainImage alt="">
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="80px">
					<template slot-scope="scope">
					            <el-switch
					              v-model="scope.row.status==1"
					              @change="userStateChange(scope.row)"
					            />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template v-slot="scope">
						<!-- 新增按钮 -->
						<!-- <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="dialogFormVisible = true" /> -->
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="updateGoods(scope.row)" />
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)" />
					</template>
				</el-table-column>
			</el-table>
			<!-- 修改商品弹出框 -->
			<el-dialog title="修改商品" :visible.sync="dialogFormVisibleUpdate">
				<el-form :model="updateData" :rules="rules" ref="updateGoodsRef">
					<el-form-item label="商品名称" label-width="120" prop="subtitle" >
						<el-input v-model="updateData.name" :value="updateData.name" style="width: 218px;"></el-input>
					</el-form-item>
          <el-form-item label="副标题" label-width="120" prop="subtitle" >
            <el-input v-model="updateData.subtitle" :value="updateData.subtitle" style="width: 218px;"></el-input>
          </el-form-item>
					<el-form-item label="商品价格" label-width="120" prop="price" >
						<el-input v-model="updateData.price" :value="updateData.price" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="商品描述" label-width="120">
						<el-input v-model="updateData.descs" :value="updateData.descs" style="width: 218px;" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="商品图片" label-width="120">
						<el-upload class="upload-demo" :on-success="handleSuccess" action="http://localhost/admin/upload" :headers="myheader" name="img"
						 :file-list="fileList3">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="生产厂家" label-width="120" prop="manufactorId">
						<el-select v-model="updateData.manufactorId" placeholder="请选择所生产产品类别">
							<el-option v-for="(item,index) in manufactors" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品排序" label-width="120">
						<el-input v-model="updateData.sorted_order" :value="updateData.sorted_order" style="width: 218px;"></el-input>
					</el-form-item>
          <el-form-item label="库存" label-width="120">
            <el-input v-model="updateData.stock" style="width: 218px;"></el-input>
          </el-form-item>
					<el-form-item label="商品参数" label-width="120">
						<el-input v-model="updateData.param" :value="updateData.param" type="textarea" style="width: 218px;"></el-input>
					</el-form-item>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
					<el-button type="primary" @click="updateDataForm">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 添加商品弹出框 -->
			<el-dialog title="添加商品" :visible.sync="dialogFormVisible">
				<el-form :model="addData" :rules="rules" ref="addGoodsRef">

					<el-form-item label="商品名称" label-width="120" prop="subtitle">
						<el-input v-model="addData.name" style="width: 218px;"></el-input>
					</el-form-item>
          <el-form-item label="副标题" label-width="120" prop="subtitle">
            <el-input v-model="addData.subtitle" style="width: 218px;"></el-input>
          </el-form-item>
					<el-form-item label="商品价格" label-width="120" prop="price">
						<el-input v-model="addData.price" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="商品描述" label-width="120">
						<el-input v-model="addData.descs" style="width: 218px;" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="商品图片" label-width="120">
						<el-upload class="upload-demo" action="http://localhost/admin/upload" :headers="myheader" :file-list="fileList3" :limit="1"
						 name="img" :on-success="handleSuccess">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="生产厂家" label-width="120" prop="manufactorId">
						<el-select v-model="addData.manufactorId" placeholder="请选择所生产产品类别">
							<el-option v-for="(item,index) in manufactors" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品排序" label-width="120">
						<el-input v-model="addData.sorted_order" style="width: 218px;"></el-input>
					</el-form-item>
          <el-form-item label="库存" label-width="120">
            <el-input v-model="addData.stock" style="width: 218px;"></el-input>
          </el-form-item>
					<el-form-item label="商品参数" label-width="120">
						<el-input v-model="addData.param" style="width: 218px;" type="textarea"></el-input>
					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addGoodsForm">确 定</el-button>
				</div>
			</el-dialog>

			<!-- 分页 -->
			<el-pagination background @current-change="getPageData" layout="prev, pager, next" :page-size=4 :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {
			
				// 商品列表
				goodsList: [],
				// 修改商品表单
				updateData: {},
				// 增加商品表单
				addData: {},
				// 父级分类列表
				parentsCatagories: [],
				// 子级目录
				childCatagories: [],
				// 厂家列表
				manufactors: [],
				// 添加修改弹出框
				dialogFormVisible: false,
				dialogFormVisibleUpdate: false,
				valueParent: '',
				valueChild: '',
				pageCurrent: 1,
				// 上传图片列表
				fileList3: [],
				// 分页总数
				total: 0,
				myheader:{},
								
				// 校验
				rules: {
					subtitle: [{
						required: true,
						message: "产品名不能为空哦！"
					}],
					price: [{
						required: true,
						message: "产品价格不能为空哦！"
					}],
					manufactorId: [{
						required: true,
						message: "厂家不能为空哦！"
					}]
				}
			}

		},
		mounted() {
			this.getParentsCatagories()
			this.myheader={
				Authorization: sessionStorage.getItem('token')
				}
		},
		methods: {
			// 获取商品
			async getGoodsList(pageNum = 1, id = 2, pageSize = 4) {
				let res = await this.$http.get(`admin/product?categoryId=${id}&pageNum=${pageNum}&pageSize=${pageSize}`)
				this.total = res.data.data.total
				this.goodsList = res.data.data.list
				this.addData.categoryId = id
			},

			// 获取父级分类
			async getParentsCatagories() {
				let res = await this.$http.get('/center/categories')
        console.log(res.data.data)
				// 父级分类列表
				this.parentsCatagories = res.data.data
				// 厂家列表
        let res1 = await this.$http.get('/admin/brand')
				let manufactors = res1.data.data
        console.log(manufactors)
				// 保存父级分类到本地
				// manufactors.forEach(v => {
				// 	v.manufactors.forEach(m => {
				// 		this.manufactors.push(m)
				// 	})
				// })
        this.manufactors = manufactors
				sessionStorage.setItem('parentsCatagories', JSON.stringify(this.parentsCatagories))
				//sessionStorage.setItem('manufactors', JSON.stringify(manufactors))
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

			// 监听子级分类选狂
			changeChildCatagory(id) {
				
				this.valueChild = id
				this.getGoodsList(this.pageCurrent, id)
				// 将表单分类id置为所选
				this.addData.categoryId = id
				this.updateData.categoryId = id
			},

			// 分页
			getPageData(pageNum) {
				
				this.pageCurrent = pageNum
				let id = this.valueChild
				this.getGoodsList(pageNum, id)
			},
			
			// 上传图片成功之后的回调
			handleSuccess(e) {
			  console.log(e)
				this.addData.mainImage = e.data
				this.updateData.mainImage = e.data
			},

			// 添加商品
			async addGoodsForm() {
				this.$refs.addGoodsRef.validate(async (valid)=>{
					if (!valid) { return }
					let res = await this.$http.post('/admin/product', this.addData)
					this.dialogFormVisible = false
					if (res.data !== undefined) {
						this.$http.get('/admin/importAll')
						this.getGoodsList(this.pageCurrent, this.valueChild)
						return this.$message.success(res.data.msg)
					}
				})
				
			},

			// 删除商品
			async removeGoods(e) {
				let id = e.id
				let res = await this.$http.delete(`/admin/product/${id}`)
				if (res.data.msg) {
					let id = this.valueChild
					this.getGoodsList(this.pageCurrent, id)
					return this.$message.success(res.data.msg)
				}
			},

			// 修改商品看，
			updateGoods(e) {
				
				this.updateData = e
				this.dialogFormVisibleUpdate = true
			},

			//提交商品表单
			async updateDataForm() { 
				this.$refs.updateGoodsRef.validate(async valid=>{
					if(!valid){return}
					let res = await this.$http.patch('/admin/product', this.updateData)
					this.dialogFormVisibleUpdate = false
					if (res.data.msg) {
						this.getGoodsList(this.pageCurrent, this.valueChild)
						return this.$message.success(res.data.msg)
					}
				})
			},
			
			// 更改状态
			async userStateChange(e){
				let data = {
					id: e.id,
					status: !e.status
				}
				let res = await this.$http.patch('/admin/product', data)
				if(res.data.msg){
					this.getGoodsList(this.pageCurrent,this.valueChild)
					return this.$message.success(res.data.msg)
				}
			}

		}
	}
</script>

<style>
</style>
