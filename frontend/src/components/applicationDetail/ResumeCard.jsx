import { useEffect, useRef } from "react";
import { FileText, Download, Trash2, Upload, Loader2, Eye } from "lucide-react";
import useResumeStore from "@/store/resumeStore";
import { cn } from "@/lib/utils";

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeCard({ applicationId }) {
  const {
    fetchResumes,
    uploadResume,
    deleteResume,
    getResumes,
    isUploading,
    uploadError,
    clearError,
  } = useResumeStore();

  const fileInputRef = useRef(null);
  const resumes = getResumes(applicationId);

  // Always fetch on mount so presigned URLs are fresh
  useEffect(() => {
    fetchResumes(applicationId);
  }, [applicationId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clearError();
    await uploadResume({ file, applicationId });
    // Reset so the same file can be re-uploaded if needed
    e.target.value = "";
  };

  const handleDelete = async (resumeId) => {
    if (!confirm("Delete this resume?")) return;
    await deleteResume({ resumeId, applicationId });
  };

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1">
          Resume Versions
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
            isUploading
              ? "bg-gray-100 dark:bg-dark-s2 text-gray-400 cursor-not-allowed"
              : "bg-dark-accent/10 text-dark-accent hover:bg-dark-accent/20",
          )}
        >
          {isUploading ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload size={12} /> Upload
            </>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        </div>
      )}

      {/* Empty state */}
      {resumes.length === 0 && !isUploading ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl text-gray-400 dark:text-dark-tx3 hover:border-dark-accent hover:text-dark-accent dark:hover:border-dark-accent transition-all"
        >
          <Upload size={20} />
          <span className="text-xs font-medium">
            Upload resume (PDF or Word)
          </span>
        </button>
      ) : (
        <div className="space-y-2">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-dark-s2 rounded-xl p-3 group"
            >
              {/* File info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText
                    size={14}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-tx1 truncate max-w-[130px]">
                    {resume.originalName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-dark-tx3">
                    {formatBytes(resume.fileSize)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* View in browser tab */}
                <a
                  href={resume.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-gray-400 dark:text-dark-tx3 hover:text-dark-accent transition-colors"
                  title="View"
                >
                  <Eye size={14} />
                </a>

                {/* Force download */}
                <a
                  href={resume.downloadUrl}
                  download
                  className="p-1.5 text-gray-400 dark:text-dark-tx3 hover:text-dark-accent transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                </a>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="p-1.5 text-gray-400 dark:text-dark-tx3 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Upload another version */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 dark:text-dark-tx3 hover:text-dark-accent border border-dashed border-gray-200 dark:border-dark-border hover:border-dark-accent rounded-xl transition-all disabled:opacity-40"
          >
            <Upload size={11} />
            Add another version
          </button>
        </div>
      )}
    </div>
  );
}
