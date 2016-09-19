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
			model.todos.push(data)
			model.inform()
		}
	})
}

app.TodoModel.prototype.toggleAll = function (checked) {
	var queryString = 'mutation { toggleAll { id, title, completed } }'
	graphQL({
		queryName: 'add',
		queryString: queryString,
		callback: (model, data) => {
			model.todos = data
			model.inform()
		}
	})
}

app.TodoModel.prototype.toggle = function (todoToToggle) {
	var queryString = `mutation { toggleOne (id: "${todoToToggle.id}") { id, title, completed } }`
	graphQL({
		queryName: 'toggleOne',
		queryString: queryString,
		callback: (model, data) => {
			model.todos = model.todos.map((todo) => {
				return todo.id !== todoToToggle.id
					? todo
					: Utils.extend({}, todo, {completed: data.completed})
			})
			model.inform()
		}
	})
}

app.TodoModel.prototype.destroy = function (todo) {
	var queryString = `mutation { delete (id: "${todo.id}") { id, title, completed } }`
	graphQL({
		queryName: 'delete',
		queryString: queryString,
		callback: (model, data) => {
			model.todos = model.todos.filter((todo) => { return todo.id !== data.id })
			model.inform()
		}
	})
}

app.TodoModel.prototype.save = function (todoToSave, text) {
	var queryString = `mutation { update (id: "${todoToSave.id}", title: "${text}") { id, title, completed } }`
	graphQL({
		queryName: 'update',
		queryString: queryString,
		callback: (model, data) => {
			model.todos = model.todos.map((todo) => {
				return todo.id !== todoToSave.id ? todo : Utils.extend({}, todo, {title: data.title})
			})
			model.inform()
		}
	})
}

app.TodoModel.prototype.clearCompleted = function () {
	var queryString = `mutation { deleteCompleted { id, title, completed } }`
	graphQL({
		queryName: 'deleteCompleted',
		queryString: queryString,
		callback: (model, data) => {
			model.todos = data
			model.inform()
		}
	})
}

