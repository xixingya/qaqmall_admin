<template>
	<div class="users">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容" clearable v-model="words">
						<el-button slot="append" icon="el-icon-search" @click="getUser" />
					</el-input>
				</el-col>

			</el-row>
			<!-- 用户列表区域 -->
			<el-table :data="userList" border stripe>
				<el-table-column type="index" label="#" />
				<el-table-column label="用户id" prop="id" />
				<el-table-column label="用户名" prop="username" />
				<el-table-column label="角色" prop="role">
					<template v-slot="scope">
						<span v-if="scope.row.role==0">管理员</span>
						<span v-else>普通用户</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="status">
					<template v-slot="scope">
						<el-switch v-model="scope.row.status==1" @change="userStateChange(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="160px">
					<template v-slot="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible(scope.row)" />

						<!-- 添加用户按钮 -->
						<el-button type="warning" icon="el-icon-circle-plus" size="mini" @click="dialogFormVisibleAdd = true" />

					</template>
				</el-table-column>
			</el-table>
			<!-- 添加用户天出框 -->
			<el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" width="50%">
				<el-form :model="addUserForm" :rules="rules" ref="addUserRef">
					<el-form-item label="用户名" label-width="120" prop="username">
						<el-input v-model="addUserForm.username" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="密码" label-width="120" prop="password">
						<el-input v-model="addUserForm.password" type="password" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
					<el-button type="primary" @click="addUserSubmit">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 更新用户天出框 -->
			<el-dialog title="更新用户" :visible.sync="dialogFormVisibleUpdate" width="50%">
				<el-form :model="updateForm" :rules="rules" ref="updateUserRef">
					<el-form-item label="用户名" label-width="120" prop="username">
						<el-input v-model="updateForm.username" style="width: 218px;"></el-input>
					</el-form-item>
					<el-form-item label="密码" label-width="120" prop="password">
						<el-input v-model="updateForm.password" type="password" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
					<el-button type="primary" @click="updateUserSubmit">确 定</el-button>
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
				total: 0,
				words: '',
				pageNum: 1,
				userList: [],
				pageCurrent: 1,
				addUserForm: {},
				updateForm: {},
				dialogFormVisibleAdd: false,
				dialogFormVisibleUpdate: false,

				// 校验
				rules: {
					username: [{
						required: true,
						message: "用户名不能为空哦！"
					},
					{
						min: 2,
						max: 15,
						message: '长度在 3 到 25 个字符',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: "密码不能为空哦！"
					},
					{
						min: 3,
						max: 15,
						message: '长度在 3 到 15 个字符',
						trigger: 'blur'
					}]

				}
			}
		},
		mounted() {
			this.getUserList(this.pageNum)
		},
		methods: {
			// 获取用户列表
			async getUserList(pageNum) {
				let res = await this.$http.get(`/admin/user?pageNum=${pageNum}&pageSize=${5}`)
				if (res.data.status !== 0) {
					return this.$message.error('获取用户信息失败！')
				}
				this.userList = res.data.data.list
				this.total = res.data.data.total
			},

			// 更改用户状态
			async userStateChange(e) {
				let updateForm = {
					id: e.id,
					status: !e.status
				}
				let res = await this.$http.patch('/admin/user', updateForm)
				if (res.data.msg) {
					this.getUserList(this.pageCurrent)
					return this.$message.success(res.data.msg)
				}
			},

			// 提交添加表单
			async addUserSubmit() {
				this.$refs.addUserRef.validate(async (valid) => {
					if (!valid) {
						return
					}
					let res = await this.$http.post('/admin/user', this.addUserForm)
					this.dialogFormVisibleAdd = false
					if (res.data.msg) {
						this.getUserList(this.pageCurrent)
						return this.$message.success(res.data.msg)
					}
				})
			},

			// 更改用户信息弹出框
			dialogFormVisible(e) {
				this.updateForm = e
				this.dialogFormVisibleUpdate = true
			},

			// 更新用户密码信息
			async updateUserSubmit() {
				this.$refs.updateUserRef.validate(async valid=>{
					if(!valid){return}
					let res = await this.$http.patch('/admin/user', this.updateForm)
					if (res.data.msg) {
						this.dialogFormVisibleUpdate = false
						return this.$message.success(res.data.msg)
					}
				})
				
			},

			// 搜索用户
			async getUser() {
				if(this.words == ''){
					this.getUserList(this.pageNum)
				}else{
					let res = await this.$http.get(`/admin/user?username=${this.words}`)
					this.userList = res.data.data.list
				}
			},

			// 分页
			getPageData(e) {
				this.pageCurrent = e
				this.getUserList(this.pageCurrent)
			}
		}
	}
</script>

<style>
</style>
