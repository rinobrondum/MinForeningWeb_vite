import React, { useState, useEffect } from 'react';
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Link} from 'components'
import {Flex} from 'rebass/styled-components'
import ConversationItem from './ConversationItem'
import styled, { css } from 'styled-components'
import {darken} from 'polished'

const MyConversationItem = styled(ConversationItem).attrs({
    flexDirection: 'row',
    width: '100%',
    height: '100px',
    justifyContent: 'Flex-start',
    alignItems: 'center',
    margin: 0,    
})`
    background-color: ${(ConversationItem) => ConversationItem.currentConversation ? '#e7e7e7' : 'secondaryLight' };       
    cursor: pointer;
    content: ${(ConversationItem) => ConversationItem.currentConversation ? ConversationItem.currentConversation : ConversationItem.currentConversation };   
    will-change: background;
    &:hover {
        background: ${darken(0.1, '#e7e7e7')};
    }
`
const ConversationsList = ({
    activeMemberId,
    conversations,
    currentConversation,
    setCurrentConversation,
}) => {
    const t = useCustomTranslation()
    
    useEffect(() => {
        if (currentConversation == null && document.getElementsByClassName('chatItem').length > 0) {
            document.getElementsByClassName('chatItem')[0].click();
        }
    }, [conversations]);
    

    return (
        
            <Flex width="100%" flexDirection="column">
                {conversations.length >= 0 ? (
                    <>
                        {conversations.map((conversation, index) => (                             
                            <MyConversationItem
                                className="chatItem"
                                key={conversation.chatId}
                                chatId={conversation.chatId}
                                title={conversation.title ? t(conversation.title) : conversation.users.filter((users) => users.userId !== activeMemberId).map(({firstName, surname}) => (`${firstName} ${surname}`)).join(`, `).substring(0, 20)} //TODO: Refactor to take each as user and dispaly 1 or 2 and + the number of remaining users.
                                lastMessage={conversation.lastMessage}
                                imageUrl={conversation.imageUrl}
                                onClick={() => {setCurrentConversation(conversation)}}
                                currentConversation={conversation === currentConversation || index === currentConversation}
                                mb={index === conversations.length - 1 ? 0 : 2}
                            />
                        ))}
                    </>
                ) : (
                    <Flex center secondary>
                        {t('Der er ingen chats')}
                    </Flex>
                )}
            </Flex>
        
    )
}

export default ConversationsList
