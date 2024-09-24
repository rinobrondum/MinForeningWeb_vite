import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box} from 'rebass/styled-components'
import {Formik, Form, Field} from 'formik'
import {Modal, Dropdown, Button} from 'components'

const Item = styled(Box).attrs({
  p: 2,
  bg: 'secondaryLight',
  color: 'black',
  as: 'li',
})`
  transition: background 0.125s ease;
  will-change: background;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.bg])};
  }
`

const RequestModal = ({hide, onRequest, groups = []}) => {
  const t = useCustomTranslation()

  const handleRequest = useCallback(
    (formData) => {
      onRequest(formData)
      hide()
    },
    [onRequest]
  )

  const initialValues = {
    group: {
      UserGroupId: null,
      title: '',      
      clubId: null
    }
  }
  return (
    <Modal title={t('Anmod om medlemsskab')} hide={hide}>
      <Box m={3}>
        <Formik 
          initialValues={initialValues}
          onSubmit={handleRequest}
        >
            <Form>
              <Field name="group"> 
                {({field: {value}, form: {setFieldValue}}) => ( // Oven over sætter jeg selectedItem for field, måske er det ikke nødvendigt her længere
                  <Dropdown
                    block
                    title={value.title || t('Vælg gruppe')} // value er selectedItem fra initialValues
                    items={groups.sort((a, b) => a.title != null && a.title.localeCompare(b.title))}
                    renderItem={({userGroupId, title, clubId}, hide) => 
                      <Item
                        onClick={() => {
                          setFieldValue('group', {
                            UserGroupId: userGroupId,
                            title: title,
                            clubId: clubId                        
                          })
                          hide()
                      }}
                      >
                        {title}
                      </Item>
                    }
                  />
                )}
              </Field>
 
              <Button small block success mt={3} type="submit"
              // Du kan her lave handlesubmmit og få selected id fra initialValues.selectedItem.value. okay og så skal jeg halve lavet request delen også.
              // Jep. hvad leder du efter ?
              // club3 controller -> Task<IHttpActionResult> ClubGroupsRequest(int clubId, List<ApiUserGroup> groups) <-- Den action skal du bruge.. okay 
              >
                {t('Godkend')}
              </Button>
            </Form>
            {/* {dialogueModalVisible && (
          <DialogueModal hide={hideDialogueModal} title={t('Slet betaling')}>
            <Box mb={3}>
              <Text center>
                {t(
                  'Du kan ikke slette denne betaling, da nogle personer allerede har afviklet deres betaling og dermed står under Afviklede betalinger.'
                )}
              </Text>
            </Box>
            
          </DialogueModal>
        )} */}
        </Formik>
      </Box>
    </Modal>
  )
}

export default RequestModal
