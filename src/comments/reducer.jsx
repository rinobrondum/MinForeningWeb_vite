import {handleActions} from 'redux-actions'
import {fetch as fetchActivities, addComment} from 'activities/actions'

const initialState = {
  entities: {},
}

const reducer = handleActions(
  {
    [fetchActivities.succeeded]: (state, {payload}) => ({
      entities: payload.entities ? payload.entities.comments : {},
    }),

    [addComment.succeeded]: (
      state,
      {
        payload: {
          comments: {
            entities: {comments},
          },
        },
      }
    ) => ({
      entities: {
        ...state.entities,
        ...comments,
      },
    }),
  },
  initialState
)

export default reducer
