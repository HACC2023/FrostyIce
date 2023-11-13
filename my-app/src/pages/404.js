import Container from "@/components/Container";

const Custom404 = () => {
  return (
    <Container>
      <div className="flex min-h-full flex-1 flex-col justify-center lg:px-8">
        <img className="mx-auto h-24 w-auto" src="/logo.png" alt="CMDR" />
        <h1 className="text-center text-xl text-primary font-bold leading-9 tracking-tight text-gray-900">
          404 Page Not Found
        </h1>
        <p className="mt-6 text-secondary text-center text-xl font-semibold">
          The page you were looking for may be unavailable. Please try again
          later.
        </p>
      </div>
    </Container>
  );
};

export default Custom404;
