import React, { useState } from 'react';
import { ModalOverlay, Button, ModalContent, CloseButton, H2, Form, FormGroup, Input, ErrorMessage } from './FormModule.style';
import useCustomTranslation from 'lib/customT'; // Importer den brugerdefinerede oversættelsesfunktion

const FormModal = ({ onClose, buttonText }) => {
  const t = useCustomTranslation(); // Flyttet deklarationen af t her

  const validateEmail = (email) => {
    // Simple email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false); // State for tracking if form is submitted
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onClose();
    } else {
      setError(t('emailValid')); // Brug af t til at oversætte fejlbeskeden
    }
    setSubmitted(true);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <H2>{buttonText}</H2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input type="text" placeholder={t('Bruger-email')} value={email} onChange={handleChange} />
            {submitted && error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>
          <CloseButton onClick={onClose}>X</CloseButton>
          <Button type="submit">{t('Bekræft')}</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FormModal;
