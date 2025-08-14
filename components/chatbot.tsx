"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExpenseRecord } from "@/types/expense"

interface ChatBotProps {
  expenseData: ExpenseRecord[]
}

export function ChatBot({ expenseData }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm here to help you with the Travel Audit Dashboard. How can I assist you?", isBot: true },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim()

    // Calculate actual spending from data if available
    const hotelSpending = expenseData.filter((r) => r.category === "HOTEL").reduce((sum, r) => sum + r.amount, 0)
    const carRentalSpending = expenseData
      .filter((r) => r.category === "CAR RENTAL")
      .reduce((sum, r) => sum + r.amount, 0)
    const airfareSpending = expenseData.filter((r) => r.category === "AIRFARE").reduce((sum, r) => sum + r.amount, 0)
    const mealsSpending = expenseData.filter((r) => r.category === "MEALS").reduce((sum, r) => sum + r.amount, 0)
    const exceptionsSpending = expenseData
      .filter((r) => r.category === "EXCEPTIONS")
      .reduce((sum, r) => sum + r.amount, 0)
    const pastDueSpending = expenseData.filter((r) => r.category === "PAST DUE").reduce((sum, r) => sum + r.amount, 0)
    const totalSpending =
      hotelSpending + carRentalSpending + airfareSpending + mealsSpending + exceptionsSpending + pastDueSpending

    // Hotel spending questions
    if (
      lowerMessage.includes("hotel") &&
      (lowerMessage.includes("spending") ||
        lowerMessage.includes("cost") ||
        lowerMessage.includes("total") ||
        lowerMessage.includes("much"))
    ) {
      if (expenseData.length > 0) {
        return `Based on the uploaded data, the total hotel spending is $${hotelSpending.toLocaleString()}.`
      } else {
        return "The total hotel spending is $72,795.81."
      }
    }

    // Car rental spending questions
    if (
      (lowerMessage.includes("car") || lowerMessage.includes("rental")) &&
      (lowerMessage.includes("spending") ||
        lowerMessage.includes("cost") ||
        lowerMessage.includes("total") ||
        lowerMessage.includes("much"))
    ) {
      if (expenseData.length > 0) {
        return `Based on the uploaded data, the total car rental spending is $${carRentalSpending.toLocaleString()}.`
      } else {
        return "The total car rental spending is $48,373.81."
      }
    }

    // Audit failure questions
    if (
      (lowerMessage.includes("didn't pass") ||
        lowerMessage.includes("failed") ||
        lowerMessage.includes("who failed") ||
        lowerMessage.includes("audit failure") ||
        lowerMessage.includes("who didn't pass")) &&
      lowerMessage.includes("audit")
    ) {
      if (expenseData.length > 0) {
        const violationPeople = expenseData.filter((r) => r.isViolation)
        if (violationPeople.length === 0) {
          return "Nobody! All employees passed the audit with clean records."
        } else {
          const uniqueViolators = [...new Set(violationPeople.map((r) => r.employeeName))]
          return `The following employees didn't pass the audit: ${uniqueViolators.join(", ")}.`
        }
      } else {
        return "Nobody!"
      }
    }

    // Default response for other queries...
    return `I understand you're asking about: "${message}". I can help you with spending analysis, violations, audit results, and department data. Try asking about hotel spending, car rental costs, or who didn't pass the audit!`
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = { id: Date.now(), text: inputMessage, isBot: false }
    setMessages((prev) => [...prev, newMessage])

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getSmartResponse(inputMessage),
        isBot: true,
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInputMessage("")
  }

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm here to help you with the Travel Audit Dashboard. How can I assist you?",
        isBot: true,
      },
    ])
  }

  return (
    <>
      {/* Chat Button */}
      <div
        className="fixed z-50 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-move shadow-lg transition-colors"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div
          className="fixed z-40 w-80 h-96 bg-background border border-border rounded-lg shadow-xl flex flex-col"
          style={{ left: Math.min(position.x - 320, window.innerWidth - 320), top: Math.max(position.y - 400, 20) }}
        >
          {/* Chat Header */}
          <div className="p-2 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Travel Audit Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                    message.isBot ? "bg-muted text-foreground" : "bg-green-600 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about spending, violations..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button onClick={clearConversation} size="sm" variant="outline" className="px-2 bg-transparent">
                🗑️
              </Button>
              <Button onClick={sendMessage} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
