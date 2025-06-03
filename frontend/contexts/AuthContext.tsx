import React, { createContext, useContext, useEffect, useState } from "react";
import { getValueFor, save, removeValueFor } from "@/utils/handleAccessToken";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = async (newToken: string) => {
    await save("token", newToken);
    setTokenState(newToken);
  };

  const removeToken = async () => {
    await removeValueFor("token");
    setTokenState(null);
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getValueFor("token");
      setTokenState(storedToken);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        setToken,
        removeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
