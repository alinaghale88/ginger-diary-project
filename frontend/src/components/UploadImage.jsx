import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const UploadImage = ({ onUpload, initialImage }) => {
    const { toast } = useToast();
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Use the initialImage prop to populate the image if editing
    useEffect(() => {
        if (initialImage) {
            setImageUrl(initialImage); // Set the initial image URL (if any)
        }
    }, [initialImage]);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gingerdiary_user_uploads");

        try {
            setUploading(true);
            const res = await fetch(`https://api.cloudinary.com/v1_1/df82gzofs/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setImageUrl(data.secure_url);
            onUpload(data.secure_url);
            setUploading(false);
            toast({ description: "Image uploaded successfully", duration: 1200 });
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            toast({ variant: "destructive", description: "Image upload failed", duration: 1200 });
        }
    };

    // Handle file drop
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            toast({ variant: "destructive", description: "File is too large. Max 2MB.", duration: 1500 });
            return;
        }
        const file = acceptedFiles[0]; // Only take first file
        if (file) uploadToCloudinary(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false,
        maxSize: MAX_FILE_SIZE,
    });

    const handleRemoveImage = () => {
        setImageUrl(null); // Clear the image URL
        onUpload(null); // Pass null to parent component to clear the image URL in the parent
    };

    return (
        <div>
            {/* Drag & Drop Upload Area */}
            <div
                {...getRootProps()}
                className={`border-dashed border-2 rounded-lg p-6 text-center cursor-pointer mt-3 
                ${isDragActive ? "border-yellow-300" : "border-gray-400"}`
                }
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-yellow-400">Drop the image here...</p>
                ) : (
                    <p className='text-gray-400'>Drag & Drop an image here, or click to select one (Max 2MB)</p>
                )}
            </div>

            {/* Show Uploaded Image Preview */}
            {imageUrl && (
                <div className="relative mt-3 inline-block">
                    <img
                        src={imageUrl}
                        alt="Uploaded Preview"
                        className="mt-3 rounded-xl"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-gray-500 text-white p-1 rounded-full"
                    >
                        <X />
                    </button>
                </div>
            )}

            {/* Uploading Indicator */}
            {uploading && <p className="text-yellow-500 mt-2">Uploading...</p>}
        </div>
    );
};

export default UploadImage;
