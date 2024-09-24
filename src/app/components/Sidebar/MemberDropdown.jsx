import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {
  getImagePath,
  getFullName,
  getMembers,
  getActiveMember,
} from 'user/selectors'
import {setActive} from 'user/actions'
import {Button, Box, Flex, Image, Text, Dropdown} from 'components'
import {Down} from 'components/icons'

const MemberDropdown = ({
  activeMember: {firstName, surname, imagePath, headerImage},
  members = [],
  setActive,
}) => {
  const name = useMemo(() => `${firstName} ${surname}`, [firstName, surname])
  const image = useMemo(() => imagePath || headerImage, [
    imagePath,
    headerImage,
  ])

  return members.length === 1 ? (
    <Box bg="primary" p={2} borderRadius={3}>
      <Flex alignItems="center">
        {image && <Image round width="25" height="25" src={image} mr={2} />}
        <Text light bold>
          {name}
        </Text>
      </Flex>
    </Box>
  ) : (
    <Dropdown
      items={members}
      renderButton={(toggle) => (
        <Button small primary block type="button" onClick={toggle}>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              {image && (
                <Image round width="25" height="25" src={image} mr={2} />
              )}
              <Text light bold>
                {name}
              </Text>
            </Flex>

            <Down fill="white" size={16} />
          </Flex>
        </Button>
      )}
      renderItem={({userId, firstName, surname}, close) => (
        <Box
          p={2}
          bg="primary"
          color="white"
          width={1}
          onClick={() => {
            setActive(userId)
            close()
          }}
        >
          {firstName} {surname}
        </Box>
      )}
    />
  )
}

const enhancer = connect(
  createStructuredSelector({
    members: getMembers,
    activeMember: getActiveMember,
  }),
  {setActive}
)

export default enhancer(MemberDropdown)
