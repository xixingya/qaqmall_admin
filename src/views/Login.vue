<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="avatar_box">
				<img src="../assets/logo.png" alt="">
			</div>
			<!-- 表单区域 -->
			<el-form ref="LoginFormRef" :rules="LoginFormRules" class="login_form" label-width="0px" :model="Login_Form">
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input v-model="Login_Form.username" prefix-icon="el-icon-user-solid" />
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input v-model="Login_Form.password" prefix-icon="el-icon-star-on" type="password" />
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login">
						登录
					</el-button>
					<el-button type="info" @click="resetLoginForm">
						重置
					</el-button>
				</el-form-item>
			</el-form>
			<!--验证码弹窗-->
			<el-popover popper-class="slidingPictures" ref="popover" trigger="manual" v-model="visible">
				<div class="sliding-pictures">
					<div class="vimg">
						<canvas id="sliderBlock"></canvas>
						<canvas id="codeImg"></canvas>
					</div>
					<div class="slider">
						<div class="track" :class="{ pintuTrue: puzzle }">
							{{ tips }}
						</div>
						<div class="button el-icon-s-grid" @mousedown.prevent="drag"></div>
					</div>
					<div class="operation">
						<span title="关闭验证码" @click="visible = false" class="el-icon-circle-close"></span>
						<span title="刷新验证码" @click="canvasInit" class="el-icon-refresh-left"></span>
					</div>
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				tips: "拖动左边滑块完成上方拼图",
				visible: false,
				//拼图是否正确
				puzzle: false,
				//滑块x轴数据
				slider: {
					mx: 0,
					bx: 0
				},
				// 登陆表单的数据绑定对象
				// xixingya
				// 123456
				Login_Form: {
					username: '',
					password: ''
				},
				// 验证规则
				LoginFormRules: {
					// 验证用户名
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 25,
							message: '长度在 2 到 25 个字符',
							trigger: 'blur'
						}
					],
					// 验证密码
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 15,
							message: '长度在 3 到 15 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		watch: {
			visible(e) {
				if (e === true) {
					this.canvasInit();
					this.puzzle = false;
				}
			}
		},
		methods: {
			//拼图验证码初始化
			canvasInit() {
				//生成指定区间的随机数
				const random = (min, max) => {
					return Math.floor(Math.random() * (max - min + 1) + min);
				};
				//x: 254, y: 109
				let mx = random(127, 244),
					bx = random(10, 128),
					y = random(10, 99);
				this.slider = {
					mx,
					bx
				};
				this.draw(mx, bx, y);
			},

			//鼠标按下
			drag(e) {
				let dom = e.target; //dom元素
				let slider = document.querySelector("#sliderBlock"); //滑块dom
				const downCoordinate = {
					x: e.x,
					y: e.y
				};
				//正确的滑块数据
				let checkx = Number(this.slider.mx) - Number(this.slider.bx);
				//x轴数据
				let x = 0;
				const move = moveEV => {
					x = moveEV.x - downCoordinate.x;
					//y = moveEV.y - downCoordinate.y;
					if (x >= 251 || x <= 0) return false;
					dom.style.left = x + "px";
					//dom.style.top = y + "px";
					slider.style.left = x + "px";
				};

				const up = () => {
					document.removeEventListener("mousemove", move);
					document.removeEventListener("mouseup", up);
					dom.style.left = "";

					let max = checkx;
					let min = checkx - 10;
					// console.log(max, min)
					// console.log(x, checkx);
					//允许正负误差1
					if ((max >= x && x >= min) || x === checkx) {
						// console.log("滑动解锁成功");
						this.puzzle = true;
						this.tips = "验证成功";
						setTimeout(() => {
							this.visible = false;
							// 发送注册请求
							this.submitLogin()
						}, 500);
					} else {
						console.log("拼图位置不正确");
						this.tips = "验证失败，请重试";
						this.puzzle = false;
						this.canvasInit();
					}
				};
				document.addEventListener("mousemove", move);
				document.addEventListener("mouseup", up);
			},
			draw(mx = 200, bx = 20, y = 50) {
				let mainDom = document.querySelector("#codeImg");
				let bg = mainDom.getContext("2d");
				let width = mainDom.width;
				let height = mainDom.height;
				let blockDom = document.querySelector("#sliderBlock");
				let block = blockDom.getContext("2d");
				//重新赋值，让canvas进行重新绘制
				blockDom.height = height;
				mainDom.height = height;
				let imgsrc = require("../assets/back.jpg");
				let img = document.createElement("img");
				img.style.objectFit = "scale-down";
				img.src = imgsrc;
				img.onload = function() {
					bg.drawImage(img, 0, 0, width, height);
					block.drawImage(img, 0, 0, width, height);
				};
				let mainxy = {
					x: mx,
					y: y,
					r: 9
				};
				let blockxy = {
					x: bx,
					y: y,
					r: 9
				};
				this.drawBlock(bg, mainxy, "fill");
				this.drawBlock(block, blockxy, "clip");
			},
			//绘制拼图
			drawBlock(ctx, xy = {
				x: 254,
				y: 109,
				r: 9
			}, type) {
				let x = xy.x,
					y = xy.y,
					r = xy.r,
					w = 40;
				let PI = Math.PI;
				//绘制
				ctx.beginPath();
				//left
				ctx.moveTo(x, y);
				//top
				ctx.arc(x + (w + 5) / 2, y, r, -PI, 0, true);
				ctx.lineTo(x + w + 5, y);
				//right
				ctx.arc(x + w + 5, y + w / 2, r, 1.5 * PI, 0.5 * PI, false);
				ctx.lineTo(x + w + 5, y + w);
				//bottom
				ctx.arc(x + (w + 5) / 2, y + w, r, 0, PI, false);
				ctx.lineTo(x, y + w);
				ctx.arc(x, y + w / 2, r, 0.5 * PI, 1.5 * PI, true);
				ctx.lineTo(x, y);
				//修饰，没有会看不出效果
				ctx.lineWidth = 1;
				ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
				ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
				ctx.stroke();
				ctx[type]();
				ctx.globalCompositeOperation = "xor";
			},


			// 重置按钮
			resetLoginForm() {
				console.log(this)
				this.$refs.LoginFormRef.resetFields()
			},
			login() {
				this.$refs.LoginFormRef.validate((valid) => {
					if (!valid) {return}
					this.visible = !this.visible
				})
			},
			// 发送登陆请求
			async submitLogin() {
				const {data: res} = await this.$http.post('/user/login', this.Login_Form)
				// console.log(res)
				if (res.status == 0) {
					if (res.data.role == 1) {
						this.$message.success('登陆成功')
						// 保存token
						const token = res.data.tokenHead + ' ' + res.data.token
						// console.log(token)
						// 保存token在sessiong中
						window.sessionStorage.setItem('token', token)
						// 跳转后台主页
						this.$router.push('home')
					} else {
						this.$message.error('权限不够，请联系管理员哦！')
					}
				} else {
					return this.$message.error(res.msg)
				}
			}
		}

	}
</script>
<style>
	.slidingPictures {
		padding: 0;
		width: 300px;
		border-radius: 2px;
	}
</style>
<!-- Add "scoped" attribe to limit CSS to this component only -->
<style lang="less" scoped>
	.login_container {
		width: 100%;
		height: 100%;
		background-color: #2d3d4d;

		.login_box {
			width: 300px;
			height: 300px;
			// background-color: #fff;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			border-radius: 8px;
			border: 1px solid #ccc;
			background: rgba(57, 108, 158, 0.5);

			.avatar_box {
				width: 100px;
				height: 100px;
				border: 1px solid #ccc;
				position: absolute;
				left: 50%;
				transform: translate(-50%, -50%);
				border-radius: 50%;
				padding: 10px;
				box-shadow: 0 0 10px #eee;
				background-color: #fff;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background-color: #eee;
				}
			}

			.login_form {
				position: absolute;
				bottom: 0;
				padding: 20px;
				width: 100%;
				box-sizing: border-box;

				.btns {
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}

	/*该样式最终是以弹窗插入*/
	.sliding-pictures {
		width: 100%;

		.vimg {
			width: 98%;
			height: 170px;

			#codeImg,
			#sliderBlock {
				padding: 7px 7px 0 7px;
				width: inherit;
				height: inherit;
			}

			#codeImg {
				//display: none;
			}

			#sliderBlock {
				position: absolute;
				z-index: 4000;
			}
		}

		.slider {
			width: 100%;
			height: 65px;
			border-bottom: #c7c9d0 1px solid;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.track {
				margin-left: 7px;
				width: 286px;
				height: 38px;
				background: rgba(28, 136, 188, 0.5);
				border-radius: 25px;
				font-size: 14px;
				line-height: 38px;
				padding-right: 15px;
				padding-left: 70px;
			}

			.pintuTrue {
				background: #67c23a;
				color: #ffffff;
			}

			.button {
				position: absolute;
				width: 50px;
				height: 50px;
				line-height: 48px;
				background: #ffffff;
				box-shadow: #b9bdc8 0 0 3px;
				border-radius: 50%;
				left: 7px;
				text-align: center;
				font-size: 28px;
				color: #3e5d8b;

				&:hover {
					color: #2181bd;
				}
			}
		}

		.operation {
			width: 100%;
			height: 40px;

			>span {
				color: #9fa3ac;
				display: inline-block;
				width: 40px;
				font-size: 25px;
				line-height: 40px;
				text-align: center;

				&:hover {
					background: #e2e8f5;
				}
			}
		}
	}
</style>
