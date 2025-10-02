import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'

export default function Product(){
  const { slug } = useParams();
  return(
    <>
      <ProductDetail path={`product/${slug}`} />
    </>
  )
}