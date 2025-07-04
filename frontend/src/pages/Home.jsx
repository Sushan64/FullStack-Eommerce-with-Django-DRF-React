import Navbar from '../components/Navbar'
import Courosel from '../components/Courosel'
import Product from '../components/Product'

export default function Home(){
  return(
    <div className="md:grid md:grid-cols-[auto_1fr] bg-white dark:bg-slate-950 text-white">
    <Navbar />
      <main className="pt-20 md:pt-10 md:px-16 px-4 min-h-screen h-auto transition-all duration-300 ease-in-out">
       <Courosel />
        <Product />
      </main>
    </div>
  )
}