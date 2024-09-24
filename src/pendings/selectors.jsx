import {createSelector} from 'reselect'
import objectToArray from 'lib/objectToArray'

export const getPendings = (state) => state.pendings.entities
export const getPendingsArray = createSelector([getPendings], (pendings) =>
  objectToArray(pendings)
)
