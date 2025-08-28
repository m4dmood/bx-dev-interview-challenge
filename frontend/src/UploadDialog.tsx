import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import { FileService } from "./services/file.service";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadDialog({ open, onClose }: UploadDialogProps) {
    const fileService = new FileService();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > 5 * 1024 * 1024) {
      alert("File must not be larger than 5 MB");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Select a file");
    console.log("Ready to upload:", file);
    await fileService.upload(file);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload</DialogTitle>
      <DialogContent>
        <input type="file" onChange={handleFileChange} />
        {file && <p>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setFile(null);
          onClose();
          }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}