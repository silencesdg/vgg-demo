<template>
  <app-content>
    <h1>豆瓣图书榜单</h1>
    <p v-if="isLoading">正在加载中</p>
    <template v-else-if="list.length > 0">
      <ul v-for="subList in list" :key="subList.type">
        <h3>{{ subList.name }}</h3>
        <ul v-if="subList.list.length > 0" class="list">
          <li v-for="book in subList.list" :key="book.works.id" @click="onBook(book)">
            {{ book.works.title }}
          </li>
        </ul>
      </ul>
    </template>
    <p v-else>暂无</p>
  </app-content>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  async asyncData({ store }) {
    await store.register("book");
    await store.dispatch("book/getList")
    console.log("++++++++++++++++++++++");
  },
  mounted() {
    // this.getList();
  },
  computed: {
    ...mapState("book", ["list", "isLoading"]),
  },
  methods: {
    ...mapActions("book", ["getList"]),
    onBook(item) {
      console.log(item.works.title)
      this.$router.push('/book/'+item.works.id)
      // window.location.href += `/${item.works.id}`;
    },
  },
};
</script>
<style scoped>
.list {
  list-style: none;
  padding: 10px;
  margin: 0;
}
</style>
