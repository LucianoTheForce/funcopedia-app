import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Video, Camera, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarStepProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRecorded: (blob: Blob) => void;
  avatar: File | null;
  profileGif: Blob | null;
}

export const AvatarStep = ({ onFileChange, onVideoRecorded, avatar, profileGif }: AvatarStepProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320,
          height: 320,
          facingMode: "user"
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        onVideoRecorded(blob);
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Add a profile picture</h2>
        <p className="text-sm text-muted-foreground">
          Choose a photo or record a video avatar
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-center">
          {stream ? (
            <div className="relative w-32 h-32">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-32 h-32 rounded-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute bottom-0 right-0"
                onClick={stopRecording}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : profileGif ? (
            <video
              src={URL.createObjectURL(profileGif)}
              autoPlay
              loop
              muted
              playsInline
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
            />
          ) : avatar ? (
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
        
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              (isRecording || stream) && "opacity-50 cursor-not-allowed"
            )}
            onClick={startRecording}
            disabled={isRecording || !!stream}
          >
            <Camera className="w-4 h-4" />
            Record Avatar
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Or upload a photo</Label>
          <Input
            id="avatar"
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="transition-all duration-200"
            disabled={isRecording || !!stream}
          />
        </div>
      </div>
    </div>
  );
};