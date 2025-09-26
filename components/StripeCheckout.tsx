'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Crown, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  plan: 'pro' | 'premium'
  price: string
  children: React.ReactNode
}

export default function StripeCheckout({ plan, price, children }: StripeCheckoutProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan === 'pro' ? 'price_pro_monthly' : 'price_premium_monthly',
          email,
        }),
      })

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
          alert('Payment failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-blue-600" />
            Upgrade to {plan === 'pro' ? 'Pro' : 'Premium'}
          </DialogTitle>
          <DialogDescription>
            Start your subscription for just {price}/month. Cancel anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-sm">
            <h4 className="font-semibold mb-2">What you'll get:</h4>
            <ul className="space-y-1 text-slate-600">
              {plan === 'pro' ? (
                <>
                  <li>• Unlimited focus sessions</li>
                  <li>• Advanced task management</li>
                  <li>• Deep work timer (90min)</li>
                  <li>• Detailed analytics</li>
                </>
              ) : (
                <>
                  <li>• Everything in Pro</li>
                  <li>• Team collaboration</li>
                  <li>• AI productivity insights</li>
                  <li>• Priority support</li>
                </>
              )}
            </ul>
          </div>
          <Button 
            onClick={handleCheckout} 
            disabled={loading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for ${price}/month`
            )}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Secure payment by Stripe • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
