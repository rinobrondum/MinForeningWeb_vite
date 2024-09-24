import React, {useMemo, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import includes from 'lodash/includes'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Item from './Item'
import {
  Calendar,
  Association,
  People,
  Payment,
  Settings,
  Email,
} from 'components/icons'
import PaymentsNotificationBadge from './PaymentsNotificationBadge'
import OutstandingPaymentsNotificationBadge from './OutstandingPaymentsNotificationBadge'
import PendingMembersNotificationBadge from './PendingMembersNotificationBadge'
import InactiveMembersBadge from './InactiveMembersBadge'
import GroupRequestsNotificationBadge from './GroupRequestsNotificationBadge'
import {getIsGroupLeader} from 'user'
import { module_activity, module_dashboard, module_payment } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";

const Menu = ({isGroupLeader, location: {pathname}}) => {
  const t = useCustomTranslation()


  const items = useMemo(
    () => { 
      
    let sidebarTabs = [
      {
        name: t('Medlemmer'),
        icon: People,
        path: '/members',
        badges: [
          PendingMembersNotificationBadge,
          InactiveMembersBadge,
          GroupRequestsNotificationBadge,
        ],
        sort: 2,
        isFetching: true
      },
      {
        name: t('Besked_plural'),
        path: '/messages',
        icon: Email,
        disabled: isGroupLeader,
        sort: 3
      },
      {
        name: t('Indstillinger'),
        icon: Settings,
        disabled: isGroupLeader,
        path: '/settings',
        sort: 5
      },
    ]

    if (useFeature(module_payment).on) {
      sidebarTabs.push(
        {
          name: t('Betalinger'),
          icon: Payment,
          path: '/payments',
          disabled: isGroupLeader,
          badges: [
            PaymentsNotificationBadge,
            OutstandingPaymentsNotificationBadge,
          ],
          sort: 4,
        },
      )
    }
      
    if (useFeature(module_dashboard).on) {
      sidebarTabs.push(
        {
          name: t('Overblik'),
          icon: Association,
          path: '/overview',
          sort: 0
        },
      )
    }

    if (useFeature(module_dashboard).on) {
      sidebarTabs.push(
        {
          name: t('Test'),
          icon: Association,
          path: '/test',
          sort: 6
        },
      )
    }

    if (useFeature(module_activity).on) {
      sidebarTabs.push(
        {
          name: t('Aktiviteter'),
          icon: Calendar,
          path: '/activities',
          sort: 1
        },
      )
    }

      return sidebarTabs.sort((a, b) => (a.sort > b.sort) ? 1 : -1);
    },
    [isGroupLeader, t]
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

const enhancer = compose(
  withRouter,
  connect(
    createStructuredSelector({
      isGroupLeader: getIsGroupLeader,
    })
  )
)

export default enhancer(Menu)
