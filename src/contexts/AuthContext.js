import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../services/axios";
import { getApiMessage, notifySuccess } from "../utils/notifications";
import { safeJsonParse } from "../utils/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      const parsedUser = safeJsonParse(storedUser, null);
      if (parsedUser) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem("user");
      }
      getProfile();
    }
    setLoading(false);
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get("/profile", { suppressToast: true });
      const profile = response.data?.data?.user;
      setUser(profile);
      if (profile) {
        localStorage.setItem("user", JSON.stringify(profile));
      }
      return profile;
    } catch (error) {
      console.error("Erreur profil:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/login",
        { email, password },
        { suppressToast: true },
      );
      const { token, user } = response.data?.data || {};
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
      notifySuccess("Connexion réussie");
      return { success: true, user };
    } catch (error) {
      const message = getApiMessage(
        error.response?.data,
        "Erreur de connexion",
      );
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/register", userData, {
        suppressToast: true,
      });
      const { token, user } = response.data?.data || {};
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
      notifySuccess("Inscription réussie");
      return { success: true };
    } catch (error) {
      const message = getApiMessage(
        error.response?.data,
        "Erreur d'inscription",
      );
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout", {}, { suppressToast: true });
    } catch (error) {
      console.error("Erreur logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      notifySuccess("Déconnexion réussie");
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    const userRoles = Array.isArray(roles) ? roles : [roles];
    return userRoles.includes(user.role);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasRole,
        getProfile,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};
