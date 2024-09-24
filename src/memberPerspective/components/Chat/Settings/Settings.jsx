import React, {useMemo, useState, useCallback, useEffect} from 'react'
//import {Text} from 'rebass/styled-components'
import {useToggle} from 'lib/hooks'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import memberDefault from 'images/member-default.png'
import { Image, Flex, Input, Button, Box} from 'components'
import { Formik, Form } from 'formik'
import {Bell, AddPerson, People, UploadImage, Logout, Cross} from 'components/icons'
import UploadImg from "../Utilitys/Icons/UploadImg"
import Item from './Item'
import styled, { css } from 'styled-components'
import {darken} from 'polished'

const Text = styled(Flex).attrs({
})`
  background: #e7e7e7;
  cursor: pointer;
  will-change: background;

  &:>:hover {
    background: ${darken(0.1, 'white')};
  }
`

const Container = styled('div')`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 220px;
  right: 0;
  padding: 0 10px 0 20px;
  background: #e7e7e7;
`

const LinkButton = styled('a')`
  display:block;
  font-size: 14px;
  cursor: pointer;
  svg {
    margin: 0 10px 0 0;
  }

  span {
    position: relative;
    top: 2px;
  }
`

const HeaderText = styled('span')`
  display:block;
  font-size: 14px;
  svg {
    margin: 0 10px 0 0;
  }

  span {
    position: relative;
    top: 2px;
  }
`

const LinkClose = styled('a')`
  font-size: 20px;
  position: absolute;
  top: 1px;
  right: 0;
  cursor:pointer;
  font-weight: bold;
`

const Settings = ({conversationRelations, 
  isGroupChat, setIsAddUsers, 
  setActiveSettings, handleChatDialogImageChange,
  setTitleModalActivated}) => {
    const t = useCustomTranslation();

    // const items = useMemo(
    //   () => [
    //     {
    //       name: t('Min side'),
    //       icon: People,
    //     },      
    //     {
    //       name: t('Chat'),
    //       icon: UploadImage,
    //     },        
    //   ],
    //   [t, ]
    // )

    return (
      <Container flexWrap="wrap" flexDirection="column" mt={2}>
            
        <Flex alignSelf="center" mt={3} style={{"position": "relative"}}>
          <Text bold fontSize="22px" >
            {t('Chat Instillinger')}
          </Text>

          <LinkClose onClick={() => setActiveSettings(false)}>
            <Cross size={12} />
          </LinkClose>
        </Flex>
            
        {isGroupChat && (
         <>    
            <Flex mt={3}>
              <LinkButton onClick={() => setTitleModalActivated(true)}>
                <People size={20} /> <span>{t('Skift navn på gruppe')}</span>
              </LinkButton>
            </Flex>

            <Flex mt={3}>
              <LinkButton onClick={() => {
                document.getElementById("groupImageUpload").click();
              }}>
                <UploadImage size={20} />  <span>{t('Tilføj billede til gruppe')}</span>

                <input type="file" id="groupImageUpload" style={{"display": "none"}} onChange={handleChatDialogImageChange} />
              </LinkButton>
            </Flex>


            <Flex mt={3}>
              <HeaderText>
                <People size={20} /> <span>{t('Deltagere')}</span>
              </HeaderText>
            </Flex>

            <Flex flexDirection="column" maxHeight="50%" mt={3} overflow='auto' >               
              {conversationRelations.map(({firstName, surname, headerImage: image, OtherUserId, Status}) => { //.slice(0, 5)
                return (
                  <>
                    <Flex flexDirection="row" style={{"paddingLeft": "8px"}} >
                      <Flex mr={2}>
                        <Image
                          round
                          src={image || memberDefault}
                          width="25"
                          height="25"
                        />
                      </Flex>
                      <Flex alignSelf="center">
                        <Text                                  
                          display="inline-block"                         
                          sx={{borderRadius: 5}}
                          style={{"cursor": "default"}} 
                        >
                          {firstName} {surname}
                        </Text>
                      </Flex>
                    </Flex>                            
                  </>
                )                      
              })}
            </Flex>
          </>
        )}
       
        <Flex onClick={() => setIsAddUsers(val => !val)} mt={3}>
          <LinkButton >
            <AddPerson size={20} /> <span>{t('Tilføj person til chatten')}</span>
          </LinkButton>
        </Flex>

        {/* <Flex width="80%" mt={3}>
          <Text bold fontSize="20px"  >
            <Bell size={20}  /> {t('Deaktivere notifikationer')}
          </Text>
        </Flex> */}

        {/*isGroupChat && (
          <Flex mt={3}>
            <LinkButton>
              <Logout size={20} /> {t('Forlad gruppe')}
            </LinkButton>
          </Flex>
        ) */}

     </Container> 
    )
}

export default Settings
