var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        isDone: false
    },
    idAttribute: '_id',
    toggle: function () {
        this.save({
            isDone: !this.get('isDone')
        });
    }
});


app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    url: '/api/todo/tasks',

    completed: function () {
        return this.filter(function (todo) {
            return todo.get('isDone');
        });
    },
    remaining: function () {
        return this.without.apply(this, this.completed());
    },
    nextOrder: function () {
        if (!this.length) {
            return 1;
        }
        return this.last().get('order') + 1;
    },
    comparator: function (todo) {
        return todo.get('order');
    }
});


app.Todos = new app.TodoList();


app.AppView = Backbone.View.extend({

    el: '#todoapp',
    tpl_statusbar: _.template($('#status-bar').html()),

    events: {
        'keypress #new-task': 'createOnEnter',
        'click #clear-completed': 'cleawrCompleted',
        'click #toggle-all': 'toggleAllCompleted',
        'click #show-task-completed': 'showTaskCompleted'
    },

    initialize: function () {
        this.$allCheckbox = this.$('#toggle-all');
        this.$input = this.$('#new-task');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        // change 后面接的是 监听的属性。这里监听的是 isDone 属性，如果 isDone 发生了变化，执行 filterOne()
        this.listenTo(app.Todos, 'change:isDone', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch();
    },

    render: function () {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.tpl_statusbar({
                completed: completed,
                remaining: remaining
            }));

            //this.$('#filters li a')
            //    .removeClass('selected')
            //    .filter('[href="/' + (app.TodoFilter || '' ) + ')]')
            //    .addClass('selected');

        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        if (completed) {
            this.$('#show-task-completed').show();
        } else {
            this.$('#show-task-completed').hide();
        }
        this.$allCheckbox.checked = !remaining;
    },

    addOne: function (todo) {
        var view = new app.TodoView({model: todo});
        if (todo.get('isDone')) {
            this.$('#task-completed').append(view.render().el);
        } else {
            this.$('#task-list').append(view.render().el);
        }
    },

    addAll: function () {
        this.$('#task-list').html('');

        app.Todos.each(this.addOne, this);
    },

    filterOne: function (todo) {
        todo.trigger('visible');
        var view = new app.TodoView({model: todo});
        if (todo.get('isDone')) {
            this.$('#task-completed').append(view.render().el);
        } else {
            this.$('#task-list').append(view.render().el);
        }
    },

    filterAll: function () {
        app.Todos.each(this.filterOne, this);
    },

    newAttributes: function () {
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },

    createOnEnter: function (event) {
        if (event.which !== 13 || !this.$input.val().trim()) {
            return;
        }
        app.Todos.create(this.newAttributes());
        this.$input.val('');
    },

    clearCompleted: function () {
        _.invoke(app.Todos.completed(), 'destory');
        return false;
    },

    toggleAllCompleted: function () {
        var completed = this.$allCheckbox.prop('checked');
        console.log(completed);
        app.Todos.each(function (todo) {
            todo.save({
                'isDone': completed
            });
        });
    },

    showTaskCompleted: function (e) {
        this.$('#task-completed').toggle('show');
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

});


app.TodoView = Backbone.View.extend({
    tagName: 'div',
    className: 'taskbox',
    template: _.template($('#task-template').html()),
    events: {
        'dblclick .task-content': 'edit',
        'keypress .task-content': 'updateOnEnter',
        'blur .edit': 'close',
        'click .checker': 'toggleCompleted',
        'click .delete': 'clear'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$('.task-content input');
        this.$taskContent = this.$('.task-content');

        this.$el.toggleClass('done', this.model.get('isDone'));
        //this.toggleVisible();


        // footer


        return this;
    },

    edit: function () {
        this.$taskContent.addClass('editing');
        this.$input.focus();
    },

    close: function () {
        var value = this.$input.val().trim();
        if (value) {
            console.log(value);
            this.model.save({title: value});
        } else {
            this.clear();
        }
        this.$taskContent.removeClass('editing');
    },

    updateOnEnter: function (e) {
        if (e.which === 13) {
            this.close();
        }
    },

    toggleVisible: function () {
        //this.$el.toggleClass('hidden', this.isHidden());
        this.$el.toggleClass('hidden');
        this.$el.remove();
    },

    isHidden: function () {
        var isDone = this.model.get('isDone');
        return ((!isDone && app.TdoFilter === 'completed') || (isDone && app.TodoFilter === 'active'));
    },

    toggleCompleted: function () {
        this.model.toggle();
    },

    clear: function () {
        this.model.destory();
    }

});


$(document).ready(function () {
    new app.AppView();
});