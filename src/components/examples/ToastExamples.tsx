
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader, Download, XCircle, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function ToastExamples() {
  const { dismiss } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const showBasicToasts = () => {
    toast({
      title: "Default Toast",
      description: "This is a default toast message"
    });
    
    toast.info("Info Toast", {
      description: "This is an informational message"
    });
    
    toast.success("Success Toast", {
      description: "Operation completed successfully"
    });
    
    toast.warning("Warning Toast", {
      description: "This action might cause issues"
    });
    
    toast.error("Error Toast", {
      description: "An error occurred during the operation"
    });
  };
  
  const showProgressToast = () => {
    const { id, update } = toast.progress(
      "Downloading file...", 
      { value: 0, showValue: true },
      { description: "Please wait while we download your file" }
    );
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      toast.updateProgress(id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        update({
          title: "Download complete",
          description: "Your file has been downloaded successfully",
          variant: "success",
          progress: undefined,
          autoClose: true
        });
      }
    }, 300);
  };
  
  const showUploadToast = () => {
    setIsUploading(true);
    
    const { id } = toast.interactive("Uploading Document", {
      description: "Your document is being uploaded to the server",
      progress: { value: 0, showValue: true, status: "indeterminate" },
      actions: {
        primary: {
          label: "View",
          onClick: () => {
            toast.success("Navigating to document");
            dismiss(id);
          }
        },
        secondary: {
          label: "Cancel",
          onClick: () => {
            toast({
              title: "Upload Cancelled",
              description: "Document upload was cancelled",
              variant: "destructive"
            });
            dismiss(id);
            setIsUploading(false);
          }
        }
      }
    });
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      toast.updateProgress(id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        toast.updateProgress(id, 100);
        setTimeout(() => {
          toast.success("Upload Complete", {
            description: "Your document has been uploaded successfully"
          });
          dismiss(id);
          setIsUploading(false);
        }, 500);
      }
    }, 500);
  };
  
  const showRetryToast = () => {
    toast.interactive("Connection Failed", {
      description: "Unable to connect to the server, please try again",
      variant: "interactive",
      actions: {
        primary: {
          label: "Retry",
          onClick: () => {
            toast.info("Reconnecting...", {
              description: "Attempting to reconnect to the server"
            });
          }
        },
        secondary: {
          label: "Dismiss",
          onClick: () => {
            toast({
              description: "You can try again later",
              variant: "info"
            });
          }
        }
      },
      custom: (
        <div className="flex items-center justify-center py-4">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
      )
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Interactive Toast Examples</h2>
      <div className="flex flex-wrap gap-4">
        <Button onClick={showBasicToasts}>Show Basic Toasts</Button>
        <Button onClick={showProgressToast} className="flex gap-2">
          <Download className="h-4 w-4" />
          Download Toast
        </Button>
        <Button 
          onClick={showUploadToast} 
          disabled={isUploading}
          className="flex gap-2"
        >
          {isUploading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Upload Toast
        </Button>
        <Button 
          onClick={showRetryToast}
          variant="destructive"
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  );
}
