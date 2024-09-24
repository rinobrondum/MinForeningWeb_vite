import {createSelector} from 'reselect'
import getDomainSettings from 'jsonFetches/getDomainSettings'

function getDomainWithoutSubdomain(url) {
  // Create a URL object
  let urlObject = new URL(url);
  let hostname = urlObject.hostname;

  // Split the hostname by dots
  let parts = hostname.split('.');

  // If the hostname has more than two parts, remove the subdomain part(s)
  if (parts.length > 2) {
      // Remove the first part (subdomain)
      parts.shift();
  }

  // Join the remaining parts back into a domain
  let domain = parts.join('.');
  return domain;
}

export const getTextTags = () => {
  let model = {
    appName: '',
    shortCompanyName: '',
    companyName: ''
  }

  try {
    const settings = getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)];

    model = {
      appName: settings.appName,
      shortCompanyName: settings.mainSortName,
      companyName: settings.mainWebsiteUrlLabel
    }
  } catch (error) {

  }

  return model
}

export const getAppName = () => {
  return (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].appName)
}

export const getCompanyName = () => {
  return (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].companyName)

}
  
export const getTopLevelDomainName = () =>
  (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].mainWebsiteUrl)

export const getTld = createSelector(
  [getTopLevelDomainName],
  (companyName) =>
    (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].tld)
)

export const getTldLocale = createSelector(
  [getTopLevelDomainName],
  (companyName) =>
    (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].langCode)
)

export const getTldEmail = createSelector(
  [getTopLevelDomainName],
  (companyName) =>
    (getDomainSettings()[getDomainWithoutSubdomain("https://" + window.location.hostname)].mainEmail)
)
