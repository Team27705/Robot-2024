// TODO: extract patterns into constants?

export const validateDouble = (value) => {
  if (!isNaN(Number(value)) && value !== '') {
    return {
      value: parseFloat(value),
      valid: true,
    };
  } else {
    return {
      value,
      valid: false,
    };
  }
};

export const validateInt = (value) => {
  if (/^-?\d*$/.test(value) && value !== '-' && value !== '') {
    return {
      value: parseInt(value, 10),
      valid: true,
    };
  } else {
    return {
      value: value,
      valid: false,
    };
  }
};

export const validateString = (value) => {
  return {
    value: value,
    valid: true,
  };
};
