"use client";

import { useState } from "react";
import { LucideCopy, LucideCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
      aria-label="Copy value"
    >
      {copied ? (
        <LucideCheck className="size-3.5 text-green-500" />
      ) : (
        <LucideCopy className="size-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}
