import React, {useState, useEffect, useCallback} from 'react'
import {Flex} from '@rebass/grid'
import {LinkButton, Link, Box, Text, H1, Checkbox, Dropdown, FormikInput as Input} from 'components'
import {Formik, Field, Form} from 'formik'
import {darken, hideText} from 'polished'
import {Settings, Back, Right} from 'components/icons'
import { render } from 'react-dom'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import { connectExternalSystem, disconnectExternalSystem, getExternalSystem, getConventusDepartments } from 'clubs/actions'
import {getActive} from 'clubs/selectors'
import styled from 'styled-components'
import {apiRequest, api} from 'app/sagas'
import {
  take,
  takeEvery,
  delay,
  select,
  put,
  call,
  all,
} from 'redux-saga/effects'
import { getAppName } from 'app/selectors';

const LabelInfo = styled.label`
  font-weight: bold;
`

const SpanInfo = styled.span`
  display:block;
  margin-bottom: 5px 0 5px 0;
`

const Item = styled(Box).attrs({
  bg: 'secondaryLight',
  color: 'black',
  as: 'li',
  p: 2,
})`
  transition: background 0.125s ease;
  will-change: background;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.bg])};
  }
`

const Conventus = ({club, connectExternalSystem, getExternalSystem, disconnectExternalSystem, getConventusDepartments2}) => {
  const [apiKey, setApiKey] = useState('');
  const [conventusId, setConventusId] = useState('');
  const [isExternalConnected, setIsExternalConnected] = useState(false);
  const [errorExternalConnected, setErrorExternalConnected] = useState(null);
  const [externalSystemInfo, setExternalSystemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useConventusClubDepartment, setUseConventusClubDepartment] = useState(false);
  const [disabledUseConventusClubDepartment, setDisabledUseConventusClubDepartment] = useState(false);
  const [conventusDepartments, setConventusDepartments] = useState(null);
  const [conventusDepartmentId, setConventusDepartmentId] = useState('');
  const [conventusDepartmentTitel, setConventusDepartmentTitel] = useState('Vælg afdeling');

  const handleActivateClubDepartment = () => {
    setUseConventusClubDepartment(!useConventusClubDepartment);
  };

  const handleActivateClubDepartmentChange = (data) => {
    setUseConventusClubDepartment(data.target.checked);

    if (data.target.checked) {
      setDisabledUseConventusClubDepartment(true)
      let values = {
        clubId: club.id,
        systemOrganizationalType: 2,
        isTestMode: true,
        jsonSettings: '{ \"conventusId\": \"' + conventusId + '\", \"Apikey\": \"' + apiKey + '\", \"conventusDepartmentId\": \"' + conventusDepartmentId + '\" }'
      }

      new Promise((resolve, reject) => {
        getConventusDepartments2({values, resolve, reject})
      })
      .then(departments => {
        setConventusDepartments(departments)
      })
      .catch(error => {
        if (error.message != null) {
          setErrorExternalConnected(error.message)
          console.log(error.message)
        } else {
          throw Error("Unknown error")
        }
      })
    }
  };

  const handleClubDepartmentSelected = (id, titel) => {
    setDisabledUseConventusClubDepartment(true);
    setConventusDepartmentTitel(titel)
    setConventusDepartmentId(id);
  };

  let firstTimeShowLoading = true;

  const connectConventusSubmit = () => {
    let values = {
      clubId: club.id,
      systemOrganizationalType: 2,
      isTestMode: true,
      jsonSettings: '{ \"conventusId\": \"' + conventusId + '\", \"Apikey\": \"' + apiKey + '\" }'
    }

    firstTimeShowLoading = true;

    if (conventusDepartmentId) {
      values.jsonSettings = '{ \"conventusId\": \"' + conventusId + '\", \"Apikey\": \"' + apiKey + '\", \"conventusDepartmentId\": \"' + conventusDepartmentId + '\" }';
    }

    setErrorExternalConnected(null);

    new Promise((resolve, reject) => {
      connectExternalSystem({values, resolve, reject})
    })
    .then(() => {
      getConventusStatus(club)
    })
    .catch(error => {
      if (error.message != null) {
        console.log(error.message)
        setErrorExternalConnected(error.message)
      } else {
        throw Error("Unknown error")
      }
    })
  }

  const disconnectConventusSubmit = () => {
    let values = {
      clubId: club.id
    }

    new Promise((resolve, reject) => {
      disconnectExternalSystem({values, resolve, reject})
    })
    .then(data => {
      setIsExternalConnected(false);
      setConventusId('')
      setDonventusDepartmentId('');
      setExternalSystemInfo(null);
    })
    .catch(error => {
      if (error.message != null) {
        console.log(error.message)
      } else {
        
        throw Error("Unknown error")
      }
    })
  }

  const getConventusStatus = (club) => {
    let values = {
      clubId: club.id
    }

    new Promise((resolve, reject) => {
      if (firstTimeShowLoading) setLoading(true)
      getExternalSystem({values, resolve, reject})
    })
    .then(data => {
      firstTimeShowLoading = false;
      setLoading(false)
      setConventusId(data.conventusId)
      setExternalSystemInfo(data);
      setConventusDepartmentId(data.conventusDepartmentId);
      setIsExternalConnected(true)
    })
    .catch(error => {
      setLoading(false)
      if (error.message != null) {
        setIsExternalConnected(false)
        setExternalSystemInfo(null)
        if (error.message.indexOf('No external system connected') !== -1) {
          firstTimeShowLoading = false;
        }
        console.log(error.message)
      } else {
        firstTimeShowLoading = false;
        setIsExternalConnected(false)
        setExternalSystemInfo(null)
        throw Error("Unknown error")
      }
    })
  }

  useEffect(() => {
    setUseConventusClubDepartment(false);
    setIsExternalConnected(false);
    setExternalSystemInfo(null)
    getConventusStatus(club);
    const externalSystemInfoInterval = setInterval(() => {
      getConventusStatus(club);
    }, 5000)

    return () => clearInterval(externalSystemInfoInterval);
  }, [setIsExternalConnected]);

  return (
  <>
    <Box>
      <LinkButton small display="inline-block" to="/settings/integrations">
        <Flex alignItems="center">
          <Back size={12} fill="white" />
          <Box ml={2}>Tilbage</Box>
        </Flex>
      </LinkButton>
    </Box>

    <Box my={3}>
      <Text secondary>Integrationer</Text>
      <H1 secondary fontWeight={400}>
        Conventus
      </H1>
    </Box>

    <LinkButton
      small
      success
      display="inline-block"
      to={{pathname: '/members', state: {import: 'conventus'}}}
    >
      <Flex alignItems="center">
        <Settings size={12} fill="white" />
        <Box ml={2}>Importer medlemmer fra Conventus med CSV</Box>
      </Flex>
    </LinkButton>

    <Box my={3} width={600}>
      <Text secondary mb={3}>
        Conventus er et administrativt værktøj for foreninger, kommuner, haller
        og fitnesscentre. Conventus samler de opgaver og den kommunikation, der
        er mellem foreninger, kommunale forvaltninger og idrætsfaciliteter.
      </Text>
    </Box>

    <Text secondary mb={3}>
      Du kan importere medlemslister direkte fra Conventus til {getAppName()}.
    </Text>

    <Link primary to="/members/conventus-import-guide">
      <Flex alignItems="center">
        <Box mr={2}>Guide til import fra Conventus med CSV</Box>

        <Right size={12} fill="primary" />
      </Flex>
    </Link>


    <Box my={3}>
      <H1 secondary fontWeight={400}>
        Web service tilkobling
      </H1>
    </Box>
    {loading &&
      <>
        <span>Henter informationer...</span>
      </>
    }

    {!loading &&
      <>
        {isExternalConnected &&
          <>
            <Text secondary mb={3}>
                <strong>Forbundet til Conventus ID:</strong> {conventusId}
                <br /> <br />
                <div>
                  <LabelInfo>
                    Grupper
                  </LabelInfo> <br />
                  <span>
                    Der er i alt {externalSystemInfo.groupsConnected} ud af {(parseInt(externalSystemInfo.departmentsCount) + parseInt(externalSystemInfo.groupsCount))} grupper forbundet 
                  </span>
                </div>
                <br />
                <div>
                  <LabelInfo>
                    Brugere
                  </LabelInfo> <br />
                  <span>
                    Der er i alt {externalSystemInfo.membersConnected} ud af {externalSystemInfo.membersCount} brugere forbundet.
                    <br />Brugerne forbindes ud fra deres email. I {getAppName()} er det ikke muligt at flere brugere på samme email adresse.
                  </span>
                </div>
                <br />
                <div>
                  <LabelInfo>
                    Inaktive brugere
                  </LabelInfo> <br />
                  <span>
                    Der er i alt {externalSystemInfo.dummyConnected} ud af {externalSystemInfo.membersCount} inaktive brugere forbundet.
                    <br />Brugerne forbindes ud fra deres email. I {getAppName()} er det ikke muligt at flere brugere på samme email adresse.
                  </span>
                </div>
                <br />
                <LinkButton
                  small
                  error
                  display="inline-block" onClick={disconnectConventusSubmit}
                  to="#">
                  <Flex alignItems="center">
                    <Settings size={12} fill="white" />
                    <Box ml={2}>Afbryd forbindelsen til Conventus</Box>
                  </Flex>
                </LinkButton>
            </Text>
          </>
        }

        {!isExternalConnected &&
          <>
            {errorExternalConnected != null &&
              <Text error secondary mb={3}>
                <strong>Der opstod en fejl med følgende fejlmeddelse:</strong> {errorExternalConnected}
              </Text>
            }

            <Formik>
              {({errors}) => (
                <Form>
                    <Field
                      small
                      white
                      autoFocus
                      border="1px solid"
                      borderColor="inactive"
                      name="conventusId"
                      type="text"
                      value={conventusId}
                      onChange={e => setConventusId(e.target.value)}
                      placeholder="Conventus Id"
                      component={Input}
                    />

                    <Field
                      small
                      white
                      autoFocus
                      border="1px solid"
                      borderColor="inactive"
                      name="apiKey"
                      type="text"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Conventus Api Key"
                      component={Input}
                    />
                </Form>
                )
              }
            </Formik>

            <Text secondary>
              <LabelInfo>
                Ønsker du at bruge Conventus afdeling som forening?
              </LabelInfo>
              <br />
              <SpanInfo>
                <input type="checkbox" checked={useConventusClubDepartment} onChange={handleActivateClubDepartmentChange} onClick={handleActivateClubDepartment} />
                <span> Udfyld felterne 'Conventus Id' og 'Conventus Api Key' før du siger ja her</span>
              </SpanInfo>
             
              <br />
            </Text>

            {useConventusClubDepartment && conventusDepartments != null ?
              (<>
                <Dropdown
                  alignRight
                  items={conventusDepartments}
                  title={conventusDepartmentTitel}
                  renderItem={({id, titel}, hide) => (
                    <Item
                      onClick={() => {
                        handleClubDepartmentSelected(id, titel)
                        if (titel) {
                          setDisabledUseConventusClubDepartment(false)
                        }
                        hide()
                      }}
                    >
                      {titel}
                    </Item>
                  )}
                />
                <br />
                <LinkButton
                  small
                  success
                  disabled={disabledUseConventusClubDepartment}
                  display="inline-block" onClick={e => {
                    if (!disabledUseConventusClubDepartment) {
                      connectConventusSubmit(e);
                    }
                  }}
                  to="#">
                  <Flex alignItems="center">
                    <Settings size={12} fill="white" />
                    <Box ml={2}>Forbind Conventus</Box>
                  </Flex>
                </LinkButton>
              </>) : (<>
                <LinkButton
                  small
                  success
                  display="inline-block" onClick={connectConventusSubmit}
                  to="#">
                  <Flex alignItems="center">
                    <Settings size={12} fill="white" />
                    <Box ml={2}>Forbind Conventus</Box>
                  </Flex>
                </LinkButton>
              </>)
            }
          </>
        }
      </>
    }
  </>
  )
}


const enhancer = connect(
  createStructuredSelector({
    club: getActive,
  }),
  {
    connectExternalSystem: connectExternalSystem.requested,
    getExternalSystem: getExternalSystem.requested,
    disconnectExternalSystem: disconnectExternalSystem.requested,
    getConventusDepartments2: getConventusDepartments.requested
  }
)

export default enhancer(Conventus)
