import React, { useMemo, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Modal, Loading } from 'components';
import { create } from 'messages/actions';
import Details from './Details';
import Groups from './Groups';
import useCustomTranslation from 'lib/customT';
import { getNestedGroupsArray } from 'groups/selectors';  // Importer korrekt selector

const validationSchema = Yup.object({
  title: Yup.string().required(),
  message: Yup.string().required(),
  allMembers: Yup.bool(),
  groupIds: Yup.array(),
});

const initialValues = {
  title: '',
  message: '',
  allMembers: false,
  groupIds: [],
};

const steps = {
  DETAILS: 0,
  GROUPS: 1,
};

const CreateModal = ({ hide, create, groups }) => {
  const t = useCustomTranslation();
  const [step, setStep] = useState(steps.DETAILS);

  const handleNext = useCallback(
    (event) => {
      event.preventDefault();
      if (groups && groups.length > 0) {
        setStep(steps.GROUPS);
      }
    },
    [setStep, groups]
  );

  const handleSubmit = useCallback(
    (values, { setSubmitting }) => {
      new Promise((resolve, reject) => {
        create({ values, resolve, reject });
      }).then(hide);
    },
    [create, hide]
  );

  const back = useMemo(
    () => (step === steps.GROUPS ? () => setStep(steps.DETAILS) : undefined),
    [step, setStep]
  );

  const hasGroups = groups && groups.length > 0;

  return (
    <Modal hide={hide} title={t('Opret besked')} back={back}>
      <Box m={3}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isValid, isSubmitting, values, handleSubmit }) => (
            <Form>
              {step === steps.DETAILS && <Details />}
              {step === steps.GROUPS && <Groups />}

              {values.allMembers || step === steps.GROUPS ? (
                <Button
                  small
                  block
                  primary
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? <Loading size={20} /> : t('Godkend')}
                </Button>
              ) : (
                <Button
                  small
                  block
                  primary
                  disabled={!isValid || (!values.title && !values.message) || !hasGroups}
                  type="button"
                  onClick={handleNext}
                >
                  {t('Vælg modtagere')}
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

const enhancer = connect(
  (state) => ({
    groups: getNestedGroupsArray(state), // Bruger den korrekte selector
  }),
  { create: create.requested }
);

export default enhancer(CreateModal);
