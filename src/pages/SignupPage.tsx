import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    try {
      // Add a timeout directly in the component
      const signupPromise = signUp(email, password, name);
      
      // Set a reasonable timeout (30 seconds) for the entire signup process
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup is taking longer than expected. Please check your email for confirmation.')), 30000)
      );
      
      // Use Promise.race to ensure we don't wait forever
      await Promise.race([signupPromise, timeoutPromise]);
      
      // Navigate to login page with success message - using replace to prevent going back to signup
      navigate("/login", { replace: true, state: { fromSignup: true } });
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle timeout specially
      if (error.message?.includes('taking longer than expected')) {
        // If it's just a timeout but signup might still be processing, show a different message
        // and still navigate to login
        navigate("/login", { replace: true, state: { 
          fromSignup: true,
          signupMessage: "Account creation initiated. Please check your email to confirm your account."
        }});
        return;
      }
      
      setError(error.message || "Failed to create account. Please try again.");
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
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details below to create an account
              </CardDescription>
            </CardHeader>
            {error && (
              <div className="px-6 py-2 text-center text-sm text-red-500 bg-red-100 rounded-md mx-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="text-primary hover:underline"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Log in
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

export default SignupPage;