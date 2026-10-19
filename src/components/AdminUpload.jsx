


import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Camera,
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  X,
  LoaderCircle,
  Info,
  Clock,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const formatSize = (bytes) => {
  if (!bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

function AdminUpload() {
  const { problemId } = useParams();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const videoRegistration = register("video", {
    validate: {
      required: (files) =>
        files?.length > 0 || "Please select a video to upload.",
      videoType: (files) =>
        !files?.length ||
        files[0].type.startsWith("video/") ||
        "Please select a valid video file.",
      maxSize: (files) =>
        !files?.length ||
        files[0].size <= MAX_FILE_SIZE ||
        "Video size must not exceed 100 MB.",
    },
  });

  const selectFile = (file) => {
    if (!file || uploading) return;

    clearErrors("video");
    setErrorMessage("");
    setUploadedVideo(null);
    setUploadProgress(0);
    setDuration(0);

    if (!file.type.startsWith("video/")) {
      setSelectedFile(null);
      setValue("video", null, { shouldValidate: true });
      setError("video", {
        type: "validate",
        message: "Please select a valid video file.",
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setValue("video", null, { shouldValidate: true });
      setError("video", {
        type: "validate",
        message: "Video size must not exceed 100 MB.",
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setValue("video", [file], {
      shouldValidate: true,
      shouldDirty: true,
    });

    const objectUrl = URL.createObjectURL(file);
    const videoElement = document.createElement("video");

    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      setDuration(
        Number.isFinite(videoElement.duration)
          ? videoElement.duration
          : 0
      );
      URL.revokeObjectURL(objectUrl);
    };

    videoElement.onerror = () => URL.revokeObjectURL(objectUrl);
    videoElement.src = objectUrl;
  };

  const removeFile = () => {
    if (uploading) return;

    setSelectedFile(null);
    setDuration(0);
    setValue("video", null, { shouldValidate: true });
    clearErrors("video");
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (formData) => {
    const file = formData.video?.[0];

    if (!file || !problemId) {
      setErrorMessage(
        !problemId
          ? "Problem ID is missing. Please open this page from a problem."
          : "Please select a video before uploading."
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setErrorMessage("");
    setUploadedVideo(null);

    try {
      // Step 1: Get Cloudinary signature from backend.
      const signatureResponse = await axiosClient.get(
        `/video/create/${problemId}`
      );

      const signatureData =
        signatureResponse.data?.data ?? signatureResponse.data;

      const {
        signature,
        timestamp,
        public_id,
        api_key,
        cloud_name,
        upload_url,
      } = signatureData;

      if (
        !signature ||
        !timestamp ||
        !public_id ||
        !api_key ||
        !cloud_name ||
        !upload_url
      ) {
        throw new Error(
          "Cloudinary upload details are incomplete. Check your backend response."
        );
      }

      // Step 2: Upload video to Cloudinary.
      const cloudinaryFormData = new FormData();

      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("timestamp", timestamp);
      cloudinaryFormData.append("public_id", public_id);
      cloudinaryFormData.append("api_key", api_key);

      const cloudinaryResponse = await axios.post(
        upload_url,
        cloudinaryFormData,
        {
          onUploadProgress: (event) => {
            if (event.total) {
              setUploadProgress(
                Math.round((event.loaded * 100) / event.total)
              );
            }
          },
        }
      );

      const videoData = cloudinaryResponse.data;

      // Step 3: Save video metadata in your backend.
      await axiosClient.post("/video/save", {
        problemId,
        public_id: videoData.public_id,
        secure_url: videoData.secure_url,
        duration: videoData.duration ?? duration,
      });

      setUploadProgress(100);

      setUploadedVideo({
        name: file.name,
        size: file.size,
        duration: videoData.duration ?? duration,
        url: videoData.secure_url,
      });

      setSelectedFile(null);
      setDuration(0);
      reset();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Video upload error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Video upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (uploading) return;

    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="box-border min-h-screen bg-slate-50 px-3 py-3 sm:px-5 sm:py-4 lg:flex lg:h-screen lg:min-h-0 lg:items-center lg:justify-center lg:overflow-hidden">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Heading inside the box */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Camera size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Upload Video
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Add a video solution for your coding problem.
              </p>
            </div>
          </div>

          <div className="p-4 sm:px-6 sm:py-4">
            {/* Video Details */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileVideo size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Video Details
                </h2>
                <p className="text-xs text-slate-500">
                  Select a video solution to upload.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Upload area */}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!uploading) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed px-4 py-5 text-center transition sm:py-6 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-blue-200 bg-blue-50/40 hover:border-blue-400"
                } ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={uploading}
                  {...videoRegistration}
                  ref={(element) => {
                    videoRegistration.ref(element);
                    fileInputRef.current = element;
                  }}
                  onChange={(event) => {
                    videoRegistration.onChange(event);
                    selectFile(event.target.files?.[0]);
                  }}
                />

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-14 sm:w-14">
                  <UploadCloud size={28} />
                </div>

                <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
                  Choose a video to upload
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500 sm:text-sm">
                  Click below or drag and drop your video file here.
                </p>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UploadCloud size={17} />
                  Browse Video
                </button>

                <p className="mt-3 text-xs text-slate-400">
                  Video formats supported · Maximum size 100 MB
                </p>
              </div>

              {/* Validation error */}
              {errors.video && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <span>{errors.video.message}</span>
                </div>
              )}

              {/* Selected file */}
              {selectedFile && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <FileVideo size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {selectedFile.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatSize(selectedFile.size)}
                      {duration > 0 && ` · ${formatDuration(duration)}`}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 size={13} />
                      File selected
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={removeFile}
                    aria-label="Remove selected video"
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <X size={19} />
                  </button>
                </div>
              )}

              {/* Upload progress */}
              {uploading && (
                <div className="mt-3 rounded-xl border border-blue-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <LoaderCircle
                        size={17}
                        className="animate-spin text-blue-600"
                      />
                      Uploading video...
                    </span>

                    <span className="text-sm font-semibold text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-blue-100"
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success message */}
              {uploadedVideo && (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-green-800">
                      Video uploaded successfully!
                    </h3>

                    <p className="mt-1 break-words text-xs text-green-700">
                      {uploadedVideo.name}
                    </p>

                    <p className="mt-1 flex flex-wrap gap-3 text-xs text-green-700">
                      <span>{formatSize(uploadedVideo.size)}</span>

                      {uploadedVideo.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDuration(uploadedVideo.duration)}
                        </span>
                      )}
                    </p>

                    {uploadedVideo.url && (
                      <a
                        href={uploadedVideo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-green-800 underline underline-offset-2"
                      >
                        View uploaded video
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Upload error */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span className="break-words">{errorMessage}</span>
                </div>
              )}

              {/* Footer note */}
              <div className="mt-4 flex items-start gap-2 text-xs leading-4 text-slate-500">
                <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />
                <p>
                  Ensure your video clearly explains the solution. Maximum
                  allowed file size is 100 MB.
                </p>
              </div>

              {/* Submit button */}
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
                >
                  {uploading ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={17} />
                      Upload Video
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-slate-400">
          Secure video upload · Powered by Cloudinary
        </p>
      </div>
    </div>
  );
}

export default AdminUpload;
