import Product from '../components/Product'
import { useParams } from 'react-router-dom'

export default function Category() {
  const { categoryPath } = useParams();
  return(
    <>
      <h2 className="text-xl font-bold">{categoryPath}</h2>
      <Product path={categoryPath} />
    </>
  )
}