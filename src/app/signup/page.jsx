"use client";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useFormik } from 'formik';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const validate = values => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    else if (values.username.length > 15) {
        errors.username = 'Username must be 15 characters or less';
    }
    else if (values.username.length < 2) {
        errors.username = 'Username must be at least 2 characters';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Password do not match';
    }
    return errors;
};


function Signup_page() {

    const formik = useFormik({
        initialValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        validate,
        onSubmit: values => {
          handleSubmit(values);
        },
        handleBlur: (e) => {
            const { name, value } = e.target;
            formik.setFieldValue(name, value);
            formik.setFieldError(name, validate({ [name]: value })[name]);
        },
    });

  const handleSubmit = (values) => {
        const FinalValues = {
            username: values.username,
            email: values.email,
            password: values.password,
        }
    
        // try {
        //     const response = await axios.post('/api/signup', values);
        //     console.log(response);
        // } catch (error) {
        //     console.log(error);
      // }
      console.log(FinalValues);
    }

  return (
    <div
      className={`h-[100vh] flex justify-center items-center ${montserrat.className}`}
    >
      <form
        className="max-w-[700px] w-[90%] bg-[rgba(66,74,120,0.05)] bg-blend-hard-light shadow-[inset_0px_0px_4.6px_#A8B4FF] p-8 rounded-xl  w-[600px] flex flex-col items-center"
        onSubmit={formik.handleSubmit}
      >
        <div className="w-full flex justify-center">
          <Image src="images/logo.svg" alt="Logo" width="100" height="100" />
        </div>
        <h1 className="sm:text-4xl text-xl text-center text-[#111B47] font-bold">
          Create your account
        </h1>
        <div className="mb-5 mt-8 max-w-[350px] w-full flex flex-col justify-center items-center">
          <div className="max-w-[350px] w-full">
            <label
              htmlFor="username"
              className="block mb-2 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className={`${formik.errors.username && formik.touched.username ? 'border-red-500' : ''} bg-[#F8FBFF] border mb-[5px] text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Username"
              onBlur={formik.handleBlur}
            />
            {formik.errors.username && formik.touched.username && <p className="text-red-500 text-sm animatedInputError font-medium mt-[10px]">{formik.errors.username}</p>}
            <label
              htmlFor="email"
              className="block mt-5 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={`${formik.errors.email && formik.touched.email ? 'border-red-500' : ''} bg-[#F8FBFF] border mt-[5px] text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="name@gmail.com"
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && <p className="text-red-500 text-sm pt-3 animatedInputError font-medium mb-[-6px]">{formik.errors.email}</p>}
            <label
              htmlFor="password"
              className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className={`${formik.errors.password && formik.touched.password ? 'border-red-500' : ''} bg-[#F8FBFF] border mt-[5px] text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Enter your password"
              
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && <p className="text-red-500 text-sm animatedInputError font-medium mt-[-10px]">{formik.errors.password}</p>}
            <label
              htmlFor="Confim Password"
              className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]"
            >
              Confim Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className={`${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : ''} bg-[#F8FBFF] border mt-[5px] text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Confirm your password"
              onBlur={formik.handleBlur}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className="text-red-500 text-sm pb-3 animatedInputError font-medium mt-[-10px] mb-5">{formik.errors.confirmPassword}</p>}
            <button
              type="submit"
              className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-lg w-full px-20 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
          </div>
          <p className="font-medium text-[#111B47] pb-2  flex justify-center">
            Already have an account?{" "}
            <span className="font-semibold transition-transform duration-300 ease-in-out transform hover:scale-110">
              &nbsp; <Link href="/login">Login</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup_page;
