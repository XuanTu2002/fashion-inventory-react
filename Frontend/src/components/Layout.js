import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <div className="flex flex-1 bg-gray-100">
        <div className="w-64 sticky top-16 h-[calc(100vh-4rem)] hidden lg:block">
          <SideMenu />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
