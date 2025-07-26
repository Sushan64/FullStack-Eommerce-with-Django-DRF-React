import React, { useState, useEffect } from 'react';
import useApi from '../components/Api';
import { Image, Form, Button, Rate, Spin, message, Radio } from 'antd';
import { RiShoppingCartFill } from '@remixicon/react';
import useCart from '../hooks/useCart'
import AddToCartButton from '../components/AddToCartButton'

export default function ProductDetail({ path = "404" }) {
  const { data, loading, error } = useApi(path);
  const [quantity, setQuantity] = useState(1)
  
  const { addToCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ messageApi, contextHolder ] = message.useMessage();
  
  const handleFinish = async () => {
    setIsSubmitting(true);
    message.loading({ content: 'Adding...', key: 'cart_add' });
    const result = await addToCart(dataToSend)
    if (result.success){
      messageApi.open({
      type: 'success',
      content: 'Item Added To Cart',
    });
    } else{
      messageApi.open({
        type:'error',
        content: 'Faild to Add'
      })
    }
    setIsSubmitting(false);
  };
  
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/`

  const [selectedOptions, setSelectedOptions] = useState({})
  
  useEffect(()=>{
    if (data?.attributes){
    let initial ={}
    for (const key in data.attributes) {
        initial[key] = '';
      }
    setSelectedOptions(initial)
    }
  }, [data])

  const handleChange = (key, value) => {
  setSelectedOptions((prev) => ({
    ...prev,
    [key]: value
  }));
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!loading && !data) return <p>Nothing..</p>;
  
  const dataToSend = {
      'product_id': data.id,
      'quantity': quantity,
      'attributes': selectedOptions,
  }

  return (
    <div className="rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* 1. Image Gallery */}
        <div className="flex flex-col gap-4">
          <Image className="rounded-md" src={`${BASE_URL}/${data.image}`} preview={`${BASE_URL}/${data.image}`} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{data.name}</h1>

          {/* Price & Rating */}
          <div className="mt-3 flex items-baseline gap-4">
            <p className="text-3xl font-bold text-indigo-600">रु.{data.price}</p>
            <p className="text-xl text-gray-400 line-through">$24.99</p>
          </div>

          {/* Options Sections */}
          <div className="mt-8 space-y-6">
            <div>
              <Rate disabled value={3} count={5} />
            </div>
          </div>
          </div>

        {/* Form */}
          <Form className="md:col-span-2" onFinish={handleFinish}>
            <div className="md:flex md:gap-10">
              {Object.entries(data.attributes).map(([attributeName, values]) => (
                <div key={attributeName} className="flex flex-col gap-1 mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-200">
                    {attributeName}
                  </h3>
                  <Form.Item name={attributeName} rules={[{ required: true, message: `Please select a ${attributeName}!` }]}>
                  <div className="mt-2 flex flex-wrap gap-2">
                      {values.map((value) =>
                        value.startsWith('#') ? (
                          <Radio.Group value={selectedOptions[attributeName]} onChange={(e) => handleChange(attributeName, e.target.value)} >
                          <Radio.Button key={value} value={value}
                            className="option-button !w-8 !h-8 !rounded-full !m-0 !hover:scale-110 !transition-transform duration-200 shadow-sm"
                            style={{ backgroundColor: value }}
                            aria-label={`Color preview for ${value}`}
                          />
                          </Radio.Group>
                        ) : (
                          <Radio.Group value={selectedOptions[attributeName]} onChange={(e) => handleChange(attributeName, e.target.value)} >
                          <Radio.Button key={value} value={value} className="option-button px-4 py-2 text-sm font-medium rounded-lg">
                            {value}
                          </Radio.Button>
                          </Radio.Group>
                        )
                      )}
                    </div>
                  </Form.Item>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button type="primary" icon={<RiShoppingCartFill />}>
                Buy Now
              </Button>
              <AddToCartButton formValues={selectedOptions} loading={isSubmitting} />
              <button type="submit">Add To Cart</button>
            </div>
          </Form>
        
                
      </div>
          {/* Description */}
          <div>
            <h1 className="mt-6 text-lg font-medium">Description</h1>
            <p className="mt-2 text-base text-gray-500">{data.description}</p>
          </div>
      </div>
  );
}
