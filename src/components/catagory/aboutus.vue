<template>
	<div class="notice">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>系统设置</el-breadcrumb-item>
			<el-breadcrumb-item>更新公告</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-form>
				<el-form-item label="公司名称" label-width="120" prop="name">
					<el-input v-model="introForm.name" style="width: 218px;"></el-input>
				</el-form-item>
				<el-form-item label="公司介绍" label-width="120" prop="name">
					<el-input v-model="introForm.content" style="width: 218px;" type="textarea"></el-input>
				</el-form-item>
				
				<el-form-item label="联系方式" label-width="120" prop="name">
					<el-input v-model="introForm.contact" style="width: 218px;" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="地    址" label-width="120" prop="name">
					<el-input v-model="introForm.address" style="width: 218px;" type="textarea"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				introForm: {}
			}
		},
		methods:{
			async onSubmit(){
				let intro = this.introForm.name+'|'+ this.introForm.content+'|'+this.introForm.contact+'|'+this.introForm.address
				let {data: res} = await this.$http.post('/admin/setAboutUs',{intro})
				if(res.status == 0){
					return this.$message.success('提交成功！')
				}
			}
		}
	}
</script>

<style>
</style>
