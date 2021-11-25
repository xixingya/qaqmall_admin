<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="logo_box">
        <img
          style="height:60px"
        />
        <span>qaqmall后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >
        退出
      </el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <!-- 侧边栏菜单 -->
        <div
          class="togger_button"
          @click="toggleButton"
        >
          |||
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location" />
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActive('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu" />
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>  
</template>

<script>
export default {
  created () {
    
  },
  data () {
    return {
      menuList: [
		  {id:1,  authName: '用户管理',children: [{id:4, path:'users', authName: '用户列表'}]},
		  {id:2,  authName: '商品管理',children: [{id:5, path:'goods', authName: '商品列表'}]},
		  {id:3,  authName: '订单管理',children: [{id:6, path:'order', authName: '订单列表'}]},
		  {id:4,  authName: '系统设置',children: [
			  {id:7, path:'goods_catagoreis', authName: '添加分类'},
			  {id:8, path:'factory_catagoreis', authName: '厂家列表'},
			  {id:9,path:'notice',authName: '更新公告'},
			  {id:10,path:'aboutus',authName: '关于我们'}]}
	  ],
      isCollapse: false,
      activePath: ''

    }
  },
  methods: {
    logout () {
      // 清楚token
      window.sessionStorage.clear()
      // 重定向登录页
      this.$router.push('/')
    },
    
    toggleButton () {
      this.isCollapse = !this.isCollapse
    },
    saveActive (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right: none;
  }
  .togger_button{
      background-color: #4a5064;
      text-align: center;
      line-height: 24px;
      color: #fff;
      letter-spacing: 0.2em;
      font-size: 10px;
      cursor: pointer;
  }
}
.el-main {
  background-color: #eeedf1;
}
.home_container {
  height: 100%;
}
</style>
