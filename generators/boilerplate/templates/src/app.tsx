import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { theme, ThemeProvider } from "./theme";
import { Demo } from "./page/demo";
import store from "./store";

export const App = () => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Route path="/" component={Demo} />
      </Router>
    </Provider>
  </ThemeProvider>
);
