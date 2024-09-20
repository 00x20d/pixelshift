import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const convertTo = formData.get("convertTo") as string;

    if (!file || !convertTo) {
      return NextResponse.json(
        { error: "File and conversion format are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let convertedBuffer: Buffer;

    switch (convertTo) {
      case "webp":
        convertedBuffer = await sharp(buffer).webp().toBuffer();
        break;
      case "png":
        convertedBuffer = await sharp(buffer).png().toBuffer();
        break;
      case "jpeg":
        convertedBuffer = await sharp(buffer).jpeg().toBuffer();
        break;
      case "avif":
        convertedBuffer = await sharp(buffer).avif().toBuffer();
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported format" },
          { status: 400 }
        );
    }

    return new NextResponse(convertedBuffer, {
      headers: {
        "Content-Type": `image/${convertTo}`,
        "Content-Disposition": `attachment; filename="converted.${convertTo}"`,
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Conversion failed. Please try again." },
      { status: 500 }
    );
  }
}
