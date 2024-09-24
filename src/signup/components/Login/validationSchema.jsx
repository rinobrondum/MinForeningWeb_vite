import Yup from 'lib/yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})

export default validationSchema
