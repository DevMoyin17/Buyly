import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/storefront/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);

  const redirectTo = location.state?.from || "/";

  const formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },
    validationSchema: yup.object({
      Email: yup.string().email("Enter a valid email").required("Email is required"),
      Password: yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const account = await signIn({
          email: values.Email,
          password: values.Password,
        });
        toast.success(`Welcome back, ${account.name.split(" ")[0]}.`);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        toast.error(error.message || "Could not sign you in.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Glowora"
      description="Pick up where you left off, check your wishlist and get back to the good stuff."
      footer={
        <span>
          New to Glowora?{" "}
          <Link
            to="/auth"
            state={location.state}
            className="font-extrabold text-brand-tangerine hover:text-brand-tangerine-dark"
          >
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signin-email" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
            Email address
          </label>
          <Input
            id="signin-email"
            type="email"
            name="Email"
            placeholder="you@example.com"
            className="mt-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Email}
            autoComplete="email"
          />
          {formik.touched.Email && formik.errors.Email && (
            <p className="field-error mt-1.5">{formik.errors.Email}</p>
          )}
        </div>

        <div>
          <label htmlFor="signin-password" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
            Password
          </label>
          <div className="relative mt-2">
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              name="Password"
              placeholder="Your password"
              className="pr-11"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Password}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formik.touched.Password && formik.errors.Password && (
            <p className="field-error mt-1.5">{formik.errors.Password}</p>
          )}
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Signing in" : "Sign in"}
        </Button>

        <p className="text-center text-[10px] leading-5 text-brand-muted">
          Your account keeps your wishlist and checkout details in one place.
        </p>
      </form>
    </AuthShell>
  );
};

export default Signin;
