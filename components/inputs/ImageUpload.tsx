"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange
}) => {
  const handleUpload = useCallback((result: any) => {
  }, [onChange])


  return (
    <CldUploadWidget
      onUploadAdded={handleUpload}
      uploadPreset="h2e0bsid"
      options={{
        maxFiles: 1
      }}
      onSuccess={(result) => {
        // @ts-ignore
        onChange(result.info?.public_id)
      }}
    >
      {({open}) => {
        return (
          <div
            onClick={() => open()}
            className="relative cursor-pointer hover:opacity-70 transition border-2 border-dashed rounded p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50}/>
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value && (
              <div
                className="absolute inset-0 w-full h-full"
              >
                <CldImage 
                  alt="Upload"
                  style={{ objectFit: 'cover' }}
                  fill
                  src={value}
                />
              </div>
            )}
          </div>
        )
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload