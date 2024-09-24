import React, {useState, useCallback, useEffect, useRef} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { Formik, Form, Field } from 'formik'
import { Image, Flex, Input, Button, Box, Loading, InputWithButton} from 'components'
import styled, { css } from 'styled-components'
import Emoji from "./Utilitys/Icons/Emoji"
import UploadImg from "./Utilitys/Icons/UploadImg"

const WriteMessageContainer = styled(Flex)`
  border-top: 1px solid #d9d9d9;
  padding: 10px 0 0 0;
`

const WriteMessage = ({
    handleWriteMessageSubmit,
    handleChatMessageDialogImageChange,
    setShowPicker,
    setNewMessage,
    newMessage
}) => {
  const t = useCustomTranslation()

  return (    
        <WriteMessageContainer flexDirection="row" alignSelf='center' height="80px" width="100%" >      
            <Flex height="100%" width="50px" mr={2} justifyContent="center" alignItems="top" >
                <label htmlFor="media">
                    <UploadImg  />
                    <Input hidden type="file" id="media" onChange={handleChatMessageDialogImageChange} />
                </label>
            </Flex> 
            <Box height="100%" width="100%"  >        
                <Formik
                     initialValues={{newMessage: newMessage}}
                    onSubmit={handleWriteMessageSubmit}   
                >
                    <Form style={{"height": "100%"}}>
                        <Box width="100%" height="100%" >                
                            <Input last
                                type="text"
                                placeholder={ `${t('Skriv noget')} ...`}        
                                required
                                name="newMessage"
                                style={{"height": "100%"}}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                }}
                            />         
                        </Box>
                    </Form>
                </Formik>
            </Box>   
            <Flex ml={2} height="100%" flexDirection="column" width="10%" mr={2} justifyContent="center" alignItems="top">

                <Button style={{"padding": "0", "height": "30px"}} onClick={handleWriteMessageSubmit}>
                    {t('Send')}
                </Button>
                <Flex style={{"height": "10px"}}></Flex>
                <Emoji onClick={() => setShowPicker(val => !val)} />

            </Flex>
        </WriteMessageContainer>        
  )
}

export default WriteMessage