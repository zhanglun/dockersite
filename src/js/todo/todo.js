var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        done: false
    },
    idAttribute: '_id',
    toggle: function () {
        this.save({
            completed: !this.get('done!')
        });
    }
});


app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    url: '/api/todo/tasklist',

    completed: function () {
        return this.filter(function (todo) {
            return todo.get('completed');
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
        'click #toggle-all': 'toggleAllCompleted'
    },

    initialize: function () {
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-task');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        this.listenTo(app.Todos, 'change:completed', this.filterOne);
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

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="/' + (app.TodoFilter || '' ) + ')]')
                .addClass('selected');

        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        console.log();
        this.allCheckbox.checked = !remaining;
    },

    addOne: function (todo) {
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
    },

    addAll: function () {
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    filterOne: function (todo) {
        todo.trigger('visible');
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

    toggleAllComplete: function () {
        var completed = this.allCheckbox.checked;
        app.Todos.each(function (todo) {
            todo.save({
                'completed': completed
            });
        });
    }

});


app.TodoView = Backbone.View.extend({
    tagName: 'div',
    className: 'taskbox',
    template: _.template($('#task-template').html()),
    events: {
        'click .task-content': 'edit',
        'keypress .task-content': 'updateOnEnter',
        'blur .edit': 'close'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$('.task-content input');
        this.$taskContent = this.$('.task-content');
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
        }
        this.$taskContent.removeClass('editing');
    },

    updateOnEnter: function (e) {
        if (e.which === 13) {
            this.close();
        }
    }

});


$(document).ready(function () {
    new app.AppView();
});