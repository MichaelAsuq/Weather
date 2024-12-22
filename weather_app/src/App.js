import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Weather from './components/weather2';

function App() {
  return (
    <>
      <div className='container'>
        <div className='row'>

          <Weather />

        </div>

      </div>

    </>
  )
}

export default App;
