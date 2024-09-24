import React from 'react'
import isAfter from 'date-fns/is_after'
import startOfToday from 'date-fns/start_of_today'
import {Button} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const SendReminderButton = ({
  lastReminderSent,
  showDialogue,
  sendReminder,
  ...props
}) => {
  const t = useCustomTranslation()
  const sent = lastReminderSent && isAfter(lastReminderSent, startOfToday())

  return (
    <Button
      {...props}
      secondary={sent}
      primary={!sent}
      onClick={sent ? showDialogue : sendReminder}
    >
      {sent ? t('Påmindelse sendt') : t('Send påmindelse')}
    </Button>
  )
}

export default SendReminderButton
