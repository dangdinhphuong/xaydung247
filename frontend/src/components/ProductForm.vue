<template>
  <a-form @submit.prevent="handleSubmit" layout="vertical" :model="form">
    <a-form-item label="Tên sản phẩm">
      <a-input v-model:value="form.name" required />
    </a-form-item>
    <a-form-item label="Giá bán">
      <a-input-number v-model:value="form.retailPrice" :min="0" style="width: 100%" required />
    </a-form-item>
    <a-form-item label="Giá vốn">
      <a-input-number v-model:value="form.costPrice" :min="0" style="width: 100%" required />
    </a-form-item>
    <a-form-item label="Tồn kho">
      <a-input-number v-model:value="form.stock" :min="0" style="width: 100%" required />
    </a-form-item>
    <a-form-item label="Đơn vị">
      <a-input v-model:value="form.unit" required />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Thêm sản phẩm</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref } from 'vue';
import { addProduct } from '../services/api';
import { message } from 'ant-design-vue';

const emit = defineEmits(['product-added']);
const form = ref({
  name: '',
  retailPrice: null,
  costPrice: null,
  stock: null,
  unit: ''
});

const handleSubmit = async () => {
  try {
    await addProduct(form.value);
    emit('product-added');
    message.success('Thêm sản phẩm thành công!');
    form.value = { name: '', retailPrice: null, costPrice: null, stock: null, unit: '' };
  } catch (err) {
    message.error('Lỗi: ' + (err.response?.data?.error || err.message));
  }
};
</script>

<style scoped>
.product-form { display: flex; flex-direction: column; gap: 10px; max-width: 300px; }
.product-form label { font-weight: bold; }
.product-form input { padding: 4px; }
.product-form button { margin-top: 10px; }
</style> 