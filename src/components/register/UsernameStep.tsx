import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UsernameStepProps {
  username: string;
  onChange: (value: string) => void;
}

export const UsernameStep = ({ username, onChange }: UsernameStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Choose your username</h2>
        <p className="text-sm text-muted-foreground">
          This is how others will see you in the app
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your username"
          className="transition-all duration-200"
        />
      </div>
    </div>
  );
};