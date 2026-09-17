"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const TONES = ["Friendly & casual", "Professional & direct", "Warm & personal"] as const;

function buildEmail(opts: {
  yourName: string;
  siteName: string;
  topic: string;
  targetUrl: string;
  tone: (typeof TONES)[number];
}) {
  const { yourName, siteName, topic, targetUrl, tone } = opts;
  const site = siteName || "[Publisher Name]";
  const topicText = topic || "[your proposed topic]";
  const name = yourName || "[Your Name]";
  const url = targetUrl || "[link to a relevant page or past article of yours]";

  if (tone === "Friendly & casual") {
    return `Subject: Quick idea for ${site}\n\nHi there,\n\nI've been reading ${site} for a while and really enjoy the way you cover this space. I had an idea for a piece that I think would fit well with what you usually publish: "${topicText}".\n\nI'd love to write it specifically for your readers rather than repurpose something generic — happy to share a quick outline first if that's easier. For reference, here's something similar I've written before: ${url}\n\nLet me know if this is something you'd be open to!\n\nBest,\n${name}`;
  }

  if (tone === "Professional & direct") {
    return `Subject: Guest post proposal — "${topicText}"\n\nHello,\n\nI'm reaching out to propose a guest article for ${site} on the topic of "${topicText}". I believe this would be a good fit based on the content you typically publish.\n\nI'm happy to write the piece to your editorial guidelines, and can provide a brief outline in advance for approval. For context on my writing, here's a relevant sample: ${url}\n\nPlease let me know if you'd like to move forward or if you have any specific requirements.\n\nRegards,\n${name}`;
  }

  return `Subject: A piece for ${site}, if it's a fit\n\nHi,\n\nMy name is ${name}, and I've followed ${site} for a while now — your coverage of this space has genuinely been useful to me. I wanted to reach out because I have an idea I think your readers would appreciate: "${topicText}".\n\nI know inboxes like yours get a lot of generic pitches, so I want to be upfront: I'd only want to write this if it's a genuine fit for your site, not just a link opportunity for me. Here's a sample of my writing so you can judge for yourself: ${url}\n\nWould love to hear your thoughts either way.\n\nWarmly,\n${name}`;
}

export function OutreachGenerator() {
  const [yourName, setYourName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [topic, setTopic] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Friendly & casual");
  const [copied, setCopied] = useState(false);

  const email = useMemo(
    () => buildEmail({ yourName, siteName, topic, targetUrl, tone }),
    [yourName, siteName, topic, targetUrl, tone],
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Your name</label>
          <input value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="Alex Moreau" className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]" />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-700">Publisher / site name</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Example Blog" className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[0.78rem] font-semibold text-ink-700">Your proposed topic</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="5 ways small teams can cut onboarding time" className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[0.78rem] font-semibold text-ink-700">Writing sample URL</label>
          <input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://yoursite.com/a-previous-article" className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-[0.86rem]" />
        </div>
      </div>

      <div className="mt-5">
        <label className="text-[0.78rem] font-semibold text-ink-700">Tone</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors ${
                tone === t ? "border-brand-400 bg-brand-50 text-brand-800" : "border-line bg-white text-ink-600 hover:border-ink-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-canvas p-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-ink-400">Generated email</p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(email);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[0.74rem] font-semibold text-ink-700 hover:border-ink-300"
          >
            <Icon name="document" size={13} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-[0.86rem] leading-relaxed text-ink-800">{email}</pre>
      </div>
    </div>
  );
}
