import { useCallback, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFilesChange,
  multiple = false,
  accept = "image/*",
  maxSize = 10,
  className,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList).filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, maxSize, multiple, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;
    
    handleFiles(e.target.files);
  }, [disabled, handleFiles]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:border-primary cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {accept.includes('image') ? 'PNG, JPG' : accept} up to {maxSize}MB
        </p>
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center space-x-2">
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
