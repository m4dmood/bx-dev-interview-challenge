import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { AuthService } from "./services/auth.service";

export function Login() {
  const authService = new AuthService();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem("authToken", data.access_token);
      navigate("/files");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4" mb={3}>Login</Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}
export default Login;