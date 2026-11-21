import { SITE } from '../config/site';

export interface Inquiry {
  id: string;
  source: string;
  receivedAt: string;
  fields: Record<string, string>;
}

const STORE_KEY = 'an_inquiries';

export function getStoredInquiries(): Inquiry[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  } catch {
    return [];
  }
}

function storeInquiry(inquiry: Inquiry) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([inquiry, ...getStoredInquiries()].slice(0, 200)));
  } catch {
    /* storage unavailable: ignore */
  }
}

/**
 * Sends a form to the configured endpoint (Web3Forms / Formspree / etc.) so it
 * lands in Arzoo's inbox. Always keeps a local copy for the /dashboard view.
 */
export async function submitInquiry(source: string, fields: Record<string, string>) {
  const inquiry: Inquiry = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    source,
    receivedAt: new Date().toISOString(),
    fields,
  };
  storeInquiry(inquiry);

  if (!SITE.formEndpoint) {
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true };
  }

  const res = await fetch(SITE.formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...(SITE.formAccessKey ? { access_key: SITE.formAccessKey } : {}),
      subject: `New website inquiry: ${source}`,
      from_name: 'arzoonaqvi.com',
      source,
      ...fields,
    }),
  });
  if (!res.ok) throw new Error('Could not send. Please call or email instead.');
  return { ok: true };
}
