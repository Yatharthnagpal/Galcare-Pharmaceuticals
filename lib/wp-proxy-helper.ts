import http from "http"
import { NextRequest, NextResponse } from "next/server"

export function proxyToWordPress(req: NextRequest, targetPath: string): Promise<NextResponse> {
  return new Promise((resolve) => {
    const { search } = req.nextUrl
    const path = targetPath + search
    const method = req.method

    const headers: Record<string, string> = {
      "host": "galcare.com",
      "user-agent": req.headers.get("user-agent") || "Mozilla/5.0",
      "accept": req.headers.get("accept") || "*/*",
      "accept-language": req.headers.get("accept-language") || "en-US,en;q=0.9",
    }

    const contentType = req.headers.get("content-type")
    if (contentType) headers["content-type"] = contentType

    const cookie = req.headers.get("cookie")
    if (cookie) headers["cookie"] = cookie

    const options: http.RequestOptions = {
      hostname: "118.139.178.174",
      port: 80,
      path: path,
      method: method,
      headers: headers,
    }

    const proxyReq = http.request(options, async (proxyRes) => {
      const chunks: Buffer[] = []
      proxyRes.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
      proxyRes.on("end", () => {
        const body = Buffer.concat(chunks)
        const responseHeaders = new Headers()

        Object.entries(proxyRes.headers).forEach(([key, val]) => {
          if (val && key.toLowerCase() !== "content-encoding" && key.toLowerCase() !== "content-length") {
            if (Array.isArray(val)) {
              val.forEach((v) => responseHeaders.append(key, v))
            } else {
              responseHeaders.set(key, val)
            }
          }
        })

        resolve(
          new NextResponse(body, {
            status: proxyRes.statusCode || 200,
            headers: responseHeaders,
          })
        )
      })
    })

    proxyReq.on("error", (err) => {
      resolve(new NextResponse(`Proxy Error: ${err.message}`, { status: 500 }))
    })

    if (method !== "GET" && method !== "HEAD") {
      req.arrayBuffer().then((buf) => {
        proxyReq.write(Buffer.from(buf))
        proxyReq.end()
      }).catch(() => proxyReq.end())
    } else {
      proxyReq.end()
    }
  })
}
