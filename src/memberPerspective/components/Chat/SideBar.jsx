import React, {useCallback} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Button} from 'rebass/styled-components'
import {Image, Input, Box} from 'components'
import memberDefault from 'images/member-default.png'
import styled, { css } from 'styled-components'
import ConversationsList from './ConversationsList'

const ProfileInfo = styled(Flex)`
    overflow: hidden;
    flex-wrap: wrap;
    height: 100px;
  `

const ProfileInfo_Container_Image = styled(Flex)`
    flex-basis:calc(40% - 10px);
    margin-right: 10px;
    padding-left: 10px;
    margin-top: 10px;
    flex-flow: column;
`

const Profile_Image = styled(Image)`
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
    height: auto;
`

const ProfileInfo_NewChat = styled(Flex)`
    flex-basis:calc(60% - 10px);
    margin-right: 10px;
    margin-top: 10px;
`

const Chat_Container = styled(Flex)`
    overflow-y: scroll;
    overflow-x: hidden;
`

const Button_NewChat = styled(Button)`
    padding-left: 5px;
    padding-right: 5px;
    cursor: pointer;
`

const SideBar = ({
    activeMemberId,
    onClickCreateNewChat,
    query,
    currentConversation,
    setCurrentConversation,
    conversations = [],
    imageUrl,
}) => {
    const t = useCustomTranslation()


    return (
        <Flex height="100%" flexDirection="column" bg="secondaryLight">

                <ProfileInfo width="100%" justifyContent="Flex-start" alignItems="top" flexDirection="row" >

                    <ProfileInfo_Container_Image flexDirection="row" justifyContent="Flex-start">
                        <Profile_Image
                            round
                            src={imageUrl || memberDefault}
                            width="100%"
                        />
                    </ProfileInfo_Container_Image>

                    <ProfileInfo_NewChat>
                        <Box mb={2} width="100%">
                            <Button_NewChat width="100%" primary onClick={() => {onClickCreateNewChat()}}>
                                {t('New Conversation')}
                            </Button_NewChat>
                        </Box>
                        {/* <Box>
                            <Input last small placeholder={`${t('Søg')}...`} onChange={query}/>                                          
                        </Box> */}
                    </ProfileInfo_NewChat>
                </ProfileInfo>

                <Chat_Container height="86%" flexDirection="column" >

                    <ConversationsList
                        activeMemberId={activeMemberId}
                        conversations={conversations}
                        currentConversation={currentConversation}
                        setCurrentConversation={setCurrentConversation}
                    />

                </Chat_Container>

            </Flex>
    )
}

export default SideBar
