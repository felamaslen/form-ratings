import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, FormikContextType } from 'formik';

import { StarContainer as Star } from './star';
import { COLOR_RATED, COLOR_HOVER } from './constants';

const flex = {
  display: 'inline-flex',
};

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

  const stars = new Array(5).fill(0)
    .map((item, index) => ({
      key: `star-${index}`,
      fraction: rating > index + 1
        ? 1
        : Math.max(0, rating - index),
    }));

  return (
    <div
      className="form-ratings"
      onMouseLeave={onReset}
      onBlur={onReset}
      style={flex}
    >
      {stars.map(({ key, fraction }, index) => (
        <Star
          key={key}
          fraction={fraction}
          onHover={setHoverRating}
          onChange={onChange}
          hoverRating={index + 1}
          color={color}
        />
      ))}
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
