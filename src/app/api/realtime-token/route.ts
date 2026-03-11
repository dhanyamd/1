import { getSubscriptionToken } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { GeminiChannel } from "@/inngest/channels/gemini";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualRequestChannel } from "@/inngest/channels/manual-request";
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import { DiscordChannel } from "@/inngest/channels/discord";
import { SlackChannel } from "@/inngest/channels/slack";
import { OpenaiChannel } from "@/inngest/channels/openai";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const channelMap: Record<string, any> = {
    gemini: GeminiChannel,
    "http-request": httpRequestChannel,
    "manual-request": manualRequestChannel,
    anthropic: AnthropicChannel,
    discord: DiscordChannel,
    slack: SlackChannel,
    openai: OpenaiChannel,
    "google-form-trigger": googleFormTriggerChannel,
};

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const channelKey = req.nextUrl.searchParams.get("channel");
        if (!channelKey || !channelMap[channelKey]) {
            return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
        }

        const token = await getSubscriptionToken(inngest, {
            channel: channelMap[channelKey],
            topics: ["status"],
        });

        return NextResponse.json({ token });
    } catch (error: any) {
        console.error("REALTIME TOKEN ERROR", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
