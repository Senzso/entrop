'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function PreviewModal({ isOpen, onClose, children }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[70vh] overflow-y-auto bg-black border border-gray-700 rounded-lg"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 z-50 bg-gray-800 hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-300" />
            </Button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

