import {createStore,combineReducers,applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'

function reducer(state ={},action){
    return {}
}
const reducers = combineReducers({
    index:reducer
})
const store = createStore(reducers,applyMiddleware(promiseMiddleware))

export default store;