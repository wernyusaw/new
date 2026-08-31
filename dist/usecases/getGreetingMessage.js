"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGreetingMessage = getGreetingMessage;
function getGreetingMessage(name, style = "casual") {
    return style === "formal" ? `Good day, ${name}` : `Greetings, ${name}`;
}
