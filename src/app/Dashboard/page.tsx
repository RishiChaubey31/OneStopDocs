'use client';
import React from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  ArrowRight, 
  FileText, 
  PenTool, 
  Zap, 
  Users, 
  Clock, 
  Star,
  Palette,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function Dashboard() {
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Document Editor",
      description: "Create professional documents with our advanced editor featuring rich text formatting, collaboration tools, and export options.",
      route: "/editor",
      color: "bg-gray-500",
      badge: "Popular"
    },
    {
      icon: PenTool,
      title: "Whiteboard",
      description: "Brainstorm and visualize ideas with our interactive whiteboard. Perfect for planning, sketching, and collaborative sessions.",
      route: "/whiteboard",
      color: "bg-gray-600",
      badge: "Creative"
    }
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "10K+" },
    { icon: FileText, label: "Documents Created", value: "50K+" },
    { icon: Clock, label: "Time Saved", value: "1000+ hrs" },
    { icon: Star, label: "User Rating", value: "4.9/5" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <div className="inline-flex items-center justify-center p-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
            <Rocket className="w-8 h-8 text-gray-600 dark:text-gray-400 mr-2" />
            <BookOpen className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-6">
            OneStop Docs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Your all-in-one platform for creating, editing, and collaborating on documents and whiteboards. 
            Transform ideas into professional content with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Zap className="w-4 h-4 mr-1" />
              Fast & Reliable
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Palette className="w-4 h-4 mr-1" />
              Highly Customizable
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Users className="w-4 h-4 mr-1" />
              Team Collaboration
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" variants={fadeInUp}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Features */}
        <motion.div className="grid md:grid-cols-2 gap-8 mb-16" variants={stagger}>
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="group h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${feature.color} bg-opacity-10`}>
                      <feature.icon className={`w-8 h-8 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="w-full group/btn bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 dark:from-gray-200 dark:to-white dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-black border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => router.push(feature.route)}
                  >
                    <Rocket className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="text-center" variants={fadeInUp}>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Ready to get started?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
            >
              View Templates
            </Button>
            <Button 
              size="lg"
              className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}

export default Dashboard