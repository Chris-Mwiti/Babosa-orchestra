"use client"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const quickFacts = [
  { label: "Status", value: "Complete ✓" },
  { label: "Chapters", value: "11" },
  { label: "Focus", value: "Go + Docker" },
  { label: "Architecture", value: "Advanced" },
]

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%230070F3' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/0 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span className="block text-white mb-2">Babosa</span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Container Orchestration System
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          A container orchestrator built from scratch in Go. This project showcases the journey of building Babosa
          through all stages—from foundational concepts to advanced scheduling and persistent storage.
        </motion.p>

        {/* Achievement Badge */}
        <motion.div variants={itemVariants} className="mb-12">
          <p className="text-cyan-400 font-semibold text-lg mb-2">Built with "Build an Orchestrator in Go"</p>
          <p className="text-muted-foreground">By Tim Boring • Manning Publications</p>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-lg p-6 text-center hover:border-cyan-400/40 transition-colors"
            >
              <p className="text-3xl font-bold text-cyan-400 mb-2">{fact.value}</p>
              <p className="text-sm text-muted-foreground">{fact.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
          >
            View on GitHub
          </a>
          <button
            onClick={() => {
              document.querySelector("#stages")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="px-8 py-3 border border-cyan-400/40 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400/10 transition-colors"
          >
            See What I Built
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
