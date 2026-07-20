import type { ComponentType } from "react";
import AgoraDoubleBufferRecording from "./projects/agora-double-buffer-recording.mdx";
import AiUsageReview2024 from "./projects/ai-usage-review-2024.mdx";
import AskAiBehindTheScenes from "./projects/ask-ai-behind-the-scenes.mdx";
import AvatarSequentialGeneration from "./projects/avatar-sequential-generation.mdx";
import CodingStyle from "./projects/coding-style.mdx";
import TeamLeadRetrospective from "./projects/team-lead-retrospective.mdx";

export const deepDives: Record<string, ComponentType> = {
  "avatar-sequential-generation": AvatarSequentialGeneration,
  "agora-double-buffer-recording": AgoraDoubleBufferRecording,
  "team-lead-retrospective": TeamLeadRetrospective,
  "ai-usage-review-2024": AiUsageReview2024,
  "coding-style": CodingStyle,
  "ask-ai-behind-the-scenes": AskAiBehindTheScenes,
};
