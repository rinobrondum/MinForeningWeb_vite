import Yup from 'lib/yup'
import {asArray} from './recurringOptions'
import {typesAsArray} from 'activities/constants'

const schema = Yup.object().shape({
  title: Yup.string().required(),
  location: Yup.string().nullable(),
  start: Yup.mixed().required(),
  description: Yup.string().max(2000).nullable(),
  recurring: Yup.number()
    .oneOf(asArray.map((type) => type.id))
    .required(),
  commentsEnabled: Yup.boolean().required(),
  participantsVisible: Yup.boolean().required(),
  type: Yup.number()
    .oneOf(typesAsArray.map((type) => type.id))
    .required(),
  participants: Yup.object().shape({
    groups: Yup.array(),
    members: Yup.array(),
  }),
  limit: Yup.number().typeError().integer(),
  hasPayment: Yup.boolean(),
  kevinPaymentDisabled: Yup.boolean(),
  amount: Yup.number().typeError().positive().min(2).nullable(),
  deadline: Yup.mixed().when('amount', {
    is: (value) => !!value,
    then: Yup.mixed().required(),
  }),
  sharedToPublicCalendar: Yup.boolean(),
})

export default schema
