/**
 * 聚合组件
 *
 */
import _ from "lodash";
import Wrapper from "./wrapper.vue";
import Content from "./content.vue";

const components = {
  Wrapper,
  Content
};

const prefix = "app-";

export default {
  install(Vue, opts) {
    _.each(components, (component, key) => {
      let name = prefix + _.kebabCase(key);
      Vue.component(name, component);
    });
  }
};
