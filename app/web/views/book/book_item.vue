<template>
  <li class="book-item">
    <router-link :to="book.id | link">
      <img :src="book.works.cover" alt="book.title">
      <h3>{{bbook.works.cover}}</h3>
      <p>
        <span>{{bbook.works.author.name}}</span>
      </p>
    </router-link>
  </li>
</template>
<script>
export default {
  props: {
    book: {
      default() {
        return {};
      }
    }
  },
  filters: {
    link(id) {
      return `/book/${id}`;
    }
  }
};
</script>
<style scoped>
.book-item {
  list-style: none;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  height: 140px;
}
.book-item img {
  float: left;
}
.book-item h3,
.book-item p {
  margin-left: 115px;
}
.book-item .price {
  float: right;
  color: #f60;
}
</style>
