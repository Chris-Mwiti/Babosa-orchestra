"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "Why build a container orchestrator from scratch?",
    answer:
      "Building from scratch teaches you the internals of container orchestration, design decisions, and trade-offs. This knowledge is invaluable for understanding systems like Kubernetes and making informed decisions in production environments. It's educational and showcases deep architectural understanding.",
  },
  {
    question: "What's the difference between containers and virtual machines?",
    answer:
      "Containers share the host OS kernel and isolated filesystems, making them lightweight (~50MB) and fast to start (~100ms). VMs emulate hardware entirely, requiring full OS boot times (~minutes) but providing stronger isolation. Containers are more efficient but less isolated.",
  },
  {
    question: "What tools and languages are used in Babosa?",
    answer:
      "Babosa uses Go for implementation, Docker for container management, and goprocinfo for system metrics. Go is chosen for its simplicity, performance, and built-in concurrency primitives. Docker provides a standard container interface, and /proc files offer system insights.",
  },
  {
    question: "How does the scheduler work in Babosa?",
    answer:
      "Babosa starts with simple round-robin scheduling, distributing tasks evenly across workers. Later chapters introduce E-PVM (Eigenvector Processor Value Method), a more sophisticated algorithm that considers resource availability and worker state for optimal placement.",
  },
  {
    question: "How does Babosa handle common failures?",
    answer:
      "Babosa uses health checks to detect failed tasks, managers monitor worker health, and failed tasks are restarted or migrated. The book covers strategies like task updates, recovery from Docker crashes, machine restarts, and cascading failure prevention.",
  },
  {
    question: "Is high availability or load balancing covered?",
    answer:
      "No, the book explicitly excludes distributed topics like HA, consensus protocols, load balancing, service discovery, and multi-manager setups. It focuses on single-manager orchestration to keep the scope manageable.",
  },
  {
    question: "What hardware do I need to build Babosa?",
    answer:
      "Basic machines (minimal CPU/RAM) suffice for learning. The book discusses hardware considerations like CPU core limits, memory constraints, and I/O limitations. You can run Babosa on a laptop or small cloud instances.",
  },
  {
    question: "Can I extend Babosa with new features?",
    answer:
      "Babosa provides a solid foundation. You can add features like service discovery, persistent volumes, multi-manager support, advanced networking, or custom schedulers post-book. The modular design makes extensions straightforward.",
  },
  {
    question: "How long does it take to complete the book?",
    answer:
      "Estimated 20-40 hours depending on your Go experience and depth of understanding desired. Each part builds progressively, and hands-on implementation is encouraged. Readers often work through chapters over several weeks.",
  },
  {
    question: "Where can I get the book?",
    answer:
      "The book is published by Manning Publications and available on their website, Amazon, and other major book retailers. Check manning.com or your favorite bookseller for availability and pricing.",
  },
]

export default function FAQ() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%230070F3' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full mb-4">
            <HelpCircle size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Questions</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about the Babosa journey
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.6 }}
              viewport={{ once: true }}
            >
              <button onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)} className="w-full text-left">
                <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-400/20 rounded-lg p-6 hover:border-cyan-400/40 transition-all flex items-center justify-between group">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-cyan-400 transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`transition-transform duration-300 text-cyan-400 flex-shrink-0 ${
                      expandedIdx === idx ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </div>
              </button>

              {expandedIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background border border-border/40 border-t-0 rounded-b-lg p-6"
                >
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Didn't find your answer?</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-400 font-semibold hover:border-cyan-400/60 transition-all"
          >
            Check the GitHub Repository
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
