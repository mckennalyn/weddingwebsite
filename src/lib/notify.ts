import "server-only";

export type RsvpChange = {
  name: string;
  from: string;
  to: string;
};

// Emails McKenna when a guest's RSVP status changes. Uses Resend's HTTP API.
// Never throws: a failed email must not break a guest's RSVP.
export async function notifyRsvpChanges(changes: RsvpChange[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || changes.length === 0) return;

  const to = process.env.RSVP_NOTIFY_EMAIL ?? "mckenna.alder@gmail.com";
  const from =
    process.env.RSVP_NOTIFY_FROM ?? "Wedding RSVP <onboarding@resend.dev>";

  const lines = changes.map((c) => `${c.name} changed their response from ${c.from} to ${c.to}.`);
  const subject =
    changes.length === 1
      ? `RSVP: ${changes[0].name} is now ${changes[0].to}`
      : `RSVP: ${changes.length} updates`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text: lines.join("\n") }),
    });
    if (!res.ok) {
      console.error("RSVP notification failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("RSVP notification failed", err);
  }
}
