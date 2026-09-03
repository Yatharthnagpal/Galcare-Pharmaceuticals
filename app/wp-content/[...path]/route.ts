import { NextRequest } from "next/server"
import { proxyToWordPress } from "@/lib/wp-proxy-helper"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params
  const subPath = p.path ? p.path.join("/") : ""
  return proxyToWordPress(request, `/wp-content/${subPath}`)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params
  const subPath = p.path ? p.path.join("/") : ""
  return proxyToWordPress(request, `/wp-content/${subPath}`)
}
