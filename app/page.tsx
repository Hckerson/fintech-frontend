import LedgerNav from "@/components/ledgerline/ledger-nav";
import HeroSection from "@/components/ledgerline/hero-section";
import MetricsStrip from "@/components/ledgerline/metrics-strip";
import AccountsSection from "@/components/ledgerline/accounts-section";
import PaymentsSection from "@/components/ledgerline/payments-section";
import CardsSection from "@/components/ledgerline/cards-section";
import TreasurySection from "@/components/ledgerline/treasury-section";
import ReconcileSection from "@/components/ledgerline/reconcile-section";
import SecuritySection from "@/components/ledgerline/security-section";
import PricingSection from "@/components/ledgerline/pricing-section";
import FaqSection from "@/components/ledgerline/faq-section";
import ContactSection from "@/components/ledgerline/contact-section";
import LedgerFooter from "@/components/ledgerline/ledger-footer";

export default function Home() {
    return (
        <>
            <LedgerNav />
            <main>
                <HeroSection />
                <MetricsStrip />
                <AccountsSection />
                <PaymentsSection />
                <CardsSection />
                <TreasurySection />
                <ReconcileSection />
                <SecuritySection />
                <PricingSection />
                <FaqSection />
                <ContactSection />
            </main>
            <LedgerFooter />
        </>
    );
}
