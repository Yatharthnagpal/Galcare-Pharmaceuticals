import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return handleWpProxy(request)
}

export async function POST(request: NextRequest) {
  return handleWpProxy(request)
}

async function handleWpProxy(request: NextRequest) {
  const { search } = request.nextUrl
  const targetUrl = `http://118.139.178.174/wp-login.php${search}`

  try {
    const body = request.method !== "GET" && request.method !== "HEAD" 
      ? await request.arrayBuffer() 
      : undefined

    const forwardHeaders: Record<string, string> = {
      "host": "galcare.com",
      "user-agent": request.headers.get("user-agent") || "Mozilla/5.0",
      "accept": request.headers.get("accept") || "*/*",
      "accept-language": request.headers.get("accept-language") || "en-US,en;q=0.9",
      "content-type": request.headers.get("content-type") || "",
      "cookie": request.headers.get("cookie") || "",
    }

    if (!forwardHeaders["content-type"]) {
      delete forwardHeaders["content-type"]
    }

    const res = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: body ? Buffer.from(body) : undefined,
      redirect: "manual",
    })

    const resHeaders = new Headers()
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding" && key.toLowerCase() !== "content-length") {
        resHeaders.set(key, value)
      }
    })

    const data = await res.arrayBuffer()
    return new NextResponse(data, {
      status: res.status,
      headers: resHeaders,
    })
  } catch (error: any) {
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 })
  }
}
