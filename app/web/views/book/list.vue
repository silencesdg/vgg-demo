<template>
  <app-content>
    <h1>豆瓣图书榜单</h1>
    <p v-if="isLoading">正在加载中</p>
    <template v-else>
      <ul v-if="list.length > 0" v-for="subList in list" :key="subList.type">
        <h3>{{subList.name}}</h3>
        <ul v-if="subList.list.length > 0" class="list">
          <li v-for="book in subList.list" :key="book.works.id">{{book.works.title}}</li>
        </ul>
      </ul>
      <p v-else>暂无</p>
    </template>
  </app-content>
</template>
<script>
import { mapState, mapActions } from "vuex";
import bookItem from "./book_item.vue";
export default {
  async asyncData({ store }) {
    await store.register("book");
    await store.dispatch("book/getList");
  },
  computed: {
    ...mapState("book", ["list", "isLoading"])
  },
  components: {
    bookItem
  }
};
</script>
<style scoped>
.list {
  list-style: none;
  padding: 10px;
  margin: 0;
}
</style>
