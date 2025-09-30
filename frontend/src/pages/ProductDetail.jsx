import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import useApi from '../components/Api';
import { Image, Form, Button, Rate, Select, message, Radio } from 'antd';
import { RiShoppingCartFill, RiAddFill } from '@remixicon/react';
import useCart from '../hooks/useCart'
import AddToCartButton from '../components/AddToCartButton'
import Review from '../components/Review'
import OtherReview from '../components/OtherReview'

export default function ProductDetail({ path = "404" }) {
  const { data, loading, error } = useApi(path);
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ messageApi, contextHolder ] = message.useMessage();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access_token')

  const handleFinish = async (formValues) => {
    setIsSubmitting(true);

    if (!token){
      navigate(`/login?next=${location.pathname}`)
      return;
    }
    
    message.loading({ content: 'Adding...', key: 'cart_add' });

    const dataToSend = {
      'product_id': data[0].id,
      'quantity': quantity,
      'attributes': formValues,
    }
    try {
      const result = await addToCart(dataToSend)
      if (result.success) {
        messageApi.open({
          type: 'success',
          content: 'Item Added To Cart',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: `Failed to Add: ${result.error || 'Unknown error'}`
        });
      }
    } catch (err) {
      
      messageApi.open({
        type: 'error',
        content: `Failed to Add: ${err.message}`
      });
    }

    setIsSubmitting(false);
  };

  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/`
  
  useEffect(() => {
    if (data?.attributes) {
      let initial = {}
      for (const key in data.attributes) {
        initial[key] = '';
      }
      form.setFieldsValue(initial);
    }
  }, [data, form])
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!loading && !data) return <p>Nothing..</p>;

  return (
    <>
    <div className="rounded-2xl shadow-md inset-shadow-sm p-6 md:p-8 lg:p-12">
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* 1. Image Gallery */}
        <div className="flex flex-col gap-4">
          <Image className="rounded-md" src={data[0].image} preview={data[0].image}/>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{data[0].name}</h1>

          {/* Price & Rating */}
          <div className="mt-3 flex items-baseline gap-4">
            <p className="text-3xl font-bold text-indigo-600">रु.{data[0].price}</p>
            <p className="text-xl text-gray-400 line-through">$24.99</p>
          </div>

          {/* Rate */}
          <div className="mt-8 space-y-6">
            <div>
              <Rate disabled value={3} count={5} />
            </div>
          </div>
        </div>

        {/* Options Selection */}
        <Form form={form} className="md:col-span-2" onFinish={handleFinish}>
          <div className="md:grid grid-cols-4 gap-4">
            {data[0].attributes && Object.entries(data[0].attributes).map(([attributeName, values]) => (
              <div key={attributeName} className="md:w-full flex flex-col gap-1 mb-4">
                <h3 className="text-sm font-medium dark:text-gray-200"> {attributeName}</h3>
                <div className="mt-2 ">
                  
                <Form.Item initialValue={values[0]} name={attributeName} rules={[{ required: true, message: `Please select a ${attributeName}!` }]}>
                  
            <Select options={values.map((valueItem) => ({
                value: valueItem,
                label: valueItem.startsWith("#") ? 
                  (<div className="flex items-center gap-2"><span className="w-4 h-4 inline-block rounded-full" style={{
                      backgroundColor: valueItem}}/>{valueItem}</div>) : (valueItem)}))} />

              
                </Form.Item>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button type="primary" icon={<RiShoppingCartFill />}>
              Buy Now
            </Button>
            <AddToCartButton loading={isSubmitting} />
          </div>
        </Form>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h1 className="mt-6 text-lg font-medium">Description</h1>
        <p className="mt-2 text-base text-gray-500">{data[0].description}</p>
      </div>
    </div>

      {/* Reviews of Others */}
      <div className="mt-4 rounded-2xl shadow-md inset-shadow-sm p-6 md:p-8 lg:p-12">
        {data[0].product_review.map((review)=>(
      <OtherReview review={review} />
      ))}
      </div>
      
      <div className="mt-4 rounded-2xl shadow-md inset-shadow-sm p-6 md:p-8 lg:p-12">
        <h1 className="text-xl mb-3">Write Your Review</h1>
      {/* Review Add */}
        <Review path={path} product_id={data[0].id} />
        </div>
    </>
  );
}