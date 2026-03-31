/**
 * Blackbox AI Client
 * HTTP client for interacting with Blackbox AI API
 */

import {
  BlackboxAuthConfig,
  BlackboxChatRequest,
  BlackboxChatResponse,
  BlackboxCodeSearchRequest,
  BlackboxCodeSearchResult,
  BlackboxTaskRequest,
  BlackboxTaskResponse,
  BlackboxGitHubRepo,
} from './schemas/blackbox.js';

export class BlackboxAIClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: BlackboxAuthConfig) {
    if (!config.apiKey) {
      throw new Error('Blackbox AI API key is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.blackbox.ai';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make authenticated request to Blackbox API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { isStream?: boolean } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Blackbox API error (${response.status}): ${error}`
        );
      }

      if (options.isStream) {
        return response as unknown as T;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Blackbox API request timeout');
      }
      throw error;
    }
  }

  /**
   * Search code across Blackbox's indexed repositories
   */
  async searchCode(
    request: BlackboxCodeSearchRequest
  ): Promise<BlackboxCodeSearchResult[]> {
    const queryParams = new URLSearchParams({
      q: request.query,
      limit: String(request.limit || 10),
      ...(request.language && { language: request.language }),
      ...(request.repository && { repo: request.repository }),
    });

    return this.makeRequest<BlackboxCodeSearchResult[]>(
      `/search/code?${queryParams}`
    );
  }

  /**
   * Create a new task for Blackbox to execute
   */
  async createTask(request: BlackboxTaskRequest): Promise<BlackboxTaskResponse> {
    return this.makeRequest<BlackboxTaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<BlackboxTaskResponse> {
    return this.makeRequest<BlackboxTaskResponse>(`/tasks/${taskId}`);
  }

  /**
   * Send a message to Blackbox AI
   */
  async chat(
    request: BlackboxChatRequest
  ): Promise<BlackboxChatResponse | AsyncIterable<string>> {
    const body = {
      messages: request.messages,
      model: request.model || 'gpt-4',
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? 2048,
      stream: request.stream ?? false,
    };

    if (request.stream) {
      return this.makeRequest<AsyncIterable<string>>('/messages', {
        method: 'POST',
        body: JSON.stringify(body),
        isStream: true,
      });
    }

    return this.makeRequest<BlackboxChatResponse>('/messages', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * List GitHub repositories connected to Blackbox
   */
  async listGitHubRepos(): Promise<BlackboxGitHubRepo[]> {
    return this.makeRequest<BlackboxGitHubRepo[]>('/github/repos');
  }

  /**
   * Get list of available models
   */
  async getAvailableModels(): Promise<string[]> {
    const response = await this.makeRequest<{ models: string[] }>('/models');
    return response.models;
  }

  /**
   * Cancel a running task
   */
  async cancelTask(taskId: string): Promise<void> {
    await this.makeRequest(`/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Stream logs from a task
   */
  async streamTaskLogs(
    taskId: string
  ): Promise<AsyncIterable<string>> {
    return this.makeRequest<AsyncIterable<string>>(
      `/tasks/${taskId}/logs/stream`,
      {
        isStream: true,
      }
    );
  }
}

/**
 * Initialize Blackbox AI client from environment
 */
export function initializeBlackboxClient(): BlackboxAIClient {
  const apiKey = process.env.BLACKBOX_API_KEY;

  if (!apiKey) {
    throw new Error(
      'BLACKBOX_API_KEY environment variable is not set. ' +
        'Please set it to your Blackbox AI API key.'
    );
  }

  return new BlackboxAIClient({
    apiKey,
    baseUrl: process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai',
    timeout: process.env.BLACKBOX_API_TIMEOUT
      ? Number.parseInt(process.env.BLACKBOX_API_TIMEOUT, 10)
      : undefined,
  });
}
