import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgeStepProps {
  age: string;
  onChange: (value: string) => void;
}

export const AgeStep = ({ age, onChange }: AgeStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">How old are you?</h2>
        <p className="text-sm text-muted-foreground">
          You must be at least 18 years old to use this app
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your age"
          min="18"
          max="100"
          className="transition-all duration-200"
        />
      </div>
    </div>
  );
};