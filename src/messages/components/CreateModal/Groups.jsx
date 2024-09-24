import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {toLower, includes} from 'lodash'
import {useField} from 'formik'
import {useSearch} from 'react-use-search'
import {Input, Text} from 'components'
import {getNestedGroupsArray} from 'groups/selectors'
import {GroupList} from 'groups/components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const predicate = ({title, subGroups = []}, _value) => {
  const value = toLower(_value)

  return (
    includes(toLower(title), value) ||
    subGroups.some((group) => includes(toLower(group.title), value))
  )
}

const Groups = ({groups}) => {
  const t = useCustomTranslation()
  const [{value}, {error, touched}, {setValue}] = useField('groupIds')

  const [filteredGroups, query, handleChange] = useSearch(groups, predicate, {
    filter: true,
  })

  const handleToggleGroup = useCallback(
    ({target: {checked, value: id}}) => {
      const newValue = checked
        ? [...value, id]
        : value.filter((group) => group !== id)

      setValue(newValue)
    },
    [setValue, value]
  )

  return (
    <>
      <Input
        small
        value={query}
        onChange={handleChange}
        placeholder={`${t('Søg i grupper')}...`}
      />
      <GroupList
        groups={filteredGroups}
        toggleGroup={handleToggleGroup}
        bulk={value}
      />
      {touched && error && (
        <Text danger my={3}>
          {error}
        </Text>
      )}
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    groups: getNestedGroupsArray,
  })
)

export default enhancer(Groups)
