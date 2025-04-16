import { ReactNode } from 'react';
import Header from '../layout/Header';

function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      </>
  );
}

export default RootLayout;