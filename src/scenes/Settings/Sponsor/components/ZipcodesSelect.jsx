import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

const animatedComponents = makeAnimated();

const ZipcodesSelect = ({
  defaultValue,
  options,
  setFieldValue,
  field,
}) => {
  const t = useCustomTranslation()
    return (
      <>
        <Select
          onChange={((values) => setFieldValue(field.name, values))}
          closeMenuOnSelect={false}
          components={animatedComponents}              
          defaultValue={defaultValue}
          isMulti
          options={options}
          getOptionLabel={(zipcodeOptions)=>zipcodeOptions.value}
          getOptionValue={(zipcodeOptions)=>zipcodeOptions.value}
          placeholder={t('Skriv postnumre')}
        />
      </>
    );
  };
  export default ZipcodesSelect;