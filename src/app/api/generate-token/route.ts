import { NextRequest, NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";
import { randomUUID } from "crypto";

const alg = "RS256";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "MISSING_UID" }, { status: 400 });
    }

    const privateKeyPEM = process.env.MOCK_JWT_PRIVATE_KEY;
    if (!privateKeyPEM) {
      return NextResponse.json({ error: "NO_PRIVATE_KEY" }, { status: 500 });
    }

    // Import PKCS#8 private key
    const privateKey = await importPKCS8(privateKeyPEM, alg);

    // Create signed JWT
    const jwt = await new SignJWT({
      iss: "bybit-app",
      aud: "bybitcash-merchant",
      sub: `bybit_user_id:${uid}`,
      uid,
      scope: ["topup:create"],
      state: randomUUID(),
      nonce: randomUUID(),
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setNotBefore(Math.floor(Date.now() / 1000))
      .setExpirationTime("10m") // token valid for 10 minutes
      .sign(privateKey);

    return NextResponse.json({ token: jwt });
  } catch (err) {
    console.error("JWT generation error:", err);
    return NextResponse.json(
      { error: "JWT_GENERATION_FAILED" },
      { status: 500 }
    );
  }
}
