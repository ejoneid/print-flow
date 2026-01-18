import { Printer } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Printer Icon */}
        <div className="relative">
          <Printer className="w-16 h-16 text-primary animate-pulse" />
          {/* Paper animation */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-primary/20 rounded-sm animate-slide-down" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Print Flow</h2>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Loading</span>
            <div className="flex gap-1">
              <span className="animate-bounce [animation-delay:0ms]">.</span>
              <span className="animate-bounce [animation-delay:150ms]">.</span>
              <span className="animate-bounce [animation-delay:300ms]">.</span>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-slide-right" />
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) translateY(8px);
            opacity: 0.5;
          }
        }

        @keyframes slide-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-slide-down {
          animation: slide-down 1.5s ease-in-out infinite;
        }

        .animate-slide-right {
          animation: slide-right 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
