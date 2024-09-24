import React, {useContext, useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {compose, branch, renderNothing} from 'recompose'
import {getActivity} from 'activities/selectors'
import {fetchStatistics} from 'activities/actions'
import ShowModal from './ShowModal'
import validURL from 'lib/ValidURL'

const Container = ({id, activity, fetchStatistics, ...props}) => {
  const [isFetching, setIsFetching] = useState(true)
  const {showCreateModal, archived} = useContext(Context)

  useEffect(() => {
    new Promise((resolve, reject) => {
      fetchStatistics({resolve, reject, id, archived})
    }).then(() => {
      setIsFetching(false)
    })
  }, [fetchStatistics, setIsFetching, id, archived])

  return (
    <ShowModal
      id={id}
      validURL={validURL}
      activity={activity}
      archived={archived}
      showCreateModal={showCreateModal}
      isFetching={isFetching}
      {...props}
    />
  )
}



const enhancer = compose(
  connect(
    (state, {id, activity}) => ({
      activity: activity || getActivity(state, id),
    }),
    {fetchStatistics: fetchStatistics.requested}
  ),
  branch(({activity}) => !activity, renderNothing)
)

export default enhancer(Container)
