import {handleActions} from 'redux-actions'

const initialState = {
  isFetching: false,
  entities: {
    0: {
      firstName: 'Kasper',
      surname: 'Jensen',
      birthdate: new Date(1992, 10, 13),
    },
    1: {
      firstName: 'Emil',
      surname: 'Jensen',
      birthdate: new Date(1994, 10, 13),
    },
  },
}

const reducer = handleActions({}, initialState)

export default reducer
