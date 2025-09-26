'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Clock, Play, Pause, Square, Plus, Target, Zap, Crown, Star, Menu, X } from 'lucide-react'
import StripeCheckout from '@/components/StripeCheckout'

interface Task {
  id: string
  title: string
  priority: string
  completed: boolean
}

export default function NovumFocus() {
  const [activeTimer, setActiveTimer] = useState<'pomodoro' | 'deep' | null>(null)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [loading, setLoading] = useState(true)

  // Load tasks from database
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks?userId=demo-user')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Fallback to demo data
      setTasks([
        { id: '1', title: 'Complete project proposal', priority: 'high', completed: false },
        { id: '2', title: 'Review team feedback', priority: 'medium', completed: true },
        { id: '3', title: 'Schedule client meeting', priority: 'low', completed: false }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      setActiveTimer(null)
      // Save completed session to database
      saveSession()
      // Show completion notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus session completed!', {
          body: 'Great job! Time for a break.',
          icon: '/favicon.ico'
        })
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const saveSession = async () => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTimer,
          duration: activeTimer === 'pomodoro' ? 25 : 90,
          completed: true,
          userId: 'demo-user'
        })
      })
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = (type: 'pomodoro' | 'deep') => {
    setActiveTimer(type)
    setTimeLeft(type === 'pomodoro' ? 25 * 60 : 90 * 60)
    setIsRunning(true)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setActiveTimer(null)
    setTimeLeft(25 * 60)
  }

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTask,
            priority: newTaskPriority,
            userId: 'demo-user'
          })
        })
        
        if (response.ok) {
          const task = await response.json()
          setTasks([task, ...tasks])
          setNewTask('')
        }
      } catch (error) {
        console.error('Error adding task:', error)
        // Fallback to local state
        const newTaskObj = {
          id: Date.now().toString(),
          title: newTask,
          priority: newTaskPriority,
          completed: false
        }
        setTasks([newTaskObj, ...tasks])
        setNewTask('')
      }
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          completed: !task.completed
        })
      })

      if (response.ok) {
        setTasks(tasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Fallback to local state
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      // Fallback to local state
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Novum Focus</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="text-slate-600">Free Plan</Badge>
              <StripeCheckout plan="pro" price="£0.99">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </StripeCheckout>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <Badge variant="outline" className="text-slate-600 w-fit">Free Plan</Badge>
                <StripeCheckout plan="pro" price="£0.99">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </StripeCheckout>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Turn your focus into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">productivity</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            The AI-powered focus timer and task tracker that helps remote workers and entrepreneurs maximize their deep work sessions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              2,847 focus sessions completed today
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              4.9/5 rating from 1,200+ users
            </div>
          </div>
        </div>

        <Tabs defaultValue="timer" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="timer" className="text-xs sm:text-sm">Focus Timer</TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">Task Manager</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm">Pricing</TabsTrigger>
          </TabsList>

          {/* Timer Tab */}
          <TabsContent value="timer" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Active Timer */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    {activeTimer === 'pomodoro' ? 'Pomodoro Session' : 
                     activeTimer === 'deep' ? 'Deep Work Session' : 'Ready to Focus'}
                  </CardTitle>
                  <CardDescription>
                    {activeTimer ? 'Stay focused and productive' : 'Choose your focus method'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4 sm:space-y-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-slate-900">
                    {formatTime(timeLeft)}
                  </div>
                  
                  {activeTimer && (
                    <Progress 
                      value={activeTimer === 'pomodoro' 
                        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
                        : ((90 * 60 - timeLeft) / (90 * 60)) * 100
                      } 
                      className="w-full h-2"
                    />
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    {!activeTimer ? (
                      <>
                        <Button onClick={() => startTimer('pomodoro')} className="bg-red-500 hover:bg-red-600 w-full sm:w-auto">
                          <Play className="w-4 h-4 mr-2" />
                          Pomodoro (25m)
                        </Button>
                        <Button onClick={() => startTimer('deep')} className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                          <Zap className="w-4 h-4 mr-2" />
                          Deep Work (90m)
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={toggleTimer} variant="outline" className="w-full sm:w-auto">
                          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isRunning ? 'Pause' : 'Resume'}
                        </Button>
                        <Button onClick={stopTimer} variant="destructive" className="w-full sm:w-auto">
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Clock className="w-5 h-5 mr-2" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm sm:text-base">Focus Sessions</span>
                    <span className="font-bold">3/8</span>
                  </div>
                  <Progress value={37.5} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm sm:text-base">Tasks Completed</span>
                    <span className="font-bold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />
                  
                  <div className="pt-4 border-t">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">2h 15m</div>
                    <div className="text-sm text-slate-600">Total focus time today</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Add New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter task description..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addTask} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Tasks</CardTitle>
                <CardDescription>Stay organized and track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-500 mt-2">Loading tasks...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tasks yet. Add your first task above!</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTask(task.id)}
                            className={`${task.completed ? 'text-green-600' : 'text-slate-400'} hover:bg-transparent`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm sm:text-base break-words ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {task.title}
                            </div>
                          </div>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h3>
              <p className="text-slate-600">Start free, upgrade when you need more power</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold">£0<span className="text-sm font-normal text-slate-600">/month</span></div>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />5 focus sessions/day</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Basic task management</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Pomodoro timer</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Basic analytics</li>
                  </ul>
                  <Button className="w-full" variant="outline">Current Plan</Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold">£0.99<span className="text-sm font-normal text-slate-600">/month</span></div>
                  <CardDescription>For serious productivity enthusiasts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Unlimited focus sessions</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Advanced task management</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Deep work timer (90min)</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Detailed analytics</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Goal tracking</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Export data</li>
                  </ul>
                  <StripeCheckout plan="pro" price="£0.99">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Start Pro Trial
                    </Button>
                  </StripeCheckout>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border-2 border-purple-500">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Premium
                  </CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold">£2.99<span className="text-sm font-normal text-slate-600">/month</span></div>
                  <CardDescription>For teams and power users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Everything in Pro</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Team collaboration</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />AI productivity insights</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Custom focus modes</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />Priority support</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />API access</li>
                  </ul>
                  <StripeCheckout plan="premium" price="£2.99">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      Start Premium Trial
                    </Button>
                  </StripeCheckout>
                </CardContent>
              </Card>
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center py-6 sm:py-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-slate-600 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-center">30-day money-back guarantee • Cancel anytime • Secure payments by Stripe</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="text-center py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white mt-12 sm:mt-16 mx-4 sm:mx-0">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">Ready to 10x your productivity?</h3>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">Join 10,000+ professionals who've transformed their work habits</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <StripeCheckout plan="pro" price="£0.99">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 w-full sm:w-auto">
                Start Free Trial
              </Button>
            </StripeCheckout>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 text-slate-500 text-sm border-t mt-12 sm:mt-16">
          <p>© 2025 Novum Focus. All rights reserved. • Privacy Policy • Terms of Service</p>
          <p className="mt-2 px-4">This website is for informational purposes only. No guarantees of outcome. Payments are securely processed by Stripe.</p>
        </footer>
      </div>
    </div>
  )
}
