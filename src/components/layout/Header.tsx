import React from "react";
import { Navbar } from "./Navbar";
export function Header() {
  return (
    <header className='text-white p-4 flex justify-between items-center'>
      <Navbar />
    </header>
  );
}
