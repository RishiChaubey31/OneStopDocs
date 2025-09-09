import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function Dashboard() {
  return (
   <div className="mx-auto max-w-6xl px-6 py-8">
    <header className="mb-8 flex items-center justify-between">
     <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-1 text-sm">Quickly create and manage your PRDs.</p>
     </div>
     <div className="flex gap-3">
      <Button size="lg">New Project</Button>
      <Button variant="outline" size="lg">Existing Project</Button>
     </div>
    </header>

    <section className="space-y-4">
     <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">Recent projects</h2>
      <Button variant="ghost" className="text-sm">View all</Button>
     </div>

     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3,4,5,6].map((i) => (
       <Card key={i} className="hover:shadow-md transition-shadow">
        <CardHeader>
         <CardTitle className="truncate">Project {i}</CardTitle>
         <CardDescription className="truncate">Last edited just now</CardDescription>
        </CardHeader>
        <CardContent>
         <div className="text-sm text-muted-foreground">
          A short description about this PRD project goes here.
         </div>
        </CardContent>
       </Card>
      ))}
     </div>
    </section>
   </div>
  )
}

export default Dashboard