'use client'

import { useState, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Plus } from 'lucide-react'

export function BundlerPreview() {
  const [bundlerState, setBundlerState] = useState({
    token: '',
    privateKey: '',
    address: '',
    solBalance: '',
    tokenBalance: '',
    buyAmount: '',
    selectedDex: 'pump',
    buyAddressCount: 4,
    jitoMevTip: 'high'
  })

  const updateBundlerState = useCallback((updates: Partial<typeof bundlerState>) => {
    setBundlerState(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <Card className="w-full max-w-5xl mx-auto bg-black border border-green-500/30 p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-mono text-green-400">Pump New Address Buy (↑Makers)</h2>
        <p className="text-sm text-white/70">
          Automatically create new wallet addresses, complete the buy transaction, transfer to the main wallet, and close the account. 
          Boost the number of independent wallet purchases of designated tokens at a very low cost.
        </p>
      </div>

      <div className="space-y-6 opacity-50 pointer-events-none">
        <div>
          <label className="text-sm font-medium text-white">Select Token</label>
          <Select disabled>
            <SelectTrigger className="w-full bg-black border-green-500/30 text-white">
              <SelectValue placeholder="Please select a token or enter the token address" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Select Token</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-4">
            <label className="text-sm font-medium text-white">Private Key</label>
            <div className="flex gap-2">
              <Input 
                disabled
                placeholder="Enter Private Key"
                className="bg-black border-green-500/30 text-white text-sm"
                value={bundlerState.privateKey}
                onChange={(e) => updateBundlerState({ privateKey: e.target.value })}
              />
              <Button variant="outline" size="sm" className="whitespace-nowrap bg-black border-green-500/30 text-green-400 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add Wallet(s)
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white">Address</label>
            <Input 
              disabled
              className="bg-black border-green-500/30 text-white text-sm"
              value={bundlerState.address}
              onChange={(e) => updateBundlerState({ address: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">SOL Balance</label>
            <Input 
              disabled
              className="bg-black border-green-500/30 text-white text-sm"
              value={bundlerState.solBalance}
              onChange={(e) => updateBundlerState({ solBalance: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">TOKEN Balance</label>
            <Input 
              disabled
              className="bg-black border-green-500/30 text-white text-sm"
              value={bundlerState.tokenBalance}
              onChange={(e) => updateBundlerState({ tokenBalance: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white">DEX Selection</label>
          <div className="flex gap-1 mt-1">
            {[
              { value: "raydium", label: "Raydium" },
              { value: "pump", label: "Pump", selected: true },
              { value: "moonshot", label: "MoonShot" }
            ].map((dex) => (
              <Button 
                key={dex.value}
                variant="outline" 
                size="sm"
                disabled 
                className={dex.selected ? "text-xs bg-green-500/20 border-green-500/30 text-green-400" : "text-xs bg-black border-green-500/30 text-white"}
              >
                {dex.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-white">Buy Address Count</label>
            <div className="flex gap-2 mt-1">
              {[4, 40, 100, 500, 1000].map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  size="sm"
                  disabled
                  className={count === bundlerState.buyAddressCount ? 'text-xs bg-green-500/20 border-green-500/30 text-green-400' : 'text-xs bg-black border-green-500/30 text-white'}
                  onClick={() => updateBundlerState({ buyAddressCount: count })}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white">Buy Amount (SOL)</label>
            <Input 
              disabled
              placeholder="0.00001"
              className="bg-black border-green-500/30 text-white text-sm"
              value={bundlerState.buyAmount}
              onChange={(e) => updateBundlerState({ buyAmount: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white">Jito MEV Tip</label>
          <div className="flex gap-2 mt-1">
            {[
              { value: "default", label: "Default 0.00003" },
              { value: "high", label: "High 0.00008", selected: true },
              { value: "ultra", label: "Ultra-High 0.00015" },
              { value: "max", label: "0.001" }
            ].map((option) => (
              <Button 
                key={option.value}
                variant="outline" 
                size="sm"
                disabled 
                className={option.value === bundlerState.jitoMevTip ? "text-xs bg-green-500/20 border-green-500/30 text-green-400" : "text-xs bg-black border-green-500/30 text-white"}
                onClick={() => updateBundlerState({ jitoMevTip: option.value })}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-2 text-yellow-200/90 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 mt-0.5" />
        <div className="text-xs">
          Cannot access bundler features. Please hold a minimum of 5M ENT tokens for at least 24 hours to unlock this functionality.
        </div>
      </div>
    </Card>
  )
}

