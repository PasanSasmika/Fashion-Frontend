import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Home from "./Home";
import FashionPage from "./FashionPage";
import FashionCollection from "./FashionCollection";
import SpecialProduct from "./SpecialProduct";
import Footer from "../../components/Footer";




function CustomerHome() {
  
  return (
    <>
   
       <div className="w-full h-screen bg-primary">
       <div>
         <Routes>
           <Route
             path="/"
             element={
               <main>
                 <NavBar/>
                 <Home/>
                 <FashionPage/>
                 <FashionCollection/>
                 <SpecialProduct/>
                 <Footer/>
                 {/* 
                 <OurServices/>
                 <AboutUs/>
                 <Footer/> */}
               </main>
             }
           />
         </Routes>
       </div>
     </div>

   
    </>
  );
}

export default CustomerHome;
