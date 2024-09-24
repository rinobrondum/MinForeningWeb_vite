import React from 'react';
import { Trans } from 'react-i18next';
import { getTextTags } from 'app/selectors';

const TransWrapper = (rest) => (
  <Trans i18nKey={rest.i18nKey} values={{...getTextTags(), ...rest.values}} components={rest.components}>
    {rest.children}
  </Trans>
);

export default TransWrapper;