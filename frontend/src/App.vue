<script setup>
import { ref } from 'vue';
import ProductForm from './components/ProductForm.vue';
import ProductList from './components/ProductList.vue';
</script>

<template>
  <div style="padding: 30px; max-width: 800px; margin: auto;">
    <h1>POS - Quản lý sản phẩm</h1>
    <ProductForm @product-added="reload++" />
    <ProductList :reload="reload" />
  </div>
</template>

<style>
body { font-family: Arial, sans-serif; }
</style>
