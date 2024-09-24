import React, {useMemo} from 'react'
import {Box, Flex, Button, Heading, Text, Image} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal} from 'components'
import {Association} from 'components/icons'
import format from 'lib/format'
import {useToggle} from 'lib/hooks'
import ValidURL from 'lib/validURL/ValidURL'

const urlRegex =
  /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/g

const prefixHttp = (url) => {
  if (url.startsWith('http')) {
    return url
  }

  return `http://${url}`
}

const Message = ({title, message, imageUrl, date, clubTitle, ...props}) => {
  const t = useCustomTranslation()

  const lines = useMemo(
    () =>
      message
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !!line),
    [message]
  )

  const excerpt = useMemo(() => {
    const text = lines.join(' ').substring(0, 100)

    return text.substr(0, Math.min(text.length, text.lastIndexOf(' ')))
  }, [lines])

  // Each line is split into segments based on the url regular expression
  // defined above. Each segment is mapped to an object on the form
  // { type: 'text' | 'link', content: string }. The type of a segment
  // indicates how it should be treated when rendered. Segments of type 'link'
  // will be wrapped in an anchor tag <a /> while 'text' segments will be
  // rendered as is.


  const [modalVisible, showModal, hideModal] = useToggle()

  return (
    <Flex bg="white" p={2} {...props}>
      {imageUrl && <Image mr={3} variant="avatar" src={imageUrl} />}
      <Box flex={1}>
        <Flex justifyContent="space-between" mb={1}>
        <Heading fontSize={2} color="black">
            {title}
          </Heading>
          <Heading fontWeight="normal" fontSize={1} color="black">
            {format(date, 'DD/MM/YYYY')}
          </Heading>
        </Flex>
        <Text color="black">{excerpt} ...</Text>

        <Button mt={2} variant="small.primary" onClick={showModal}>
          {t('Læs mere')}
        </Button>

        {modalVisible && (
          <Modal title={title} hide={hideModal} width={500}>
            <Box p={3}>
              <Flex alignItems="center" mb={3}>
                <Association size={16} fill="primary" />
                <Text ml={2} color="primary">
                  {clubTitle}
                </Text>
              </Flex>
              {lines.map((line) => (
                
                <Text secondary mb={2} >
                  
                  <ValidURL string={line}></ValidURL>
                </Text>
              ))}
            </Box>
          </Modal>
        )}
      </Box>
    </Flex>
  )
}

export default Message
