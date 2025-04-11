import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import pdfParse from 'pdf-parse';

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

    const filePath = path.join("/tmp", renamedFilename);
    await writeFile(filePath, buffer);
    
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;
    
    return NextResponse.json({ fileId: renamedFilename, filePath, extractedText });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to save file", details: error.message },
      { status: 500 }
    );
  }
}
export const config = {
  runtime: 'nodejs', // not 'edge'
};