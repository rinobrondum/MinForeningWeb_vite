import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Field, Form} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Yup from 'lib/yup'
import {Alert} from 'components/icons'
import {authenticate} from 'authentication'
import {Box, Flex, FormikInput as Input, Button, Tooltip, Link, Text, Loading} from 'components'
import {Login} from 'components/icons'
import {getCompanyName} from 'app/selectors'
import punydecode from 'punycode';

const useOrganisation = document.head.querySelector("[name~=useMinOrganisation][content]").content == "true";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
  domainName: useOrganisation ? Yup.string().required() : Yup.string()
})

const initialValues = {
  email: '',
  password: '',
  domainName: ''
}

const getSubdomain = () => {
  var subDomain = ""
  const hostname = window.location.hostname; // Get the full hostname
  const parts = hostname.split('.'); // Split the hostname into parts

  if (hostname.indexOf(".minorganisation.dk") !== -1 && parts.length > 2) {
    // If the hostname has more than two parts, the first part is usually the subdomain
    subDomain = parts.slice(0, parts.length - 2).join('.');
    subDomain = punydecode.toUnicode(subDomain); // decoded if there is "æøå"
    var splittedTLD = subDomain.split('-');
    var replaceTLD = splittedTLD[splittedTLD.length - 1]
    subDomain = subDomain.replace("-" + replaceTLD, "." + replaceTLD)
  }

  return subDomain
}

const LoginForm = ({authenticate, companyName}) => {
  const handleSubmit = useCallback(
    ({email, password, domainName}, {setErrors}) => {

      if (useOrganisation) {
        const tenantApi = () => document.head.querySelector("[name~=tenantApi][content]").content;
        const minorgendpointResolverUrl = tenantApi() + "/tenant/minorgendpoint/" + domainName;
        const minorggrowthbookurlResolverUrl = tenantApi() + "/tenant/minorggrowthbookurl/" + domainName;

        fetch(minorgendpointResolverUrl).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(apiMyOrgUrl => {
          localStorage.setItem("minOrganisation_apiMyOrgUrl", apiMyOrgUrl + "/api");
          localStorage.setItem("minOrganisation_websubDomain", domainName.replace(".", "-"));
          document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', apiMyOrgUrl + "/api");

          fetch(minorggrowthbookurlResolverUrl).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();
          })
          .then(growthBookUrl => {
            localStorage.setItem("minOrganisation_growthBookUrl", growthBookUrl);
            document.head.querySelector("[name~=growthBookUrl][content]").setAttribute('content', growthBookUrl);
  
            new Promise((resolve, reject) => {
              authenticate({email, password, resolve, reject}) 
              setIsLoading(true) 
            }).catch(error => {
              setErrors({global: error})
              setIsLoading(false)
            })
          }).catch(error => {
            console.error('Error:', error);
          });

        })
        .catch(error => {
          console.error('Error:', error);
        });
      } else {
        localStorage.removeItem('minOrganisation_apiMyOrgUrl')
        localStorage.removeItem('minOrganisation_websubDomain')

        new Promise((resolve, reject) => {
          authenticate({email, password, resolve, reject}) 
          setIsLoading(true) 
        }).catch(error => {
          setErrors({global: error})
          setIsLoading(false)
        })
      }

    },
    [authenticate]
    )
    
    const t = useCustomTranslation()
    const [isLoading, setIsLoading] = useState(false)
    
    if (getSubdomain() !== 'web') {
      initialValues.domainName = getSubdomain();
    }
    
  return (
    <Formik
      onSubmit={handleSubmit}
      validateOnBlur={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
   
    >
      {({errors}) => (
        <Form>
          <Field
            small
            white
            autoFocus
            border="1px solid"
            borderColor="inactive"
            name="email"
            type="email"
            placeholder="Email"
            component={Input}
          />
          <Field
            white
            small
            border="1px solid"
            borderColor="inactive"
            name="password"
            type="password"
            placeholder={t('Kode')}
            component={Input}
          />

          {useOrganisation &&
            <Flex flexDirection="row" alignItems="center" justifyContent="center" width="100%">
                <Box flex="1" mr={2}>
                  <Field 
                      small
                      white
                      border="1px solid"
                      borderColor="inactive"
                      name="domainName"
                      type="text"
                      placeholder={t('Domæne navn på din organisation')}
                      component={Input}
                  />
                </Box>
                
                <Box display="flex" alignItems="center" style={{ marginTop: '-15px', marginRight: '-24px'}}>
                  <Tooltip text={t('domainNameTooltip')} ml={2} width="200px">
                    {({show, hide}) => (
                      <Alert
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        fill="secondary"
                        size={16}
                      />
                    )}
                  </Tooltip>
                </Box>
            </Flex>
          }

          <Box mb={3}>
            <Button block purple bold type="submit">
              <Flex alignItems="center">
                <Box flex="1" mr={2}>
                  {isLoading ? <Loading size={20}/> : t('Log ind')}
                </Box>
                <Login size={20} fill="white" />
              </Flex>
            </Button>
          </Box>

          {errors.global && (
            <Box mt={3}>
              <Text danger>{errors.global}</Text>
            </Box>
          )}
          <Box mt={3}>
            <Text right primary>
              <Link primary to="/forgot">
                {t('Glemt kodeord?')}
              </Link>
            </Text>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(
  createStructuredSelector({companyName: getCompanyName}),
  {
    authenticate: authenticate.requested,
  }
)

export default enhancer(LoginForm)
