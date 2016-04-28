import './css/blog.less';

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';

import AppView from './components/app.vue';
import MarkNoteView from './components/marknote.vue';
import ArticleListView  from './components/articleList.vue';
import ArticleDetailView from './components/articleDetail.vue';

Vue.use(Router);
Vue.use(VueResource);

Vue.http.options.root = 'http://localhost:1234/blog/api';
Vue.http.headers.common.Authorization = 'Basic YXBpOnBhc3N3b3Jk';

const router = new Router();
router.map({

  '/articles': {
    component: ArticleListView
  },

  '/articles/:id': {
    name: 'articles',
    component: ArticleDetailView
  },

  '/editor': {
    component: MarkNoteView
  },

  '/editor/:id': {
    name: 'editor',
    component: MarkNoteView
  }

});

router.redirect({
  '*': '/articles'
});

router.start(AppView, '#app');
