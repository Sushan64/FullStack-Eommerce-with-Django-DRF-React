import React, { useState, useEffect } from 'react';
import { useCartGet, useCartDelete } from '../hooks/useCart'
import CartItem from '../components/CartItem'
import {message} from 'antd'

export default function Cart(){
  const {data, loading, error} = useCartGet();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)
  const { deleteItem, delData, delSuccess, delLoading, delError } = useCartDelete();
  const [ messageApi, contextHolder ] = message.useMessage();
  const [deletingItemId, setDeletingItemId] = useState(null);
  
  const getTotalPrice = (diff) =>{
    setTotalPrice((prev)=>(prev + diff))
  }

  useEffect(()=>{
    if (data && data.cartItems){
      setCartItems(data.cartItems);
    }
  },[data])

  useEffect(() => {
    if (cartItems.length > 0) {
      const initialTotal = cartItems.reduce((acc, item) => acc + Number(item.product.price) * Number(item.quantity), 0);
      setTotalPrice(initialTotal);
    } else {
      setTotalPrice(0);
    }
  }, [cartItems]);

  // Handle delete success
  useEffect(()=>{
    if (delSuccess && deletingItemId) {
      setCartItems((prev) => prev.filter((item) => item.id !== deletingItemId));
      messageApi.open({
        type: 'success',
        content: 'Item removed successfully',
      });
      setDeletingItemId(null);
    }
  }, [delSuccess, deletingItemId, messageApi])

  // Handle delete error
  useEffect(() => {
    if (delError) {
      messageApi.open({
        type: 'error',
        content: `Failed to remove: ${delError}`,
      });
      setDeletingItemId(null);
    }
  }, [delError, messageApi]);

  const handleDelete = async (id) => {
    setDeletingItemId(id);
    await deleteItem(id);
  }
  
  if (error) return <p>Error: {error}</p>
  if (loading) return <p>Loading...</p>
  if (!data) return <p>Nothing...</p>


  return(
    <>
      {contextHolder}
      <div className="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
          <h1 className="text-xl font-semibold">Shopping Cart</h1>
          <div className="grid lg:grid-cols-3 lg:gap-x-8 gap-x-6 gap-y-8 mt-6">
            {/* CartProduct */}
            <div className="lg:col-span-2 space-y-6">
  
            {cartItems.map((item, index)=>{
      
      return(
      <CartItem key={index} getTotalPrice={getTotalPrice} initialTotalPrice={totalPrice} onDelete={()=>handleDelete(item.id)} name={item.product.name} quantity={item.quantity} price={item.product.price} image={item.product.image}/>
   )
    })}
              
            </div>
            {/* Shipping */}
            <div className="rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
              <ul className="font-medium space-y-4">
                <li className="flex flex-wrap gap-4 text-sm">Subtotal <span className="ml-auto font-semibold">रु.{totalPrice}</span></li>
                <li className="flex flex-wrap gap-4 text-sm">Shipping <span className="ml-auto font-semibold">रु.00</span></li>
                <li className="flex flex-wrap gap-4 text-sm">Tax <span className="ml-auto font-semibold">रु.00</span></li>
                <hr className="border-slate-300" />
                <li className="flex flex-wrap gap-4 text-sm font-semibold">Total <span className="ml-auto">रु.{totalPrice}</span></li>
              </ul>

              <div className="mt-8 space-y-4">
                <button type="button" className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-800 hover:bg-slate-900 text-white rounded-md cursor-pointer">Buy Now</button>
                <button type="button" className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-50 hover:bg-slate-100 text-slate-900 border border-gray-300 rounded-md cursor-pointer">Continue Shopping</button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-4">
                <img src="https://readymadeui.com/images/master.webp" alt="card1" className="w-10 object-contain" />
                <img src="https://readymadeui.com/images/visa.webp" alt="card2" className="w-10 object-contain" />
                <img src="https://readymadeui.com/images/american-express.webp" alt="card3" className="w-10 object-contain" />
              </div>
            </div>

        </div>
      </div>
    </>
  )
}