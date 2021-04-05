<template>
	<div class="orderList">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 搜索订单 -->
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容" clearable v-model="orderNo">
						<el-button slot="append" icon="el-icon-search" @click="getOrderOne" />
					</el-input>
				</el-col>
			
			</el-row>
			
			<!-- 订单列表 -->
			<el-table 
			border 
			:data="orderList" 
			style="width: 100%"
			:cell-style="cellStyle">
				<el-table-column prop="orderNo" label="订单号" width="180" />
				<el-table-column prop="orderItemVoList" label="商品名称" width="220">
					<template v-slot="scope">
						<span>{{scope.row.orderItemVoList[0].productName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="shippingVo" label="地区">
					<template v-slot="scope">
						<span>{{scope.row.shippingVo.receiverProvince}} {{scope.row.shippingVo.receiverCity}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="payment" label="价格" width="100" align="center"></el-table-column>
				<el-table-column prop="statusDesc" label="状态" width="180" align="center"></el-table-column>
				<el-table-column prop="shippingVo" label="操作" align="center">
					<template v-slot="scope">
						<!-- 修改价格 -->
						<el-button :disabled="scope.row.status===10?false : true" type="text"size="mini" @click="handleUpdate(scope.row)" >修改价格</el-button>
						<!-- 取消订单 -->
						<el-button :disabled="scope.row.status===10?false : true" type="text"size="mini" @click="handleCancel(scope.row)" >取消订单</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 分页 -->
			<el-pagination 
			background 
			@current-change="handleChange" 
			layout="prev, pager, next" 
			:page-size=5 
			:total="total">
			</el-pagination>
			<!-- 修改价格 -->
			<!-- 添加商品弹出框 -->
			<el-dialog title="修改价格" :visible.sync="dialogFormVisible">
				<el-form :model="updatePrice" :rules="rules" ref="priceRef">
					<el-form-item label="商品价格" label-width="120" prop="price">
						<el-input v-model="updatePrice.price" style="width: 218px;"></el-input>
					</el-form-item>
				</el-form>
			
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitUpdatePrice">确 定</el-button>
				</div>
			</el-dialog>
			
		</el-card>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				total: 1,
				orderNo: '',
				orderOne: '',
				orderList: [],
				currentPage: 1,
				updatePrice: {},
				dialogFormVisible: false,
				// 校验
				rules: {
					price: [{
						required: true,
						message: "产品价格不能为空哦！"
					}]
				}
			}
		},
		mounted() {
			this.getOrederList(this.currentPage)
		},
		methods: {
			// 获取所有订单
			async getOrederList(pageNum) {
				let {
					data: res
				} = await this.$http.get(`/admin/order?pageNum=${pageNum}&pageSize=5`)
				if (res.status == 0) {
					this.orderList = res.data.list
					this.total = res.data.total
				}
			},
			
			// 分页
			handleChange(pageNum){
				this.currentPage = pageNum
				this.getOrederList(pageNum)
			},
			
			// 取消订单
			async handleCancel(e){
				let orderNo = e.orderNo
				let {data: res} = await this.$http.patch(`/admin/order/${orderNo}`)
				console.log(res)
				if(res.status !== 0){
					return this.$message.error(res.msg)
				}
				this.getOrederList(this.currentPage)
				return this.$message.success('订单已取消！')
			},
			
			// 搜索订单
			async getOrderOne(){
				this.orderList = []
				if(this.orderNo == ''){
					this.getOrederList(this.currentPage)
				}else{
					let {data: res} = await this.$http.get(`/admin/orderOne?orderNo=${this.orderNo}`)
					if(res.status == 0){
						this.orderList.push(res.data)
						return
					}
				}
			},
			
			// 修改价格
			handleUpdate(e){
				this.updatePrice.orderNo = e.orderNo
				this.dialogFormVisible = true		
			},
			
			// 提交修改
			async submitUpdatePrice(){
				this.$refs.priceRef.validate(async (valid)=>{
					if (!valid) { return }
					let {data: res} = await this.$http.patch(`/admin/orderUpdate`, this.updatePrice )
					if(res.status !== 0){
						return this.$message.error(res.msg)
					}
					this.getOrederList(this.currentPage)
					this.dialogFormVisible = false
					return this.$message.success('修改成功！！')
				})
			},
			
			//列样式
			cellStyle(data){
				if(data.columnIndex === 4&& data.row.status === 0){
					//已取消
					return 'color: #3aaa1b'
				}else if(data.columnIndex === 4&&data.row.status === 20){
					//以支付
					return 'color: #3b47ee'
				}else if(data.columnIndex === 4&&data.row.status === 10){
					//未支付
					return 'color: #ff0000'
				}else if(data.columnIndex === 3){
					return 'color: red'
				}
			}
		}
	}
</script>

<style>
</style>
