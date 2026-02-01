"use client"

import { useEffect } from "react"
import { errorEmitter } from "@/firebase/error-emitter"
import { useToast } from "@/hooks/use-toast"
import { FirestorePermissionError } from "@/firebase/errors"

export function FirebaseErrorListener() {
  const { toast } = useToast()

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throwing the error in development will show the Next.js error overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
      
      // In production, we'll just show a toast
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You do not have permission to perform this action.",
      })
    }

    errorEmitter.on("permission-error", handleError)

    return () => {
      errorEmitter.off("permission-error", handleError)
    }
  }, [toast])

  return null
}
