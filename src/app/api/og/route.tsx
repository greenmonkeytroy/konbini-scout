import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("shelf");

  let title = "Konbini Scout";
  let creatorName = "";
  let snackNames: string[] = [];

  if (slug) {
    try {
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      const shelf = await client.query(api.shelves.bySlug, { slug });
      if (shelf) {
        title = shelf.title;
        creatorName = (shelf.creator as { name?: string } | null)?.name ?? "";
        snackNames = shelf.snacks
          .filter((s): s is NonNullable<typeof s> => s !== null)
          .map((s) => s.name);
      }
    } catch {
      // fall through to default branding
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F5EFE0",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand pill */}
        <div style={{ display: "flex", marginBottom: "36px" }}>
          <div
            style={{
              backgroundColor: "#D4281C",
              color: "white",
              fontSize: "20px",
              fontWeight: 700,
              padding: "8px 20px",
              borderRadius: "8px",
              letterSpacing: "0.08em",
            }}
          >
            KONBINI SCOUT
          </div>
        </div>

        {/* Shelf title */}
        <div
          style={{
            fontSize: title.length > 40 ? "52px" : "68px",
            fontWeight: 900,
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: "16px",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {creatorName ? (
          <div style={{ fontSize: "26px", color: "#888", marginBottom: "32px" }}>
            by {creatorName}
          </div>
        ) : null}

        {/* Snack pills */}
        {snackNames.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "auto",
              paddingBottom: "32px",
            }}
          >
            {snackNames.map((name, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  border: "2px solid #E8DCC8",
                  borderRadius: "10px",
                  padding: "10px 22px",
                  fontSize: "20px",
                  color: "#1A1A1A",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#D4281C", fontWeight: 800 }}>{i + 1}</span>
                {name}
              </div>
            ))}
          </div>
        ) : null}

        {/* Footer rule + tagline */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid #D8CCBA",
            fontSize: "20px",
            color: "#AAA",
          }}
        >
          Your guide to the best Asian snacks you haven't tried yet.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
