import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {subDays, startOfToday, format} from 'date-fns'
import {Formik, Form, Field} from 'formik'
import {fetchStatistics} from 'groups/actions'
import {fetchStatistics as fetchClubStatistics} from 'clubs/actions'
import {getGroupStatistics} from 'groups/selectors'
import {getActiveStatistics as getClubStatistics} from 'clubs/selectors'
import {typesById} from 'activities/constants'
import {Flex, Box, Text, Input, Button, Loading, Dropdown} from 'components'
import { exportGroupActivities, exportGroup} from 'groups/actions'

const initialValues = {
  start: format(subDays(startOfToday(), 30), 'YYYY-MM-DD'),
  end: format(startOfToday(), 'YYYY-MM-DD'),
}

const Statistics = ({
  fetchStatistics,
  fetchClubStatistics,
  statistics,
  id,
  exportGroupActivities,
  exportGroup,
  club,
  ...props
}) => {
  const t = useCustomTranslation()
  
  const exportOptions = [{name: 'Aktiviteter'}, {name: 'Opgaver'}]  // TODO: create later , {name: 'Medlemmer'}
  const [selectedOption, setSelectedOption] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  
  const handleSubmit = useCallback(
    (values, {setSubmitting}) => {
      new Promise((resolve, reject) => {
        if (id === 'all' || id === 'notInGroups') {
          fetchClubStatistics({resolve, reject, ...values})
        } else {
          fetchStatistics({resolve, reject, id, ...values})
        }
      }).then(() => setSubmitting(false))
    },
    [fetchStatistics, fetchClubStatistics, id]
  )


  const handleClick = (name) => {
    setIsFetching(true)
    if (name === 'Opgaver'){
      {          
      new Promise((resolve, reject) => 
       
       exportGroup({groupId: id, clubId: club.id, resolve, reject}))
           .then((data) => {

           const blob = new Blob(['\ufeff', data], {
             type: 'text/csv;charset=utf-8;',
           })        
           const link = document.createElement('a')
           link.download = id
             ? `opgaver.csv`
             : `opgaver.csv`
           link.href = window.URL.createObjectURL(blob)
           link.click()
           setIsFetching(false)
       }) 
     } 
    }
    else if (name === 'Aktiviteter'){
      {          
      new Promise((resolve, reject) => 
       
       exportGroupActivities({groupId: id, clubId: club.id, resolve, reject}))
           .then((data) => {
           const blob = new Blob(['\ufeff', data], {
             type: 'text/csv;charset=utf-8;',
           })        
           const link = document.createElement('a')

           link.download = id
             ? `aktiviteter.csv`
             : `aktiviteter.csv`
           link.href = window.URL.createObjectURL(blob)
           link.click()
           setIsFetching(false)
       }) 
     } 
    }
    else if (name === 'Medlemmer'){
      
    }
    
   }

  return (
    <Box {...props}>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({isSubmitting}) => (
          <Form>
            <Flex alignItems="flex-end" mb={3}>
              <Box width={2 / 5} mr={2}>
                <Text>{t('Fra')}</Text>
                <Field name="start">
                  {({field}) => <Input small last type="date" {...field} />}
                </Field>
              </Box>
              <Box width={2 / 5} mr={2}>
                <Text>{t('Til')}</Text>
                <Field name="end">
                  {({field}) => <Input small last type="date" {...field} />}
                </Field>
              </Box>
              <Box width={1.67 / 5}>
                <Flex>
                  <Button
                  primary
                  small
                  block
                  type="submit"
                  disabled={isSubmitting}
                  mr={2}
                >
                  {isSubmitting ? <Loading size={16} /> : t('Vis')}
                </Button>
                <Dropdown 
                  title={isFetching ? <Loading size={20}/> : t('Eksporter')}
                  items={exportOptions}
                  renderItem={({name})=>{ return <Button onClick={()=>{ setSelectedOption(name), handleClick(name)
          }} style={{width: '100%'}}>{t(`${name}`)}</Button>}}
          />
                </Flex>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>

      {statistics.length > 0 && (
        <Flex>
          <Flex flexDirection="column" justifyContent="flex-end">
            <Box p={2} bg="secondaryLight">
              <Text right secondary style={{whiteSpace: 'nowrap'}}>
                <strong>{t('Antal aktiviteter')}</strong>
              </Text>
            </Box>
            <Box p={2} bg="secondaryLight">
              <Text right secondary style={{whiteSpace: 'nowrap'}}>
                <strong>{t('Deltagergrad')}</strong>
              </Text>
            </Box>
          </Flex>
          <Box bg="secondaryLight">
            <Box py={2} px={3} height={38} bg="secondary">
              <Text center color="white">
                <strong>{t('Alle')}</strong>
              </Text>
            </Box>
            <Box p={2}>
              <Text center>{statistics[0].activityCount}</Text>
            </Box>
            <Box p={2}>
              <Text center>{statistics[0].participationPercentage}%</Text>
            </Box>
          </Box>
          {statistics
            .filter(({type}) => type > 0)
            .sort(
              ({type: typeA}, {type: typeB}) =>
                typesById[typeA].order - typesById[typeB].order
            )
            .map(({type, activityCount, participationPercentage}) => {
              const {color, icon: Icon} = typesById[type]

              return (
                <Box bg="secondaryLight">
                  <Flex
                    py={2}
                    px={3}
                    height={38}
                    bg={color}
                    alignItems="center"
                  >
                    <Icon fill="white" size={18} />
                  </Flex>
                  <Box p={2}>
                    <Text center>{activityCount}</Text>
                  </Box>
                  <Box p={2}>
                    <Text center>{participationPercentage}%</Text>
                  </Box>
                </Box>
              )
            })}
        </Flex>
      )}
    </Box>
    
  )
}

const enhancer = connect(
  (state, {id}) => ({
    statistics:
      id === 'all' || id === 'notIntGroups'
        ? getClubStatistics(state)
        : getGroupStatistics(state, id),
  }),
  {
    fetchStatistics: fetchStatistics.requested,
    fetchClubStatistics: fetchClubStatistics.requested,
    exportGroupActivities: exportGroupActivities.requested,
    exportGroup: exportGroup.requested
  }
)

export default enhancer(Statistics)
