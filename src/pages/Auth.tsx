import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/");
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-gradient-to-b from-secondary to-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to continue your journey
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-muted/20">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#F97316',
                    brandAccent: '#FB923C',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#2A2530',
                    defaultButtonBackgroundHover: '#403E43',
                    inputBackground: '#1A1F2C',
                    inputBorder: '#403E43',
                    inputBorderHover: '#F97316',
                    inputBorderFocus: '#F97316',
                  },
                  borderWidths: {
                    buttonBorderWidth: '0px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'hover:opacity-90 transition-opacity',
                input: 'bg-secondary border-muted hover:border-primary focus:border-primary transition-colors',
                label: 'text-foreground/90',
              }
            }}
            theme="dark"
            providers={[]}
          />
        </div>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;