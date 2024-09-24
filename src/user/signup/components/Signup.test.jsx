import React from 'react'
import { shallow } from 'enzyme'
import { Signup } from './Signup'

const setup = overrideProps => {
  const props = {
    ...overrideProps,
    logout: jest.fn(),
    getClubInformation: jest.fn(),
    params: {
      clubToken: '123abc',
    },
  }

  const wrapper = shallow(<Signup {...props} />)

  return {
    wrapper,
    props,
  }
}

describe('<Signup />', () => {
  it('renders without crashing', () => {
    const { wrapper } = setup()

    expect(wrapper).toMatchSnapshot()
  })

  it('calls logout after mount', () => {
    const {
      wrapper,
      props: { logout },
    } = setup()

    expect(logout).toHaveBeenCalled()
  })

  it('call getClubInformation if clubToken is present', () => {
    const {
      wrapper,
      props: {
        getClubInformation,
        params: { clubToken },
      },
    } = setup()

    expect(getClubInformation).toHaveBeenCalledWith({ clubToken })
  })
})
