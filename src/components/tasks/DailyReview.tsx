"use client"

import { useState, useEffect } from 'react'
import { format, isToday, subDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { DailyReview, NewDailyReview } from '@/lib/tasks/types'
import { CheckCircle, Clock, TrendingUp, BookOpen, Star } from 'lucide-react'

interface DailyReviewCompletionProps {
  date: Date
  onReviewComplete?: () => void
}

export function DailyReviewCompletion({ date, onReviewComplete }: DailyReviewCompletionProps) {
  const { tasks, getTasksForDate, getCompletedTasks } = useTasksContext()
  const [review, setReview] = useState<Partial<NewDailyReview>>({
    reflection: '',
    improvements: '',
    productivityScore: 5
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dayTasks = getTasksForDate(date)
  const completedTasks = dayTasks.filter(task => task.status === 'completed')
  const completionRate = dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0

  const handleSubmitReview = async () => {
    setIsSubmitting(true)
    
    try {
      const reviewData: NewDailyReview = {
        reviewDate: date,
        completedTasks: completedTasks.length,
        totalTasks: dayTasks.length,
        reflection: review.reflection || '',
        improvements: review.improvements || '',
        productivityScore: review.productivityScore || 5
      }

      const response = await fetch('/api/daily-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        onReviewComplete?.()
      }
    } catch (error) {
      console.error('Failed to submit daily review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProductivityMessage = (score: number) => {
    if (score >= 8) return "Excellent productivity! 🚀"
    if (score >= 6) return "Good productive day! 👍"
    if (score >= 4) return "Decent progress made 📈"
    return "Room for improvement tomorrow 💪"
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Daily Review - {format(date, 'PPP')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">{dayTasks.length - completedTasks.length}</div>
            <div className="text-sm text-gray-700">Remaining</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</div>
            <div className="text-sm text-blue-700">Completion Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Daily Progress</span>
            <span>{completedTasks.length} of {dayTasks.length} tasks</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Unfinished Tasks */}
        {dayTasks.length - completedTasks.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Tasks to roll over to tomorrow:</h3>
            <div className="space-y-2">
              {dayTasks
                .filter(task => task.status !== 'completed')
                .map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                    <Badge className="bg-yellow-100 text-yellow-700" variant="outline">
                      {task.priority}
                    </Badge>
                    <span className="text-sm">{task.title}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Productivity Score */}
        <div>
          <label className="block text-sm font-medium mb-2">
            How productive did you feel today? (1-10)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
              <button
                key={score}
                onClick={() => setReview(prev => ({ ...prev, productivityScore: score }))}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                  review.productivityScore === score
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
          {review.productivityScore && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
              <Star className="h-4 w-4" />
              {getProductivityMessage(review.productivityScore)}
            </p>
          )}
        </div>

        {/* Reflection Questions */}
        <div className="space-y-4">
          <div>
            <label htmlFor="reflection" className="block text-sm font-medium mb-2">
              What went well today? 🌟
            </label>
            <Textarea
              id="reflection"
              placeholder="Reflect on your achievements, successful strategies, or positive moments..."
              value={review.reflection}
              onChange={(e) => setReview(prev => ({ ...prev, reflection: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="improvements" className="block text-sm font-medium mb-2">
              What needs adjustment tomorrow? 🔧
            </label>
            <Textarea
              id="improvements"
              placeholder="Think about what you could do differently, challenges to address, or areas to improve..."
              value={review.improvements}
              onChange={(e) => setReview(prev => ({ ...prev, improvements: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? 'Saving...' : 'Complete Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function DailyReviewPrompt() {
  const [showReview, setShowReview] = useState(false)
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false)
  
  useEffect(() => {
    // Check if user should see daily review prompt
    const checkReviewStatus = async () => {
      const today = new Date()
      const yesterday = subDays(today, 1)
      
      // Only show prompt after 6 PM
      const currentHour = today.getHours()
      if (currentHour < 18) return
      
      // Check if review was already completed for yesterday
      try {
        const response = await fetch(`/api/daily-reviews?date=${yesterday.toISOString().split('T')[0]}`)
        if (response.ok) {
          const reviews = await response.json()
          if (reviews.length === 0) {
            setShouldShowPrompt(true)
          }
        }
      } catch (error) {
        console.error('Failed to check review status:', error)
      }
    }
    
    checkReviewStatus()
  }, [])

  if (!shouldShowPrompt && !showReview) {
    return null
  }

  if (showReview) {
    return (
      <DailyReviewCompletion 
        date={subDays(new Date(), 1)}
        onReviewComplete={() => {
          setShowReview(false)
          setShouldShowPrompt(false)
        }}
      />
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Time for your daily review!</h3>
              <p className="text-sm text-blue-700">
                Reflect on yesterday's progress and plan for tomorrow
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShouldShowPrompt(false)}
            >
              Later
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowReview(true)}
            >
              Start Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
