import React, {useState, useMemo,  useCallback, useEffect, useRef} from 'react'
import styled, {css} from 'styled-components'
import {darken} from 'polished'
import {get, noop} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Alert, People} from 'components/icons'
import {Flex, Image, Text, Button, Tooltip, Box, Modal, Dropdown} from 'components'
import {Row, Cell} from 'components/Table'
import format from 'lib/format'
import {useToggle} from 'lib/hooks'
import memberDefault from 'images/member-default.png'
import InvitationModal from './InvitationModal'
import NoteForm from './NoteForm'
import TypeDropdown from './TypeDropdown'
import EditModal from './EditModal'
import Statistics from './Statistics'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getClubInfo as club, getClubInfo} from 'signup/club'
import { getAppName } from 'app/selectors'
import { useFeature } from "@growthbook/growthbook-react";
import { module_members_editable } from 'globalModuleNames'
import checkIfChildEmail from 'lib/checkIfChildEmail'


const DetailsContainer = styled(Flex).attrs({
  flexDirection: 'column',
})`
  background: ${(props) => props.theme.colors.secondaryLight};
`

const DummyButton = styled(Button)`
  opacity: 0.5;
`

const OverviewContainer = styled(Row).attrs({
  alignItems: 'center',
})`
  cursor: pointer;
  ${(props) =>
    props.isOpen &&
    css`
      background: ${(props) => darken(0.1, props.theme.colors.secondaryLight)};
    `};
`

const MemberRow = ({
  open,
  style,
  active,
  fetchRelations,
  firstName,
  surname,
  type,
  birthdate,
  id,
  toggleBulk,
  checked,
  updateMember,
  address,
  city,
  isChild,
  phone,
  email,
  zip,
  note,
  emailLastSent,
  headerImage: image,
  hasOneAdministrator,
  isLeader,
  dummy,
  groupName,
  inactive,
  authToken,
  isGroupLeader,
  showGroupsModal: _showGroupsModal,
  showRelationsModal: _showRelationsModal,
  groupId,
  club,
  clubInternalMemberId,
  tenantUserId,
  appName,
  currentUserActiveType,
}) => {
  const t = useCustomTranslation()
  const userId = useMemo(
    () => (133337 + id * 3).toString(16).toUpperCase(), // Please, don't ask ...
    [id]
  )

  const [emailDisabled, setEmailDisabled] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(open)
  const [
    invitationModalVisible,
    showInvitationModal,
    hideInvitationModal,
  ] = useToggle()
  const [editModalVisible, showEditModal, hideEditModal] = useToggle()
  const [infoModalVisible, showInfoModal, hideInfoModal] = useToggle()
  const [relationsInvalid, setRelationsInvalid] = useState(false)
  const toggleDetailsVisible = useCallback(() => {
    if (detailsVisible) {
      setDetailsVisible(false)
    } else {
      fetchRelations(id)
      setDetailsVisible(true)
    }
  }, [fetchRelations, id, setDetailsVisible, detailsVisible])

  const handleCheckboxClick = useCallback((event) => {
    event.stopPropagation()
  }, [])

  const showGroupsModal = useCallback(() => {
    _showGroupsModal(id)
  }, [_showGroupsModal, id])

  const showRelationsModal = useCallback(() => {
    _showRelationsModal(id)
  }, [_showRelationsModal, id])

  const prevOpen = useRef()

  useEffect(() => {
    prevOpen.current = open
  },)

  useEffect(() => {
    if (open) {
      fetchRelations(id)
    }
  }, [open, fetchRelations, id, ])

  const container = useRef()

  useEffect(() => {
    if (!prevOpen.current && open) {
      fetchRelations(id)
      setDetailsVisible(true)
      window.scrollTo(0, container.current.offsetTop)
    }
  }, [open, fetchRelations, id])

  if (container.current != null) {
    if (detailsVisible) {
      container.current.style.height = '200px';
    } else if (!detailsVisible && container.current != null) {
      container.current.style.height = '0';
    }
  }
  

  function calculateAge(birthdate) {
    // Split the birthdate string into day, month, and year
    const [day, month, year] = birthdate.split('-').map(Number);

    // Create a Date object for the birthdate
    const birthDate = new Date(year, month - 1, day);

    // Get today's date
    const today = new Date();

    // Calculate the age
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
  }

  function convertChildEmail(email, isChild = false) {
    const match = checkIfChildEmail(email)
    // If email address followed by random characters found, replace them with "(barn)"
    if (match && match[1]) {
        const randomChars = match[1];
        const cleanedStr = email.replace(randomChars, "(barn)");

        return cleanedStr;
    } else if (isChild) {
        return email + " (barn)";
    } else {
        // If no email address followed by random characters found, return the original string
        return email;
    }
}
  return (
    <div ref={container} style={style}>
      <OverviewContainer
        onClick={toggleDetailsVisible}
        isOpen={detailsVisible}
        inactive={inactive}
      >
        <Cell flex="0 0 30px">
          <input
            type="checkbox"
            value={id}
            onChange={toggleBulk}
            onClick={handleCheckboxClick}
            checked={checked}
          />
        </Cell>
        <Cell flex="0 0 45px" justifyContent="center" alignItems="center">
          {!detailsVisible &&
            (inactive ? (
              <Box bg="danger" width={25} height={25} borderRadius="50%" />
            ) : (
              <Image
                round
                src={image || memberDefault}
                height="25"
                width="25"
              />
            ))}
        </Cell>
        <Cell flex="1 0 120px">
          <Text color="black" fontWeight="bold" opacity={inactive ? 0.5 : 1}>
            {firstName}
          </Text>
          {isLeader && (
            <Box ml={3}>
              <Tooltip
                text={t('{{name}} er gruppeleder af denne gruppe ({{group}})', {
                  name: firstName,
                  group: groupName,
                })}
              >
                {({show, hide}) => (
                  <People
                    fill="primary"
                    size={16}
                    onMouseEnter={show}
                    onMouseLeave={hide}
                  />
                )}
              </Tooltip>
            </Box>
          )}
        </Cell>
        <Cell flex="1 0 140px" bold protectOverflow>
          <Text fontWeight="bold" color="black" opacity={inactive ? 0.5 : 1}>
            {surname}
          </Text>
        </Cell>
        <Cell> 
        </Cell>
        <Cell flex="1 0 110px">
          <Text
            color="secondary"
            fontWeight="bold"
            opacity={inactive ? 0.5 : 1}
          >
            {birthdate && `${format(birthdate, 'DD-MM-YYYY')} (${calculateAge(format(birthdate, 'DD-MM-YYYY'))} ${t('år')})`}
          </Text>
        </Cell>
        <Cell flex="0 0 100px" secondary bold>
          {inactive && (
            <>
              <Button
                tiny
                danger={dummy}
                warning={!dummy}
                onClick={showInvitationModal}
              >
                <Flex alignItems="center">
                  {t('Inaktiv')}
                  <Box ml={1}>
                    <Alert fill="white" size={14} />
                  </Box>
                </Flex>
              </Button>
              {invitationModalVisible && (
                <InvitationModal
                  invitationLink={
                    inactive && `registrer?email=${email}&password=${authToken}`
                  }
                  hide={hideInvitationModal}
                  id={id}
                  name={firstName}
                  emailLastSent={emailLastSent}
                  dummy={dummy}
                />
              )}
            </>
          )}
        </Cell>
        <Cell flex="0 0 140px">
          <Flex justifyContent="flex-end" flex="1">
            <TypeDropdown
              disabled={isChild}
              memberId={id}
              currentType={type}
              updateMember={updateMember}
              hasOneAdministrator={hasOneAdministrator}
              isGroupLeader={isGroupLeader}
              inactive={inactive}
            />
          </Flex>
        </Cell>
      </OverviewContainer>

      {detailsVisible && (
        <DetailsContainer>
          <Flex>
            <Flex width={90} justifyContent="center" alignItems="center">
              <Image
                round
                src={image || memberDefault}
                width="70"
                height="70"
              />
            </Flex>

            <Flex flex="1">
              <Box
                width={1 / 5}
                px={2}
                my={3}
                borderRight="1px solid"
                borderColor="secondary"
              >
                {infoModalVisible && (!club.canEditMembers) && (
                  <Modal title="Redigering" width={300} hide={hideInfoModal}>
                    <Box m={3}>
                      <Text secondary center>
                        Det er ikke muligt at ændre oplysninger på et medlem,
                        idet en bruger i {appName} kan være medlem af flere
                        foreninger.
                      </Text>
                    </Box>
                  </Modal>
                )}
                <Text>
                  <span onClick={inactive ? noop : showInfoModal}>{phone}</span>
                </Text>
                <Box mt={1}>
                  <Text>
                    <span onClick={inactive ? noop : showInfoModal}>
                      {convertChildEmail(email, isChild)}
                    </span>
                  </Text>
                </Box>
                <Box mt={1}>
                  <Text>
                    <span onClick={inactive ? noop : showInfoModal}>
                      {address}
                    </span>
                  </Text>
                </Box>
                <Box mt={1}>
                  <Text>
                    <span onClick={inactive ? noop : showInfoModal}>
                      {zip} {city}
                    </span>
                  </Text>
                </Box>
                <Box mt={1} span onClick={inactive ? noop : showInfoModal}>
                  <span>{t('Bruger ID')}: </span>

                  {tenantUserId &&
                    <span>{tenantUserId}</span>
                  }        
                </Box>
                <Box mt={1} span onClick={inactive ? noop : showInfoModal}>     
                  <span>{t('Medlems ID')}: </span>

                  {clubInternalMemberId &&
                    <span>{clubInternalMemberId}</span>
                  }       
                </Box>
                {(currentUserActiveType === 2 && inactive) || (currentUserActiveType === 2 && type === 1 && club.canEditMembers) ? (

                  <>
                    <Box mt={1}>
                      <Button tiny primary onClick={showEditModal}>
                        {t('Rediger')}
                      </Button>
                    </Box>
                    {editModalVisible && (
                      <EditModal
                        isDummy={!!authToken}
                        hide={hideEditModal}
                        checkIfChildEmail={checkIfChildEmail}
                        initialValues={{
                          id,
                          firstName,
                          surname,
                          email: convertChildEmail(email),
                          childEmail: convertChildEmail(email),
                          address,
                          zip,
                          city,
                          mobile: phone,
                          birthdate: birthdate
                            ? format(birthdate, 'YYYY-MM-DD')
                            : null,
                        }}
                      />
                    )}
                  </>
                ): null}
              </Box>

              <Flex
                px={2}
                my={3}
                height={100}
                width={1 / 5}
                flexDirection="column"
                borderRight="1px solid"
                borderColor="secondary"
              >
                <Button flex={1} mb={2} small primary onClick={showGroupsModal}>
                  {t('Grupper')}
                </Button>
                {
                  dummy ? <DummyButton 
                    flex={1}
                    block
                    small
                    primary
                    onClick={()=> setRelationsInvalid(true)}>
                      {t('Relationer')}
                      
                  </DummyButton> : 
                  <Button
                    flex={1}
                    block
                    small
                    primary
                    onClick={showRelationsModal}
                    
                  >
                    {t('Relationer')}
                  </Button>

                }
                {relationsInvalid &&
                  <Text small danger >{t("For at tilføje relationer skal bruger have modtaget Invitationsmail via systemet.")}</Text>
                }
              </Flex>

              <Box
                width={2 / 5}
                px={2}
                my={3}
                borderRight="1px solid"
                borderColor="secondary"
              >
                {!dummy && <Statistics id={id} groupId={groupId} active={active}/>}
              </Box>

              <Box height={100} width={1 / 5} px={2} my={3}>
                
                  <NoteForm
                    disabled={isGroupLeader}
                    initialValues={{note, id}}
                  />
                
              </Box>
            </Flex>
          </Flex>
        </DetailsContainer>
      )}
    </div>
  )
}

const enhancer = connect(createStructuredSelector({
  club: getClubInfo,
  appName: getAppName,
}))

export default enhancer(MemberRow)

