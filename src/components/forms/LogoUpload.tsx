"use client";

import { useRef, useState, useCallback } from "react";
import { uploadLogo, deleteLogo } from "@/actions/logo";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";

interface LogoUploadProps {
  logoUrl: string | null;
}

export function LogoUpload({ logoUrl: initialLogoUrl }: LogoUploadProps) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("logo", file);

    const result = await uploadLogo(formData);

    if (result.success) {
      setLogoUrl(result.data);
    } else {
      setError(result.error);
    }

    setUploading(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDelete = async () => {
    setError(null);
    setUploading(true);

    const result = await deleteLogo();

    if (result.success) {
      setLogoUrl(null);
    } else {
      setError(result.error);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Logo de l&apos;entreprise</label>

      {logoUrl ? (
        <div className="flex items-center gap-4">
          <div className="relative h-[120px] w-[120px] overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo entreprise"
              className="h-full w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Supprimer
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          disabled={uploading}
          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/60 p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              Cliquez ou glissez votre logo
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WebP — 2 Mo max
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
