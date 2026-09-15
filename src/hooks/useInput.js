import { useState } from 'react';

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(defaultValue);
  };

  return [value, handleValueChange, setValue, reset];
}

export default useInput;
