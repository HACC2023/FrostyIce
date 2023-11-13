const Custom500 = () => {
  return (
    <div className='flex min-h-full flex-1 flex-col justify-center lg:px-8'>
      <img className='mx-auto h-24 w-auto' src='/logo.png' alt='CMDR' />
      <h1 className='text-center text-xl text-primary font-bold leading-9 tracking-tight text-gray-900'>
        500 Server Side Error
      </h1>
      <p className='mt-6 text-secondary text-center text-xl font-semibold'>
        There was an error connecting to the server. Please try again later.
      </p>
    </div>
  );
};

export default Custom500;
