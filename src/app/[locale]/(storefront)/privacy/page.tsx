export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-brand-gradient">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-lg">Last Updated: May 4, 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This includes your name, email address, phone number, and shipping address.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">2. How We Use Your Information</h2>
          <p>We use the information we collect to process your orders, provide customer support, and send you updates about your purchases. We may also use your contact information to send you marketing communications, which you can opt out of at any time.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">3. Data Security</h2>
          <p>We take the security of your personal information seriously and use industry-standard measures to protect it. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Services</h2>
          <p>We use third-party services like Razorpay for payment processing and Supabase for database management. These services have their own privacy policies governing how they handle your information.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at bsrshoppingmall@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
