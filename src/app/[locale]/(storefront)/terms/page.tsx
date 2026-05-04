export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-brand-gradient">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-lg">Last Updated: May 4, 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>By accessing or using BSR Shopping Mall, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">2. Purchases and Payments</h2>
          <p>All purchases made through BSR Shopping Mall are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Payments are processed through Razorpay.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">3. Shipping and Returns</h2>
          <p>Shipping times are estimates and not guaranteed. Please refer to our Shipping Policy for more details. Returns are accepted within 7 days of delivery for eligible items in original condition.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">4. Intellectual Property</h2>
          <p>All content on BSR Shopping Mall, including text, graphics, and logos, is the property of BSR Shopping Mall and is protected by copyright and other intellectual property laws.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>BSR Shopping Mall shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">6. Governing Law</h2>
          <p>These terms are governed by the laws of India and the state of Andhra Pradesh.</p>
        </section>
      </div>
    </div>
  );
}
