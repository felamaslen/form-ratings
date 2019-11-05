import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import memoize from 'memoize-one';

const COLOR_OUTLINE = '#9197a3';
const COLOR_RATED = '#f7b500';
const COLOR_HOVER = COLOR_RATED;

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

// http://mathworld.wolfram.com/Pentagram.html for the
// geometry of a 5-pointed star
const DIST_A = 1 / (2 + 2 * Math.sin(Math.PI / 10));
const DIST_B = DIST_A * 2 * Math.sin(Math.PI / 10);
const DIST_P = DIST_A * Math.cos(Math.PI / 10);

const POINT_RADIUS = DIST_A / 10;
const LINE_LENGTH_DIFF = POINT_RADIUS / Math.tan(Math.PI / 10);

// Point positions of the star
// Each point is a pair where the lines stop and an arc is formed
const POINT_A = [
  DIST_A + (DIST_A - LINE_LENGTH_DIFF) * Math.cos((2 * Math.PI) / 5),
  LINE_LENGTH_DIFF * Math.sin((2 * Math.PI) / 5),
];
const POINT_A2 = [
  DIST_A + DIST_B - (DIST_A - LINE_LENGTH_DIFF) * Math.cos((2 * Math.PI) / 5),
  LINE_LENGTH_DIFF * Math.sin((2 * Math.PI) / 5),
];

const POINT_B = [DIST_A * 2 + DIST_B - LINE_LENGTH_DIFF, DIST_P];
const POINT_B2 = [
  DIST_A * 2 + DIST_B - LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P + LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
];

const POINT_C = [
  DIST_A + DIST_B + (DIST_B + DIST_A - LINE_LENGTH_DIFF) * Math.cos((2 * Math.PI) / 5),
  DIST_P + (DIST_B + DIST_A - LINE_LENGTH_DIFF) * Math.sin((2 * Math.PI) / 5),
];
const POINT_C2 = [
  DIST_A + DIST_B + (DIST_B + DIST_A) * Math.cos((2 * Math.PI) / 5) - LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P + (DIST_B + DIST_A) * Math.sin((2 * Math.PI) / 5) - LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
];

const POINT_D = [
  DIST_A - (DIST_B + DIST_A) * Math.cos((2 * Math.PI) / 5) + LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P + (DIST_B + DIST_A) * Math.sin((2 * Math.PI) / 5) - LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
];
const POINT_D2 = [
  DIST_A - (DIST_B + DIST_A - LINE_LENGTH_DIFF) * Math.cos((2 * Math.PI) / 5),
  DIST_P + (DIST_B + DIST_A - LINE_LENGTH_DIFF) * Math.sin((2 * Math.PI) / 5),
];

const POINT_E = [
  LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P + LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
];
const POINT_E2 = [LINE_LENGTH_DIFF, DIST_P];

// POLY_gon positions of the pentagon
const POLY_A = [DIST_A, DIST_P];
const POLY_B = [DIST_A + DIST_B, DIST_P];
const POLY_C = [
  DIST_A + DIST_B * (1 + Math.cos((2 * Math.PI) / 5)),
  DIST_P + DIST_B * Math.sin((2 * Math.PI) / 5),
];
const POLY_D = [DIST_A + DIST_B / 2, DIST_P * 2];
const POLY_E = [
  DIST_A - DIST_B * Math.cos((2 * Math.PI) / 5),
  DIST_P + DIST_B * Math.sin((2 * Math.PI) / 5),
];

const WIDTH = (DIST_A + DIST_B + DIST_A);
const DIFF_FRAC = LINE_LENGTH_DIFF / WIDTH;

const F0_MIN = DIFF_FRAC;
const F1_X = DIST_A - (DIST_B + DIST_A) * Math.cos((2 * Math.PI) / 5);
const F1_MIN = F1_X + DIFF_FRAC * Math.cos(Math.PI / 5);

const F2_X = DIST_A - (DIST_B) * Math.cos((2 * Math.PI) / 5);

const F3_X = DIST_A;

const F4_X = DIST_A + (DIST_B / 2);
const F4_X_LEFT = F4_X - LINE_LENGTH_DIFF * Math.sin(Math.PI / 10);
const F4_X_RIGHT = F4_X + LINE_LENGTH_DIFF * Math.sin(Math.PI / 10);

const F5_X = DIST_A + DIST_B;

const F6_X = DIST_A + DIST_B * (1 + Math.cos((2 * Math.PI) / 5));

const F7_X = (DIST_A + DIST_B) * (1 + Math.cos((2 * Math.PI) / 5));
const F7_X_LEFT = F7_X - LINE_LENGTH_DIFF * Math.cos(Math.PI / 5);
const F7_X_RIGHT = F7_X - LINE_LENGTH_DIFF * Math.sin(Math.PI / 10);

const F8_X = (2 * DIST_A) + DIST_B;
const F8_X_LEFT = F8_X - LINE_LENGTH_DIFF;

const fracWhole = [
  ['M', POINT_A],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_A2],
  ['L', POLY_B],
  ['L', POINT_B],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_B2],
  ['L', POLY_C],
  ['L', POINT_C],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_C2],
  ['L', POLY_D],
  ['L', POINT_D],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_D2],
  ['L', POLY_E],
  ['L', POINT_E],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_E2],
  ['L', POLY_A],
  ['L', POINT_A],
];

const frac1 = (fracWidth) => ([
  ['M', POINT_E],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_E2],
  ['L', [fracWidth, DIST_P]],
  ['L', [fracWidth, DIST_P + (fracWidth * Math.tan(Math.PI / 5))]],
]);

const frac2 = (fracWidth) => {
  const sectionWidth = fracWidth - F1_X;

  return [
    ['M', POINT_D],
    ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_D2],
    ['L', [
      F1_X + sectionWidth,
      DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
        - (sectionWidth / Math.tan(Math.PI / 10)),
    ]],
    ['L', [
      F1_X + sectionWidth,
      DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
        - (sectionWidth * Math.tan(Math.PI / 5)),
    ]],
  ];
};

const frac3 = (fracWidth) => {
  const sectionWidth = fracWidth - F2_X;

  return [
    ['M', [F2_X, DIST_P + (DIST_B) * Math.cos(Math.PI / 10)]],
    ['L', [
      F2_X + sectionWidth,
      DIST_P + (DIST_B) * Math.cos(Math.PI / 10)
      + sectionWidth * Math.tan(Math.PI / 5),
    ]],
    ['L', [
      F2_X + sectionWidth,
      DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
        - ((sectionWidth + (F2_X - F1_X)) * Math.tan(Math.PI / 5)),
    ]],
    ['L', [
      F2_X,
      DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
        - (F2_X - F1_X) * Math.tan(Math.PI / 5),
    ]],
  ];
};

const frac4 = (fracWidth) => {
  const sectionWidth = fracWidth - F3_X;

  return [
    ['M', [F3_X, DIST_P]],
    ['L', [fracWidth, DIST_P - sectionWidth * Math.tan((2 * Math.PI) / 5)]],
    ['L', [
      fracWidth,
      DIST_P + DIST_B * Math.cos(Math.PI / 10)
        + (F3_X - F2_X + sectionWidth) * Math.tan(Math.PI / 5),
    ]],
    ['L', [
      F3_X,
      DIST_P + DIST_B * Math.cos(Math.PI / 10)
        + (F3_X - F2_X) * Math.tan(Math.PI / 5),
    ]],
  ];
};

const frac5 = (fracWidth) => {
  const sectionWidth = fracWidth - F4_X_LEFT;
  const sectionHeight = Math.sqrt(
    (POINT_RADIUS ** 2)
    - ((sectionWidth - (POINT_RADIUS * Math.cos(Math.PI / 10))) ** 2),
  );

  return [
    ['M', [
      DIST_A + (DIST_B / 2) - (LINE_LENGTH_DIFF * Math.sin(Math.PI / 10)),
      LINE_LENGTH_DIFF * Math.cos(Math.PI / 10),
    ]],
    ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', [
      fracWidth,
      LINE_LENGTH_DIFF * Math.cos(Math.PI / 10)
        + (POINT_RADIUS * Math.sin(Math.PI / 10))
        - sectionHeight,
    ]],
    ['L', [
      fracWidth,
      DIST_P + DIST_B * Math.cos(Math.PI / 10)
        + (F4_X_LEFT - F2_X + sectionWidth) * Math.tan(Math.PI / 5),
    ]],
    ['L', [
      F4_X_LEFT,
      DIST_P + DIST_B * Math.cos(Math.PI / 10)
        + (F4_X_LEFT - F2_X) * Math.tan(Math.PI / 5),
    ]],
  ];
};

const frac6 = (fracWidth) => ([
  ['M', [
    F4_X_RIGHT,
    DIST_P + DIST_B * Math.cos(Math.PI / 10)
      + (F4_X_RIGHT - F2_X) * Math.tan(Math.PI / 5),
  ]],
  ['L', [
    fracWidth,
    DIST_P + DIST_B * Math.cos(Math.PI / 10)
      + (fracWidth - F2_X) * Math.tan(Math.PI / 5),
  ]],
  ['L', [
    fracWidth,
    (fracWidth - F4_X) * Math.tan((2 * Math.PI) / 5),
  ]],
  ['L', [
    F4_X_RIGHT,
    LINE_LENGTH_DIFF * Math.cos(Math.PI / 10),
  ]],
]);

const frac7 = (fracWidth) => ([
  ['M', [F5_X, DIST_P]],
  ['L', [fracWidth, DIST_P]],
  ['L', [
    fracWidth,
    DIST_P
      + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - fracWidth) * Math.tan(Math.PI / 5),
  ]],
  ['L', [
    F5_X,
    DIST_P
      + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - F5_X) * Math.tan(Math.PI / 5),
  ]],
]);

const frac8 = (fracWidth) => ([
  ['M', [F6_X, DIST_P]],
  ['L', [fracWidth, DIST_P]],
  ['L', [
    fracWidth,
    DIST_P + (F8_X - fracWidth) * Math.tan(Math.PI / 5),
  ]],
  ['L', [
    F6_X,
    DIST_P + DIST_B * Math.cos(Math.PI / 10),
  ]],
]);

const frac9 = (fracWidth) => ([
  ['M', [
    F6_X,
    DIST_P + DIST_B * Math.cos(Math.PI / 10),
  ]],
  ['L', [
    fracWidth,
    DIST_P + DIST_B * Math.cos(Math.PI / 10)
      + (fracWidth - F6_X) / Math.tan(Math.PI / 10),
  ]],
  ['L', [
    fracWidth,
    DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - fracWidth) * Math.tan(Math.PI / 5),
  ]],
  ['L', [
    F6_X,
    DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - F6_X) * Math.tan(Math.PI / 5),
  ]],
]);

const frac10 = [
  ['M', [
    F7_X_LEFT,
    DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - F7_X_LEFT) * Math.tan((2 * Math.PI) / 5),
  ]],
  ['L', [
    F7_X_RIGHT,
    DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - F7_X_RIGHT) * Math.tan((2 * Math.PI) / 5),
  ]],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', [
    F7_X_LEFT,
    DIST_P + (DIST_B + DIST_A) * Math.cos(Math.PI / 10)
      - (F7_X - F7_X_LEFT) * Math.tan(Math.PI / 5),
  ]],
];

const frac11 = [
  ['M', [F8_X_LEFT, DIST_P]],
  ['A', [POINT_RADIUS, POINT_RADIUS], '0,0,1', POINT_B2],
  ['L', [
    F8_X_LEFT,
    DIST_P + LINE_LENGTH_DIFF * Math.tan(Math.PI / 5),
  ]],
];

const generateStarFraction = memoize((fraction) => {
  const fracWidth = fraction * WIDTH;

  return [
    fraction >= F0_MIN && frac1(Math.min(fracWidth, F3_X)),
    fraction >= F1_MIN && frac2(Math.min(fracWidth, F2_X)),
    fraction >= F2_X && frac3(Math.min(fracWidth, F4_X)),
    fraction >= F3_X && frac4(Math.min(fracWidth, F4_X_LEFT)),
    fraction >= F4_X_LEFT && frac5(Math.min(fracWidth, F4_X_RIGHT)),
    fraction >= F4_X_RIGHT && frac6(Math.min(fracWidth, F5_X)),
    fraction >= F5_X && frac7(Math.min(fracWidth, F6_X)),
    fraction >= F6_X && frac8(Math.min(fracWidth, F8_X_LEFT)),
    fraction >= F6_X && frac9(Math.min(fracWidth, F7_X_LEFT)),
    fraction > F7_X_LEFT && frac10,
    fraction > F8_X_LEFT && frac11,
  ]
    .filter(Boolean)
    .map((path, index) => ({
      path,
      key: `frac-${index}`,
    }));
});

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

  return (
    <div
      className="star-container"
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      onClick={onClick}
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

const RatingsField = ({
  name,
  value,
  formik: { setFieldValue },
}) => {
  const onChange = useCallback((newValue) => setFieldValue(name, newValue),
    [name, setFieldValue]);

  const [hoverRating, setHoverRating] = useState(null);

  const onReset = useCallback(() => setHoverRating(null), []);

  const rating = hoverRating || value;
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
    >
      {stars.map(({ key, fraction }, index) => (
        <StarContainer
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
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};

RatingsField.defaultProps = {
  value: 0,
};

export default connect(RatingsField);
