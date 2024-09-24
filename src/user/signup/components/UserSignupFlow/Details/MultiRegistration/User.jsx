import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import {Box, Flex} from '@rebass/grid'
import includes from 'lodash/includes'
import {withTranslation} from 'react-i18next'
import {withRouterParams} from 'lib/hoc'
import {Text, Button, Image} from 'components'
import {Checkmark} from 'components/icons'
import TypeSelector from './TypeSelector'
import NewUserForm from './NewUserForm'
import NewChildForm from './NewChildForm'
import ExistingUserForm from './ExistingUserForm'
import memberDefault from 'images/member-default.png'

const SavedIcon = styled(Checkmark).attrs({
  fill: 'success',
  size: 30,
})`
  position: absolute;
  top: 12px;
  right: 12px;
`

const Container = styled(Box).attrs({
  mb: 3,
  width: 1,
})`
  background: ${(props) => props.theme.colors.inactive};
  border-radius: 5px;

  will-change: background;
  transition: background 0.125s ease;

  ${(props) =>
    !props.isOpen &&
    css`
      &:hover {
        background: ${(props) => props.theme.colors.secondaryLight};
      }
    `};
`

const Title = styled(Box).attrs({
  p: 3,
})`
  cursor: ${(props) => (props.isOpen ? 'auto' : 'pointer')};
  position: relative;
`

class User extends Component {
  state = {
    isOpen: this.props.error || this.props.initialOpen,
    type: this.props.initialOpen ? 'own' : null,
  }

  toggle = () => this.setState(({isOpen}) => ({isOpen: !isOpen}))

  close = () => this.setState({isOpen: false})

  open = () => this.setState({isOpen: true})

  handleTypeClick = (type) => this.setState({type})

  remove = () => {
    const {
      userId: id,
      remove,
      params: {email, password},
    } = this.props

    remove({id, email, password})
    this.close()
  }

  save = (values) => {
    const {type} = this.state
    const {saveConfiguration, userId} = this.props

    if (includes(['own', 'child', 'existing'], type)) {
      saveConfiguration({
        type,
        userId,
        ...values,
        error: null,
      })
    }

    this.close()
  }

  renderForm = () => {
    const {type} = this.state
    const {email, password, passwordConfirmation} = this.props

    const props = {
      ...this.props,
      onSubmit: this.save,
      renderButtons: this.renderButtons,
      initialValues: {
        email,
        password,
        passwordConfirmation,
      },
    }

    return (
      {
        own: <NewUserForm {...props} />,
        child: <NewChildForm {...props} />,
        existing: <ExistingUserForm {...props} />,
      }[type] || null
    )
  }

  renderButtons = () => {
    const {t} = this.props
    return (
      <Button success small block type="submit">
        {t('Gem')}
      </Button>
    )
  }
  componentDidUpdate(prevProps, prevState) {
    const {error} = this.props

    if (!prevProps.error && !!error) {
      this.setState({isOpen: true})
    }
  }

  render() {
    const {
      firstName,
      surname,
      headerImage,
      hasOtherClubUsers,
      saved,
      singleUser,
      error,
      t,
    } = this.props
    const {isOpen, type} = this.state

    return (
      <Container isOpen={isOpen}>
        <Title onClick={this.open} isOpen={isOpen}>
          <Flex alignItems="center" justifyContent="center">
            <Box mr={3}>
              <Image
                round
                height="25"
                width="25"
                src={headerImage || memberDefault}
              />
            </Box>
            <Text bold center>
              {firstName} {surname}
            </Text>
          </Flex>
          {!error && saved && <SavedIcon />}
        </Title>

        {isOpen && (
          <Box px={3}>
            <Box>
              <TypeSelector
                handleClick={this.handleTypeClick}
                hasOtherClubUsers={hasOtherClubUsers}
                selected={type}
                singleUser={singleUser}
              />
            </Box>

            {type && (
              <Box width={250} mx="auto" mt={4}>
                {this.renderForm()}
              </Box>
            )}

            <Box py={3}>
              <Button small transparent block onClick={this.remove}>
                <Text danger bold>
                  {t('Slet bruger')}
                </Text>
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    )
  }
}

export default withTranslation()(withRouterParams(User))
