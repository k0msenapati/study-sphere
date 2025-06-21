"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    avatar: "👩‍💻",
    content: "Study Sphere completely transformed how I prepare for exams. The AI study buddy feels like having a personal tutor available 24/7!",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Medical Student",
    avatar: "👨‍⚕️",
    content: "The adaptive quizzes are incredible. They know exactly what I need to work on and adjust the difficulty perfectly.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Engineering Student",
    avatar: "👩‍🔬",
    content: "I love how it generates comprehensive notes from my lectures automatically. Saves me hours every week!",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Business Student",
    avatar: "👨‍💼",
    content: "The personalized learning approach helped me improve my grades significantly. Highly recommend!",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Psychology Student",
    avatar: "👩‍🎓",
    content: "Finally, a study tool that understands my learning style. The AI insights are spot-on!",
    rating: 5
  },
  {
    name: "Alex Thompson",
    role: "Data Science Student",
    avatar: "👨‍💻",
    content: "The progress tracking feature keeps me motivated and helps me identify areas for improvement.",
    rating: 5
  }
]

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <div className="flex-shrink-0 w-80 mx-4">
      <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 h-full shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="text-2xl mr-3">{testimonial.avatar}</div>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <Quote className="h-5 w-5 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic">{testimonial.content}</p>
      </div>
    </div>
  )
}

const Marquee = ({ children, direction = "left", speed = 50 }: { children: React.ReactNode, direction?: "left" | "right", speed?: number }) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear"
          }
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

export default function TestimonialsSection() {
  const firstRow = testimonials.slice(0, 3)
  const secondRow = testimonials.slice(3)

  return (    <section id="testimonials" className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">            What Students{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have transformed their learning experience
          </p>
        </motion.div>

        <div className="space-y-8">
          <Marquee direction="left" speed={60}>
            {firstRow.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </Marquee>
          
          <Marquee direction="right" speed={50}>
            {secondRow.map((testimonial, index) => (
              <TestimonialCard key={index + 3} testimonial={testimonial} index={index + 3} />
            ))}
          </Marquee>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center justify-center space-x-4 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex -space-x-2">
              {["👩‍💻", "👨‍⚕️", "👩‍🔬", "👨‍💼", "👩‍🎓"].map((avatar, i) => (
                <div key={i} className="text-2xl bg-white dark:bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-700">
                  {avatar}
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">10,000+ Happy Students</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Average rating: 4.9/5 ⭐</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
