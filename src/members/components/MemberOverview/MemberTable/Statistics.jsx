import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import {subDays, startOfToday, format} from 'date-fns'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Flex,
  Box,
  Text,
  Input,
  FormikAutoSubmit,
  Loading,
  Button,
} from 'components'
import {fetchStatistics} from 'members/actions'
import {getStatistics} from 'members/selectors'
import {typesById} from 'activities/constants'
import {Dropdown} from 'components'
import { exportMemberactivities } from 'groups'
import { exportMemberTasks } from 'groups'

const initialValues = {
  start: format(subDays(startOfToday(), 30), 'YYYY-MM-DD'),
  end: format(startOfToday(), 'YYYY-MM-DD'),
}


const Statistics = ({
  fetchStatistics, 
  groupId,
  id, 
  statistics,
  exportMemberactivities,
  exportMemberTasks,
  active
}) => {
  
  const handleClick = (name) => {
    if (name === 'Opgaver'){
      {          
      new Promise((resolve, reject) => 
       
       exportMemberTasks({memberId: id, groupId: groupId, clubId: active.id, resolve, reject}))
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
       }) 
     } 
    }
    else if (name === 'Aktiviteter'){
      {          
      new Promise((resolve, reject) => 
       exportMemberactivities({memberId: id, groupId: groupId, clubId: active.id, resolve, reject}))
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
       }) 
     } 
    }
    else if (name === 'Medlemmer'){
      console.log('error')
    }
    
   }
  
  const exportOptions = [{name: 'Aktiviteter'}, {name: 'Opgaver'}] // TODO: create later , {name: 'Medlemmer'}
  const [selectedOption, setSelectedOption] = useState('')
  const [showExports, setShowExports] = useState(false)
  const [statsShown, setStatsShown] = useState(false)

  const handleSubmit = useCallback(
    (values, {setSubmitting}) => {
      new Promise((resolve, reject) => {
        fetchStatistics({resolve, reject, id, ...values})
      }).then(() => setSubmitting(false), setStatsShown(true))
    },
    [fetchStatistics, id]
  )

  const t = useCustomTranslation()

  return (
    <Flex height={100} flexDirection="column" justifyContent="space-between">
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({isSubmitting}) => (
          <Form>
            <Flex mb={2} alignItems="flex-end">
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
              <Box width={3 / 5} > 
                <Flex >
                  <Button
                  
                    primary
                    small
                    block
                    mr={2}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loading size={15} /> : t('Vis')}
                  </Button>
                  <Dropdown 
                    style={{width: '100%'}}
                    title={t('Eksporter')}
                    items={exportOptions}
                    renderItem={({name})=>{ return <Button onClick={()=>{ setSelectedOption(name), handleClick(name)
                    }} style={{width: '100%'}}>{t(`${name}`)}</Button>}}/>
                </Flex>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>

      {statistics.length > 0 && (
        <Flex>
          {statistics
            .filter(({type}) => type > 0)
            .sort(
              ({type: typeA}, {type: typeB}) =>
                typesById[typeA].order - typesById[typeB].order
            )
            .map(
              (
                {
                  type,
                  activityCount,
                  participatingCount,
                  participationPercentage,
                },
                index,
                array
              ) => {
                const {color} = typesById[type]

                return (
                  <Box
                    flex={1}
                    borderRadius={3}
                    bg={color}
                    key={id}
                    py={1}
                    px={2}
                    mr={index === array.length - 1 ? 0 : 2}
                  >
                    <Text small center color="white">
                      {participationPercentage}% ({participatingCount}/
                      {activityCount})
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

const enhancer = connect(
  (state, {id}) => ({statistics: getStatistics(state, id)}),
  {
    fetchStatistics: fetchStatistics.requested,
    exportMemberactivities: exportMemberactivities.requested,
    exportMemberTasks: exportMemberTasks.requested
  }
)

export default enhancer(Statistics)
