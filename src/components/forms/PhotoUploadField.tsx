import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

interface PhotoUploadFieldProps {
  onChange: (file: File | null) => void;
}

export function PhotoUploadField({ onChange }: PhotoUploadFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle camera stream (in a real implementation, you'd show a camera view)
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex-1"
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}