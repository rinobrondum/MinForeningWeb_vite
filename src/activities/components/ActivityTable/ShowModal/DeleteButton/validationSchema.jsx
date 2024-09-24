import Yup from 'lib/yup'

const validationSchema = Yup.object({
  message: Yup.string().max(150).nullable(),
})

export default validationSchema
