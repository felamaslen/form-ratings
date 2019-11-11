import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Segment } from './types';

import { COLOR_RATED, COLOR_OUTLINE, DEFAULT_SCALE } from './constants';

import {
  fracWhole,
  generateStarFraction,
} from './svg';

const drawPath = (scale: number = DEFAULT_SCALE, path: Segment[]): string => path
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

interface IProps {
  fraction: number,
  scale?: number,
  color: string,
}

const Star: React.FC<IProps> = ({ fraction, scale, color }) => (
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
  scale: DEFAULT_SCALE,
};

interface ContainerProps {
  fraction: number,
  onHover: (rating: number) => void,
  onChange: (rating: number) => void,
  hoverRating: number,
  color: string,
}

export function StarContainer({
  fraction,
  onHover,
  onChange,
  hoverRating,
  color,
}: ContainerProps) {
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
