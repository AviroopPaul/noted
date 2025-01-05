import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";

interface CoverImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const defaultCovers = [
  // Replace these with your Cloudinary URLs
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462574/cld-sample-2.jpg",
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462574/samples/cup-on-a-table.jpg",
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462573/samples/balloons.jpg",
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462566/samples/landscapes/beach-boat.jpg",
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462566/samples/animals/three-dogs.jpg",
  "https://res.cloudinary.com/dami7wcek/image/upload/v1732462574/samples/coffee.jpg",
];

const CoverImageModal: React.FC<CoverImageModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  onFileUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [recentImagesError, setRecentImagesError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchRecentImages = async () => {
      if (isOpen) {
        try {
          setIsLoadingRecent(true);
          setRecentImagesError(null);
          const response = await fetch("/api/images/recent");
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch recent images");
          }

          console.log("Received images:", data.images); // Debug log
          setRecentImages(data.images.slice(0, 5));
        } catch (error: unknown) {
          console.error("Error fetching recent images:", error);
          setRecentImagesError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        } finally {
          setIsLoadingRecent(false);
        }
      }
    };

    fetchRecentImages();
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onImageSelect(data.url);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to add error handling UI here
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg w-[90%] max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Choose cover image</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-6">
          {/* Upload section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Upload image</h4>
            <label
              className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                {isUploading ? (
                  <>
                    <LoadingSpinner size="medium" />
                    <span className="text-sm text-base-content/70 mt-2">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="mb-2 text-base-content/70" />
                    <span className="text-sm text-base-content/70">
                      Upload from computer
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </label>
          </div>

          {/* Recently used images section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recently used</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoadingRecent ? (
                <div className="col-span-full flex justify-center py-4">
                  <LoadingSpinner size="medium" />
                </div>
              ) : recentImagesError ? (
                <div className="col-span-full text-center text-error py-4">
                  {recentImagesError}
                </div>
              ) : recentImages.length > 0 ? (
                recentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onImageSelect(image)}
                    className="relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                    disabled={isUploading}
                  >
                    <img
                      src={image}
                      alt={`Recent cover ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center text-base-content/70 py-4">
                  No recent images found
                </div>
              )}
            </div>
          </div>

          {/* Default covers section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Default covers</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {defaultCovers.map((cover, index) => (
                <button
                  key={index}
                  onClick={() => onImageSelect(cover)}
                  className="relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                  disabled={isUploading}
                >
                  <img
                    src={cover}
                    alt={`Cover ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverImageModal;
