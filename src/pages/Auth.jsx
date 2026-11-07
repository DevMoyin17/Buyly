import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/storefront/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const signUp = useAuthStore((state) => state.signUp);

  const redirectTo = location.state?.from || "/";

  const formik = useFormik({
    initialValues: {
      Name: "",
      Email: "",
      Password: "",
    },
    validationSchema: yup.object({
      Name: yup
        .string()
        .trim()
        .min(2, "Enter your full name")
        .required("Name is required"),
      Email: yup.string().email("Enter a valid email").required("Email is required"),
      Password: yup
        .string()
        .required("Password is required")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
          "Use at least 8 characters, one uppercase, one lowercase, one number and one symbol",
        ),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const account = await signUp({
          name: values.Name,
          email: values.Email,
          password: values.Password,
        });
        toast.success(`Welcome to Glowora, ${account.name.split(" ")[0]}.`);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        toast.error(error.message || "Could not create your account.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthShell
      eyebrow="Join the edit"
      title="Create your account"
      description="Keep your favourite finds together and make your next checkout a little faster."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            to="/signin"
            state={location.state}
            className="font-extrabold text-brand-tangerine hover:text-brand-tangerine-dark"
          >
            Sign in
          </Link>
        </span>
      }
    >
      {user && (
        <p className="mb-4 rounded-xl border border-brand-line bg-brand-cream px-3 py-2 text-[11px] leading-5 text-brand-muted">
          You are already signed in as{" "}
          <span className="font-semibold text-brand-ink">{user.email}</span>.
        </p>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
            Full name
          </label>
          <Input
            id="name"
            name="Name"
            type="text"
            placeholder="Your name"
            className="mt-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Name}
            autoComplete="name"
          />
          {formik.touched.Name && formik.errors.Name && (
            <p className="field-error mt-1.5">{formik.errors.Name}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
            Email address
          </label>
          <Input
            id="signup-email"
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
          <label htmlFor="signup-password" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
            Password
          </label>
          <div className="relative mt-2">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="Password"
              placeholder="Create a strong password"
              className="pr-11"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Password}
              autoComplete="new-password"
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
          {isLoading ? "Creating account" : "Create account"}
        </Button>

        <p className="text-center text-[10px] leading-5 text-brand-muted">
          By creating an account you agree to Glowora&apos;s terms of service and privacy policy.
        </p>
      </form>
    </AuthShell>
  );
};

export default Auth;
