"use client";

const CONTACTS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/15303037330",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path
          fill="#fff"
          d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
        />
        <path
          fill="#fff"
          d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.66 0-3.2-.46-4.53-1.25l-.32-.19-3.01.79.8-2.93-.21-.3A8.1 8.1 0 0 1 3.87 12c0-4.5 3.66-8.13 8.15-8.13 4.48 0 8.13 3.64 8.13 8.13 0 4.5-3.65 8.13-8.13 8.13Z"
        />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/SEOSERVICE9111",
    bg: "#26A5E4",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path
          fill="#fff"
          d="M21.5 3.5 2.7 10.9c-1.1.44-1.1 1.07-.2 1.35l4.8 1.5 1.85 5.65c.22.6.38.84.78.84.3 0 .43-.14.6-.3l1.63-1.6 3.4 2.5c.62.35 1.07.17 1.23-.57l2.9-13.7c.24-1.05-.4-1.5-1.19-1.07ZM8.66 13.98l9.02-5.68c.43-.26.82-.12.5.17l-7.65 6.9-.3 3.16-1.57-4.55Z"
        />
      </svg>
    ),
  },
];

/**
 * Floating contact sidebar, fixed to the right edge of the viewport.
 * Sits above page content but stays clear of it on both desktop and mobile,
 * and never appears inside the dashboard (which has its own chrome).
 */
export function SocialSidebar() {
  return (
    <div className="fixed right-3 top-1/2 z-30 -translate-y-1/2 flex flex-col gap-2.5 sm:right-4">
      {CONTACTS.map((contact) => (
        <a
          key={contact.name}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on ${contact.name}`}
          title={`Chat on ${contact.name}`}
          className="group flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-1 ring-black/5 transition-transform duration-150 hover:scale-105 active:scale-95 sm:h-12 sm:w-12"
          style={{ backgroundColor: contact.bg }}
        >
          {contact.icon}
        </a>
      ))}
    </div>
  );
}
