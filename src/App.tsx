import React from "react";
import { AppStateManager } from './components/views/AppStateManager';
import { GlobalStyles } from './components/GlobalStyles';

export default function App() {
  return (
    <>
      <GlobalStyles />
      <AppStateManager />
    </>
  );
}
