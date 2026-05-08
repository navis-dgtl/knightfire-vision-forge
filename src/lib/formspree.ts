const ENDPOINT = "https://formspree.io/f/mnjwgdga";

type FormspreePayload = Record<string, unknown> & {
  _subject: string;
  _replyto: string;
};

export async function notifyFormspree(payload: FormspreePayload): Promise<void> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[formspree] non-2xx response", res.status, body);
    }
  } catch (err) {
    console.error("[formspree] network error", err);
  }
}
