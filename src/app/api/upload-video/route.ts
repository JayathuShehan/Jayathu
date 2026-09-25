import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicPath = path.join(process.cwd(), "public", "hero-video.mp4");
    await writeFile(publicPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/hero-video.mp4?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Failed to save uploaded video:", error);
    return NextResponse.json(
      { error: "Failed to save video to public directory" },
      { status: 500 }
    );
  }
}
