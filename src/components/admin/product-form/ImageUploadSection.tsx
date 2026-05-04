"use client";

import { Upload, X, Crop } from "lucide-react";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditCrop: () => void;
  onRemoveImage: () => void;
}

export function ImageUploadSection({ 
  imagePreview, 
  onImageChange, 
  onEditCrop, 
  onRemoveImage 
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#171717]">Product Image</label>
      <div className="border-2 border-dashed border-[#eaeaea] rounded-xl p-8 flex flex-col items-center justify-center bg-[#fafafa] relative hover:bg-[#f5f5f5] transition-colors">
        {imagePreview ? (
          <div className="relative w-32 h-40 group">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md shadow-sm" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md gap-2">
              <button 
                type="button"
                onClick={onEditCrop}
                className="bg-white text-[#E11D48] rounded-full p-2 hover:bg-slate-50 transition-colors"
                title="Edit Crop"
              >
                <Crop size={16} />
              </button>
              <button 
                type="button"
                onClick={onRemoveImage}
                className="bg-white text-red-500 rounded-full p-2 hover:bg-slate-50 transition-colors"
                title="Remove Image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload className="size-8 text-[#888888] mb-3" />
            <p className="text-sm font-medium text-[#171717]">Click to upload or drag and drop</p>
            <p className="text-xs text-[#888888] mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
          </>
        )}
        <input 
          type="file" 
          accept="image/*"
          onChange={onImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
      </div>
    </div>
  );
}
