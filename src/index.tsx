import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, FormikContextType } from 'formik';

import { Stars } from './stars';
import { COLOR_RATED, COLOR_HOVER } from './constants';

export { Stars } from './stars';

interface IProps {
  name: string,
  value?: number,
}

const RatingsField: React.FC<IProps & {
  formik: FormikContextType<{ [x: string]: {}; }>
}> = ({
  name,
  value,
  formik: { setFieldValue },
}) => {
  const numberValue = Number(value);
  const onChange = useCallback((newValue) => setFieldValue(name, newValue),
    [name, setFieldValue]);

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const onReset = useCallback(() => setHoverRating(null), []);

  const rating = hoverRating || numberValue;
  const color = hoverRating
    ? COLOR_HOVER
    : COLOR_RATED;

  return (
    <div
      className="form-ratings"
      onMouseLeave={onReset}
      onBlur={onReset}
    >
      <Stars
        value={rating}
        onHover={setHoverRating}
        onChange={onChange}
        color={color}
      />
    </div>
  );
};

RatingsField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
};

RatingsField.defaultProps = {
  value: 0,
};

export default connect(RatingsField);
