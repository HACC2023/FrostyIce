import { useState } from 'react';
const Error = () => {
  const [showError, setShowError] = useState(true);
  if (showError) {
    return (
      <div
        className='ma fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'
        style={{ zIndex: 1000 }}>
        <div className='max-w-lg rounded-lg bg-white p-8'>
          <img className='mx-auto h-24 w-auto' src='/logo.png' alt='CMDR' />
          <h1 className='text-center text-xl text-primary font-bold leading-9 tracking-tight text-gray-900'>
            500 Server Side Error
          </h1>
          <p className='mt-6 text-secondary text-center text-xl font-semibold'>
            There was an error connecting to the server. Please try again later.{' '}
            <br />
            If the error continues, please contact management through the
            Contact Forms.
          </p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <button
              className='w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
              onClick={() => setShowError(false)}>
              Close Error
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Error;
