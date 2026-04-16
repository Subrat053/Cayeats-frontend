import React, { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import {
  uploadImageWithMeta,
  getMenuImages,
  addMenuImage,
  deleteMenuImage,
} from "../../api/restaurantService";
import { logger } from "../../utils/logger";

const DashboardMenuImages = () => {
  const [menuImages, setMenuImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchMenuImages();
  }, []);

  const fetchMenuImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const images = await getMenuImages();
      setMenuImages(images);
    } catch (err) {
      setError("Failed to load menu images");
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  const flashMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      flashMessage("Only JPG, PNG, or WEBP images are allowed", true);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      flashMessage("Image size must be less than 5MB", true);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload image to Cloudinary via backend
      const uploadResponse = await uploadImageWithMeta(file);

      if (!uploadResponse?.url) {
        throw new Error("Failed to get image URL");
      }

      // uploadResponse now contains { url, publicId }
      const imageUrl = uploadResponse.url;
      const publicId = uploadResponse.publicId || null;

      // Save menu image reference to database with publicId
      await addMenuImage(imageUrl, publicId);

      // Update local state with image object
      setMenuImages((prev) => [...prev, { url: imageUrl, publicId }]);
      flashMessage("Menu image added successfully!");
    } catch (err) {
      flashMessage(err.message || "Failed to upload image", true);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDeleteImage = async (imageObj) => {
    // imageObj can be a string (old format) or object { url, publicId }
    const imageUrl = typeof imageObj === "string" ? imageObj : imageObj.url;
    const publicId = typeof imageObj === "object" ? imageObj.publicId : null;

    if (!window.confirm("Are you sure you want to delete this menu image?")) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await deleteMenuImage(imageUrl, publicId);
      setMenuImages((prev) =>
        prev.filter((img) => {
          const imgUrl = typeof img === "string" ? img : img.url;
          return imgUrl !== imageUrl;
        }),
      );
      flashMessage("Menu image deleted successfully!");
    } catch (err) {
      flashMessage(err.message || "Failed to delete image", true);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Images</h1>
        <p className="text-gray-600 mt-1">
          Upload images of your physical menu or menu boards. These will be
          displayed alongside your digital menu.
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-start gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <label
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`block cursor-pointer transition-all ${
            dragActive
              ? "bg-orange-50 border-orange-300"
              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
          } border-2 border-dashed rounded-lg p-8 text-center`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-gray-600 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-orange-500" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Menu Images Grid */}
      {menuImages.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Menu Images ({menuImages.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuImages.map((imageObj, index) => {
              // Handle both old string format and new object format
              const imageUrl =
                typeof imageObj === "string" ? imageObj : imageObj.url;
              const uniqueKey =
                typeof imageObj === "string"
                  ? imageUrl
                  : imageObj.url + imageObj.publicId;

              return (
                <div
                  key={uniqueKey || index}
                  className="relative group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Menu"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Delete Button Overlay */}
                  <button
                    onClick={() => handleDeleteImage(imageObj)}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Delete image"
                  >
                    <X className="w-6 h-6 text-white cursor-pointer" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No menu images uploaded yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start by uploading your first menu image above
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardMenuImages;
