import React, { useState, useEffect } from 'react';
import i18n from 'i18n'; // Assume i18n is already configured

async function loadTranslations(url, language, namespace) {
    try {
      const response = await fetch(`${url}/${language}/${namespace}.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const translations = await response.json();
      i18n.addResourceBundle(language, namespace, translations, true, true);
    } catch (error) {
      console.error('Failed to load translation file:', error);
      throw error; // Re-throw to be caught by loader
    }
  }

const Loader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  async function loadResources() {
    try {
      const appUrl = location.protocol + '//' + location.host;

      // Load each translation file
      // Assuming `loadTranslations` is a function that loads a JSON and adds it to i18next
      await Promise.all([
        loadTranslations(appUrl + '/locales', 'en', 'translation'),
        loadTranslations(appUrl + '/locales', 'da', 'translation'),
        loadTranslations(appUrl + '/locales', 'de', 'translation'),
        loadTranslations(appUrl + '/locales', 'cz', 'translation'),
        loadTranslations(appUrl + '/locales', 'es', 'translation'),
        loadTranslations(appUrl + '/locales', 'sk', 'translation'),
        loadTranslations(appUrl + '/locales', 'pl', 'translation'),
        loadTranslations(appUrl + '/locales', 'no', 'translation')
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Optionally set error handling or default state
    }
  }

  useEffect(() => {
    if(loading) loadResources();
  }, [loading]);

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return children;
};

export default Loader;