import React from 'react'
import styled from 'styled-components'
import flow from 'lodash/flow'
import {Flex} from '@rebass/grid'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Box, LinkButton, Link} from 'components'

const Image = styled(Box)`
  width: 150px;
  height: 150px;
  flex: 0 0 150px;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.src});
`

const stripHtml = (text) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = text
  return tmp.textContent || tmp.innerText || ''
}

const truncate = (text) =>
  text.substr(0, Math.min(text.length, text.lastIndexOf(' ')))

const Post = ({title, jetpackFeaturedMediaUrl, excerpt, link}) => {
  const t = useCustomTranslation()

  const trimmedExcerpt = flow(
    stripHtml,
    (excerpt) => excerpt.substring(0, 100),
    truncate
  )(excerpt.rendered)

  return (
    <Flex bg="secondaryLight" p={2}>
      <Link external to={link} target="_blank">
        <Image src={jetpackFeaturedMediaUrl} />
      </Link>
      <Box p={2} flex="1">
        <Box>
          <Link external to={link} target="_blank">
            <Text secondary bold>
              {t(title.rendered, { nsSeparator: false })}
            </Text>
          </Link>
        </Box>

        <Box mt={2} mb={3}>
          <Text secondary>{t(trimmedExcerpt)} ...</Text>
        </Box>

        <Box width={130}>
          <LinkButton external to={link} small block target="_blank">
            {t('Læs mere')}
          </LinkButton>
        </Box>
      </Box>
    </Flex>
  )
}

export default Post
