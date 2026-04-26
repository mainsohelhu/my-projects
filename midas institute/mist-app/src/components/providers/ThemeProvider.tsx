"use client";

import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  // Since the user is getting script tag errors from next-themes,
  // and the site design is primarily light-mode based,
  // we use a simplified provider to eliminate console errors.
  return <div className="contents">{children}</div>;
}
