import 'jest-localstorage-mock'
import {select, call} from 'redux-saga/effects'
import * as selectors from './selectors'
import * as sagas from './sagas'

describe.skip('authentication sagas', () => {
  describe('setTokenLocalStorage', () => {
    const generator = sagas.setTokenLocalStorage()

    it('should select token from store', () => {
      expect(generator.next().value).toEqual(select(selectors.getToken))
    })

    it('should save the token to local storage', () => {
      expect(generator.next().value).toEqual(
        call([localStorage, 'setItem'], 'mf-token', undefined)
      )
    })
  })
})
