import Carousel from '../components/Carousel'
import Product from '../components/Product'

export default function Home(){
  return(
    <>
       <Carousel />
       <Product path="" />
      <h2 className="text-2xl mt-3" >Tech</h2>
      <Product path="Tech" />
      <h2 className="text-2xl mt-3" >Grocery</h2>
      <Product path="Grocery" />
    </>
  )
}