'use client'
import { Button } from '@/components/ui/button';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput, ChatInputSubmit, ChatInputTextArea } from '@/components/ui/chat-input'
import { Particles } from '@/components/ui/particles';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { CustomCursorButton } from '@/components/ui/wood-cursor';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner';

const page = () => {
    const pdf = useRef(null)
    const chatContainerRef = useRef(null);
    const [InputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            role: "ai",
            content: "Hey there! I am your AI assistant. You can ask me anything about the library.",
        }
    ]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSubmit = async () => {
        if (!InputValue.trim()) return; // Prevent sending empty messages
        if (!fileId) {
            toast.error("Please upload a PDF file first.");
            return;
        }

        try {
            // Append user message to chat
            setChatHistory((prev) => [...prev, { role: "user", content: InputValue }]);
            setIsLoading(true);

            // Ask question
            const askRes = await axios.post("/api/ask", {
                fileId,
                userPrompt: InputValue,
            });

            let answer = askRes.data.answer;

            try {
                if (typeof answer === 'string') {
                    try {
                        const parsed = JSON.parse(answer);

                        // If it's the Gemini format
                        if (Array.isArray(parsed?.candidates) && parsed.candidates[0]?.content?.parts?.[0]?.text) {
                            const inner = parsed.candidates[0].content.parts[0].text;
                            try {
                                const innerParsed = JSON.parse(inner);
                                answer = innerParsed.answer || innerParsed.response || innerParsed.skills?.join(", ") || JSON.stringify(innerParsed, null, 2);
                            } catch (e) {
                                answer = inner;
                            }
                        } else {
                            answer = parsed.answer || parsed.response || parsed.parts?.[0]?.text || JSON.stringify(parsed, null, 2);
                        }
                    } catch (err) {
                        console.error("Error parsing answer:", err);
                    }
                } else if (typeof answer === 'object') {
                    answer = answer.answer || answer.response || answer.parts?.[0]?.text || JSON.stringify(answer, null, 2);
                }
            } catch (err) {
                console.error("Error parsing answer:", err);
            }

            // Append AI response to chat
            setChatHistory((prev) => [...prev, { role: "ai", content: answer }]);
            setIsLoading(false);

            setInputValue(""); // Clear input if needed
        } catch (error) {
            console.error("Error during AI interaction:", error);
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const formData = new FormData();
            formData.append("file", selectedFile);

            setPdfLoading(true);
            setIsUploading(true);
            try {
                const response = await axios.post("/api/pdf-parse", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const data = response.data;
                if (data.fileId) {
                    setFileId(data.fileId);
                    setChatHistory((prev) => [...prev, {
                        role: "user",
                        content: `📄 PDF "${selectedFile.name}" .`,
                    }]);
                    console.log("Uploaded File ID:", data.fileId);
                } else {
                    console.error("File upload failed:", data.error);
                }
                setIsUploading(false);
            } catch (error) {
                console.error("Error uploading PDF:", error);
                setIsUploading(false);
            }
            setPdfLoading(false);
        }
    };

    return (
<div>
            {pdfLoading && (
                <div className="absolute top-10 left-[50%] translate-x-[-50%] bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <TextShimmer>  Uploading and parsing PDF...</TextShimmer>
                </div>
            )}
            {isLoading && (
                <div className="absolute top-20 left-[50%] translate-x-[-50%] bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                  <TextShimmer>Generating answer...</TextShimmer>
                </div>
            )}
            <div className='h-screen w-full flex justify-center pt-20 bg-zinc-950 relative'>
               <ShootingStars
                       starColor="#ffffff"
                       trailColor="#ffffff"
                       minSpeed={6}
                       maxSpeed={10}
                       minDelay={1000}
                       maxDelay={3000}
                     />
               <ShootingStars
                       starColor="#ffffff"
                       trailColor="#ffffff"
                       minSpeed={6}
                       maxSpeed={10}
                       minDelay={1000}
                       maxDelay={3000}
                     />
               
               <ShootingStars
                       starColor="#ffffff"
                       trailColor="#ffffff"
                       minSpeed={6}
                       maxSpeed={10}
                       minDelay={1000}
                       maxDelay={3000}
                     />
               
               <ShootingStars
                       starColor="#ffffff"
                       trailColor="#ffffff"
                       minSpeed={6}
                       maxSpeed={10}
                       minDelay={1000}
                       maxDelay={3000}
                     />
               <ShootingStars
                       starColor="#ffffff"
                       trailColor="#ffffff"
                       minSpeed={6}
                       maxSpeed={10}
                       minDelay={1000}
                       maxDelay={3000}
                     />
               
               <Particles
        className="absolute inset-0"
        quantity={150}
        ease={50}
        color='#ffffff'
        refresh
      />
        <CustomCursorButton className='hidden'/>
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%), bg-[url('/stars-bg.png')] bg-cover bg-repeat" />
            <div ref={chatContainerRef} className='w-[80%] h-[calc(100vh-200px)] overflow-y-auto pr-2'>
                {chatHistory.map((msg, index) => (
                 
             
                  <ChatBubble key={index} variant={msg.role === "user" ? "sent" : "received"}>
                        <ChatBubbleAvatar fallback={msg.role === "user" ? "ME" : "AI"} />
                        <ChatBubbleMessage variant={msg.role === "user" ? "sent" : "received"}>
                            {typeof msg.content === 'string' ? msg.content.replace(/^"(.*)"$/, '$1') : JSON.stringify(msg.content)}
                        </ChatBubbleMessage>
                    </ChatBubble>
                  
                ))}
            </div>

            <div className='absolute bottom-5 left-[50%] translate-x-[-50%]'>
               
                <div className='flex flex-col  items-start justify-center'>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="w-full flex items-center  bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2"
                    >
                        <textarea
                            className="flex-grow cursor-default bg-transparent text-white resize-none outline-none h-10 max-h-40 overflow-y-auto"
                            placeholder="Type a message..."
                            value={InputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            rows={1}
                        />
                        <button className='text-white cursor-none' onClick={()=>pdf.current.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
</svg>
<input type="file" name="" accept='application/pdf' className='hidden' ref={pdf} id="" onChange={handleFileChange} />
                        </button>
                        <button
                            type="submit"
                            disabled={!fileId || isUploading}
                            className={`ml-2 p-2 ${
                              !fileId || isUploading ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white"
                            } transition-colors`}
                            aria-label="Send message"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M2.01 21L23 12 2.01 3v7l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default page
