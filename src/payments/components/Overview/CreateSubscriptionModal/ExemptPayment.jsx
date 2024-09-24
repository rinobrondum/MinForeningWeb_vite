import {Formik} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Flex, Button, Box, Text,} from 'components'
import React, {useCallback} from 'react'


const ExemptPayment = ({
    hide,
    _continue,
    cancel,
    values
}) => {
  const t = useCustomTranslation()

  const handleSubmit = useCallback(
    () => {
        _continue(values);
    },[_continue]
  );

  const handleCancelSubmit = useCallback(
    () => {
        cancel(values);
    },[cancel]
  );


  return (
    <Modal title={t('ExemptPayment')} hide={hide} width={300}>
        <Flex flexDirection="column" p={3}>
            <Formik>
                <Box mt={3}>
                    <Text >
                    {t('')}  
                    </Text>
                    
                    <Button primary block small type="submit" onClick={handleSubmit}>
                        {t('Fortsæt')}
                    </Button>

                    <Button primary block small type="submit" onClick={handleCancelSubmit} >
                        {t('Annuller')}
                    </Button>        
                </Box>
            </Formik>
        </Flex>
    </Modal>
  )
}

export default ExemptPayment
