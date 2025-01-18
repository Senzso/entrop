'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { TerminalIcon, X, Send, Mic, Loader2, Wallet } from 'lucide-react'
import { useChat } from 'ai/react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Keypair } from '@solana/web3.js'
import { getTokenProfile, getTokenOrders, getPairInfo } from '../utils/dexscreener'
import { checkTwitterUsername } from '@/utils/twitter'
import { BundlerPreview } from '@/components/bundler-preview'
import { OnChainActionsPreview } from '@/components/onchain-actions-preview'
import { VolumeBotPreview } from './volume-bot-preview'
import { PreviewModal } from './preview-modal'

const WELCOME_MESSAGE = `Welcome to Entropy AI Terminal!
Type !help for a list of available commands.`

const HELP_MESSAGE = `Available commands:
!token_profile [address] - Get token profile
!token_orders [chainId] [address] - Get token orders
!pair_info [chainId] [pairId] - Get pair information
!twitter_check [username] - Check Twitter username history
!gen_wallet - Generate a new SOL wallet
!connect - Connect Phantom wallet
!bundler - View token bundler interface
!onchainactions - View OnChain actions interface
!volumebot - View Anti-MEV Volume Bot interface
!help - Show this help message

For any other queries, just type your question and I'll assist you.`

interface TerminalProps {
  onClose: () => void
}

export default function Terminal({ onClose }: TerminalProps) {
  const { toast } = useToast()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showBundler, setShowBundler] = useState(false)
  const [showOnChain, setShowOnChain] = useState(false)
  const [showVolumeBot, setShowVolumeBot] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [{ role: 'assistant', content: WELCOME_MESSAGE }]
  })

  const connectPhantomWallet = useCallback(async () => {
    if (typeof window.solana !== 'undefined') {
      try {
        await window.solana.connect()
        const publicKey = window.solana.publicKey.toString()
        setIsWalletConnected(true)
        toast({
          title: "Wallet Connected",
          description: `Phantom wallet connected: ${publicKey}`,
        })
        return `Wallet connected successfully. Public key: ${publicKey}`
      } catch (err) {
        console.error('Failed to connect wallet:', err)
        toast({
          title: "Connection Failed",
          description: "Failed to connect Phantom wallet. Please try again.",
          variant: "destructive",
        })
        return 'Failed to connect Phantom wallet. Please try again.'
      }
    } else {
      toast({
        title: "Wallet Not Found",
        description: "Phantom wallet extension not found. Please install it and try again.",
        variant: "destructive",
      })
      return 'Phantom wallet extension not found. Please install it and try again.'
    }
  }, [toast])

  const handleCommand = useCallback(async (command: string) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ')
    
    switch (cmd) {
      case '!help':
        return HELP_MESSAGE
      case '!token_profile':
        if (args.length === 0) {
          return 'Please provide a token address'
        } else {
          const profile = await getTokenProfile(args[0])
          return profile
        }
      case '!token_orders':
        if (args.length < 2) {
          return 'Please provide chainId and token address'
        } else {
          const orders = await getTokenOrders(args[0], args[1])
          return orders
        }
      case '!pair_info':
        if (args.length < 2) {
          return 'Please provide chainId and pairId'
        } else {
          const pairInfo = await getPairInfo(args[0], args[1])
          return pairInfo
        }
      case '!twitter_check':
        if (args.length === 0) {
          return 'Please provide a Twitter username'
        } else {
          const twitterInfo = await checkTwitterUsername(args[0])
          return twitterInfo.formattedData || twitterInfo.error || 'No information found for this username.'
        }
      case '!gen_wallet':
        const newWallet = Keypair.generate()
        const publicKey = newWallet.publicKey.toString()
        const privateKey = Buffer.from(newWallet.secretKey).toString('hex')
        return `New wallet generated:
Public Key: ${publicKey}
Private Key: ${privateKey}
IMPORTANT: Save your private key securely. It will not be shown again.`
      case '!connect':
        if (isWalletConnected) {
          return `Wallet already connected. Public key: ${window.solana.publicKey.toString()}`
        } else {
          const result = await connectPhantomWallet()
          return result
        }
      case '!bundler':
        if (!isWalletConnected) {
          return 'Please connect your wallet first using !connect'
        }
        setShowBundler(true)
        return 'Opening Token Bundler interface...'
      case '!onchainactions':
        if (!isWalletConnected) {
          return 'Please connect your wallet first using !connect'
        }
        setShowOnChain(true)
        return 'Opening OnChain Actions interface...'
      case '!volumebot':
        if (!isWalletConnected) {
          return 'Please connect your wallet first using !connect'
        }
        setShowVolumeBot(true)
        return 'Opening Anti-MEV Volume Bot interface...'
      default:
        return null
    }
  }, [isWalletConnected, connectPhantomWallet, setShowBundler, setShowOnChain, setShowVolumeBot])

  const handleSend = useCallback(async (text: string) => {
    if (text.trim()) {
      const commandResponse = await handleCommand(text)
      if (commandResponse) {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'user', content: text },
          { role: 'assistant', content: commandResponse }
        ])
      } else {
        console.log('Sending request to OpenAI...');
        console.log('Messages:', messages);
        try {
          await handleSubmit(undefined as any, {
            options: {
              body: {
                messages: [
                  ...messages,
                  { role: 'user', content: text }
                ]
              }
            }
          })
          console.log('Response received from OpenAI');
        } catch (error) {
          console.error('Error in handleSubmit:', error)
          setMessages(prevMessages => [
            ...prevMessages,
            { role: 'user', content: text },
            { role: 'assistant', content: 'An error occurred while processing your request. Please try again.' }
          ])
        }
      }
      setInput('') // Reset the input field after sending
    }
  }, [handleCommand, setMessages, handleSubmit, messages, setInput])

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      handleSend(transcript)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      setIsRecording(false)
      toast({
        title: "Speech Recognition Error",
        description: "An error occurred while trying to recognize speech.",
        variant: "destructive",
      })
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current.start()
  }, [toast, handleSend])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isVisible) {
      const speech = new SpeechSynthesisUtterance(WELCOME_MESSAGE);
      speech.lang = 'en-GB';
      speech.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female') || null;
      window.speechSynthesis.speak(speech);
    }
  }, [isVisible]);

  return (
    <div className={`
      relative z-10 w-full max-w-3xl pointer-events-auto
      shadow-2xl transition-all duration-1000 ease-in-out overflow-hidden rounded-lg
      ${isMinimized ? 'h-16' : 'h-[80vh]'}
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="relative w-full h-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bc1c4eb282f3f00e950ab1b9945bd41e-2pF4BtFyk5tX21ISPVSSQB3nKWfIz1.gif"
              alt=""
              fill
              sizes="100vw"
              className="object-cover animate-scale"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Terminal Content */}
      <div className="relative flex flex-col h-full">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-5 h-5" />
            <span className="font-mono text-sm">ENTROPY_AI v1.0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={connectPhantomWallet}
              disabled={isWalletConnected}
              className="text-green-400 bg-black border-green-400/50 hover:bg-green-400/10 text-xs px-2 py-1"
            >
              <Wallet className="w-3 h-3 mr-1" />
              {isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:text-white/70 transition-colors"
              aria-label={isMinimized ? "Maximize terminal" : "Minimize terminal"}
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="hover:text-white/70 transition-colors"
              aria-label="Close terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Terminal Messages */}
        <div className={`
          flex-grow overflow-y-auto p-4 select-text
          transition-all duration-500
          ${isMinimized ? 'opacity-0' : 'opacity-100'}
        `}>
          {messages.map((message, i) => (
            <div
              key={i}
              className={`mb-4 font-mono text-sm ${
                message.role === 'user' ? 'text-green-400' : 'text-white/90'
              }`}
            >
              <span className="opacity-50">{message.role === 'user' ? '>' : '#'}</span> {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className={`
          p-6 border-t border-white/10 bg-black/50
          transition-all duration-500
          ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <div className="flex items-center gap-2 relative">
            <span className="text-green-400 font-mono absolute left-2 top-4">{'>'}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsInputExpanded(true)}
              onBlur={() => setIsInputExpanded(false)}
              placeholder="Enter your command..."
              className={`w-full bg-transparent border-none outline-none font-mono text-sm text-white/90 placeholder:text-white/30 pl-6 transition-all duration-300 ${
                isInputExpanded ? 'h-32 py-3' : 'h-16 py-2'
              }`}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-4">
              <Send className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={`absolute right-12 top-4 ${isRecording ? 'text-red-500' : 'text-white/70'}`}
            >
              {isRecording ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>

      <PreviewModal isOpen={showBundler} onClose={() => setShowBundler(false)}>
        <BundlerPreview />
      </PreviewModal>
      <PreviewModal isOpen={showOnChain} onClose={() => setShowOnChain(false)}>
        <OnChainActionsPreview />
      </PreviewModal>
      <PreviewModal isOpen={showVolumeBot} onClose={() => setShowVolumeBot(false)}>
        <VolumeBotPreview />
      </PreviewModal>
    </div>
  )
}

