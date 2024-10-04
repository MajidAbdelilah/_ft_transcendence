"use client";

import { Inter, Montserrat } from "next/font/google";
import BackgroundBeams from "/src/components/ui/background-beams";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

function Login_page() {

  const [isMobile, setIsMobile] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    handleBlur: (e) => {
      const { name, value } = e.target;
      formik.setFieldValue(name, value);
      formik.setFieldError(name, validate({ [name]: value })[name]);
    },
  });

    const handleSubmit = async (values) => {
      // try {
      //   const response = await axios.get('/api/login', values);
      //   console.log(response);
      // } catch (error) {
      //   console.log(error);
      // }
      console.log(values);
    };

  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  return (
    <div
      className={`h-[100vh] flex justify-center items-center ${montserrat.className}`}
    >
      <form onSubmit={formik.handleSubmit} className={`${!isMobile ? "bg-[rgba(66,74,120,0.05)]" : "border-none"} max-w-[700px] z-[10] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]  bg-blend-hard-light ${!isMobile ? "shadow-[inset_0px_0px_4.6px_#A8B4FF]" : ""} p-8 rounded-xl h-[700px] w-[600px] flex flex-col items-center`}>
        <div className="w-full flex justify-center">
          <Image src="/images/logo.png" alt="Logo" width="100" height="100" />
        </div>
        <h1 className="sm:text-4xl  text-xl text-center text-[#111B47] font-bold">
          Login to your account
        </h1>
        <div className="mb-5 mt-8 max-w-[350px] w-full flex flex-col justify-center items-center">
          <div className="max-w-[350px] w-full">
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`${formik.errors.email && formik.touched.email ? 'border-red-500' : ''} bg-[#F8FBFF] border border-gray-300 text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && <p className="text-red-500 text-sm mt-2 animatedInputError font-medium">{formik.errors.email}</p>}
            <label
              htmlFor="password"
              className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`${formik.errors.password && formik.touched.password ? 'border-red-500' : ''} bg-[#F8FBFF] border border-gray-300 text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && <p className="text-red-500 text-sm mb-5 mt-[-10px] animatedInputError font-medium">{formik.errors.password}</p>}
            <button
              type="submit"
              className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-lg w-full px-20 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
          </div>
          <p className="font-medium text-[#111B47] pb-2  flex justify-center">
            Don&apos;t have an account?{" "}
            <span className="font-semibold transition-transform duration-300 ease-in-out text-sm sm:text-base transform hover:scale-110">
              &nbsp; <Link href="/signup">Sign up</Link>
            </span>
          </p>
          <button
            type="submit"
            className=" flex itemes-center justify-center gap-4 text-black bg-[#BFD5F6] focus:ring-4 focus:outline-none focus:ring-blue-300 sm:w-[80%] sm:w-[70%] font-semibold rounded-[10px] text-base sm:px-10 sm:py-3 px-5 py-5 text-center dark:bg-blue-600 mt-5 mb-2 transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            {" "}
            <Image
              src="images/42_Logo 1.svg"
              alt="Logo"
              width="40"
              height="40"
            />{" "}
            Login Intra
          </button>{" "}
        </div>
      </form>
    </div>
  );
}

export default Login_page;
