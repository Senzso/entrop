'use client'

import { useState, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Info, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VolumeBotPreview() {
  const [volumeBotState, setVolumeBotState] = useState({
    token: '',
    amount: '',
    privateKey: '',
    address: '',
    solBalance: '',
    tokenBalance: '',
    selectedDex: 'pump',
    jitoMevTip: 'ultra',
    isRandomAmount: false
  })

  const updateVolumeBotState = useCallback((updates: Partial<typeof volumeBotState>) => {
    setVolumeBotState(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <Card className="w-full max-w-6xl mx-auto bg-black/90 border border-purple-500/30 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-mono text-gray-200">Anti-MEV Volume Bot</h2>
        <p className="text-xs text-gray-300/70 mt-1">
          Complete buy and sell within the same block, increasing trading volume without additional losses.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4 opacity-50 pointer-events-none">
          <div className="flex gap-2">
            <div className="flex-grow">
              <label className="text-xs font-medium text-gray-200">Select Token</label>
              <Select onChange={(e) => updateVolumeBotState({ token: e.target.value })}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select token to brush volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">Select Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-200">Amount (SOL)</label>
              <Input 
                disabled
                placeholder="0.00"
                className="bg-gray-800 border-gray-700 text-gray-200"
                value={volumeBotState.amount}
                onChange={(e) => updateVolumeBotState({ amount: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-grow">
              <label className="text-xs font-medium text-gray-200">Private Key</label>
              <div className="flex gap-2">
                <Input 
                  disabled
                  className="bg-gray-800 border-gray-700 text-gray-200"
                  placeholder="Enter Private Key"
                  value={volumeBotState.privateKey}
                  onChange={(e) => updateVolumeBotState({ privateKey: e.target.value })}
                />
                <Button variant="outline" size="sm" className="whitespace-nowrap bg-gray-800 border-gray-700 text-gray-200">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-200">Address</label>
              <Input 
                disabled
                className="bg-gray-800 border-gray-700 text-gray-200"
                value={volumeBotState.address}
                onChange={(e) => updateVolumeBotState({ address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-xs font-medium text-gray-200">SOL Balance</label>
              <Input 
                disabled
                className="bg-gray-800 border-gray-700 text-gray-200"
                value={volumeBotState.solBalance}
                onChange={(e) => updateVolumeBotState({ solBalance: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-200">TOKEN Balance</label>
              <Input 
                disabled
                className="bg-gray-800 border-gray-700 text-gray-200"
                value={volumeBotState.tokenBalance}
                onChange={(e) => updateVolumeBotState({ tokenBalance: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-200">DEX Selection</label>
            <div className="flex gap-2 mt-1">
              {["Raydium", "Pump", "MoonShot", "Orca"].map((dex, index) => (
                <Button 
                  key={dex}
                  variant="outline" 
                  size="sm"
                  disabled 
                  className={index === 1 ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-800 border-gray-700 text-gray-200"}
                  onClick={() => updateVolumeBotState({ selectedDex: dex.toLowerCase() })}
                >
                  {dex}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-200">Jito MEV Tip</label>
            <div className="flex gap-2 mt-1">
              {[
                { value: "0", label: "0" },
                { value: "default", label: "Default 0.00003" },
                { value: "high", label: "High 0.0001" },
                { value: "ultra", label: "Ultra-High 0.0003" },
                { value: "max", label: "0.001" }
              ].map((option) => (
                <Button 
                  key={option.value}
                  variant="outline" 
                  size="sm"
                  disabled 
                  className={option.value === volumeBotState.jitoMevTip ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-800 border-gray-700 text-gray-200"}
                  onClick={() => updateVolumeBotState({ jitoMevTip: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 opacity-50 pointer-events-none">
          <div className="space-y-2">
            <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-200">Estimated Loss Cost</label>
                <p className="text-sm text-gray-300">-</p>
              </div>
            </div>
            <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-200">Estimated Service Fee</label>
                <p className="text-sm text-gray-300">0.005 SOL</p>
              </div>
            </div>
            <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-200">Estimated Volume</label>
                <p className="text-sm text-gray-300">0 SOL ≈ $0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-200">Random Amount</label>
            <Switch id="random-mode" disabled checked={volumeBotState.isRandomAmount} onChange={(e) => updateVolumeBotState({ isRandomAmount: e.target.checked })} />
          </div>

          <Button disabled className="w-full bg-gray-700 text-gray-200 hover:bg-gray-700/30 border border-gray-600">
            Start Volume Brushing
          </Button>

          <div className="text-center text-xs text-gray-300/70">
            Lowest service fee: 0.005 SOL per brush
          </div>

          <Card className="bg-purple-500/5 border-purple-500/20">
            <div className="p-2 flex items-center justify-between border-b border-purple-500/20">
              <h3 className="text-xs font-medium text-gray-200">Volume Brushing Log</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">Brushed: 0 times</span>
                <Button variant="outline" size="sm" disabled className="text-xs text-green-400 border-green-500/30">
                  Refresh
                </Button>
              </div>
            </div>
            <div className="p-4 text-center text-gray-300/70 text-xs">
              No Records
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-2 text-yellow-200/90 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 mt-0.5" />
        <div className="text-xs">
          Cannot access volume bot features. Please hold a minimum of 5M ENT tokens for at least 24 hours to unlock this functionality.
        </div>
      </div>
    </Card>
  )
}

