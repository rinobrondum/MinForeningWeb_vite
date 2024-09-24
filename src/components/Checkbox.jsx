import React from 'react'

const Checkbox = ({input, ...rest}) => (
  <div>
    <input type="checkbox" {...input} {...rest} />
  </div>
)

export default Checkbox
