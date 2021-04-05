<template>
	<div class="notice">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>系统设置</el-breadcrumb-item>
			<el-breadcrumb-item>更新公告</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-form>
				<el-form-item label="内容" label-width="120" prop="name">
					<el-input v-model="noticeForm.content" style="width: 218px;" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="单位" label-width="120" prop="name">
					<el-input v-model="noticeForm.name" style="width: 218px;"></el-input>
				</el-form-item>
				<el-form-item label="日期" label-width="120" prop="name">
					<el-input v-model="noticeForm.date" style="width: 218px;" type="date"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">立即发布</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				noticeForm: {}
			}
		},
		methods:{
			async onSubmit(){
				let notice = this.noticeForm.content + '|' + this.noticeForm.name+ '|'+this.noticeForm.date
				let {data: res} = await this.$http.post('/admin/setAnnouncement',{notice})
				if(res.status == 0){
					return this.$message.success('发布成功！')
				}
			}
		}
	}
</script>

<style>
</style>
