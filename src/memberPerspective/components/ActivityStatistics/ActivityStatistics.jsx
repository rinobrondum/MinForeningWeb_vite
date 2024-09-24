import React, {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useContext,
} from 'react'
import {Box, Flex, Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {startOfMonth, endOfMonth, parse, format} from 'date-fns'
import {Formik, Form, Field} from 'formik'
import {Loading, Input, Button, Dropdown} from 'components'
import {typesById as types} from 'activities/constants'
import Section from '../Section'
import ApiContext from 'memberPerspective/ApiContext'

const initialState = {
  isFetching: true,
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date()),
  statistics: [],
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'succeeded':
      return {...state, isFetching: false, statistics: payload}
    case 'setInterval':
      return {
        ...state,
        isFetching: true,
        start: payload.start,
        end: payload.end,
      }
    default:
      return state
  }
}

const ActivityStatistics = ({setIsActivities}) => {
  const api = useContext(ApiContext)

  const [state, dispatch] = useReducer(reducer, initialState)

  const t = useCustomTranslation()

  const handleExportActivitiesSelf = useCallback(() => { 

    api.exportActivitiesself().then(response => response.text()).then((data) => {
    const blob = new Blob(['\ufeff', data], {
      type: 'text/csv;charset=utf-8;',
    })        
    const link = document.createElement('a')
  api.getUser(api.memberId).then(response => response).then((data) => {
    link.download = data
    ? `${data.firstName}_${data.surname}.csv`
    : `MyActivities.csv`
  link.href = window.URL.createObjectURL(blob)
  link.click()
  })})

   
   
})

  const statistics = useMemo(
    () =>
      state.statistics
        .filter(({type}) => type > 0)
        .sort(
          ({type: typeA}, {type: typeB}) =>
            types[typeA].order - types[typeB].order
        ),
    [state]
  )

  const handleSubmit = useCallback(
    ({start, end}) => {
      dispatch({
        type: 'setInterval',
        payload: {
          start: parse(start),
          end: parse(end),
        },
      })
      setIsActivities(val => !val)
    },
    [dispatch]
  )

  useEffect(() => {
    api
      .getActivityStatistics({start: state.start, end: state.end})
      .then((response) => {
        dispatch({type: 'succeeded', payload: response})
      })
      .catch((error) => {})
  }, [dispatch, state.start, state.end])

  return (
    
    <Flex flexDirection="column" height="100%">
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          start: format(state.start, 'YYYY-MM-DD'),
          end: format(state.end, 'YYYY-MM-DD'),
        }}
      >
        {() => (
          <Form>
            <Flex alignItems="flex-end" w={1}>
              <Box width={2 / 5} mr={2}>
                <Text color="black" mb={1}>
                  {t('Fra')}
                </Text>
                <Field name="start">
                  {({field}) => (
                    <Input
                      small
                      last
                      type="date"
                      placeholder="dd/mm/yyyy"
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box width={2 / 5} mr={2}>
                <Text color="black" mb={1}>
                  {t('Til')}
                </Text>
                <Field name="end">
                  {({field}) => (
                    <Input
                      small
                      last
                      type="date"
                      placeholder="dd/mm/yyyy"
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box width={3 / 5}>
                <Flex>
                  <Button
                    primary
                    small
                    block
                    type="submit"
                    disabled={state.isFetching}
                    mr={2}
                  >
                    {t('Vis')}
                  </Button>
                  <Dropdown 
                    width={1 / 5}
                    title='Eksporter'
                    items={[{name: 'Aktiviteter'}]}
                    renderItem={({name})=>{ return <Button onClick={()=>{  handleExportActivitiesSelf()
                    }}>{name}</Button>}}/>
                </Flex>
              </Box>
              
            </Flex>
          </Form>
        )}
      </Formik>
      {state.isFetching ? (
        <Loading />
      ) : (
        <Flex mt={2}>
          {statistics.map(
            (
              {
                activityCount,
                participatingCount,
                participationPercentage,
                type,
              },
              index
            ) => {
              const {color} = types[type]

              return (
                <Box
                  key={type}
                  mr={index === statistics.length - 1 ? 0 : 2}
                  width={1 / 5}
                  p={2}
                  bg={color}
                  sx={{borderRadius: 3}}
                >
                  <Text color="white">
                    {parseFloat(participationPercentage.toPrecision(2))}% (
                    {participatingCount}/{activityCount})
                  </Text>
                </Box>
              )
            }
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default ActivityStatistics
