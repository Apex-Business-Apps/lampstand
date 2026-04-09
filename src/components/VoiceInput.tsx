import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { voiceOrchestrator as voiceManager } from "@/lib/voice/VoiceOrchestrator";
import { toast } from "sonner";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export const VoiceInput = ({ onResult }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      voiceManager.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceManager.startListening(
        (text) => {
          onResult(text);
          setIsListening(false);
        },
        (err) => {
          toast.error(err);
          setIsListening(false);
        }
      );
    }
  };

  if (!voiceManager.isSupported()) {
    return null; // Don't render if not supported
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={`relative ${isListening ? "border-primary text-primary" : ""}`}
      title={isListening ? "Stop listening" : "Start speaking"}
    >
      {isListening ? (
        <>
          <Square className="h-4 w-4 absolute" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/20 animate-ping"></span>
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
