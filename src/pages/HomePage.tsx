import React from 'react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { TrustValueSection } from '@/components/marketing/TrustValueSection'
import { CoreServicesSection } from '@/components/marketing/CoreServicesSection'
import { ProductShowcaseSection } from '@/components/marketing/ProductShowcaseSection'
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection'
import { DataTransparencySection } from '@/components/marketing/DataTransparencySection'
import { AdvisorShowcaseSection } from '@/components/marketing/AdvisorShowcaseSection'
import { FAQSection } from '@/components/marketing/FAQSection'
import { FinalCTASection } from '@/components/marketing/FinalCTASection'

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* 1. Hero Section (Spacious two-column composition with student visual & floating panels) */}
      <HeroSection />

      {/* 2. Section 1: Trust and Product Value (Beyond raw marks: 5 interrelated dimensions) */}
      <TrustValueSection />

      {/* 3. Section 2: Core Services (4 distinctive alternating editorial layouts: Recs, Cutoffs, AI, Fees) */}
      <CoreServicesSection />

      {/* 4. Section 3: Product Showcase (Desktop-style interactive decision cockpit mockup) */}
      <ProductShowcaseSection />

      {/* 5. Section 4: How UniRaah Works (3-step progressive timeline reflecting actual discovery flow) */}
      <HowItWorksSection />

      {/* 6. Section 5: Official-Data Transparency (Grounding, cycle variance, verified documents) */}
      <DataTransparencySection />

      {/* 7. Section 6: AI Admission Advisor Showcase (Sample query, concise answer, source reference card) */}
      <AdvisorShowcaseSection />

      {/* 8. Section 7: Frequently Asked Questions (Accessible interactive accordion, Karachi scope) */}
      <FAQSection />

      {/* 9. Section 8: Final Call to Action (High-contrast conversion banner) */}
      <FinalCTASection />
    </div>
  )
}
