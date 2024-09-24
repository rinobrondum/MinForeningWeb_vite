import React, {useEffect, useRef, useCallback} from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import qs from 'qs'
import {noop} from 'lodash'
import {withProps, compose} from 'recompose'
import {Flex} from 'components'
import {withRouterParams} from 'lib/hoc'
import {typesAsArray} from 'activities/constants'
import Item from './Item'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  width: 200,
})`
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.5);
`

const TypeList = ({types, match: {url}, params: {archived}, hide}) => {
  const t = useCustomTranslation()
  const container = useRef()
  const outsideClickHandler = useCallback(
    (event) => {
      if (container.current && container.current.contains(event.target)) {
        return
      }
      hide()
    },
    [container, hide]
  )
  useEffect(() => {
    document.addEventListener('click', outsideClickHandler)

    return () => {
      document.removeEventListener('click', outsideClickHandler)
    }
  }, [outsideClickHandler])

  return (
    <div ref={container}>
      <Container>
        <Item
          to={{pathname: url, search: qs.stringify({archived})}}
          name={t('Alle')}
          color="secondary"
          renderIcon={noop}
          onClick={hide}
        />
        {types.map(({id, key, color, icon: Icon}) => (
          <Item
            key={id}
            url={url}
            name={`(${t(key)})`}
            color={color}
            to={{
              pathname: url,
              search: qs.stringify({archived, type: id}),
            }}
            onClick={hide}
            renderIcon={() => <Icon fill="white" size={20} />}
          />
        ))}
      </Container>
    </div>
  )
}

const enhancer = compose(
  withRouter,
  withRouterParams,
  withProps({
    types: typesAsArray.filter((type) => !type.hidden),
  })
)

export default enhancer(TypeList)
