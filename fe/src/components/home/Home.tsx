import { Header } from './header/Header'
import { Hero } from './hero/Hero'
import { Stats } from './stats/Stats'
import { FeaturedCards } from './featuredCards/FeaturedCards'
import { Testimonies } from './testimonies/Testimonies'
import { ReqAccessForm } from './reqAccessForm/ReqAccessForm'
import { Footer } from './footer/Footer'

export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <FeaturedCards />
      <Testimonies />
      <ReqAccessForm />
      <Footer />
    </>
  )
}
