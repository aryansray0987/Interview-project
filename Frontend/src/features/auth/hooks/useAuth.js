import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { email });
      const data = await login({ email, password });
      console.log('Login response:', data);
      if (data && data.user) {
        console.log('Setting user after login:', data.user);
        setUser(data.user);
      }
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login error:', error);
      return false; // Indicate failed login
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true; // Indicate successful registration
    } catch (error) {
      console.error('Registration error:', error);
      return false; // Indicate failed registration
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        console.log('Attempting to fetch user data...');
        const data = await getMe();
        console.log('User data received:', data);
        if (data && data.user) {
          console.log('Setting user state:', data.user);
          setUser(data.user);
        } else {
          console.log('No user data received');
        }
      } catch (error) {
        console.error('Get user error:', error);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [setLoading, setUser]);

  return { user, loading, handleRegister, handleLogin, handleLogout, setUser };
};
