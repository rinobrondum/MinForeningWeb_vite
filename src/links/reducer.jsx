import {handleActions} from 'redux-actions'
import get from 'lodash/get'
import omit from 'lodash/omit'
import {fetch as fetchClubs} from 'clubs/actions'
import * as actions from './actions'

const initialState = {
  isFetching: false,
  entities: {},
}

const reducer = handleActions(
  {
    [fetchClubs.succeeded]: (state, action) => ({
      ...state,
      entities: get(action, 'payload.entities.links', {}),
    }),

    [actions.create.succeeded]: (
      state,
      {
        payload: {
          entities: {links},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...links,
      },
    }),

    [actions.deactivate.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: omit(state.entities, id),
    }),
  },
  initialState
)

export default reducer
