import React from 'react';
import styled from 'styled-components';
import {Item} from "./OrderItem";
import useCustomTranslation from 'lib/customT'
const Period = styled(Item)`
`
const Renewal = ({payRenewal}) => {
  const t = useCustomTranslation()

  return (
    <Period>
        <p>{t('Betaling fornyes:')}</p>
        <p>{payRenewal}</p>
    </Period>
  )
}

export default Renewal