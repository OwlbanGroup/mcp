/**
 * Blackbox AI Schema Types
 * Type definitions for Blackbox AI API responses and requests
 */

export interface BlackboxCodeSearchResult {
  id: string;
  repository: string;
  file: string;
  language: string;
  snippet: string;
  lineNumber: number;
  url: string;
}

export interface BlackboxTaskResponse {
  taskId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlackboxMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BlackboxChatRequest {
  messages: BlackboxMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface BlackboxChatResponse {
  id: string;
  choices: Array<{
    message: BlackboxMessage;
    finishReason: string;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface BlackboxCodeSearchRequest {
  query: string;
  language?: string;
  repository?: string;
  limit?: number;
}

export interface BlackboxTaskRequest {
  prompt: string;
  repository: string;
  branch?: string;
  instructions?: string;
}

export interface BlackboxGitHubRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  isPrivate: boolean;
}

export interface BlackboxAuthConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
