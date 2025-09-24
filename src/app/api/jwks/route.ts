import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    keys: [
      {
        kty: "RSA",
        use: "sig",
        alg: "RS256",
        kid: "mock-key-1",
        n: "5yLUvgPDsZOXxuvwPs4CvkbbqOSkfEFT9SM6q3h-pCo1D_lxGuhDVTYiwCPALtyxiVbSf7KiQX3ZRQqpuKj6A8T_kqaGMOO6Lst1AWJDH1IemdS62OGQx4-ftY9b2RB672ZHVIenIxNrr1mX04N6KBjJKxUMASOar2c6u0-Z2U9Rgj8KjsiFP2Ro5TB0N9yMGqLdOKK-dMJ6Sr7za9kga_KlyMzkZiC31KASyKxS0kVF_H7hX3Z0EuMo4RWUhIhZnXSES1UB6XaLw1raO2JsR8bH03fSkmMVX1f9eTJxUQQEfSoaFkLVpIsTsOqiEgBNtY17rx_OSs9sTaEXyo-9Qw",
        e: "AQAB",
      },
    ],
  });
}
