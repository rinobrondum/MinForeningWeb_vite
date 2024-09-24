import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Flex, Box} from '@rebass/grid'
import {createStructuredSelector} from 'reselect'
import {withTranslation} from 'react-i18next'
import {
  getIsFetching,
  getNewImportMembers,
  getExistingImportMembers,
  getImportRolesArray,
  getImportGroupsArray,
  upload,
} from 'members'
import {Button, Text, Loading, Link, LinkButton} from 'components'
import PreviewTable from './PreviewTable'
import Roles from './Roles'
import Groups from './Groups'
import Existing from './Existing'
import ImportForm from './ImportForm'
import steps from '../steps'
import countryCodes from 'lib/countryCodes'
import {getActive} from 'clubs'

const localSteps = {
  ROLES: 'roles',
  GROUPS: 'groups',
  MEMBERS: 'members',
  EXISTING: 'existing',
}

class ImportFlow extends Component {
  state = {
    step: null,
  }

  confirm = () =>
    new Promise((resolve, reject) =>
      this.props.confirm({resolve, reject})
    ).then(() => this.props.setStep(steps.DONE))

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.step === null) {
      const {roles, members, groups, existing} = this.props

      if (existing.length > 0) {
        this.setState({step: localSteps.EXISTING})
      } else if (roles.length > 0) {
        this.setState({step: localSteps.ROLES})
      } else if (groups.length > 0) {
        this.setState({step: localSteps.GROUPS})
      } else if (members.length > 0) {
        this.setState({step: localSteps.MEMBERS})
      }
    }
  }

  render() {
    const {
      isFetching,
      members,
      roles,
      groups,
      existing,
      method,
      t,
      club,
    } = this.props
    const {step} = this.state

    return (
      <Flex flexDirection="column" width={700}>
        <Flex flexDirection="column" justifyContent="center">
          <Flex>
            <Box mr={3} width={3 / 4}>
              <Text secondary>
                {t(
                  method === steps.CONVENTUS
                    ? 'Her kan du impotere dine medlemmer, roller og grupper fra en CSV-fil.'
                    : 'Her kan du importere dine medlemmer fra en CSV-fil.'
                )}
                {t('Brug denne skabelon:')}{' '}
                <Link
                  external
                  download
                  primary
                  to={`${process.env.PUBLIC_URL}/files/${
                    method === steps.CONVENTUS
                      ? 'csv_medlemmer_roller_grupper.csv'
                      : 'csv_medlemmer.csv'
                  }`}
                >
                  {t('CSV-medlemsskabelon')}
                </Link>
              </Text>
            </Box>
            <Box width={200}>
              <ImportForm
                method={method === steps.CONVENTUS ? 'conventus' : 'csv'}
              />
            </Box>
          </Flex>
          {isFetching && (
            <Flex mt={2} flexDirection="column" alignItems="center">
              <Box mb={3}>
                <Text secondary>{t('Uploader')}...</Text>
              </Box>
              <Loading />
            </Flex>
          )}

          {members.length === 0 &&
            method === steps.CONVENTUS &&
            (club?.countryCode === countryCodes.da || club?.countryCode === countryCodes.da_DK) && (
              <Box width={1} mt={3}>
                <LinkButton
                  to="/members/conventus-import-guide"
                  purple
                  small
                  block
                >
                  {t('Guide til Conventus-import - tryk her')}
                </LinkButton>
              </Box>
            )}

          {step === localSteps.EXISTING && existing.length > 0 && (
            <Existing
              existing={existing}
              proceed={() =>
                this.setState({
                  step:
                    roles.length > 0
                      ? localSteps.ROLES
                      : groups.length > 0
                      ? localSteps.GROUPS
                      : localSteps.MEMBERS,
                })
              }
            />
          )}

          {step === localSteps.ROLES && roles.length > 0 && (
            <Roles
              roles={roles}
              proceed={() => {
                if (groups.length > 0) {
                  this.setState({
                    step: localSteps.GROUPS,
                  })
                } else {
                  this.setState({
                    step: localSteps.MEMBERS,
                  })
                }
              }}
            />
          )}

          {step === localSteps.GROUPS && groups.length > 0 && (
            <Groups
              groups={groups}
              proceed={() => this.setState({step: localSteps.MEMBERS})}
            />
          )}

          {step === localSteps.MEMBERS && members.length > 0 && (
            <Fragment>
              <Box my={4}>
                <PreviewTable members={members} />
              </Box>
              <Flex justifyContent="flex-end">
                <Button small primary onClick={this.confirm}>
                  {t('Importer')}
                </Button>
              </Flex>
            </Fragment>
          )}
        </Flex>
      </Flex>
    )
  }
}

const enhancer = connect(
  createStructuredSelector({
    isFetching: getIsFetching,
    members: getNewImportMembers,
    existing: getExistingImportMembers,
    groups: getImportGroupsArray,
    roles: getImportRolesArray,
    club: getActive,
  }),
  {
    confirm: upload.confirm,
  }
)

export default withTranslation()(enhancer(ImportFlow))
