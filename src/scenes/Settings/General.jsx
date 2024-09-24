import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Formik, Form, Field } from 'formik';
import { Flex } from '@rebass/grid';
import { withTranslation } from 'react-i18next';
import {
  Box,
  Text,
  ImageInput,
  FormikInput as Input,
  Button,
  TextArea,
} from 'components';
import { Camera } from 'components/icons';
import clubDefault from 'images/club-default.png';
import { getActive } from 'clubs/selectors';
import { update, fetch } from 'clubs/actions';


function General({ club, update, t, getInfo}) {
  const [submitted, setSubmitted] = useState(false);
 const [dataPolicyPlaceholder, setDataPolicyPlaceholder] = useState("Indsæt link til datapolitik")
  
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const handleSubmit = (values) =>
    new Promise((resolve) => {
      update({ ...values, resolve })
      
    }).then(() => {
      getInfo({dataPolicy: true})
      setSubmitted(true)
      delay(2000).then(()=> setSubmitted(false));
      
    });
    

    const linkRegex = /(http(s?)):\/\//i;

    function isValidLink(input) {
      return linkRegex.test(input) || input === "" || input === null;
    }
    
  return club ? (
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={{...club, publicDescription: "", privateDescription: ""}}
      >
        {({values}) => (
        <Form>
          <Flex width={800} alignItems="flex-end">
            <Box flex="1" mr={4}>
              <Field
                name="image"
                component={ImageInput}
                placeholder={club.imageUrl || clubDefault}
                renderButton={({ value }) => (
                  <Flex justifyContent="center" alignItems="center">
                    <Box mr={2}>
                      <Camera fill="purple" size={18} />
                    </Box>
                    <Text purple fontWeight={400}>
                      {club.imageUrl || value ? t('Skift billede') : t('Tilføj billede')}
                    </Text>
                  </Flex>
                )}
              />
            </Box>
            <Box flex="1"></Box>
          </Flex>
          <Flex width={1/1} mt={3} style={{ gap: '25px' }}>
            <Box mr={4} flex="1">
              <Box>
                <Text small secondary>
                  {t('Navn')} *
                </Text>
              </Box>
              <Field
                small
                white
                placeholder={t('Navngiv din forening, klub, hold')}
                name="clubName"
                component={Input}
              />
              <Flex style={{ gap: '10px' }}>
                <Flex style={{ flexDirection: 'column' }}>
                  <Box mr={3}>
                    <Text small secondary>
                      {t('Postnummer')} *
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Field
                      small
                      white
                      placeholder={`${t('Postnummer')} ...`}
                      name="zip"
                      component={Input}
                    />
                  </Box>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Box>
                    <Text small secondary>
                      {t('By')}
                    </Text>
                  </Box>
                  <Field
                    small
                    white
                    placeholder={`${t('By')} ...`}
                    name="city"
                    component={Input}
                  />
                </Flex>
              </Flex>

              <Box>
                <Text small secondary>
                  {t('Adresse')}
                </Text>
              </Box>
              <Field
                small
                white
                placeholder={`${t('Adresse')} ...`}
                name="address"
                component={Input}
              />

              <Box>
                <Text small secondary>
                  {t('Telefonnummer')}
                </Text>
              </Box>
              <Field
                small
                white
                placeholder={`${t('Telefonnummer')} ...`}
                name="phoneNumber"
                component={Input}
              />
              <Box>
                <Text small secondary>
                  {t('Hjemmeside')}
                </Text>
              </Box>
              <Field
                small
                white
                placeholder={`${t('Hjemmeside')} ...`}
                name="homePage"
                component={Input}
              />
              <Box>
                <Text small secondary>
                  {t('Datapolitik')} (format: https://www.example.com)
                </Text>
              </Box>
                
              <Field
                small
                white
                name="dataPolicyLink"
                placeholder={`${t(dataPolicyPlaceholder)}`}
                component={Input}
                error={!isValidLink(values.dataPolicyLink)}
              /> 
                <Text small secondary>
                  {t('CVR')}
                </Text>
              <Field
                small
                white
                placeholder={`${t('Indsæt CVR')} ...`}
                name="vatId"
                component={Input}
              />
            </Box>

            
            <Box flex="2">
              {/* <Box flex="1">
                <Box>
                  <Text small secondary>
                    {t('Offentlig beskrivelse')}
                  </Text>
                </Box>
                <Field
                  white
                  name="publicDescription"
                  placeholder={`${t('Skriv en beskrivelse')} ...`}
                  component={TextArea}
                  style={{ height: "190px" }}
                />
              </Box>
              <Box flex="1">
                <Box>
                  <Text small secondary>
                    {t('Privat beskrivelse')}
                  </Text>
                </Box>
                <Field
                  white
                  name="privateDescription"
                  placeholder={`${t('Skriv en beskrivelse')} ...`}
                  component={TextArea}
                  style={{ height: '190px' }}
                />
              </Box> */}
              <Flex>
                <Box>
                
                  <Button
                    bold
                    block
                    small
                    {...{ success: submitted, primary: !submitted }}
                    type="submit"
                    disabled={!isValidLink(values.dataPolicyLink)}
                  >
                    {submitted ? `${t('Gemt')}!` : t('Gem ændringer')}
                  </Button> 
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  ) : null;
  }


const enhancer = connect(
  createStructuredSelector({
    club: getActive,
  }),
  {
    update: update.requested,
    getInfo: fetch.requested
  }
);

export default withTranslation()(enhancer(General));
