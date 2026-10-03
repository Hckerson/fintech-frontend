"use client";
import { Toaster as Primitive } from "sonner";

export default function Toaster() {
    return (
        <Primitive
            theme="dark"
            position="bottom-right"
            closeButton
            toastOptions={{
                classNames: {
                    toast: "border-border-dark! bg-background-alt! text-text! rounded-lg! shadow-(--shadows-xl)! font-body!",
                    description: "text-text-secondary!",
                    closeButton:
                        "border-border-dark! bg-background-alt! text-text-secondary!",
                },
            }}
        />
    );
}
