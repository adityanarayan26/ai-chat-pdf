import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { sendMessage } from '@/utils/Aimodel';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { extractedText, userPrompt } = await req.json();

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

    const result = await sendMessage(
      `${context}\n\nBased on that, answer this: ${userPrompt}`
    );

    let finalAnswer = result;

    // Try to parse if the result is JSON string (from Gemini or similar)
    try {
      if (finalAnswer) {
        console.log(finalAnswer);
        try {
          const parsed = JSON.parse(finalAnswer);
          // If you expect one key-value pair only
          const firstKey = Object.keys(parsed)[0];
          finalAnswer = parsed[firstKey];
        } catch (e) {
          // Not a JSON object, keep original
        }
      }
      const parsed = JSON.parse(result);
      if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
        finalAnswer = parsed.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      // If not JSON, keep the original result
    }

    return NextResponse.json({ answer: finalAnswer });
  } catch (error) {
    console.error('Error processing ask request:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer. Please check the input and try again.', details: error.message },
      { status: 500 }
    );
  }
}
