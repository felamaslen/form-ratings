import React, { useState, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import FormRatings, { Stars } from 'form-ratings';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './App.css';

const initialValues = {
  someField: 'foo',
  ratingQuality: null,
  ratingPrice: null,
};

const MyForm = () => {
  const [result, setResult] = useState(initialValues);

  const onSubmit = useCallback((values) => setResult(values), []);

  return (
    <>
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
      <hr />
      <h3>Submit result:</h3>
      <SyntaxHighlighter language="json" style={docco}>
        {JSON.stringify(result, null, 2)}
      </SyntaxHighlighter>
      <hr />
      <h3>Code:</h3>
      <SyntaxHighlighter language="javascript" style={docco}>{
`import React from 'react';
import { render } from 'react-dom';
import { Formik, Form, Field } from 'formik';
import FormRatings from 'form-ratings';

render((
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
), document.getElementById('root'));
`}
      </SyntaxHighlighter>
    </>
  );
};

const MyStatic = () => {
  const [value, setValue] = useState(null);

  return (
    <>
      <Stars value={value} color="red" />
      <input
        type="range"
        min="0"
        max="5"
        step="0.01"
        value={value || 0}
        onChange={({ target: { value } }) => setValue(value)}
      />
      <span>Value: {value && Number(value).toFixed(2)}</span>
      <hr />
      <h3>Code:</h3>
      <SyntaxHighlighter language="javascript" style={docco}>{
`import React from 'react';
import { render } from 'react-dom';
import { Formik, Form, Field } from 'formik';
import { Stars } from 'form-ratings';

render((
  <Stars value={value} color="red" />
), document.getElementById('root'));
`}
      </SyntaxHighlighter>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <section className="form">
        <h2>Form</h2>
        <MyForm />
      </section>
      <section className="static">
        <h2>Static field</h2>
        <MyStatic />
      </section>
    </div>
  );
}

export default App;
