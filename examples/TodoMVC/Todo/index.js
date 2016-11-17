import actions from './actions'
import view, {componentDidUpdate} from './view'
import reducers from './reducers'

function Todo () {
  return {
    initialState: {
      editing: false,
      inputVal: ''
    },
    actions,
    reducers,
    view,
    componentDidUpdate
  }
}

export default Todo
