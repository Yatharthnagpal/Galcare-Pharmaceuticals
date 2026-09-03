import { NextRequest } from "next/server"
import { proxyToWordPress } from "@/lib/wp-proxy-helper"

export async function GET(request: NextRequest) {
  return proxyToWordPress(request, "/wp-login.php")
}

export async function POST(request: NextRequest) {
  return proxyToWordPress(request, "/wp-login.php")
}
