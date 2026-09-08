import type { Metadata } from "next";
import ChatClient from "./chat-client";

export const metadata: Metadata = {
  title: "Ask AI",
};

// The chat box carries its own title, description, and "how it was built" link.
export default function AskPage() {
  return (
    <ChatClient />
  );
}
