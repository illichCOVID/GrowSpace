'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginModal from './LoginModal';

export default function LayoutWrapper({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const openRegister = () => {
    setIsRegistering(true);
    setModalOpen(true);
  };

  const openLogin = () => {
    setIsRegistering(false);
    setModalOpen(true);
  };

  return (
    <>
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />
      <main>{children}</main>
      <Footer />
      {modalOpen && (
        <LoginModal
          isRegistering={isRegistering}
          onClose={() => setModalOpen(false)}
          switchMode={() => setIsRegistering((prev) => !prev)}
        />
      )}
    </>
  );
}
