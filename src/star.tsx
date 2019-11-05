import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { COLOR_RATED, COLOR_OUTLINE } from './constants';

import {
  fracWhole,
  generateStarFraction,
} from './svg';

const drawPath = (scale, path) => path
  .map(([op, ...points]) => `${op} ${points
    .map((value) => {
      if (Array.isArray(value)) {
        return value.map((pix) => pix * scale).join(',');
      }

      return value;
    })
    .join(' ')
  }`)
  .join(' ');

const Star = ({ fraction, scale, color }) => (
  <svg width={scale} height={scale}>
    {fraction === 1 && (
      <path
        d={drawPath(scale, fracWhole)}
        stroke="none"
        strokeWidth={0}
        fill={color}
      />
    )}
    {fraction > 0 && fraction < 1 && generateStarFraction(fraction)
      .map(({ path, key }) => (
        <path
          key={key}
          d={drawPath(scale, path)}
          stroke={color}
          strokeWidth={1}
          fill={COLOR_RATED}
        />
      ))}
    <path
      d={drawPath(scale, fracWhole)}
      stroke={fraction > 0 ? color : COLOR_OUTLINE}
      strokeWidth={1}
      fill="none"
    />
  </svg>
);

Star.propTypes = {
  fraction: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  scale: PropTypes.number,
};

Star.defaultProps = {
  scale: 24,
};

function StarContainer({
  fraction,
  onHover,
  onChange,
  hoverRating,
  color,
}) {
  const onMouseOver = useCallback(() => onHover(hoverRating), [onHover, hoverRating]);
  const onClick = useCallback(() => onChange(hoverRating), [onChange, hoverRating]);
  const onKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      onChange(hoverRating);
    }
  }, [onChange, hoverRating]);

  return (
    <div
      role="button"
      tabIndex={0}
      className="star-container"
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Star
        fraction={fraction}
        color={color}
      />
    </div>
  );
}

StarContainer.propTypes = {
  fraction: PropTypes.number.isRequired,
  onHover: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  hoverRating: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default StarContainer;
