import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Container from "@/components/Container";

const SignIn = () => {
  const [error, setError] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // sends them to the home page
  if (session) {
    router.push("/home");
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      redirect: false,
    },
  });

  async function onSubmit(data) {
    console.log(data);
    const res = await signIn("credentials", data);
    if (res.error) {
      console.log("ERROR:", res.error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  return (
    <Container>
      <div className="flex min-h-full flex-1 flex-col justify-center lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-24 w-auto" src="/logo.png" alt="CMDR" />
          <h5 className="mt-6 text-secondary text-center text-xl font-semibold">
            Center for Marine Debris Research
          </h5>
          <h6 className="text-center text-secondary text-md font-semibold">
            Marine Debris Reporting Platform
          </h6>

          <div className="mt-8 p-8 rounded-2xl border">
            <h3 className="text-center text-xl text-primary font-bold leading-9 tracking-tight">
              Are you a member? Sign in here.
            </h3>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                className="space-y-6 group"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("email")}
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Example: john@cmdr.com"
                      className="block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      {...register("password")}
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••••"
                      className="block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
                    />
                    <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                      Please enter a valid password address
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary group-invalid:pointer-events-none group-invalid:opacity-30"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div
                className={`mt-2 py-1.5 px-2 rounded text-sm bg-red-100 text-red-600 border border-red-500 ${
                  error ? "" : "hidden"
                }`}
              >
                Invalid credentials.
              </div>

              {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Register here.
              </Link>
            </p> */}
            </div>
            <div className="divider mt-6 text-secondary font-semibold">OR</div>
            <div className="grid h-10 mt-4 card rounded-box place-items-center">
              <p className="text-center text-sm text-gray-500">
                Make a report as a guest{" "}
                <Link
                  href="/report"
                  className="font-semibold leading-6 text-primary hover:text-secondary"
                >
                  here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignIn;
