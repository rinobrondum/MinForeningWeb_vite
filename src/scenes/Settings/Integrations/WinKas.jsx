import React, {Component} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Flex} from '@rebass/grid'
import {
  Box,
  LinkButton,
  H1,
  Text,
  Link,
  ButtonWithProtectedAction,
} from 'components'
import {Back, Right, Settings} from 'components/icons'
import {getActive} from 'clubs/selectors'
import {winKasSync} from 'clubs/actions'

const Indicator = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${(props) =>
    props.active ? props.theme.colors.success : props.theme.colors.danger};
`

class WinKas extends Component {
  disable = () => this.props.winKasSync({values: {enabled: false}})

  render() {
    const {club} = this.props

    return club ? (
      <>
        <Box>
          <LinkButton small display="inline-block" to="/settings/integrations">
            <Flex alignItems="center">
              <Back size={12} fill="white" />
              <Box ml={2}>Tilbage</Box>
            </Flex>
          </LinkButton>
        </Box>

        <Box mt={3} mb={2}>
          <Text secondary>Integrationer</Text>
          <H1 secondary fontWeight={400}>
            WinKAS Air Synkronisering
          </H1>
        </Box>

        <Flex alignItems="center" mb={3}>
          <Box mr={2}>
            <Indicator active={club.winKasSyncEnabled} />
          </Box>
          <Text bold color={club.winKasSyncEnabled ? 'success' : 'danger'}>
            Synkronisering er {club.winKasSyncEnabled ? '' : 'ikke'} aktiv
          </Text>
        </Flex>

        {club.winKasSyncEnabled ? (
          <ButtonWithProtectedAction
            small
            secondary
            accept={this.disable}
            display="inline-block"
            text="Er du sikker på at du vil afbryde synkronisering med WinKAS?"
          >
            <Flex alignItems="center">
              <Settings size={12} fill="white" />
              <Box ml={2}>Afbryd synkronisering</Box>
            </Flex>
          </ButtonWithProtectedAction>
        ) : (
          <LinkButton
            small
            success
            external
            to="https://winkas.dk/minforening-opsaetning/"
            display="inline-block"
            target="_blank"
          >
            <Flex alignItems="center">
              <Settings size={12} fill="white" />
              <Box ml={2}>Opsæt synkronisering</Box>
            </Flex>
          </LinkButton>
        )}

        <Box my={3} width={600}>
          <Text secondary mb={3}>
            Med WinKAS får du økonomistyring, et stærkt medlemssystem og mange
            muligheder for opkrævning (Nets, Faktura, Online betalinger).
          </Text>
        </Box>

        <Text secondary mb={3}>
          Du kan let synkronisere dine medlemmer mellem MinForening og WinKAS
          Air.
        </Text>

        <Box mb={2}>
          <Link
            primary
            external
            to="https://winkas.dk/integration-minforening/"
            target="_blank"
          >
            <Flex alignItems="center">
              <Box mr={2}>
                Læs mere om denne integration på WinKAS' hjemmeside
              </Box>

              <Right size={12} fill="primary" />
            </Flex>
          </Link>
        </Box>

        <Link primary external to="https://winkas.dk/" target="_blank">
          <Flex alignItems="center">
            <Box mr={2}>Opret din forening i WinKAS</Box>

            <Right size={12} fill="primary" />
          </Flex>
        </Link>
      </>
    ) : null
  }
}

const enhancer = connect(
  createStructuredSelector({
    club: getActive,
  }),
  {
    winKasSync: winKasSync.requested,
  }
)

export default enhancer(WinKas)
