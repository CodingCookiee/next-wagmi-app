import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {

  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }