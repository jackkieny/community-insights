import { Header } from './header/Header'
import { Hero } from './hero/Hero'
import { Stats } from './stats/Stats'
import { Footer } from './footer/Footer'

export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Footer />
    </>
  )
}
