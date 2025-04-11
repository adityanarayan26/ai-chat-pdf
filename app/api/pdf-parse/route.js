import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileId = nanoid(6);
    const filename = file.name.replaceAll(" ", "_");
    const renamedFilename = `${filename
      .split(".")
      .slice(0, -1)
      .join(".")}_${fileId}.${filename.split(".").pop()}`;

    const filePath = path.join(process.cwd(), "docs/pdfFiles/", renamedFilename);
    await mkdir(path.join(process.cwd(), "docs/pdfFiles"), { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({ fileId: renamedFilename });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to save file", details: error.message },
      { status: 500 }
    );
  }
}