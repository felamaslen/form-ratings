import React, { useState, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import FormRatings from 'form-ratings';

import './App.css';

const initialValues = {
  someField: 'foo',
  ratingQuality: null,
  ratingPrice: null,
};

/*
*/
function App() {
  const [result, setResult] = useState(initialValues);

  const onSubmit = useCallback((values) => setResult(values), []);

  return (
    <div className="App">
      <h2>Form submit result:</h2>
      <code>{JSON.stringify(result, null, 2)}</code>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <h3>Some field</h3>
              <Field name="someField" />
            </div>
            <div>
              <h3>Rating (quality)</h3>
              <Field name="ratingQuality" as={FormRatings} />
            </div>
            <div>
              <h3>Rating (price)</h3>
              <Field name="ratingPrice" as={FormRatings} />
            </div>
            <div>
              <button type="submit">Save</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
