import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

type Step = {
  title: string
  description: string
  field: "username" | "age" | "avatar_url"
}

const steps: Step[] = [
  {
    title: "Choose your username",
    description: "This is how other users will see you",
    field: "username"
  },
  {
    title: "How old are you?",
    description: "Enter your age",
    field: "age"
  },
  {
    title: "Add a profile picture",
    description: "Upload your best photo",
    field: "avatar_url"
  }
]

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    avatar_url: ""
  })
  const navigate = useNavigate()

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Submit form
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          age: parseInt(formData.age),
          avatar_url: formData.avatar_url || undefined
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id)

      if (!error) {
        navigate('/')
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return
    }

    if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }))
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{currentStepData.title}</h1>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <div className="space-y-4">
          {currentStepData.field === "avatar_url" ? (
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              {formData.avatar_url && (
                <img 
                  src={formData.avatar_url} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-full mx-auto mt-4"
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={currentStepData.field}>{currentStepData.title}</Label>
              <Input
                id={currentStepData.field}
                type={currentStepData.field === "age" ? "number" : "text"}
                value={formData[currentStepData.field]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [currentStepData.field]: e.target.value
                }))}
                placeholder={`Enter your ${currentStepData.field}`}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  )
}