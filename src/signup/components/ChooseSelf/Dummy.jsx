import { Flex } from '@rebass/grid'
import { Card, Image, StyledRadioButton, Text } from 'components'
import { Field } from 'formik'
import memberDefault from 'images/member-default.png'
import useCustomTranslation from 'lib/customT'

const Dummy = ({id, image, firstName, surname}) => {
  const t = useCustomTranslation()

  return (
    <Card bg="white" mb={3}>
      <Flex justifyContent="center" alignItems="center" mb={4}>
        <Image round src={image} width="60" height="60" />
        <Text ml={3} color="secondary">
          <strong>
            {firstName} {surname}
          </strong>
        </Text>
      </Flex>

      <Flex justifyContent="center" alignItems="center">
        <Field
          name="self"
          render={({field, form}) => (
            <StyledRadioButton
              {...field}
              checked={`${id}` === `${form.values.self}`}
              value={id}
            />
          )}
        />
        <Text ml={3} color="secondary">
          {t('Det er mig')}
        </Text>
      </Flex>
    </Card>
  )
}

Dummy.defaultProps = {
  image: memberDefault,
}

export default Dummy
