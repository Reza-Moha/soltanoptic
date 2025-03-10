import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function SubmitBtn({ children, disabled = false }) {
  return (
    <div className="w-full inline-flex items-center justify-center">
      <RainbowButton disabled={disabled}>{children}</RainbowButton>
    </div>
  );
}
