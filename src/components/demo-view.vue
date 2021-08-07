<template>
  <div class="demo-view">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'demo-view',
  }
</script>

<style lang="less">
  .demo-view {
    padding: 20px 10px;
    border: 1px solid #eeeeee;
  }
</style>