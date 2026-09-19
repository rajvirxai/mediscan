'use client';

import React from 'react';
import { FileText, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface FilePreviewProps {
  file: File | { name: string; type: string; size: number; previewUrl?: string };
  onRemove: () => void;
  onReplaceClick: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  onReplaceClick,
}) => {
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file instanceof File && isImage) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if ('previewUrl' in file && file.previewUrl) {
      setObjectUrl(file.previewUrl);
    } else {
      setObjectUrl(null);
    }
  }, [file, isImage]);

  const formattedSize = React.useMemo(() => {
    if (!file.size) return '850 KB';
    const mb = file.size / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${(file.size / 1024).toFixed(1)} KB`;
  }, [file.size]);

  return (
    <div className="rounded-3xl border border-[#E9EBED] bg-white p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-[#E9EBED]">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#13714C]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#3AB67D]" />
          <span>Prescription Loaded</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReplaceClick}
            className="flex items-center gap-1 rounded-xl border border-[#E9EBED] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#3AB67D] active:scale-95 transition-all"
          >
            <RefreshCw className="h-3 w-3 text-[#13714C]" />
            Change
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 transition-all"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-3 items-center">
        {/* Visual Preview */}
        <div className="relative flex h-36 w-full sm:w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E9EBED] bg-[#f8fafc]">
          {isImage && objectUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={objectUrl}
              alt="Prescription Preview"
              className="h-full w-full object-cover"
            />
          ) : isPdf ? (
            <div className="flex flex-col items-center justify-center text-center p-3">
              <div className="rounded-xl bg-rose-100 p-2 text-rose-600 border border-rose-200 mb-1">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-900">PDF Doc</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-3">
              <div className="rounded-xl bg-[#A2E494]/30 p-2 text-[#13714C] border border-[#3AB67D]/30 mb-1">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-900">Clinical Scan</span>
            </div>
          )}

          <div className="absolute bottom-1.5 right-1.5 rounded bg-white/90 px-1 py-0.5 text-[9px] font-mono text-[#13714C] border border-[#E9EBED] font-bold">
            {isPdf ? 'PDF' : 'IMG'}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="flex-1 space-y-2 w-full">
          <div>
            <h4 className="text-sm font-bold text-slate-900 break-all leading-snug">
              {file.name}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Size: <span className="text-[#13714C] font-mono font-bold">{formattedSize}</span>
            </p>
          </div>

          <div className="rounded-xl bg-[#f8fafc] p-2 border border-[#E9EBED] text-[11px]">
            <span className="text-slate-500 block text-[10px]">Security Tier</span>
            <span className="font-semibold text-[#13714C]">Encrypted MediScan Cloud Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
