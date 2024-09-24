import { getTextTags } from 'app/selectors';
import {useTranslation} from 'react-i18next'

const useCustomTranslation = (options) => {
  const { t } = useTranslation(options);


  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  // Create a function that wraps t and includes common variables
  const translate = (key, options) => {
    // You can define and provide other common variables here
    const values = getTextTags()

    values.organizationTypeNameCapitalize = t('organizationTypeNameCapitalize');
    values.organizationTypeName = t('organizationTypeName');

    // Merge common variables with options
    if (options) {
      const mergedOptions = { ...values, ...options };
      return t(key, mergedOptions);
    } else {
      return t(key, values);
    }
  };

  return translate;
};

export default useCustomTranslation;