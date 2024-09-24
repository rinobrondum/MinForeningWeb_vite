import React from 'react'
import { shallow } from 'enzyme'
import { Image, H2, Text } from 'components'
import Club from './Club'

function setup(override) {
  const props = {
    image: 'test',
    name: 'Club name',
    groups: ['First', 'Second'],
    ...override,
  }

  const wrapper = shallow(<Club {...props} />)

  return {
    props,
    wrapper,
  }
}

describe('<Club />', () => {
  it('renders without crashing', () => {
    const { wrapper } = setup()

    expect(wrapper).toMatchSnapshot()
  })

  it('renders image if present', () => {
    const { wrapper } = setup()

    expect(wrapper.find(Image).exists()).toBe(true)
  })

  it('renders club name as header', () => {
    const {
      wrapper,
      props: { name },
    } = setup()

    expect(wrapper.find(H2).exists()).toBe(true)
    expect(
      wrapper
        .find(H2)
        .children()
        .text()
    ).toEqual(name)
  })

  it('renders groups concatenated', () => {
    const {
      wrapper,
      props: { groups },
    } = setup()

    expect(wrapper.find(Text).text()).toEqual(groups.join(', '))
  })
})
