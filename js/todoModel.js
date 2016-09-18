/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
'use strict'
var app = app || {}

var Utils = app.Utils
var graphQL = Utils.graphql

app.TodoModel = function (key) {
	this.key = key
	this.todos = []
	graphQL = graphQL.bind(null, this)
	graphQL(
		{
			queryName: 'todos',
			queryString: 'query { todos { id, title, completed } }',
			callback: (model, data) => {
				console.log(JSON.stringify(data))
				model.todos = data
				model.inform()
			}
		})
	this.onChanges = []
}

app.TodoModel.prototype.subscribe = function (onChange) {
	this.onChanges.push(onChange)
}

app.TodoModel.prototype.inform = function () {
	this.onChanges.forEach((cb) => cb())
}

app.TodoModel.prototype.addTodo = function (title) {
	var queryString = `mutation { add (title: "${title}") { id, title, completed } }`
	graphQL({
		queryName: 'add',
		queryString: queryString,
		callback: (model, data) => {
			console.log(data)
			model.todos.push(data)
			model.inform()
		}
	})
}

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		// this.todos = this.todos.map(function (todo) {
		// 	return Utils.extend({}, todo, {completed: checked});
		// });

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		// this.todos = this.todos.map(function (todo) {
		// 	return todo !== todoToToggle ?
		// 		todo :
		// 		Utils.extend({}, todo, {completed: !todo.completed});
		// });

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
		console.log(JSON.stringify(todo))

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		// this.todos = this.todos.map(function (todo) {
		// 	return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		// });

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

//})();
