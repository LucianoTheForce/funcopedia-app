import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface AvatarStepProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatar: File | null;
}

export const AvatarStep = ({ onFileChange, avatar }: AvatarStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Add a profile picture</h2>
        <p className="text-sm text-muted-foreground">
          Choose a photo that represents you best
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-center">
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">Upload photo</Label>
          <Input
            id="avatar"
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};