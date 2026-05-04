"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Crop, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import getCroppedImg from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  image: string;
  aspect: number;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({ image, aspect, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="bg-white w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Crop className="size-5 text-brand-red" /> Adjust & Crop Image
            </h3>
            <p className="text-sm text-slate-500">Position the image within the frame for best results</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="flex-1 relative bg-slate-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            classes={{
              containerClassName: "bg-slate-50",
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Zoom Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zoom</label>
                <span className="text-xs font-mono text-slate-600">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <ZoomOut size={18} />
                </button>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rotation</label>
                <span className="text-xs font-mono text-slate-600">{rotation}°</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setRotation((rotation - 90 + 360) % 360)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <RotateCcw size={18} />
                </button>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <button onClick={() => setRotation((rotation + 90) % 360)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <RotateCcw size={18} className="rotate-180 scale-x-[-1]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onCancel} className="text-slate-500 hover:text-slate-900">
              Cancel
            </Button>
            <Button
              onClick={handleCrop}
              disabled={loading}
              className="bg-brand-red hover:bg-brand-red/90 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-brand-red/20 min-w-[140px]"
            >
              {loading ? "Processing..." : "Apply Crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
