export interface BotBrain {
  say(prompt: string, context?: Record<string, unknown>): Promise<string>;
}

export class ScriptedBrain implements BotBrain {
  private script: string[];

  constructor(script: string[] = []) {
    this.script = script;
  }

  async say(prompt: string, context?: Record<string, unknown>): Promise<string> {
    if (context && typeof context.index === 'number' && this.script[context.index]) {
      return this.script[context.index];
    }
    return prompt;
  }
}

// Future AI Hook Seam:
// export class AIBrain implements BotBrain {
//   async say(prompt: string): Promise<string> {
//     const res = await fetch('/api/bot/chat', { method: 'POST', body: JSON.stringify({ prompt }) });
//     const data = await res.json();
//     return data.message;
//   }
// }
