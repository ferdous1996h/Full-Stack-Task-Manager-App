import { useEffect, useState } from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const darkStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#1f2937',
    borderColor: state.isFocused ? '#6366f1' : '#374151',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#6366f1',
    },
  }),

  menu: base => ({
    ...base,
    backgroundColor: '#111827',
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#4f46e5'
      : state.isFocused
        ? '#374151'
        : '#111827',
    color: '#fff',
    cursor: 'pointer',
  }),

  singleValue: base => ({
    ...base,
    color: '#fff',
  }),

  input: base => ({
    ...base,
    color: '#fff',
  }),

  placeholder: base => ({
    ...base,
    color: '#9ca3af',
  }),

  dropdownIndicator: base => ({
    ...base,
    color: '#9ca3af',
  }),

  indicatorSeparator: base => ({
    ...base,
    backgroundColor: '#374151',
  }),

  multiValue: base => ({
    ...base,
    backgroundColor: '#374151',
  }),

  multiValueLabel: base => ({
    ...base,
    color: '#fff',
  }),
};
export default function MultiselectInput() {
  const [categoryOptions, setCategoryOptions] = useState([]);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('There is a error while fetching categories');
        }
        const data = await response.json();
        setCategoryOptions(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategory();
  }, []);
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[categoryOptions[0]]}
      isMulti
      options={categoryOptions}
      styles={darkStyles}
      className="mt-1"
      name="multiSelect"
      id="multiSelect"
    />
  );
}
