import { NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  // Continue to the requested page
  return NextResponse.next();
}

// Optional: Define paths where the middleware should run
export const config = {
  matcher: [
    "/((?!api/auth|api/cron|api/webhooks/stripe|_next/static|_next/image|favicon.ico|\\.(?:jpg|png|gif|ico|css|js)$).*)",
  ],
};
