import React, { useState } from "react";
import students from "../../Assets/students.svg"
const StudentSignUp = () => {
  const [name, setName] = useState("");
  const [Roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Name entered:", name);
    console.log("Mail entered:", email);
    console.log("Roll entered:", Roll);
    console.log("Password entered:", password);
  };


  return (
    <section
      className="bg-blue-900 min-h-screen h-full
      flex items-center justify-center"

    >
      {/* login  container */}
      <div className="bg-white flex flex-col md:flex-row rounded-2xl shadow-lg w-[80%] md:w-[900px] p-5">
        <div className="flex-1 p-0  justify-center items-center">
          <img src={students} alt="students" className="w-full h-full"></img>
        </div>

        <div className="flex-1 px-8">
          <h2 className="font-bold text-2xl mt-6 mx-2">Request Your Account</h2>
          <form
            className="flex flex-col gap-1"
            action="#"
            onSubmit={handleSubmit}
            method="POST"
          >
            <p className="mt-6 text-xs font-semibold">Full name*</p>
            <input
              className="p-2 rounded-lg border mt-0 shadow-sm"
              placeholder="Enter full name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <p className="mt-2 text-xs font-semibold ">Email*</p>
            <input
              className="shadow-sm p-2 rounded-lg border mt-0 "
              placeholder="Enter your E-Mail"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            ></input>

            <p className="mt-2 text-xs font-semibold ">Roll Number*</p>
            <input
              className="shadow-sm p-2 rounded-lg border mt-0 "
              placeholder="Enter your Roll No."
              type="text"
              onChange={(e) => setRoll(e.target.value)}
            ></input>

            <p className="mt-2 text-xs font-semibold">Password*</p>
            <div class="Relative">
              <input
                className="shadow-sm p-2 rounded-lg border mt-0 w-full"
                placeholder="Enter password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <button
              type="submit"
              className="p-2 my-4 bg-purple-600 rounded-lg text-white hover:bg-purple-500 focus:outline-none focus:ring focus:border-blue-300 active:transform active:scale-95 transition-all duration-150 shadow-2xl "
            >
              {" "}
              Request Account{" "}
            </button>
          </form>

          <div
            className="mt-0 mb-2 grid grid-cols-3
              items-center text-gray-500 "
          >
            <hr className="outline-gray-500"></hr>
            <p className="text-center text-sm">OR</p>
            <hr className="outline-gray-500"></hr>
          </div>

          <button className="mb-2 items-center justify-center flex bg-white border py-2 w-full rounded-xl font-bold mt-3 focus:outline-none focus:ring focus:border-grey-100 active:transform active:scale-95 transition-all duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              className="mr-3"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Sign in with Google
          </button>
          <p className="items-centere flex justify-center text-sm mt-2">
            Already have an account?{" "}
            <a
              className="active:transform text-blue-800 font-semibold mx-1 hover:underline"
              href=""
            >
              {" "}
              Login
            </a>{" "}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentSignUp;
