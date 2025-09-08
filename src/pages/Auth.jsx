import { useFormik } from 'formik';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
const [isPasswordShow, setIsPasswordShow] = useState(false);
const [message, setMessage] = useState(''); // State for messages
const [isLoading, setIsLoading] = useState(false); 
const url = "https://bookit-app-vn3p.vercel.app/user/signup"
const navigate = useNavigate();

useEffect(() => {
  if (message) {
    toast.success(message); // Show success toast with message from backend
  }
}, [message]); 



  const formik = useFormik({
    initialValues: {
      Name: "",
      Email: "",
      Password: "",
    },

    onSubmit: (values) => {
      setIsLoading(true); // Start loading

      axios
        .post(url, values)  // POST request with form data
        .then((res) => {
          const successMessage = res.data.message || "Successfully signed up!";
          setMessage(successMessage);
  
          const userName = values.userName; 
          localStorage.setItem("userName", JSON.stringify({ name: userName })); 
          navigate("/signin"); // Navigate to signin page after successful submission
        })
        .catch((err) => {
          const errorMessage = err.response?.data.message || 'An error occurred';
          setMessage(errorMessage); // Set error message for toast
        })
        .finally(() => {
          setIsLoading(false); // Stop loading regardless of success or failure
        });
    },


    validationSchema: yup.object({
      Email: yup.string().required("Email is required"),
      Name: yup.string()
      .required("Name is required")
      .matches(/^[A-Z]/, "First letter must be uppercase"), 
      Password: yup
        .string()
        .required("Password is required")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
          "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
              CREATE ACCOUNT!!!!
            </h1> 
            <span className='text-red-500'>{message}</span>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
            
              <div className="space-y-2">
                <Label htmlFor="Name">Name</Label>
                <Input
                id='userNamee' type="text" placeholder="Name" name='Name' onChange={formik.handleChange}
                />
                <small>{formik.errors.Name}</small>
              </div>

                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                 type="email" placeholder="Email" name='Email' onChange={formik.handleChange}
                  required
                />
                  <small>{formik.errors.Email}</small>
              </div>
              
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className='flex'>
                <Input type={isPasswordShow ? "text" : "password"} placeholder="Password" name='Password'  onChange={formik.handleChange}/>
                <button type='button' class="input-group-text" id="addon-wrapping" onClick={() => { setIsPasswordShow(!isPasswordShow) }} ><i class={`fa-solid fa-eye${isPasswordShow ? "" : "-slash"}`}></i></button>
                </div>
                <small>{formik.errors.Password}</small>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
              {
                      !isLoading ? 
                      "Create Account"
                      : "Loading"
                    }
              </Button>
            </form>
            
            <div className="mt-4 text-center">
            <p>
                  <small>Have an account?</small>
                  <Link to="/signin"> Sign In.</Link>
                </p>
           
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;