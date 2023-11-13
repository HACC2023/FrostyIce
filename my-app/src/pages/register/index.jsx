import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Register = () => {
  const [error, setError] = useState(false);
  const [exists, setExists] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (session) {
    router.push("/");
  }

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      image: "",
      confirmPassword: "",
      confrimEmail: "",
    },
  });

  useEffect(() => {
    if (success) {
      reset();
    }
  }, [reset, success]);

  async function onSubmit(data) {
    // console.log("data", data);
    try {
      //console.log("hello world");
      if (data.email !== data.confrimEmail) {
        setError(true);
        setEmailErr(true);
        setErrMsg("The Input Email Addresses Do Not Match!")
      }
      if (data.password !== data.confirmPassword) {
        setError(true);
        setPasswordErr(true);
        setErrMsg("The Passwords Do Not Match!")
        return;
      } 
      if(!regularExpression.test(data.password)) {
        setError(true);
        setPasswordErr(true);
        setErrMsg("The Password Is Not Strong Enough!   Password must contain at least one number, one uppercase letter, nd one lowercase letter. ")
        return;
      }

      const res = await fetch(`/api/mongo/user/find-user/${data.email}`);
      const user = await res.json();
      if (user) {
        setError(true);
        setExists(true);
      } else {
        const res = await fetch("/api/mongo/user/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            image: "",
          }),
        });
        const user = await res.json();

        if (!res.ok) {
          setError(true);
          setErrMsg("Something went wrong. Please try again!")
          return;
        } else {
          setSuccess(true);
        }
      }
    } catch (error) {
      setError(true);
      setErrMsg("Something went wrong. Please try again!")
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register your account
        </h2>
      </div>
      <div>
        {error ? <div>An Error Occured. Please check the following issue or try again later.</div> : <br/>}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6 group"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                {...register("firstName")}
                id="firstName"
                name="firstName"
                type="text"
                pattern="^[a-zA-Z]{1,}$"
                required
                placeholder="e.g John"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
              <span className="mt-2 hidden text-xs text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                You must enter a name
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                {...register("lastName")}
                id="lastName"
                name="lastName"
                type="text"
                pattern="^[a-zA-Z]{1,}$"
                required
                placeholder="e.g Doe"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
              <span className="mt-2 hidden text-xs text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                You must enter a name
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
                required
                placeholder="Enter your email"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
              <span className="mt-2 hidden text-xs text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid email address
              </span>
            </div>
            <label
              htmlFor="confirmEmail"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email Address Confirmation <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                {...register("confirmEmail")}
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
                required
                placeholder="Enter your email"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
              <span className="mt-2 hidden text-xs text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please confirm the email address.
              </span>
            </div>
            <div
              className={`mt-2 py-1.5 px-2 rounded text-sm bg-red-100 text-red-600 border border-red-500 ${
                emailErr ?{error} : "hidden"
              }`}
            >
          The Input Email Addresses Do Not Match!
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password <span className="text-red-500">*</span>
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
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Password must contain at least one number, one uppercase letter,
                and one lowercase letter.
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="mt-2">
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••••"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 peer"
              />
            </div>
            <div
              className={`mt-2 py-1.5 px-2 rounded text-sm bg-red-100 text-red-600 border border-red-500 ${
                passwordErr ?{error} : "hidden"
              }`}
            >
              {errMsg}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30"
            >
              Register
            </button>
          </div>
        </form>
     
       
        <div className={`text-sm mt-3 ${success ? "" : "hidden"}`}>
          Successfully created an account!{" "}
          <Link
            href="/auth/credentials-signin"
            className="text-blue-600 underline"
          >
            Log in here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
