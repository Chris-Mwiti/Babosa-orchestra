"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"

const discoveries = [
  {
    title: "Containers vs VMs",
    description:
      "Containers share the host OS kernel, making them lightweight, faster to start, and more efficient than virtual machines.",
    icon: "🐳",
  },
  {
    title: "Orchestrator Architecture",
    description:
      "A manager acts as the central coordinator, the scheduler decides placement, and workers execute tasks on machines.",
    icon: "⚙️",
  },
  {
    title: "Task State Management",
    description:
      "Tasks transition through states (Pending, Running, Failed). Docker API integration handles container lifecycle management.",
    icon: "🔄",
  },
  {
    title: "Real-Time Metrics",
    description:
      "Monitoring CPU and memory from /proc filesystems gives visibility into resource consumption and system health.",
    icon: "📊",
  },
  {
    title: "Resiliency Patterns",
    description:
      "Health checks, automated restarts, and task migration strategies prevent cascading failures and ensure uptime.",
    icon: "🛡️",
  },
  {
    title: "Smart Scheduling",
    description:
      "Round-robin scheduling is simple but E-PVM (Eigenvector Processor Value Method) enables resource-aware, optimal placement.",
    icon: "🎯",
  },
  {
    title: "Persistence Matters",
    description:
      "Abstracting storage via interfaces allows switching between in-memory and persistent stores for task state durability.",
    icon: "💾",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  hover: { y: -8, transition: { duration: 0.3 } },
}

export default function Discoveries() {
  return (
    <section id="discoveries" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%230070F3' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full mb-4">
            <Lightbulb size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Key Insights</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Key Discoveries</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Essential learnings from building Babosa that apply to any orchestration system
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {discoveries.map((discovery, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all"
            >
              <div className="text-4xl mb-4">{discovery.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{discovery.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{discovery.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
