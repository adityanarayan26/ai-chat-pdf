"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

const CustomCursorButton = React.forwardRef(({ className, children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const cursorRef = React.useRef(null)

  React.useEffect(() => {
    const cursor = document.createElement("div")
    cursorRef.current = cursor
    
    cursor.className = cn(
      "w-[21px] h-[21px]",
      "fixed -left-[6px] -top-[5px]",
      "pointer-events-none select-none hidden",
      "bg-[url('https://assets.codepen.io/165585/default.png')]",
      "bg-cover bg-no-repeat",
      "drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
    )
    
    document.body.appendChild(cursor)
    document.body.style.cursor = "none"

    const positionElement = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    const showCursor = () => {
      cursor.style.display = "block"
    }

    const hideCursor = () => {
      cursor.style.display = "none"
    }

    window.addEventListener("pointermove", positionElement)
    window.addEventListener("pointermove", showCursor)
    window.addEventListener("pointerleave", hideCursor)
    window.addEventListener("pointerout", hideCursor)

    return () => {
      window.removeEventListener("pointermove", positionElement)
      window.removeEventListener("pointermove", showCursor)
      window.removeEventListener("pointerleave", hideCursor)
      window.removeEventListener("pointerout", hideCursor)
      document.body.removeChild(cursor)
      document.body.style.cursor = ""
    };
  }, [])

  React.useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.backgroundImage = isHovered 
        ? "url('https://assets.codepen.io/165585/pointer.png')"
        : "url('https://assets.codepen.io/165585/default.png')"
    }
  }, [isHovered])

  return (
    <button
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "appearance-none border-none outline-none",
        "min-w-[120px] px-5 py-3",
        "text-white font-semibold text-base leading-6",
        "rounded-[10px] bg-[#15181C] dark:bg-[#15181C]",
        "cursor-none",
        "shadow-[0px_8px_20px_-8px_rgba(26,33,43,0.50),0px_4px_12px_0px_rgba(26,33,43,0.05),0px_1px_3px_0px_rgba(26,33,43,0.25),0px_1.5px_0.5px_0px_#454D57_inset,0px_-3px_1px_0px_rgba(0,0,0,0.50)_inset]",
        "transform-gpu transition-transform duration-200",
        "hover:scale-x-[1.03] hover:scale-y-[1.06]",
        "active:scale-x-[0.98] active:scale-y-[0.96]",
        className
      )}
      {...props}>
      {children}
    </button>
  );
})

CustomCursorButton.displayName = "CustomCursorButton"

export { CustomCursorButton }