"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";

interface PictureProps {
    profilePicture: string;
    onImageUpload: (file: File) => void;
    uploading: boolean;
}

const Picture: React.FC<PictureProps> = ({
    profilePicture,
    onImageUpload,
    uploading,
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Called when user selects or drops an image
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setCroppedImage(null);
        }
    };

    // For drag & drop
    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setCroppedImage(null);
            e.dataTransfer.clearData();
        }
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            if (!imageSrc || !croppedAreaPixels) return;
            const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            setCroppedImage(croppedImg);

            // Convert dataURL to file and upload
            const file = dataURLtoFile(croppedImg, "profile_cropped.jpeg");
            onImageUpload(file);
            setImageSrc(null); // close cropper
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc, rotation, onImageUpload]);

    const onCancelCrop = () => {
        setImageSrc(null);
    };

    // Prevent default behaviors for drag & drop
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="bg-white rounded-md p-6 shadow-md flex flex-col items-center w-full">
            <h2 className="text-md font-semibold mb-4 text-black">Profile Picture</h2>

            {/* Drag & Drop zone */}
            {!imageSrc && (
                <>
                    {croppedImage ? (
                        <img
                            src={croppedImage}
                            alt="Cropped"
                            className="w-48 h-48 rounded-full object-cover mb-4"
                        />
                    ) : profilePicture ? (
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-48 h-48 rounded-full object-cover mb-4"
                        />
                    ) : (
                        <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                    )}

                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        className="w-full border-2 border-dashed border-gray-400 rounded-md p-4 cursor-pointer text-center text-sm text-gray-500 mb-4"
                        onClick={() => inputRef.current?.click()}
                    >
                        Drag & Drop image here or click to select
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="hidden"
                    />
                    {uploading && (
                        <p className="text-xs text-gray-500 mt-2">Uploading image...</p>
                    )}
                </>
            )}

            {/* Cropper */}
            {imageSrc && (
                <div className="w-full bg-gray-100 rounded-md p-4">
                    {/* Cropper with fixed height */}
                    <div className="relative w-full h-64 rounded-md overflow-hidden">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    {/* Controls: Cancel & Confirm buttons */}
                    <div className="flex justify-between items-center mt-4 space-x-2">
                        <button
                            onClick={onCancelCrop}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={showCroppedImage}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                            Confirm
                        </button>
                    </div>


                    <div className="mt-4 flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-xs text-black whitespace-nowrap w-12">Zoom:</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <label className="text-xs text-black whitespace-nowrap w-12">Rotate:</label>
                            <input
                                type="range"
                                min={0}
                                max={360}
                                step={1}
                                value={rotation}
                                onChange={(e) => setRotation(Number(e.target.value))}
                                className="flex-1"
                            />
                        </div>
                    </div>



                </div>
            )}
        </div>
    );
};

export default Picture;

// Helper: read file as dataURL
function readFile(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result as string));
        reader.readAsDataURL(file);
    });
}

// Helper: convert dataURL to File object
function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// Inline getCroppedImg helper using canvas to crop and rotate
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number },
    rotation = 0
): Promise<string> {
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous"); // needed for cross origin images
            image.src = url;
        });

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get canvas context");

    // Calculate safe area for rotation
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // Set canvas to final size - cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw cropped image
    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
    );

    // Return base64 image
    return canvas.toDataURL("image/jpeg");
}
