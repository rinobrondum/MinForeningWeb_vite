import {globalState } from 'app/components/App'

const getDomainSettings = () => {
  return globalState.states.get('domainSettings').state.value
}

export default getDomainSettings