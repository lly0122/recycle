export default function reducers (sources) {
  return [
    sources.actions
      .filterByType('editTodo')
      .reducer(editTodo),

    sources.actions
      .filterByType('toggleTodo')
      .reducer(toggleTodo),

    sources.actions
      .filterByType('toggleAll')
      .reducer(toggleAll),

    sources.actions
      .filterByType('deleteTodo')
      .reducer(deleteTodo),

    sources.actions
      .filterByType('deleteCompleted')
      .reducer(deleteCompleted),

    sources.actions
      .filterByType('insertTodo')
      .reducer(insertTodo),

    sources.actions
      .filterByType('inputVal')
      .reducer(inputVal)
  ]
}


function insertTodo (state, action) {
  let lastId = state.list.length > 0
   ? state.list[state.list.length - 1].id : 0

  state.list.push({
    id: lastId + 1,
    title: action.payload,
    completed: false
  })

  return state
}

function editTodo (state, action) {
  let todo = state.list.find(todo => todo.id === action.id)
  todo.title = action.title

  return state
}

function toggleTodo (state, action) {
  let todo = state.list.find(todo => todo.id === action.id)
  todo.completed = !todo.completed

  return state
}

function toggleAll (state, action) {
  let amountCompleted = state.list
    .filter(todoData => todoData.completed)
    .length

  let amountActive = state.list.length - amountCompleted

  state.list.forEach(todo => {
    todo.completed = (amountActive) ? true : false
  })

  return state
}

function deleteTodo (state, action) {
  state.list = state.list
    .filter(todo => !(todo.id === action.id))

  return state
}

function deleteCompleted (state, action) {
  state.list = state.list
    .filter(todo => todo.completed === false)

  return state
}

function inputVal (state, action) {
  state.inputVal = action.payload

  return state
}
