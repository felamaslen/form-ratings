import { Segment, StarPart } from './types';

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
  DIST_A +
    DIST_B +
    (DIST_B + DIST_A) * Math.cos((2 * Math.PI) / 5) -
    LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P +
    (DIST_B + DIST_A) * Math.sin((2 * Math.PI) / 5) -
    LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
];

const POINT_D = [
  DIST_A -
    (DIST_B + DIST_A) * Math.cos((2 * Math.PI) / 5) +
    LINE_LENGTH_DIFF * Math.cos(Math.PI / 5),
  DIST_P +
    (DIST_B + DIST_A) * Math.sin((2 * Math.PI) / 5) -
    LINE_LENGTH_DIFF * Math.sin(Math.PI / 5),
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

// polygon positions of the pentagon
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

export const fracWhole: Segment[] = [
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

export const generateStarFraction = (fraction: number): StarPart[] => [
  {
    key: 'outline',
    path: [['M', [0, 0]], ['L', [1, 0]], ['L', [1, 1]], ['L', [0, 1]], ['z'], ...fracWhole, ['z']],
  },
  {
    key: 'mask',
    path: [
      ['M', [fraction, 0]],
      ['L', [1, 0]],
      ['L', [1, 1]],
      ['L', [fraction, 1]],
    ],
  },
];
