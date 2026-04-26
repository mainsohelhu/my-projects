import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "midas_institute_secret_key_123"; // Use env in production
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(user: any) {
  // Super Admin expires in 24 hours, others effectively forever (10 years)
  const duration = user.role === "SUPER_ADMIN" 
    ? 24 * 60 * 60 * 1000 
    : 10 * 365 * 24 * 60 * 60 * 1000;
    
  const expires = new Date(Date.now() + duration);
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, { expires, httpOnly: true, secure: true, sameSite: "lax" });
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const duration = parsed.user.role === "SUPER_ADMIN" 
    ? 24 * 60 * 60 * 1000 
    : 10 * 365 * 24 * 60 * 60 * 1000;

  parsed.expires = new Date(Date.now() + duration);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
