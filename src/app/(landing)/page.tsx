import About from '@/components/common/landing/About/About'
import { Contacts } from '@/components/common/landing/Contacts/Contacts'
import { FAQ } from '@/components/common/landing/FAQ/FAQ'
import Hero from '@/components/common/landing/Hero/Hero'
import Mechanisms from '@/components/common/landing/Mechanisms/Mechanisms'
import Problems from '@/components/common/landing/Problems/Problems'
import Results from '@/components/common/landing/Results/Results'
import { Footer } from '@/components/features/landing/Footer/Footer'

export default function Page() {
  return (
    <>
      <Hero />
      <Problems />
      <Mechanisms />
      <Results />
      <About />
      <FAQ />
      <Contacts />
      <Footer />
    </>
  )
}
