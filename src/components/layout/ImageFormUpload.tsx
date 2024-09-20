import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import JSZip from "jszip";

export const ImageFormUpload = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [convertTo, setConvertTo] = useState<string>("webp");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [compressionLevel, setCompressionLevel] = useState<number>(75);
  const [showCompressionSlider, setShowCompressionSlider] =
    useState<boolean>(false);

  useEffect(() => {
    setShowCompressionSlider(convertTo === "jpeg" || convertTo === "webp");
  }, [convertTo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(newPreviews);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    const zip = new JSZip();
    let convertedCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("convertTo", convertTo);
      formData.append("compressionLevel", compressionLevel.toString());

      try {
        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          zip.file(`${file.name.split(".")[0]}.${convertTo}`, blob);
          convertedCount++;
          setProgress((convertedCount / files.length) * 100);
        } else {
          throw new Error(`Failed to convert ${file.name}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(`Error converting ${file.name}. Please try again.`);
      }
    }

    if (convertedCount > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "converted_images.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(
        `Successfully converted ${convertedCount} out of ${files.length} images.`
      );
    }

    setConverting(false);
  };

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-250px)]'>
      <div
        className='container mx-auto p-8 max-w-2xl  text-[#f8f8ff] rounded-lg shadow-md
                      dark:bg-[#0e0e0e] dark:text-[#f8f8ff] dark:border dark:border-[#f8f8ff] dark:shadow-[0_0_10px_rgba(248,248,255,0.1)]'
      >
        <h1 className='text-2xl font-bold mb-6 text-center text-[#0e0e0e] dark:text-[#f8f8ff]'>
          Image Converter
        </h1>
        <Input
          type='file'
          onChange={handleFileChange}
          accept='image/*'
          multiple
          className='mb-4 file:text-[#0e0e0e] dark:file:text-[#f8f8ff] file:border-0 placeholder-[#0e0e0e] text-[#0e0e0e] dark:text-[#f8f8ff] dark:placeholder-[#f8f8ff]'
        />
        {previews.length > 0 && (
          <div className='mb-4 grid grid-cols-3 gap-2'>
            {previews.map((preview, index) => (
              <Image
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className='object-cover'
              />
            ))}
          </div>
        )}
        <div className='mb-4'>
          <Label
            className='text-[#0e0e0e] dark:text-[#f8f8ff]'
            htmlFor='convertTo'
          >
            Convert To
          </Label>
          <Select value={convertTo} onValueChange={setConvertTo}>
            <SelectTrigger
              id='convertTo'
              className=' file:text-[#0e0e0e] dark:file:text-[#f8f8ff] file:border-0 placeholder-[#0e0e0e] text-[#0e0e0e] dark:text-[#f8f8ff] dark:placeholder-[#f8f8ff]'
            >
              <SelectValue placeholder='Select format' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='webp'>WebP</SelectItem>
              <SelectItem value='png'>PNG</SelectItem>
              <SelectItem value='jpeg'>JPEG</SelectItem>
              <SelectItem value='avif'>AVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {showCompressionSlider && (
          <div className='mb-4'>
            <Label
              className='text-[#0e0e0e] dark:text-[#f8f8ff]'
              htmlFor='compressionLevel'
            >
              Compression Level: {compressionLevel}%
            </Label>
            <Slider
              id='compressionLevel'
              min={0}
              max={100}
              step={1}
              value={[compressionLevel]}
              onValueChange={(value) => setCompressionLevel(value[0])}
              className='mt-2'
            />
          </div>
        )}
        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || converting}
          className='w-full bg-[#f8f8ff] text-[#0e0e0e] hover:bg-[#f8f8ff]/90
                     dark:bg-[#f8f8ff] dark:text-[#0e0e0e] dark:hover:bg-[#f8f8ff]/90'
        >
          {converting ? "Converting..." : "Convert"}
        </Button>
        {converting && (
          <div className='mt-4'>
            <Progress value={progress} className='w-full' />
            <p className='text-sm text-center mt-2'>{`${Math.round(
              progress
            )}%`}</p>
          </div>
        )}
        {error && (
          <Alert variant='destructive' className='mt-4'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className='mt-4'>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ImageFormUpload;
