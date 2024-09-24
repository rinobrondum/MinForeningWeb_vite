import { withStateHandlers } from 'recompose'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const withToggle = (name, visible = false) => {
  const names = typeof name === 'string' ? [name] : name

  const {
    state,
    handlers,
  } = names.reduce((acc, name) => {
    const field = `${name}Visible`
    const capitalized = capitalize(name)

    return {
      state: {
        ...acc.state,
        [field]: visible,
      },
      handlers: {
        ...acc.handlers,
        [`show${capitalized}`]: () => () => ({
          [field]: true,
        }),
        [`hide${capitalized}`]: () => () => ({
          [field]: false,
        }),
        [`toggle${capitalized}`]: ({ [field]: prev }) => () => ({
          [field]: !prev,
        }),
      },
    }
  }, {})

  return withStateHandlers(state, handlers)
}

export default withToggle
