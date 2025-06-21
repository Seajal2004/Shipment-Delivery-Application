import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
  const { currentUser } = useAuth();
  
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  const isAdmin = currentUser && adminEmails.includes(currentUser.email);
  
  return { isAdmin };
};