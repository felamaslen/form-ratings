import React, { FunctionComponent } from 'react';

import { StarContainer } from './star';

const flex = {
  display: 'inline-flex',
};

interface StarsProps {
  value: number;
  color: string;
  onHover?: (rating: number) => void;
  onChange?: (rating: number) => void;
}

export const Stars: FunctionComponent<StarsProps> = ({ value, color, onHover, onChange }) => {
  const stars = new Array(5).fill(0).map((item, index) => ({
    key: `star-${index}`,
    fraction: value > index + 1 ? 1 : Math.max(0, value - index),
  }));

  return (
    <div style={flex}>
      {stars.map(({ key, fraction }, index) => (
        <StarContainer
          key={key}
          fraction={fraction}
          onHover={onHover}
          onChange={onChange}
          hoverRating={index + 1}
          color={color}
        />
      ))}
    </div>
  );
};
