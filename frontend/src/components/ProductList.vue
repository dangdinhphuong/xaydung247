<template>
  <div>
    <h2>Danh sách sản phẩm</h2>
    <a-table :dataSource="products" :columns="columns" rowKey="_id" bordered />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getProducts } from '../services/api';

const props = defineProps({ reload: Boolean });
const products = ref([]);

const columns = [
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Giá bán', dataIndex: 'retailPrice', key: 'retailPrice' },
  { title: 'Giá vốn', dataIndex: 'costPrice', key: 'costPrice' },
  { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
  { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' }
];

const fetchProducts = async () => {
  try {
    products.value = await getProducts();
  } catch (err) {
    alert('Lỗi tải sản phẩm: ' + (err.response?.data?.error || err.message));
  }
};

onMounted(fetchProducts);
watch(() => props.reload, fetchProducts);
</script>

<style scoped>
table { border-collapse: collapse; width: 100%; margin-top: 10px; }
th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
th { background: #f5f5f5; }
</style> 