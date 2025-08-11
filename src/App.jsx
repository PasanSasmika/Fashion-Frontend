import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AdminHome from "./pages/AdminPages/AdminHome"
import LoginPage from "./components/LoginPage"
import SignUp from "./components/SignUp"
import CustomerHome from "./pages/HomePages/CustomerHome"
import AllProducts from "./pages/HomePages/AllProducts"
import ProductOverview from "./pages/HomePages/ProductOverview"
import Cart from "./pages/HomePages/Cart"
import OrderCancel from "./pages/HomePages/OrderCancel"
import OrderedItems from "./pages/HomePages/OrderedItems"


function App() {

  return (
    <>
    <BrowserRouter>
    <Toaster/>
     <Routes path="/*">
     <Route path='/' element={<CustomerHome/>}/>
     <Route path='/products' element={<AllProducts/>}/>
     <Route path='/productoverview/:id' element={<ProductOverview/>}/>
     <Route path="/cart" element={<Cart />} />
     <Route path="/login" element={<LoginPage />} />
     <Route path="/signup" element={<SignUp />} />
     <Route path='/admin/*' element={<AdminHome/>}/>
      <Route path="/ordered-items/:orderId" element={<OrderedItems />} />
     <Route path="/order-cancel/:orderId" element={<OrderCancel />} />
     </Routes>

     </BrowserRouter>
    </>
  )
}

export default App
