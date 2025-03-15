import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export function ImageUpload({ currentImageUrl, onUpload, onRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setLoading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(currentImageUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    try {
      setLoading(true);
      await onRemove();
      setPreview(null);
    } catch (error) {
      console.error('Remove failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="プロフィール画像"
              className="w-32 h-32 rounded-full object-cover"
            />
            {onRemove && (
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-50"
              >
                <X size={16} className="text-neutral-600" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-neutral-100 flex items-center justify-center">
            <Upload size={24} className="text-neutral-400" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        isLoading={loading}
        className="w-full"
      >
        画像をアップロード
      </Button>
    </div>
  );
}