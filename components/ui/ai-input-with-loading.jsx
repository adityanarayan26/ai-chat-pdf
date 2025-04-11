"use client";;
import { CornerRightUp, File } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { TextShimmer } from "./text-shimmer";
import { Button } from "./button";
import { ShinyText } from "./shiny-text";
import axios from "axios";


export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "Ask me anything!",
  minHeight = 56,
  maxHeight = 200,
  loadingDuration = 3000,
  thinkingDuration = 1000,
  onSubmit,
  className,
  autoAnimate = false
}) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(autoAnimate);
  const [isAnimating, setIsAnimating] = useState(autoAnimate);
  const [file,setFile]=useState(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
const pdf= useRef(null)
  useEffect(() => {
    let timeoutId;

    const runAnimation = () => {
      if (!isAnimating) return;
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, thinkingDuration);
      }, loadingDuration);
    };

    if (isAnimating) {
      runAnimation();
    }

    return () => clearTimeout(timeoutId);
  }, [isAnimating, loadingDuration, thinkingDuration]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || submitted) return;
    
    setSubmitted(true);
    await onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
    
    setTimeout(() => {
      setSubmitted(false);
    }, loadingDuration);
  };


  const handleFileChange = async (e) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
       const response =  await axios.post("/api/pdf-parse", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
      console.log('response',response);
      const data = response.data
  
        if (data.text) {
          setInputValue(data.text); // Put extracted text in input box
        } else {
          console.error("PDF parsing failed:", data.error);
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div
        className="relative max-w-xl w-full outline-none mx-auto flex items-start flex-col gap-2">
   {file &&  <div className=" mx-auto px-2 py-1 flex gap-x-1 items-center rounded-lg bg-zinc-300 text-black">             <File className="text-black"  size={16}/>
   <p className="text-xs italic">{file.name}</p></div> }

        <div className="relative max-w-xl w-full mx-auto outline-none">
          <Textarea
            id={id}
            placeholder={placeholder}
            className={cn(
              "max-w-xl bg-zinc-800 outline-none dark:bg-white/5 w-full rounded-3xl pl-6 pr-10 py-4",
              "placeholder:text-white dark:placeholder:text-white/70",
              "border-none  dark:ring-white/30",
              "  text-white dark:text-white resize-none text-wrap leading-[1.2]",
              `min-h-[${minHeight}px]`
            )}
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={submitted} />
            <input type="file" accept="application/pdf" className="hidden" ref={pdf} onChange={handleFileChange}/>
          <button
            onClick={handleSubmit}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-xl py-1 px-1",
              submitted ? "bg-none" : "bg-black/5 dark:bg-white/5"
            )}             
            type="button"
            disabled={submitted}>
            {submitted ? (
              <div
                className="w-4 h-4 bg-white dark:bg-white rounded-sm animate-spin transition duration-700"
                style={{ animationDuration: "3s" }} />
            ) : (
              <div className="flex gap-x-2 items-center">
             <button onClick={()=>pdf.current.click()} className="cursor-pointer">

             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
</svg>
             </button>

              <CornerRightUp
                className={cn(
                  "w-4 h-4 transition-opacity dark:text-white",
                  inputValue ? "opacity-100" : "opacity-30"
                )}
                />
                </div>
            )}
          </button>
          
        </div>
         {submitted &&  <div>
          <TextShimmer className='pl-4 h-4 font-sans mx-auto text-xs' duration={1}>
  Ai is thinking ...
                    </TextShimmer>
         </div> }
      </div>
    </div>
  );
}