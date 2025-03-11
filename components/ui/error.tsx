import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ErrorProps {
  title?: string
  message?: string
  retry?: () => void
}

export function ErrorMessage({
  title = "Ha ocurrido un error",
  message = "Lo sentimos, algo salió mal. Por favor, inténtalo de nuevo más tarde.",
  retry,
}: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="max-w-[500px] text-muted-foreground">{message}</p>
      {retry && (
        <Button onClick={retry} className="mt-4">
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}

export function ErrorOverlay(props: ErrorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <ErrorMessage {...props} />
    </div>
  )
} 