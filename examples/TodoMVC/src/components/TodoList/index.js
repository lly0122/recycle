import view from './view'
import Todo from '../Todo'
import { toggleTodo, deleteTodo, editTodo, deleteCompleted, toggleAll, insertTodo, inputVal } from './reducers'
import { ENTER_KEY, ESC_KEY, updateLocalStorage, getFromLocalStorage } from '../../utils'

export default function TodoList () {
  return {
    initialState: {
      inputVal: '',
      list: getFromLocalStorage()
    },

    reducers (sources) {
      return [
        sources.select(Todo)
          .on('toggle')
          .reducer(toggleTodo),

        sources.select(Todo)
          .on('destroy')
          .reducer(deleteTodo),

        sources.select(Todo)
          .on('titleChanged')
          .reducer(editTodo),

        sources.selectClass('clear-completed')
          .on('click')
          .reducer(deleteCompleted),

        sources.selectClass('toggle-all')
          .on('click')
          .reducer(toggleAll),

        sources.selectClass('new-todo')
          .on('change')
          .map(e => e.target.value)
          .reducer(inputVal),

        sources.selectClass('new-todo')
          .on('keyDown')
          .filter(e => e.keyCode === ENTER_KEY)
          .map(e => e.target.value.trim())
          .filter(val => val.length > 0)
          .reducer(insertTodo),

        sources.selectClass('new-todo')
          .on('keyDown')
          .filter(e => e.keyCode === ESC_KEY)
          .mapTo('')
          .reducer(inputVal)
      ]
    },

    view (props, state) {
      return view({
        todos: state.list,
        filter: props.route.filter,
        inputVal: state.inputVal
      })
    },

    componentDidUpdate ({ state }) {
      updateLocalStorage(state)
    }
  }
}
