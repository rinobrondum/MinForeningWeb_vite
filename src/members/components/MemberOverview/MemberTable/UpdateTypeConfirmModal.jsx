import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {get, includes} from 'lodash'
import {compose} from 'recompose'
import {withTranslation} from 'react-i18next'
import {ConfirmModal, Image, Text, Button, Flex, Box} from 'components'
import {GroupList} from 'groups/components'
import {getNestedGroupsArray} from 'groups/selectors'
import {types, typeIds} from 'members/constants'
import {getMember, getMemberLeaderGroups} from 'members/selectors'
import {addMembersToGroups} from 'groups'

class UpdateTypeConfirmModal extends Component {
  state = {
    groupBulk: get(this.props, 'leaderGroups', []).map((id) => `${id}`),
  }

  toggleGroup = ({target: {checked, value}}) => {
    this.setState(({groupBulk}) => ({
      groupBulk: !checked
        ? groupBulk.filter((groupId) => groupId !== value)
        : [...groupBulk, value],
    }))
  }

  renderBody = () => {
    const {
      t,
      member: {headerImage, firstName, surname},
    } = this.props

    return (
      <Fragment>
        <Flex flexDirection="column" alignItems="center" p={3}>
          {headerImage && (
            <Box mb={3}>
              <Image round src={headerImage} height="45" />
            </Box>
          )}
          <Box mb={3}>
            <Text bold secondary center>
              {firstName} {surname}
            </Text>
          </Box>
          <Box width={200}>
            <Text center secondary small>
              {t('Hvilke grupper vil du gøre {{name}} gruppeleder af?', {
                name: firstName,
              })}
            </Text>
          </Box>
        </Flex>
        <GroupList
          groups={this.props.groups}
          bulk={this.state.groupBulk}
          toggleGroup={this.toggleGroup}
        />
      </Fragment>
    )
  }

  accept = () => {
    const {accept} = this.props
    const {groupBulk: addGroups} = this.state
    const removeGroups = get(this.props, 'leaderGroups', [])
      .map((id) => `${id}`)
      .filter((id) => !includes(addGroups, id))

    accept(this.isGroupLead ? {addGroups, removeGroups} : {})
  }

  get isGroupLead() {
    const {typeId, inactive} = this.props

    return !inactive && typeIds[typeId] === types.GROUP_LEAD.name
  }

  render() {
    const {typeId, inactive, t, ...props} = this.props

    return (
      <ConfirmModal
        {...props}
        accept={this.accept}
        title={t('Redigér rettigheder')}
        renderBody={this.isGroupLead && this.renderBody}
        renderButtons={
          this.isGroupLead
            ? ({accept}) => (
                <Button small primary onClick={accept}>
                  {t('Godkend')}
                </Button>
              )
            : null
        }
      />
    )
  }
}

UpdateTypeConfirmModal.defaultProps = {
  leaderGroups: [],
}

const enhancer = compose(
  withTranslation(),
  connect(
    (state, {memberId}) => ({
      member: getMember(state, memberId),
      groups: getNestedGroupsArray(state),
      leaderGroups: getMemberLeaderGroups(state, memberId),
    }),
    {
      addMembersToGroups: addMembersToGroups.requested,
    }
  )
)

export default enhancer(UpdateTypeConfirmModal)
