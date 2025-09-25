
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

    const privateKey = await importPKCS8(
      process.env.MOCK_JWT_PRIVATE_KEY!,
      alg
    );

    const jwt = await new SignJWT({
      iss: "bybit-app",
      aud: "bybitcash-merchant",
      sub: `bybit_user_id:${uid}`,
      uid: parseInt(uid, 10),
      scope: ["topup:create"],
      state: randomUUID(),
      nonce: randomUUID(),
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setNotBefore(Math.floor(Date.now() / 1000))
      .setExpirationTime("5m")
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
