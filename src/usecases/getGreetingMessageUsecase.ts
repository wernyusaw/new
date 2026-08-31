export function getGreetingMessage(name: string, style: "casual" | "formal" = "casual"): string {
  return style === "formal" ? `Good day, ${name}` : `Greetings, ${name}`;
}