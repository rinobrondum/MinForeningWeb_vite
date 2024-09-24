import {handleActions, combineActions} from 'redux-actions'
import {omit} from 'lodash'
import * as actions from './actions'

const initialState = {
  entities: {},  
  totalViews: null,
  views: null,
  exemptList: [],

  isFetchingNoSponsor: false,
  noSponsorEntities: [],

  isFetchingExemptionRoles: false,
  exemptionRolesEntities: [],
}

const reducer = handleActions(
  {
    [actions.setViews]: (state, {payload: {views, totalViews}}) => ({
      ...state,
      views,
      totalViews,
    }),

    [combineActions(
      actions.fetch.succeeded,
      actions.create.succeeded,
      actions.update.succeeded,      
    )]: (
      state,
      {
        payload: {
          entities: {sponsors},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...sponsors,
      },
    }),    

    [actions.buyViews.succeeded]: (state, {payload: count}) => ({
      ...state,
      totalViews: state.totalViews + count,
    }),

    [actions.remove.succeeded]: ({entities, ...state}, {payload: id}) => ({
      ...state,
      entities: omit(entities, id),
    }),

    [actions.fetchNoSponsor.succeeded]: (state, action) => ({
      ...state,
      isFetchingNoSponsor: false,
      noSponsorEntities: action.payload,
    }),

    [actions.fetchExemptionUserRoles.succeeded]: (state, action) => ({
      ...state,
      isFetchingExemptionRoles: false,
      exemptionRolesEntities: action.payload,
    }),

    [actions.updateExemptUserRoles.succeeded]: (state, action) => ({
      ...state,      
     // exemptionRolesEntities: true,
    }),

  },
  initialState,
)

export default reducer
