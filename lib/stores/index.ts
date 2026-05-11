// lib/stores/index.ts
// Single import point for all stores and their types

export {
  useAuthStore,
  authFetch,
  selectToken,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoading,
} from "./useAuthStore";
export {
  useProjectStore,
  selectFeaturedProjects,
  selectAllTags,
} from "./useProjectStore";
export {
  usePostStore,
  selectFeaturedPosts,
  selectAllPostTags,
} from "./usePostStore";
export {
  useTestimonialStore,
  selectPendingCount,
  selectFeaturedTestimonials,
} from "./useTestimonialStore";
export {
  useContactStore,
  selectUnreadCount,
  selectMessagesByStatus,
} from "./useContactStore";
export {
  useUIStore,
  toast,
  selectTheme,
  selectToasts,
  selectActiveModal,
  selectModalPayload,
} from "./useUIStore";
export {
  useProfileStore,
  selectSkillsByCategory,
  selectCurrentJob,
  selectIsAvailable,
} from "./useProfileStore";
export {
  useUploadStore,
  selectUpload,
  selectIsUploading,
} from "./useUploadStore";

// Types
export type { TestimonialSubmission } from "./useTestimonialStore";
export type { ContactFormData } from "./useContactStore";
export type { ToastVariant, Toast, ModalId } from "./useUIStore";
export type { FullProfile } from "./useProfileStore";
export type { UploadState, UploadStatus } from "./useUploadStore";
