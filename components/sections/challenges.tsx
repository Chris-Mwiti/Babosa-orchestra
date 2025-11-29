"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AlertCircle, ChevronRight } from "lucide-react"

const challenges = [
  {
    category: "Application Failures",
    items: [
      {
        title: "Bugs & Crashes",
        problem: "Application code bugs cause unexpected crashes and task failures.",
        solution: "Implement health checks and automatic restarts to recover failed tasks.",
        impact: "High",
      },
      {
        title: "Startup Issues",
        problem: "Tasks may fail to start due to resource constraints or configuration errors.",
        solution: "Add validation, retry logic, and detailed error logging.",
        impact: "Medium",
      },
    ],
  },
  {
    category: "Environmental Issues",
    items: [
      {
        title: "Resource Exhaustion",
        problem: "CPU, memory, or disk space depletion causes task eviction or slowdowns.",
        solution: "Monitor metrics, implement resource limits, and use intelligent scheduling.",
        impact: "Critical",
      },
      {
        title: "Docker Daemon Crashes",
        problem: "If the Docker daemon dies, all containers on that worker are lost.",
        solution: "Implement daemon health checks and automatic recovery with task migration.",
        impact: "High",
      },
      {
        title: "Machine Restarts",
        problem: "Power failures or OS restarts stop all running tasks.",
        solution: "Persist task state and reassign tasks to other healthy workers.",
        impact: "Critical",
      },
    ],
  },
  {
    category: "Manager & Worker Failures",
    items: [
      {
        title: "Worker Node Failures",
        problem: "A worker becomes unavailable, leaving its tasks orphaned.",
        solution: "Manager detects unhealthy workers, migrates tasks to healthy nodes.",
        impact: "High",
      },
      {
        title: "Manager Failures",
        problem: "If the manager crashes, no new tasks can be scheduled or updated.",
        solution: "Implement manager redundancy and state persistence (high availability).",
        impact: "Critical",
      },
      {
        title: "Split-Brain Scenarios",
        problem: "Network partitions cause conflicting decisions between components.",
        solution: "Use consensus protocols and quorum-based decisions.",
        impact: "High",
      },
    ],
  },
]

export default function Challenges() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0)

  return (
    <section id="challenges" className="py-24 relative overflow-hidden bg-muted/30">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230070F3' fillOpacity='0.1' fillRule='evenodd'%3E%3Cg fill='%230070F3' fillOpacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-400/30 rounded-full mb-4">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-sm font-semibold text-red-400">Watch Out</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Challenges & Solutions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Common pitfalls when building orchestrators and strategies to overcome them
          </p>
        </motion.div>

        {/* Challenges Accordion */}
        <div className="space-y-4">
          {challenges.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
                className="w-full text-left"
              >
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/20 rounded-lg p-6 hover:border-red-400/40 transition-all flex items-center justify-between group">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-red-400 transition-colors">
                      {category.category}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {category.items.length} challenge{category.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight
                    className={`transition-transform duration-300 text-red-400 flex-shrink-0 ${
                      expandedCategory === catIdx ? "rotate-90" : ""
                    }`}
                    size={24}
                  />
                </div>
              </button>

              {expandedCategory === catIdx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {category.items.map((item, itemIdx) => (
                    <motion.div
                      key={itemIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIdx * 0.1 }}
                      className="bg-background border border-border/40 rounded-lg p-6 ml-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-red-400">{item.title}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.impact === "Critical"
                              ? "bg-red-500/20 text-red-400"
                              : item.impact === "High"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {item.impact}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <p className="font-semibold text-foreground mb-1">Problem:</p>
                          <p>{item.problem}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Solution:</p>
                          <p className="text-cyan-400">{item.solution}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
