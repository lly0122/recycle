import SingleCounter from './SingleCounter'

export default function MultipleCounters () {
  return {
    initialState: {
      childButtonClicked: 0
    },
    actions: function actions (sources) {
      return [
        sources.childrenActions
          .filterByType('buttonClicked')
          .mapTo({ type: 'childButtonClicked' })
      ]
    },
    reducers: function reducers (sources) {
      return [
        sources.actions
          .filterByType('childButtonClicked')
          .reducer(function increment (state) {
            state.childButtonClicked++
            return state
          })
      ]
    },
    view: function view (state, props, jsx) {
      return (
        <div>
          <div><SingleCounter id='1' /></div>
          <div><SingleCounter id='2' /></div>
          <div><SingleCounter id='3' /></div>
          <div className='message'>
            Total child button clicks: {state.childButtonClicked}
          </div>
        </div>
      )
    }
  }
}
