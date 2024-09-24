import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Text, Flex, Box } from 'components';
import {
  getNumberOfMembersNotInGroups,
  getNumberOfInactiveMembers,
} from 'members/selectors';
import Group from './Group';

const Container = styled(Flex)`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  background: ${(props) => props.theme.colors.secondaryLight};
  box-shadow: 0 2px 8px -3px rgba(0, 0, 0, 0.5);
`;

const initializeList = (items) => {
  if (items.length > 4) {
    const half = Math.ceil(items.length / 2);
    return [
      {
        id: 'first',
        items: items.slice(0, half),
      },
      {
        id: 'last',
        items: items.slice(half),
      },
    ];
  } else {
    return [
      {
        items,
        id: 'first',
      },
    ];
  }
};

const AddNew = styled(Flex).attrs({
  p: 2,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
  cursor: pointer;
`;

const GroupList = ({
  groups,
  membersNotInGroups,
  inactiveMembers,
  showNewModal,
  close,
  showEditModal,
  isOpen,
  t,
}) => {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    const initializeLists = () => {
      const newLists = [
        {
          all: true,
          title: t('Alle'),
          id: 'all',
        },
        ...(inactiveMembers > 0
          ? [
              {
                inactive: true,
                title: t('Inaktive brugere ({{count}})', {
                  count: inactiveMembers,
                }),
                id: 'inactive',
              },
            ]
          : []),
        ...(membersNotInGroups > 0
          ? [
              {
                notInGroup: true,
                title: t('Ikke i gruppe ({{count}})', {
                  count: membersNotInGroups,
                }),
                id: 'notInGroups',
              },
            ]
          : []),
        ...groups,
      ];

      setLists(initializeList(newLists));
    };

    initializeLists();
  }, [groups, membersNotInGroups, inactiveMembers, t]);

  return (
    <Container isOpen={isOpen}>
      {lists.map((list, index) => (
        <Flex key={list.id} flexDirection="column">
          {list.items.map((item) => (
            <Group
            {...item}
            level={1}
            key={item.id}
            close={close}
            showEditModal={showEditModal}
            >
             
            </Group>
          ))}
          {index === lists.length - 1 && (
            <AddNew onClick={() => showNewModal(0)}>
              <Box ml={"auto"} mr={20}>
                <Text secondary>+ {t('Opret gruppe')}</Text>
              </Box>
            </AddNew>
          )}
        </Flex>
      ))}
    </Container>
  );
};

const enhancer = compose(
  withTranslation(),
  connect(
    createStructuredSelector({
      membersNotInGroups: getNumberOfMembersNotInGroups,
      inactiveMembers: getNumberOfInactiveMembers,
      
    })
  )
)

export default enhancer(GroupList)
