import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { ProgressIndicator } from "@/components/register/ProgressIndicator";
import { UsernameStep } from "@/components/register/UsernameStep";
import { AgeStep } from "@/components/register/AgeStep";
import { AvatarStep } from "@/components/register/AvatarStep";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      let avatarUrl = null;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar, { 
            upsert: true,
            contentType: avatar.type
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          age: parseInt(age),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      toast({
        title: "Success!",
        description: "Your profile has been created.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UsernameStep username={username} onChange={setUsername} />;
      case 2:
        return <AgeStep age={age} onChange={setAge} />;
      case 3:
        return <AvatarStep onFileChange={handleFileChange} avatar={avatar} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <ProgressIndicator currentStep={step} totalSteps={3} />
        
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border/50 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          {renderStep()}

          <div className="flex justify-between mt-8 gap-4">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="flex-1"
                disabled={
                  (step === 1 && !username) ||
                  (step === 2 && !age)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Profile..." : "Complete Registration"}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;