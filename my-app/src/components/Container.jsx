const Container = ({ children }) => {
  return (
    <div className="p-4 md:p-10 flex flex-col gap-3 bg-base-100 md:m-3 md:rounded-3xl text-primary min-h-screen backdrop-blur-3xl">
      {children}
    </div>
  )
}

export default Container;