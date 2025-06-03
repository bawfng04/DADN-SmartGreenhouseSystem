import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { router, Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth();

  const handleLogin = () => {
    login();
  };

  const { mutate: login } = useMutation({
    mutationFn: async () => {
      const response = await apiCall({
        method: "POST",
        endpoint: "/login",
        body: {
          username,
          password,
        },
      });
      console.log("Response", response);
      return response;
    },
    onSuccess: async (data) => {
      console.log("Login success", data);
      await setToken(data.token);
      router.replace("/(tabs)");
    },
    onError: (error) => {
      console.log("Login error", error);
      alert("Login error" + error.message);
    },
  });

  return (
    <ImageBackground
      source={require("@/assets/images/bg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("@/assets/images/Branding.png")}
          style={{ marginVertical: 40 }}
        />

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <TextInput
              placeholder=""
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>

          <View style={[styles.inputContainer, { position: "relative" }]}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              placeholder=""
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 16,
                top: 42,
              }}
            >
              {showPassword ? (
                <Image
                  source={require("@/assets/images/show.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              ) : (
                <Image
                  source={require("@/assets/images/hide.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Chưa có tài khoản?{" "}
          <Link href="/auth/signup" style={styles.signupLink}>
            Tạo tài khoản
          </Link>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  green: {
    color: "#228B22",
  },
  orange: {
    color: "#FF8C00",
  },
  form: {
    width: "100%",
    gap: 16,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    elevation: 2,
  },
  inputContainer: {
    gap: 12,
  },

  label: {
    paddingLeft: 12,
    fontWeight: 500,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  loginButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 24,
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 18,
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    color: "#228B22",
    fontWeight: "600",
  },
});
