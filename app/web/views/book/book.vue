<template>
  <app-content>
    <template v-if="book">
      <h1>书名：{{ book.works.title }}</h1>
      <h3>作者：{{ book.works.author[0].name }}</h3>
      <div class="summary">标签：{{ summary }}</div>
    </template>
    <p v-else>暂无此书</p>
  </app-content>
</template>
<script>
import { mapState } from "vuex";
export default {
  async asyncData({ store }) {
    await store.register("book");
    await store.once("dispatch", "book", "getList");
  },
  computed: {
    ...mapState("book", ["list"]),
    summary() {
      let a = [];
      for (let i = 0; i < this.book.works.highlightTags.length; i++) {
        const element = this.book.works.highlightTags[i];
        a.push(element.name);
      }
      return a.join(",");
    },

    book() {
      this.id = this.$route.params.id;
      let data = null;

      for (let i = 0; i < this.list.length; i++) {
        for (let j = 0; j < this.list[i].list.length; j++) {
          const element = this.list[i].list[j];
          if (element.works.id == this.id) {
            data = element;
            break;
          }
        }
      }
      return data;
    },
  },
};
</script>
