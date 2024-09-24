import React from 'react'
import { shallow } from 'enzyme'
import withToggle from './withToggle'

describe('withToggle', () => {
  it('should provide a boolean prop', () => {
    const toggleBaseName = 'testToggle'
    const visiblilityProp = 'testToggleVisible'

    const Component = withToggle(toggleBaseName)(() => <div />)

    const wrapper = shallow(<Component />)

    expect(wrapper.props()[visiblilityProp]).toBeDefined()
  })

  it('should provide a function prop for toggling on', () => {
    const toggleBaseName = 'testToggle'
    const showProp = 'showTestToggle'

    const Component = withToggle(toggleBaseName)(() => <div />)

    const wrapper = shallow(<Component />)

    expect(wrapper.props()[showProp]).toBeDefined()
  })

  it('should provide a function prop for toggling off', () => {
    const toggleBaseName = 'testToggle'
    const hideProp = 'hideTestToggle'

    const Component = withToggle(toggleBaseName)(() => <div />)

    const wrapper = shallow(<Component />)

    expect(wrapper.props()[hideProp]).toBeDefined()
  })
})
