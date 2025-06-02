import React from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Category from "./pages/Category";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./context/AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Import from "./pages/Import";
import Export from "./pages/Export";
import { ToastContainerComponent } from "./components/Toast";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Check if user is logged in
    const checkCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/user/current", {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData._id);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser("");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Lỗi kiểm tra người dùng hiện tại:", error);
        setUser("");
      } finally {
        setLoader(false);
      }
    };

    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      checkCurrentUser();
    }
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Đang tải...</h2>
        </div>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <ToastContainerComponent />
      <BrowserRouter>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Navigate to="/login" />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/import" element={<Import />} />
            <Route path="/export" element={<Export />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
