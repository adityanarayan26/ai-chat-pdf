import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { sendMessage } from '@/utils/Aimodel';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { extractedText, userPrompt } = await req.json();

    if (!extractedText || !userPrompt) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    const combinedText = extractedText;

    const context = `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${combinedText}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to the question, the AI assistant should try its best to provide a helpful response based on its general knowledge, but must clearly mention when information is not found in the context.
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.`;

    // Replace console.log with remote-logging compatible code or remove in production
    // console.log("Sending to AI:", `${context}\n\nBased on that, answer this: ${userPrompt}`);

    const result = await sendMessage(
      `${context}\n\nBased on that, answer this: ${userPrompt}`
    );

    let finalAnswer = result;

    try {
      const parsed = typeof result === 'string' ? JSON.parse(result) : result;

      if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
        finalAnswer = parsed.candidates[0].content.parts[0].text;
      } else if (parsed?.answer) {
        finalAnswer = parsed.answer;
      } else if (typeof parsed === 'object') {
        finalAnswer = Object.values(parsed)[0] || result;
      }
    } catch (err) {
      // Not a JSON, use original result
    }

    return NextResponse.json({ answer: finalAnswer || "I'm sorry, I couldn't generate a response." });
  } catch (error) {
    console.error('Error processing ask request:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer. Please check the input and try again.', details: error.message },
      { status: 500 }
    );
  }
}
