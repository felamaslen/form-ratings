import React, { FunctionComponent, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, FormikContextType } from 'formik';

import { Stars } from './stars';
import { COLOR_RATED, COLOR_HOVER } from './constants';

export { Stars } from './stars';

interface RatingsFieldProps {
  name: string;
  value?: number;
  formik: FormikContextType<{ [x: string]: {} }>;
}

const RatingsField: FunctionComponent<RatingsFieldProps & {
  formik: FormikContextType<{ [x: string]: {} }>;
}> = ({ name, value, formik: { setFieldValue } }) => {
  const numberValue = Number(value);
  const onChange = useCallback(newValue => setFieldValue(name, newValue), [name, setFieldValue]);

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const onReset = useCallback(() => setHoverRating(null), []);

  const rating = hoverRating || numberValue;
  const color = hoverRating ? COLOR_HOVER : COLOR_RATED;

  return (
    <div className="form-ratings" onMouseLeave={onReset} onBlur={onReset}>
      <Stars value={rating} onHover={setHoverRating} onChange={onChange} color={color} />
    </div>
  );
};

RatingsField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    setFieldError: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFormikState: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    getFieldProps: PropTypes.func.isRequired,
    getFieldMeta: PropTypes.func.isRequired,
    registerField: PropTypes.func.isRequired,
    unregisterField: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    values: PropTypes.objectOf(PropTypes.shape({}).isRequired).isRequired,
    initialValues: PropTypes.objectOf(PropTypes.shape({}).isRequired).isRequired,
    errors: PropTypes.object.isRequired,
    initialErrors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    initialTouched: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValidating: PropTypes.bool.isRequired,
    submitCount: PropTypes.number.isRequired,
  }).isRequired,
};

RatingsField.defaultProps = {
  value: 0,
};

export default connect(RatingsField);
