"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface ImageUploadProps {
  snackId: Id<"snacks">;
  imageType: "illustration" | "photo";
  currentUrl: string | null;
  label: string;
}

export default function ImageUpload({ snackId, imageType, currentUrl, label }: ImageUploadProps) {
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const attachImage = useMutation(api.admin.attachImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/") || !user) {
      toast.error("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({ clerkId: user.id });
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json() as { storageId: Id<"_storage"> };
      await attachImage({ clerkId: user!.id, snackId, storageId, imageType });
      setPreview(URL.createObjectURL(file));
      toast.success("Image saved!");
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-nori">{label}</p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-warm bg-white transition-colors hover:border-konbini-red hover:bg-rice-paper"
      >
        {preview ? (
          <div className="relative h-36 w-full">
            <Image src={preview} alt={label} fill className="rounded-lg object-contain p-2" />
            <div className="absolute right-2 top-2 rounded-full bg-matcha p-1">
              <CheckCircle size={14} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <Upload size={24} className="text-nori-light" />
            <p className="text-sm text-nori-light">
              {uploading ? "Uploading…" : "Drag & drop or click to upload"}
            </p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
            <p className="text-sm font-semibold text-konbini-red">Uploading…</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
