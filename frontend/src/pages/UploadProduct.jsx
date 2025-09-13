import {Input, Form, Select, Upload, Switch, Button, InputNumber} from 'antd'
import {useState, useEffect} from 'react'
import useFetchWithAuth from '../hooks/useFetchWithAuth'
const BASE_URL = import.meta.env.VITE_BASE_URL

export default function UploadProduct(){
  const [resOptionsData, setResOptionsData] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  
  
  useEffect(()=>{
    const fetchData = async () =>{
      try{
    const res = await useFetchWithAuth(`${BASE_URL}/api/attributes/`,{
    method:'GET'
  })
    const categoryRes = await useFetchWithAuth(`${BASE_URL}/api/category/all/`, {
      method: 'GET'
    })
    const resItemsData = await res.json()
    const categoryResData = await categoryRes.json()

    // Refined Attributes & Available Options
    const optionsItems = resItemsData.map((item)=>({
    value: item.id,
    label: `${item.attribute}: ${item.value}`
  }))
        
    // Refined Available Category
    const categoryRefined = categoryResData.map((item)=>({
      value: item.name,
      label: item.name
    }))
      
    setResOptionsData(optionsItems)
    setCategoryData(categoryRefined)
      } catch (err){
      console.error('Something went wrong!')
      }
    }
    
  fetchData();
  }, [])


  // Handle Finish
  const handleFinish = async (value) =>{
    try{
      const formData = new FormData()
      formData.append('category', value.category)
      formData.append('name', value.title)
      formData.append('image', value.upload[0].originFileObj)
      formData.append('slug', value.slug)
      formData.append('description', value.description)
      formData.append('free_delivary', value.free_delivary ? 'true': 'false')
      formData.append('price', value.price)

      value.options.forEach((opt) => {
        formData.append("attributes_id", parseInt(opt, 10));
      });
      
      await useFetchWithAuth(`${BASE_URL}/api/`, {
        method: 'POST',
        body: formData,
      }, true)
    } catch (err){
      console.error(err)
    }
  }
  
  return (
    <>
      <Form onFinish={handleFinish}>

        <Form.Item name="title" label="Title" rules={[{required: true, message:"This can't be empty!"}]}>
          <Input placeholder="Product's Title" />
        </Form.Item>

        <Form.Item name="options" label="Options" rules={[{required:true, message:'Select at least one Options!'}]}>
          <Select mode="multiple" style={{ flex: 1 }} placeholder="Select Options" options={resOptionsData} optionFilterProp="label" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{required:true, message:'Select a Category!'}]}>
          <Select style={{ flex: 1 }} placeholder="Select Category" options={categoryData} />
        </Form.Item>

        <Form.Item name="slug" label="Slug" rules={[{required:true, message:"This can't be empty"}]}>
          <Input placeholder="Slug" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{required:true, message:"This can't be empty"}]}>
          <Input.TextArea placeholder="Your product's details"/>
        </Form.Item>

        <Form.Item name="upload" label="Upload" getValueFromEvent={(e) => e && e.fileList} rules={[{required:true, message:"This can't be empty"}]}>
          <Upload listType="picture-card" beforeUpload={()=> false} maxCount={1}>Upload</Upload>
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{required:true, message:"This can't be empty"}]}>
          <InputNumber />
        </Form.Item>

        <Form.Item name="free_delivery" label="Free Delivery" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Button type="primary" htmlType="submit">Submit</Button>
        
      </Form>
    </>
  )
}