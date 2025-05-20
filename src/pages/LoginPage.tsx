import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.fromSignup) {
      setShowSignupSuccess(true);
      // Clear the state so the message doesn't reappear on subsequent visits
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Login successful, useEffect will handle redirect when user state updates
      // Add a timeout as a failsafe in case the useEffect doesn't trigger
      setTimeout(() => {
        // If we're still on the login page after 2 seconds, force navigate
        if (window.location.pathname.includes('/login')) {
          navigate("/dashboard", { replace: true });
        }
      }, 2000);
    } catch (error: any) {
      console.error("Login error:", error);
      // Set user-friendly error message
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (error.message?.includes('timed out')) {
        setError('Connection timed out. Please check your internet connection.');
      } else {
        setError(error.message || 'Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="px-4 py-12 w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">
                Log in to your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to log in to your account
              </CardDescription>
            </CardHeader>
            {showSignupSuccess && (
              <div className="px-6 py-2 text-center text-sm text-green-500 bg-green-100 rounded-md mx-6">
                Account created successfully! Please log in.
              </div>
            )}
            {error && (
              <div className="px-6 py-2 text-center text-sm text-red-500 bg-red-100 rounded-md mx-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Demo credentials:</p>
                  <p>Email: demo@resumeforge.com</p>
                  <p>Password: password</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Log in"
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary hover:underline font-medium"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;