# form-ratings

> Star ratings [Formik](https://github.com/jaredpalmer/formik) component

[![NPM](https://img.shields.io/npm/v/form-ratings.svg)](https://www.npmjs.com/package/form-ratings)

## Install

```bash
npm install --save form-ratings
```

## Usage

The following would be placed inside a `<Formik />` form:

```jsx
import React from 'react'
import { Field } from 'formik';
import FormRatings from 'form-ratings'

function Example() {
  return (
    <Field as={FormRatings} />
  );
}
```

Please see the code in the `example/` directory for more information.

## Development

In one tab, run the rollup watcher:

- `npm start`

In another tab, run the create-react-app development server:

- `cd example && npm start`

## License

MIT © [felamaslen](https://github.com/felamaslen)
