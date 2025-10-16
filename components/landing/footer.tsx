'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative bg-black text-gray-300 py-16 px-4 border-t border-purple-900/30">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-light text-white">Rêve</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Cross the bridge between the life you&apos;re living and the universe you&apos;re meant to create.
              Your transformation begins tonight.
            </p>
            <p className="text-sm text-gray-500">
              Built with evidence-based practices from Stanford, Harvard, UCLA, and the American
              Academy of Sleep Medicine.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/science" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Science & Research
                </Link>
              </li>
              <li>
                <Link href="/subconscious-ai" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Subconscious AI
                </Link>
              </li>
              <li>
                <Link href="/landing#guides" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/landing" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Research</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4120639/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  IRT Meta-Analysis
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8935176/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Journaling Studies
                </a>
              </li>
              <li>
                <Link href="/science" className="text-gray-400 hover:text-purple-400 transition-colors">
                  All Citations
                </Link>
              </li>
              <li>
                <Link href="/science" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Research Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Rêve. All rights reserved. Built with ✨ for exploring the subconscious.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
