"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const testDatabaseConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/db-test')
      const result = await response.json()
      setTestResult(result)
    } catch (err) {
      setError('Failed to connect to the test API')
      console.error('API call error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Test on page load
  useEffect(() => {
    testDatabaseConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Database Connection Test</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Test Results</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-foreground">Testing database connection...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-destructive mb-2">Error</h3>
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
          {testResult && (
            <div className={`rounded-lg p-4 mb-4 ${
              testResult.success 
                ? 'bg-success/10 border border-success/20' 
                : 'bg-destructive/10 border border-destructive/20'
            }`}>
              <h3 className={`font-medium mb-2 ${
                testResult.success ? 'text-success' : 'text-destructive'
              }`}>
                {testResult.success ? 'Success' : 'Failed'}
              </h3>
              <p className="text-foreground mb-2">{testResult.message}</p>
              {testResult.userCount !== undefined && (
                <p className="text-foreground">User count in database: {testResult.userCount}</p>
              )}
              {testResult.error && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Error details:</p>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {testResult.error}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Again'}
          </button>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">How to Check Database Connection</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Check Environment Variables</h3>
              <p className="text-muted-foreground text-sm">
                Make sure your DATABASE_URL is correctly set in Netlify environment variables.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2">2. Check Netlify Logs</h3>
              <p className="text-muted-foreground text-sm">
                Look at your deployment logs for any database connection errors.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2">3. Test with API Route</h3>
              <p className="text-muted-foreground text-sm">
                This page tests the connection by querying the database through an API route.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2">4. Check Prisma Client</h3>
              <p className="text-muted-foreground text-sm">
                Verify that Prisma Client is properly generated and configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}