import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          const res = await axios.get(`${API_BASE_URL}/students/${parsedUser.uid}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          setStudentProfile(res.data);
          // Set global axios auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error("Session restoration failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      // Only run timer if user is logged in
      if (!localStorage.getItem('token')) return;
      
      clearTimeout(inactivityTimer);
      // 10 minutes = 600000 ms
      inactivityTimer = setTimeout(() => {
        console.log("Logged out due to inactivity");
        logout();
      }, 600000);
    };

    // Attach event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);

    // Initial call
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/students/login`, {
        email,
        password
      });

      const data = res.data;
      const userData = {
        uid: data.uid,
        email: data.email,
        displayName: data.name
      };

      setUser(userData);
      setStudentProfile(data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      return data;
    } catch (error) {
      console.error("Login failed", error);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
        const res = await axios.post(`${API_BASE_URL}/students/register`, {
            email,
            password,
            name: name || email.split('@')[0],
            role: 'student'
        });
        
        const data = res.data;
        const userData = {
          uid: data.uid,
          email: data.email,
          displayName: data.name
        };

        setUser(userData);
        setStudentProfile(data);

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userData));
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        return data;
    } catch (error) {
        console.error("Signup failed", error);
        throw new Error(error.response?.data?.message || "Signup failed");
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    // Full redirect to homepage as requested
    window.location.href = '/';
  };

  const value = { user, studentProfile, setStudentProfile, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
