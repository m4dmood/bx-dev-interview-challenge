import { useState, useEffect } from "react";
import { FileService } from "./services/file.service";
import { ThemeProvider } from "@emotion/react";
import { StyledEngineProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container, Table, TableHead, TableRow, TableCell, TableBody, ButtonGroup, TableFooter } from "@mui/material";
import theme from "./theme";
import UploadDialog from "./UploadDialog";
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from "react-router-dom";

function FilesPage() {
  const fileService = new FileService();
  const [fileList, setFileList] = useState<any[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    expectedHash: string;
    actualHash: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
      try {
        const files = await fileService.findAll();
        setFileList(files);
      } catch (e) {
        console.error("Errore nel caricamento dei file:", e);
      }
    };

  const download = async (s3Key: string, filename: string) => {
    await fileService.downloadFile(s3Key, filename);
  }

  const verifyFile = async (file: File, fileKey: string) => {
      setIsVerifying(true);
      try {
        // Ottieni l'hash atteso dal server
        const response = await fetch(`/api/file/${fileKey}/hash`);
        const { hash: expectedHash } = await response.json();

        // Calcola l'hash del file scaricato
        const actualHash = await calculateFileHash(file);

        const isValid = expectedHash === actualHash;
        setVerificationResult({
          isValid,
          expectedHash,
          actualHash
        });

        return isValid;
      } catch (error) {
        console.error('Errore durante la verifica:', error);
        return false;
      } finally {
        setIsVerifying(false);
      }
    };

    return { verifyFile, isVerifying, verificationResult };
  };

  // Funzione per calcolare l'hash lato client
  async function calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const formatSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleDialogClose = () => {
    setShowUploadDialog(false);
    loadFiles();
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                BonusX Interview Challenge
              </Typography>
              <Button style={{ margin: '0 10px 0 10px' }}
                variant="contained"
                color="info"
                startIcon={<UploadIcon/>}
                onClick={() => setShowUploadDialog(true)}>
                Upload
              </Button>
              <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </Toolbar>
          </AppBar>  

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, justifyContent: "center" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Uploaded on</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              {fileList.length > 0 && <TableBody>
                {fileList.map(f => {
                  return <TableRow key={f.id}>
                          <TableCell>{f.filename}</TableCell>
                          <TableCell>{formatSize(f.size)}</TableCell>
                          <TableCell>{formatDate(f.uploadedOn)}</TableCell>
                          <TableCell>
                            <ButtonGroup>
                              <Button onClick={() => download(f.s3Key, f.filename)}>Download</Button>
                            </ButtonGroup>
                          </TableCell>
                         </TableRow>;
                })}
              </TableBody>}
              <TableFooter>
                
              </TableFooter>
            </Table>
            {fileList.length === 0 && <Typography variant="body1" sx={{ mt: 4, display: 'block', textAlign: 'center', color: 'gray', fontSize: '36px' }}>No files uploaded yet</Typography>}
            <UploadDialog open={showUploadDialog} onClose={() => handleDialogClose()}/>
          </Container>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
export default FilesPage;