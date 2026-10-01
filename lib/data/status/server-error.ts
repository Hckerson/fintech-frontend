export const SERVER_ERROR_COPY = {
    eyebrow: "Error · 500",
    first: {
        title: "This page didn't load.",
        lead: "Something failed while showing this page. Your money and records were not affected.",
    },
    again: {
        title: "Still not loading.",
        lead: "It failed a second time. Send us the reference below and we'll look into it. Your money and records were not affected.",
    },
    offline: {
        title: "You're offline.",
        lead: "Reconnect and try again. Nothing was lost, and your money was not affected.",
    },
    retry: "Try again",
    retrying: "Trying…",
    home: "Go to home",
    help: "Get help",
    reference: "Reference",
    tag: "Stopped here",
    copy: "Copy reference",
    copied: "Copied",
    metaTitle: "Something went wrong · Ledgerline",
} as const;
