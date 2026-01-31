"use server";

export async function notifyDiscord(message: string) {
  try {
    const captainHookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!captainHookUrl) {
      throw new Error("DISCORD_WEBHOOK_URL missing");
    }

    const discordResponse = await fetch(captainHookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    // return data to browser
    return {
      error: null,
      data: discordResponse,
    };
  } catch (err) {
    console.log("Error while notifying Discord:", err);
    return { error: String(err), data: null };
  }
}
