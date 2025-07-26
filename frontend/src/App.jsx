import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from './components/Navbar'
import Category from './pages/Category'
import Product from './pages/Product'
import Login from './pages/Login'
import Cart from './pages/Cart'

function App() {
  return (
    <BrowserRouter>
    <div className="md:grid md:grid-cols-[auto_1fr] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="pt-20 md:pt-10 md:px-16 px-4 min-h-screen h-auto pb-18 transition-all duration-300 ease-in-out w-full max-w-full overflow-x-hidden">
        
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="category/:categoryPath" element={<Category />}></Route>
            <Route path="product/:slug" element={<Product />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="cart" element={<Cart />}></Route>
          </Routes>
        
      </main>
    </div>
      </BrowserRouter>
  );
}

export default App;
