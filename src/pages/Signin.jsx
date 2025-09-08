import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [message, setMessage] = useState(''); // State for messages
  const [isLoading, setIsLoading] = useState(false); 
  const   navigate = useNavigate();   
  const url = "https://bookit-app-vn3p.vercel.app/user/signin"

  

  useEffect(() => {
    if (message) {
      toast.success(message); // Show success toast with message from backend
    }
  }, [message]); 


    const formik = useFormik({
        initialValues: {
            Email: "",
            Password: "",
        },
        

        onSubmit: (values) => {
            setIsLoading(true);
            console.log(values);
            axios.post(url, values)
                .then((res) => {
                  const successMessage = res.data.message || "Successfully signed in!";
                  setMessage(successMessage); // Set success message for toast
          
                    navigate("/home")
                    localStorage.setItem('token', res.data.token); 
                })
                .catch((err) => {
                  const errorMessage = err.response?.data.message || 'An error occurred';
                  setMessage(errorMessage); // Set error message for toast
                })
                .finally(() => {
                    setIsLoading(false);
                })
        },

        validationSchema: yup.object({
            
            Email: yup.string().required("Email is required"),
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
              SIGNIN!!!!!
            </h1>
            <span className="text-red-500">{message}</span>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="EmaiIl" name='Email' onChange={formik.handleChange}/>
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
                      "Sign In"
                      : "Signing In..........."
                    }
              </Button>
            </form>
            
            <div className="mt-4 text-center">
            <p>
                                {/* <a href="">Forget password?</a> */}
                               <small>Don't have an account?</small> <a href="">
                                <Link to="/auth">
                                Create an account.
                                </Link>
                                </a>
                            </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;