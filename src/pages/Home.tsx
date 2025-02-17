import React from 'react'
import { FeaturesSection } from '../components/ui/FeaturesSection'
import {FlipWords} from "../components/ui/FlipWords"
import  {Cover} from "../components/ui/Cover"
import ExtraInfo from '../components/ui/ExtraInfo'


function Home() {
  return (
    <div>
        <FlipWords />
        <Cover />
        <FeaturesSection />
        <ExtraInfo />
    </div>
  )
}

export default Home