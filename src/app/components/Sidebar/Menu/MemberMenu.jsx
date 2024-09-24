import React, {useMemo} from 'react'
import {withRouter} from 'react-router-dom'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {includes} from 'lodash'
import Item from './Item'
import {
  Person,
  Association,
  People,
  Payment,
  Settings,
  Email,
} from 'components/icons'
import {Text} from 'components'
import { module_chat, module_chat_web } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";


const PATH = '/my-page'

const BetaBadge = () => (
  <Text small px={1} py={0} bg="danger" color="white">
    Beta
  </Text>
)
  
const MemberMenu = ({location: {pathname}}) => {
  
  const t = useCustomTranslation()
  
  const items = useMemo(
    () =>{
      let memberTabs = 
     [
      {
        name: t('Min side'),
        icon: Person,
        path: '/my-page' //,
        // badges: [ BetaBadge,
        //],
      },      
             
    ]
    
    if (useFeature(module_chat).on && useFeature(module_chat_web).on) {
      memberTabs.push(
        { 
          name: t('Chat'),
          icon: Email,
          path: '/chat',
          badges: [ BetaBadge,
          ],
          isFetching: false,
        }, 
      )
    }

    return memberTabs
  },
    [t, ]
  )

  return items.map((item) => (    
      <Item
        key={item.name}
        active={includes(
          item.path,
          pathname.split('/').filter((part) => !!part)[0]
        )}
        {...item}
      />    
  ))
}

export default withRouter(MemberMenu)