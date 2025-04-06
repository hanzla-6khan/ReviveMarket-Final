import { Container } from "@mui/material";
import LoginForm from "../features/auth/LoginForm";

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
