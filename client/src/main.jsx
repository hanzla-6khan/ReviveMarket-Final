import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { green } from "@mui/material/colors";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    primary: {
      main: green[800],
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* React query tools extension */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <App />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
