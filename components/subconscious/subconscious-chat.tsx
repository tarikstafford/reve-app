'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Message } from '@/lib/db/types'
import { Send, Loader2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export function SubconsciousChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dreamCount, setDreamCount] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkDreamCount()
    if (isUnlocked) {
      loadMessages()
    }
  }, [isUnlocked])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkDreamCount = async () => {
    try {
      const response = await fetch('/api/dreams/count')
      const data = await response.json()
      if (data.success) {
        setDreamCount(data.count)
        setIsUnlocked(data.count >= 10)
      }
    } catch (error) {
      console.error('Error checking dream count:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/subconscious/messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message immediately
    const tempUserMessage: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: 'temp',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/subconscious/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center space-y-6 bg-white/80 backdrop-blur">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-20 h-20 text-purple-400 mx-auto" />
          </motion.div>
          <div className="space-y-3">
            <h3 className="text-2xl font-light text-gray-800">
              Connect with Your Subconscious
            </h3>
            <p className="text-gray-600">
              This feature unlocks after logging 10 dreams
            </p>
            <div className="pt-4">
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(dreamCount / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {dreamCount} / 10 dreams logged
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur overflow-hidden">
        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  Start a conversation with your subconscious mind
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-6 py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask your subconscious anything..."
                className="resize-none border-purple-200 focus:border-purple-400"
                rows={2}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
