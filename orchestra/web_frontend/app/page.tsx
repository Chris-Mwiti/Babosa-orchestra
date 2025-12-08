"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/sections/hero"
import Stages from "@/components/sections/stages"
import Discoveries from "@/components/sections/discoveries"
import Challenges from "@/components/sections/challenges"
import FAQ from "@/components/sections/faq"
import Footer from "@/components/footer"

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="bg-background text-foreground min-h-screen dark">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <Stages />
      <Discoveries />
      <Challenges />
      <FAQ />
      <Footer />
    </div>
  )
}
