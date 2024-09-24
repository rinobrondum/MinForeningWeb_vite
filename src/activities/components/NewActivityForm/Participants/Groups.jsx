import React, {useCallback} from 'react'
import {toLower, difference, includes, get, uniqBy, flatten} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {useSearch} from 'react-use-search'
import {Input, Text} from 'components'
import {GroupList} from 'groups/components'

const predicate = ({title, subGroups = []}, value) =>
  includes(toLower(title), toLower(value)) ||
  subGroups.some((group) => includes(toLower(group.title), toLower(value)))

const Groups = ({groups, value, setFieldValue, prevValue, isEdit, members,}) => {
  const t = useCustomTranslation()
  const toggleGroup = useCallback(
    ({target: {checked, value: id}}) => {
      setFieldValue(
        'participants.groups',
        checked
          ? [...value, `${id}`]
          : value.filter((participant) => `${participant}` !== `${id}`)
      )

      setFieldValue("participants.members", checked ? uniqBy(
        flatten([members, ...groups.filter(group => group.id == id).map(group => get(group, 'users', []))]),
        user => `${user}`) : value.filter((participant) => `${participant}` !== `${id}`));

      if (isEdit && includes(prevValue, parseInt(id, 10))) {
        setFieldValue(
          'participants.members',
          difference(
            members.map((member) => member.toString()),
            get(
              groups.find((group) => group.id.toString() === id),
              'users',
              []
            ).map((member) => member.toString())
          )
        )
      }
    },
    [setFieldValue, value, prevValue, members, groups, isEdit])
  

  const [filteredGroups, query, handleChange] = useSearch(groups, predicate, {
    filter: true,
  })

  return (
    <>
      <Input
        small
        value={query}
        onChange={handleChange}
        placeholder={`${t('Søg i grupper')} ...`}
      />
      {
        filteredGroups.length === 0 ? <Text>{t('Der er ingen grupper i foreningen')}</Text> : 
        <GroupList
          groups={filteredGroups}
          toggleGroup={toggleGroup}
          bulk={value}
        />
      }
    </>
  )
}


export default Groups
