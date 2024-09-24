import React, {Component} from 'react'
import styled from 'styled-components'
import {toLower, includes} from 'lodash'
import {withTranslation} from 'react-i18next'
import {Searchable, Input, Box} from 'components'
import Item from './Item'
import { useState } from 'react'

const List = styled(Box).attrs({
  mb: 3,
})`
  max-height: 400px;
  overflow-y: scroll;
`

const MemberList = ({ members, children, t, parents, relationChildren, chosenMember, limited }) => {
  const relations = []
  
  const [bulk, setBulk] = useState(relations);

  const toggleBulk = (id, limited) => {
    if(limited){
      setBulk([])
    }
    setBulk((prevBulk) =>
      includes(prevBulk, id, ) ? prevBulk.filter((i) => i !== id) : [...prevBulk, id]
    );
    chosenMember(members.find((member) => member.id === id))
  };

  const predicate = (item, value) => {
    const lowerCaseValue = toLower(value);
    return (
      includes(toLower(item.firstName), lowerCaseValue) ||
      includes(toLower(item.surname), lowerCaseValue)
    );
  };

  return (
    <Searchable items={members} predicate={predicate}>
      {({ items, handleChange }) => (
        <>
          <Input
            small
            onChange={handleChange}
            placeholder={`${t('Søg i medlemmer')}...`}
          />

          <List>
            {items
              .sort((a, b) => a.firstName.localeCompare(b.firstName))
              .map(({ id, ...item }) => (
                <Item
                  key={id}
                  toggleBulk={() => toggleBulk(id, limited)}
                  checked={includes(bulk, id)}
                  
                  {...item}
                />
              ))}
          </List>

          {children && children({ bulk })}
        </>
      )}
    </Searchable>
  );
};

export default withTranslation()(MemberList)
