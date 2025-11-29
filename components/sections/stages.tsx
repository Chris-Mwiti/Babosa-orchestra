"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const stages = [
  {
    part: "Part 1",
    title: "Introduction & Foundations",
    chapters: [
      {
        num: 1,
        title: "What is an Orchestrator?",
        desc: "Why build from scratch? Understanding containers vs VMs, and core components.",
      },
    ],
    topics: ["Containers vs VMs", "Key Components", "Babosa Architecture", "Tools: Go & Docker"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    part: "Part 2",
    title: "Building the Worker",
    chapters: [
      { num: 4, title: "Babosa Worker", desc: "Tasks, Docker integration, queue management, and counting." },
      { num: 5, title: "Worker API", desc: "Routes, request handling, and API design patterns." },
      { num: 6, title: "Metrics Collection", desc: "Real-time monitoring from /proc, goprocinfo integration." },
    ],
    topics: ["Task Management", "Docker API", "Database Integration", "REST Endpoints", "System Metrics"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    part: "Part 3",
    title: "Building the Manager",
    chapters: [
      { num: 7, title: "Babosa Manager", desc: "Core manager components, worker selection, task distribution." },
      { num: 8, title: "Manager API", desc: "API routes, request/response handling, orchestration logic." },
      { num: 9, title: "Resilience & Failures", desc: "Recovery strategies, health checks, crash handling." },
    ],
    topics: ["Coordination", "Scheduling", "Failure Detection", "Health Checks", "Task Migration"],
    color: "from-teal-500 to-green-500",
  },
  {
    part: "Part 4",
    title: "Advanced Patterns",
    chapters: [
      { num: 10, title: "Sophisticated Scheduling", desc: "Round-robin vs E-PVM, resource-aware placement." },
      { num: 11, title: "Persistent Storage", desc: "Store interface, in-memory and persistent implementations." },
    ],
    topics: ["Scheduling Algorithms", "E-PVM Theory", "Data Persistence", "State Management"],
    color: "from-green-500 to-emerald-500",
  },
]

export default function Stages() {
  const [expandedPart, setExpandedPart] = useState<number | null>(0)

  return (
    <section id="stages" className="py-24 relative overflow-hidden bg-muted/30">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%230070F3' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Building Stages
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow the book's journey through four major parts, building your orchestrator step by step
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {stages.map((stage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <button onClick={() => setExpandedPart(expandedPart === idx ? null : idx)} className="w-full text-left">
                <div
                  className={`bg-gradient-to-r ${stage.color} bg-opacity-10 border border-cyan-400/20 rounded-lg p-6 hover:border-cyan-400/40 transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-cyan-400 mb-1">{stage.part}</div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                        {stage.title}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`transition-transform duration-300 text-cyan-400 ${expandedPart === idx ? "rotate-180" : ""}`}
                      size={24}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedPart === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {/* Chapters */}
                  {stage.chapters.map((ch, chIdx) => (
                    <motion.div
                      key={chIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: chIdx * 0.1 }}
                      className="bg-background border border-border/40 rounded-lg p-4 ml-4"
                    >
                      <h4 className="font-semibold text-cyan-400 text-lg mb-2">
                        Chapter {ch.num}: {ch.title}
                      </h4>
                      <p className="text-muted-foreground">{ch.desc}</p>
                    </motion.div>
                  ))}

                  {/* Topics */}
                  <div className="bg-background border border-border/40 rounded-lg p-4 ml-4">
                    <h4 className="font-semibold text-foreground mb-3">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
