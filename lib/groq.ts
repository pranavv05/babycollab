import { Groq } from 'groq-sdk'

let client: Groq | undefined

// Created lazily so builds and routes that never call Groq don't need GROQ_API_KEY
export function getGroq(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return client
}
