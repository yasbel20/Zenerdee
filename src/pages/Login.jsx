import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserAuthModal from '../components/UserAuthModal';

// Página pública de login para clientes: muestra el modal de autenticación.
function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <UserAuthModal
        onClose={() => navigate('/')}
        onSuccess={() => navigate('/')}
        initialTab="login"
      />
    </div>
  );
}

export default Login;
