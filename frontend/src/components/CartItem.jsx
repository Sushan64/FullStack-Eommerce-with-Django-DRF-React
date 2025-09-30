import {Row, Col, Flex, Image} from 'antd';
import {Trash2} from "lucide-react";
import { useState, useEffect, useRef } from 'react'

export default function CartItem({ name, price, quantity, image, getTotalPrice, selected_attributes, onDelete}){
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [totalItemPrice, setTotalItemPrice] = useState(price * quantity);
  const [quantities, setQuantities] = useState(quantity);
  
  const prevItemPriceRef = useRef(price*quantity)
  
  const increase = () =>{
    const newQuantity = quantities + 1;
    setQuantities(newQuantity);
    setTotalItemPrice(price * newQuantity);
  }
  const decrease=() =>{
    if (quantities > 1){
      const newQuantity = quantities - 1;
    setQuantities(newQuantity);
    setTotalItemPrice(price * newQuantity);
    }
  }
  useEffect(()=>{
    const prevItemPrice = prevItemPriceRef.current;
    const diff = totalItemPrice - prevItemPrice;
    getTotalPrice(diff)
    prevItemPriceRef.current = totalItemPrice;
  }, [totalItemPrice])
  return(
    <>
        <div className="flex gap-4 px-4 py-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex gap-6 sm:gap-4 max-sm:flex-col">
            <div className="w-24 h-24 max-sm:w-24 max-sm:h-24 shrink-0 rounded-md">
              <img src={`${BASE_URL}/${image}`} className="w-full h-full rounded-md object-contain" alt="product" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-semibold">{name}</h3>
                <p className="text-[13px] font-medium mt-2 flex items-center gap-2">
                  Selected: {Object.entries(selected_attributes).map(([key, value])=>(
                   <span key={key} className="inline-block w-auto px-1 rounded-sm">
                     {value.startsWith("#")
                      ? (<div className="flex item-center"><span className="w-4 h-4 inline-block rounded-full" style={{ backgroundColor: value }}></span></div>)
                     : (value)} </span>
                  ))
                  }
                </p>
              </div>
              <div className="mt-auto">
                <h3 className="text-sm font-semibold">रु.{totalItemPrice}</h3>
              </div>
            </div>
          </div>

          <div className="ml-auto flex flex-col">
            <div className="flex h-4 items-start gap-4 justify-end">
              <button type="button" onClick={onDelete}>
              <Trash2 strokeWidth={1} size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <button onClick={decrease} type="button" className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-400 outline-none rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white" viewBox="0 0 124 124">
                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                </svg>
              </button>
              <span className="font-semibold text-base leading-[18px]">{quantities}</span>
              <button onClick={increase} type="button" className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-800 outline-none rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white" viewBox="0 0 42 42">
                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

    </>
  )
}