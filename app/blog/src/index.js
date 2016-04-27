require('./css/blog.less');


import Vue from 'vue';
import Router from 'vue-router';

import AppView from './components/app.vue';
import MarkNoteView from './components/marknote.vue';
import ArticleView  from './components/article.vue';
import ArticlesView from './components/articles.vue';

Vue.use(Router);

var router = new Router();

router.map({
  '/articles': {
    component: ArticlesView
  },
  '/articles/:id': {
    name: 'articles',
    component: ArticleView
  },
  '/editor': {
    component: MarkNoteView
  }
});

router.redirect({
  // '/': 'articles'
});
// var App = Vue.extend({});

router.start(AppView, '#app');
