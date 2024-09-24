import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMemberIds } from 'members/selectors'
import { bulk } from 'members/actions'

const CheckAll = ({ add, remove, memberIds }) => (
  <input
    type="checkbox"
    onChange={e => (e.target.checked ? add(memberIds) : remove(memberIds))}
  />
)

const mapStateToProps = state => ({
  memberIds: getMemberIds(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      add: bulk.add,
      remove: bulk.remove,
    },
    dispatch
  )

const enhancer = connect(mapStateToProps, mapDispatchToProps)

export default enhancer(CheckAll)
