import React, {useState, useEffect, useRef} from 'react'
import {Modal, Text, Button, Box, Flex, Loading} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const ConfirmModal = ({
  accept,
  reject,
  acceptText,
  rejectText,
  text,
  title,
  renderButtons,
  renderBody,
  hide,
}) => {
  const t = useCustomTranslation()
  const [loading, setLoading] = useState(false)
  const mounted = useRef()

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const loadify = (func) => () => {
    func()
    setTimeout(() => {
      if (mounted) {
        setLoading(true)
      }
    }, 300)
  }

  return (
    <Modal title={t('Er du sikker?')} hide={reject} width={400}>
      <Flex flexDirection="column" p={3}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {(text || renderBody) && (
              <Box mb={3}>
                {text && (
                  <Box>
                    <Text secondary center>
                      {text}
                    </Text>
                  </Box>
                )}
                {renderBody && renderBody()}
              </Box>
            )}

            {renderButtons ? (
              renderButtons({accept: loadify(accept), reject, hide})
            ) : (
              <Flex justifyContent="space-between">
                <Box mr={3} width={1 / 2}>
                  <Button success small block onClick={loadify(accept)}>
                    {t('Ja')}
                  </Button>
                </Box>
                <Box width={1 / 2}>
                  <Button danger small block onClick={reject}>
                    {t('Nej')}
                  </Button>
                </Box>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Modal>
  )
}

export default ConfirmModal
