// lib/cloudinary/index.ts

export {
  cloudinary,
  uploadFile,
  deleteFile,
  generateSignature,
  FOLDERS,
  type UploadFolder,
  type UploadOptions,
  type UploadResult,
  type SignatureResult,
} from "./cloudinary";

export {
  getImageUrl,
  getProfilePhotoUrl,
  getCoverPhotoUrl,
  getProjectCoverUrl,
  getBlogCoverUrl,
  getLogoUrl,
  getAvatarUrl,
  isCloudinaryId,
  resolveImageUrl,
} from "./helpers";
