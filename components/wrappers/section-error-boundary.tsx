"use client";
import { Component, Suspense, type ReactNode } from "react";
import { nanoid } from "nanoid";
import ErrorState from "@/components/ui/error-state";
import { ERROR_COPY } from "@/lib/data/error-messages";

interface Props {
    skeleton: ReactNode;
    children: ReactNode;
}

interface State {
    reference: string | null;
}

export default class SectionErrorBoundary extends Component<Props, State> {
    state: State = { reference: null };

    static getDerivedStateFromError(error: Error & { digest?: string }): State {
        return { reference: error.digest ?? nanoid() };
    }

    reset = () => this.setState({ reference: null });

    render() {
        return this.state.reference ? (
            <div className="surface-card p-4">
                <ErrorState
                    kind="retryable"
                    message={ERROR_COPY.sectionFailed}
                    reference={this.state.reference}
                    onRetry={this.reset}
                />
            </div>
        ) : (
            <Suspense fallback={this.props.skeleton}>
                {this.props.children}
            </Suspense>
        );
    }
}
