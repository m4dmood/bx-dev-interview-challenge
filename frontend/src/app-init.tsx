import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  CssBaseline,
  Icon,
  modalClasses,
  StyledEngineProvider,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import theme from "./theme";
import { useEffect, useState } from "react";
import { FileService } from "./services/file.service";
import UploadDialog from "./UploadDialog";

function App() {
  const fileService = new FileService();
  const [fileList, setFileList] = useState<any[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await fileService.findAll();
        setFileList(files);
      } catch (e) {
        console.error("Errore nel caricamento dei file:", e);
      }
    };

    loadFiles();
  }, []);

  const download = async (s3Key: string, filename: string) => {
    await fileService.downloadFile(s3Key, filename);
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
              <Button color="inherit">Login</Button>
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
            <UploadDialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)}/>
          </Container>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
