<template>
  <div id="app">
    <!-- 路由出口，也就是所有的页面内容都是展示在这 -->
    <!-- <router-view></router-view> -->

    <!--
      keep-alive 组件：能够帮我们缓存组件的状态
     -->
    <keep-alive>
      <!-- 这里是会被缓存的视图组件 -->
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>

    <!-- 这里是不被缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive">
    </router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style>
  #app {
    height: 100%;
  }
</style>
