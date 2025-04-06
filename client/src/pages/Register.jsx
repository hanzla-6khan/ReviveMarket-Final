import React, { useState } from "react";
import { Container } from "@mui/material";
import RegisterForm from "../features/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
