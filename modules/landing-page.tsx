"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PenSquare, FileText, PanelLeft, Shapes, ArrowRight, Sparkles, Users, Zap, Shield, Clock, Star, CheckCircle, Play, Globe, Rocket } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: PenSquare,
      title: "Smart PRD Editor",
      description: "AI-powered collaborative editor with real-time suggestions and version control",
      color: "bg-yellow-100"
    },
    {
      icon: FileText,
      title: "Design Documentation",
      description: "Beautiful, structured design docs with templates and best practices built-in",
      color: "bg-yellow-100"
    },
    {
      icon: PanelLeft,
      title: "Interactive Flowcharts",
      description: "Drag-and-drop flowchart builder with smart connectors and auto-layout",
      color: "bg-yellow-100"
    },
    {
      icon: Shapes,
      title: "Professional UML",
      description: "Complete UML diagram suite with code generation and reverse engineering",
      color: "bg-yellow-100"
    }
  ];

  const benefits = [
    { icon: Zap, title: "10x Faster", description: "Create documents in minutes, not hours" },
    { icon: Users, title: "Team Collaboration", description: "Real-time editing with your entire team" },
    { icon: Shield, title: "Enterprise Security", description: "Bank-level security for your sensitive docs" },
    { icon: Globe, title: "Global Access", description: "Access your work from anywhere, anytime" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "This platform revolutionized how we create PRDs. Our team productivity increased by 300%.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Designer at StartupXYZ",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "The design doc templates are incredible. We went from chaos to organized documentation overnight.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Engineering Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "UML diagrams have never been this easy. The auto-generation features are mind-blowing.",
      rating: 5
    }
  ];

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-cream-50 to-stone-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-40 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-stone-100 dark:bg-stone-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-40 animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-neutral-100 dark:bg-neutral-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-40 animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-blur-sm bg-cream-50/80 dark:bg-zinc-950/80 border-b border-stone-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
           <Image src="/logo.png" alt="OneStopDocs" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
              OneStopDocs
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-stone-600 dark:text-stone-300 hover:text-zinc-900 dark:hover:text-cream-50 transition-colors">Features</a>
            <a href="#testimonials" className="text-stone-600 dark:text-stone-300 hover:text-zinc-900 dark:hover:text-cream-50 transition-colors">Reviews</a>
            <a href="#pricing" className="text-stone-600 dark:text-stone-300 hover:text-zinc-900 dark:hover:text-cream-50 transition-colors">Pricing</a>
            <Button variant="outline" size="sm" className="border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Product Teams
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-cream-50 dark:via-stone-200 dark:to-cream-50 bg-clip-text text-transparent">
                Create Stunning
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-800 via-stone-700 to-zinc-800 dark:from-amber-200 dark:via-stone-300 dark:to-stone-200 bg-clip-text text-transparent">
                Product Documents
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
              The all-in-one platform for PRDs, design docs, flowcharts, and UML diagrams. 
              <span className="font-semibold text-zinc-800 dark:text-cream-100"> Built for modern product teams.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg" 
               
                onClick={() => router.push("/editor")}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
             
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-12 text-sm text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 w-full px-6 py-20 bg-stone-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Powerful tools designed to streamline your product development workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-cream-50/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="text-center space-y-4 p-8">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-cream-50" />
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-800 dark:text-cream-100">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 w-full px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
                Why Teams Choose Us
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-cream-50 bg-white rounded-full" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-800 dark:text-cream-100 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 dark:from-amber-900/20 dark:to-stone-900/20 rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Product Dashboard"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="text-white absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 w-full px-6 py-20 bg-stone-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
              Loved by Product Teams
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-300">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-cream-50/80 dark:bg-zinc-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-stone-200 dark:bg-stone-700 text-zinc-800 dark:text-stone-200">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-zinc-800 dark:text-cream-100">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
          Join thousands of product teams who&apos;ve already revolutionized their documentation process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-zinc-800 to-black hover:from-zinc-900 hover:to-zinc-800 text-cream-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push("/editor")}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-12 border-t border-stone-200/50 dark:border-zinc-800/50 bg-cream-50/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cream-50" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-cream-50 dark:to-stone-200 bg-clip-text text-transparent">
                OneStopDocs
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-stone-600 dark:text-stone-400 hover:text-zinc-900 dark:hover:text-cream-100 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-stone-600 dark:text-stone-400 hover:text-zinc-900 dark:hover:text-cream-100 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-stone-600 dark:text-stone-400 hover:text-zinc-900 dark:hover:text-cream-100 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-stone-200/50 dark:border-zinc-800/50 text-center">
            <p className="text-stone-500 dark:text-stone-400">
              © {new Date().getFullYear()} OneStopDocs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
