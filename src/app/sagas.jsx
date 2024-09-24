import {put, select, call} from 'redux-saga/effects'
import {keys, startsWith} from 'lodash'
import {getToken} from 'authentication/selectors'
import {logout} from 'authentication/actions'
import camelCaseKeys from 'lib/camelCaseKeys'
import getAppUrls from 'jsonFetches/getAppUrls'
import * as actions from "../authentication/actions"

const basicAuthCredentials = (app = false) =>
  btoa(
    app
      ? 'minforeningapiuser:eGFt5y377hEbeD7aTFpQgxQf26tEym'
      : 'minforeningwebuser:ZxDjmeQrwpqYd2zDxIHLShu3wrnptz'
  )

export function* api(
  url,
  {
    withToken = true,
    overrideToken,
    method = 'get',
    version = 'v2',
    appApi = false,
    body,
    ...options
  } = {}
) {
  const token = withToken
    ? overrideToken
      ? overrideToken
      : yield select(getToken)
    : undefined

  const authorization = token
    ? `Bearer ${token}`
    : `Basic ${basicAuthCredentials(appApi)}`

  const headers = {
    Authorization: authorization,
    'Content-Type': 'application/json',
  }

  const baseEndpoint = getAppUrls().apiMyOrgUrl
  if (!baseEndpoint) {
    const t = overrideUrl ? url : `${baseEndpoint}/${version}${url}`
    console.log('baseEndpoint is empty' + t);
    throw new Error('baseEndpoint is empty');
  }
 

  const response = yield call(
    fetch,
    startsWith(url, 'http') || startsWith(url, 'https')
      ? url
      : `${baseEndpoint}${
          version ? `/${version}` : ''
        }${url}`,
    {
      ...options,
      method: method.toUpperCase(),
      headers,
      body: JSON.stringify(body),
    }
  )

  const json = yield call([response, 'json'])
  const transformed = yield call(camelCaseKeys, json)

  if (!response.ok) {
      
      yield put(actions.serverError({status: response.status, message: json.Message}))
      
    } else {
      return transformed;
    }
  }
  
 

export function specialRequest(url, method, body) {

  return function(callback) {
    
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(null, xhr.response)
        } else {
          callback(xhr.status, null)
        }
      }
    }
    xhr.ontimeout = function () {
      console.log('timeout')
    }
    xhr.open(method, url, true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(keys(body)[0] === '' ? body[''] : body));
  }
}

export function* apiRequest(
  url,
  {
    withToken = true,
    overrideToken,
    overrideUrl = false,
    method = 'get',
    version = 'v2',
    appApi = false,
    body,
    returnRaw = false,
    isJsonSpecial = false,
    stopRequestedWith = false,
    ...options
  } = {}
) {
  const token = withToken
    ? overrideToken
      ? overrideToken
      : yield select(getToken)
    : undefined
  const authorization = token
    ? `Bearer ${token}`
    : `Basic ${basicAuthCredentials(appApi)}`

  let data

  let headers = {};

  if (!stopRequestedWith) {
    headers = {
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  if (withToken) {
    headers["Authorization"] = authorization;
  }

  if (!body) {
    data = undefined
  } else if (!(body instanceof FormData)) {
    data = JSON.stringify(keys(body)[0] === '' ? body[''] : body)

    headers['Content-Type'] = 'application/json'
  } else {
    data = body
  }

  let response = null;
  if (isJsonSpecial) {
    let headers2 = {

    }
    const baseEndpoint = getAppUrls().apiMyOrgUrl

    if (!baseEndpoint) {
      const t = overrideUrl ? url : `${baseEndpoint}/${version}${url}`
      console.log('baseEndpoint is empty ' + t);
      throw new Error('baseEndpoint is empty');
    }

    response = yield call(
      fetch,
      overrideUrl ? url : `${baseEndpoint}/${version}${url}`,
      {
        ...options,
        method: method.toUpperCase(),
        headers: headers2,
        body: JSON.stringify(keys(body)[0] === '' ? body[''] : body),
      }
    )
  } else {
    const baseEndpoint = getAppUrls().apiMyOrgUrl
    if (!baseEndpoint) {
      var t = overrideUrl ? url : `${baseEndpoint}/${version}${url}`
      console.log('baseEndpoint is empty ' + t);
      throw new Error('baseEndpoint is empty');
    }

   
    response = yield call(
      fetch,
      overrideUrl ? url : `${baseEndpoint}/${version}${url}`,
      {
        ...options,
        method: method.toUpperCase(),
        headers,
        body: data,
      }
    )
  }

  if (response.status === 403) {
    yield put(logout())
  } else if (response.status === 204) {
    return null
  } else if (response.status === 401 && url.indexOf('login') !== -1) {
    throw {'message': 'forkert password'}
  }

  if (response.status === 404){
    console.log("Connection error, trying again")
  }

  if (returnRaw) {
    
    return response
  } else {
    const json = yield call([response, 'json'])

    const transformed = yield call(camelCaseKeys, json)

    if (!response.ok) {
      
      yield put(actions.serverError({status: response.status, message: json.Message}))
      
    } else {
      return transformed;
    }
  

  }
}
