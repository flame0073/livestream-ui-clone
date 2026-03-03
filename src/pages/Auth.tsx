import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AuthProps {
  sidebarExpanded: boolean;
}

const Auth = ({ sidebarExpanded }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Email and password are required"); return; }
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else { toast.success("Logged in!"); navigate("/"); }
    } else {
      if (password.length < 6) { toast.error("Password must be at least 6 characters"); setLoading(false); return; }
      const { error } = await signUp(email, password);
      if (error) toast.error(error.message);
      else { toast.success("Account created! You are now logged in."); navigate("/"); }
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen pt-14 pb-20 sm:pb-8 transition-all duration-200 ${sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"}`}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-primary-foreground"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold">{isLogin ? "Sign In" : "Create Account"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Welcome back to LiveTube" : "Join LiveTube today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
