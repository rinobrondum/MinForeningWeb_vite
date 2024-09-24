import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {subDays, startOfToday, format} from 'date-fns'
import {Formik, Form, Field} from 'formik'
import {fetchStatistics} from 'clubs/actions'
import {getActiveStatistics} from 'clubs/selectors'
import {typesById} from 'activities/constants'
import {Flex, Box, Button, Text, Input, Loading} from 'components'

const initialValues = {
  start: format(subDays(startOfToday(), 30), 'YYYY-MM-DD'),
  end: format(startOfToday(), 'YYYY-MM-DD'),
}

const Statistics = ({fetchStatistics, statistics}) => {
  const handleSubmit = useCallback(
    (values, {setSubmitting}) => {
      new Promise((resolve, reject) => {
        fetchStatistics({resolve, reject, ...values})
      }).then(() => setSubmitting(false))
    },
    [fetchStatistics]
  )

  const t = useCustomTranslation()

  return (
    <Box>
      <Box mb={2}>
        <Text secondary bold>
          {t('Statistik')}
        </Text>
      </Box>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({isSubmitting}) => (
          <Form>
            <Flex alignItems="flex-end" mb={3}>
              <Box width={2 / 5} mr={2}>
                <Text mr={2}>{t('Fra')}</Text>
                <Field name="start">
                  {({field}) => <Input small last type="date" {...field} />}
                </Field>
              </Box>
              <Box width={2 / 5} mr={2}>
                <Text mr={2}>{t('Til')}</Text>
                <Field name="end">
                  {({field}) => <Input small last type="date" {...field} />}
                </Field>
              </Box>
              <Box width={1 / 5}>
                <Button
                  primary
                  small
                  block
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loading size={16} /> : t('Vis')}
                </Button>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>

      {statistics.length > 0 && (
        <>
          <Flex>
            <Box width={1 / 3} />
            <Box bg="secondaryLight" p={1} width={1 / 3}>
              <Text color="secondary" center>
                <strong>{t('Antal aktiviteter')}</strong>
              </Text>
            </Box>
            <Box bg="secondaryLight" p={1} width={1 / 3}>
              <Text color="secondary" center>
                <strong>{t('Deltagergrad')}</strong>
              </Text>
            </Box>
          </Flex>

          <Flex>
            <Box width={1 / 3} bg="secondaryLight" p={1} alignItems="center">
              <Text ml={2} color="secondary">
                {t('Alle')}
              </Text>
            </Box>
            <Box bg="secondaryLight" p={1} width={1 / 3}>
              <Text color="black" center>
                {statistics[0]?.activityCount}
              </Text>
            </Box>
            <Box bg="secondaryLight" p={1} width={1 / 3}>
              <Text color="black" center>
                {statistics[0]?.participationPercentage}%
              </Text>
            </Box>
          </Flex>

          {statistics
            .filter(({type}) => type > 0)
            .sort(
              ({type: typeA}, {type: typeB}) =>
                typesById[typeA].order - typesById[typeB].order
            )
            .map(({type, participationPercentage, activityCount}) => {
              const {id, color, icon: Icon, name} = typesById[type]

              return (
                <Flex key={id}>
                  <Flex
                    width={1 / 3}
                    bg={color}
                    p={1}
                    pl={2}
                    alignItems="center"
                  >
                    <Icon size={20} fill="white" />
                    <Text ml={2} color="white">
                      {t(`${name}`)}
                    </Text>
                  </Flex>
                  <Box bg="secondaryLight" p={1} width={1 / 3}>
                    <Text color="black" center>
                      {activityCount}
                    </Text>
                  </Box>
                  <Box bg="secondaryLight" p={1} width={1 / 3}>
                    <Text color="black" center>
                      {participationPercentage}%
                    </Text>
                  </Box>
                </Flex>
              )
            })}
        </>
      )}
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({statistics: getActiveStatistics}),
  {fetchStatistics: fetchStatistics.requested}
)

export default enhancer(Statistics)
