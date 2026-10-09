import LeadForm from "@/components/LeadForm";
import BrandMark from "@/components/BrandMark";
import CountryFlag from "@/components/CountryFlag";
import CoverageMap from "@/components/CoverageMap";
import Icon, { type IconName } from "@/components/Icon";
import Photo, { type PhotoId } from "@/components/Photo";
import MotionEffects from "@/components/MotionEffects";
import MobileNavigation from "@/components/MobileNavigation";
import { site } from "@/lib/site";

const navigation = [
  { href: "#coverage", label: "USA & Canada" },
  { href: "#laptops", label: "Laptops" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];
const useCases: { image: PhotoId; icon: IconName; title: string; text: string; tags: string[] }[] = [
  { image: "conference", icon: "calendar", title: "Events & conferences", text: "Plan laptops for attendees, speakers and the people behind your next event.", tags: ["Conferences", "Trade shows"] },
  { image: "training", icon: "classroom", title: "Training & workshops", text: "Discuss a consistent setup for classes, corporate training and group sessions.", tags: ["Training", "Education"] },
  { image: "office-workspace", icon: "team", title: "Temporary staff", text: "Equip short-term team members for the work ahead, without a hardware purchase.", tags: ["Onboarding", "Seasonal teams"] },
  { image: "remote-work", icon: "globe", title: "Remote teams", text: "Explore rental options for teammates working across the USA and Canada.", tags: ["Remote work", "Project teams"] },
];
const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "message", title: "Get a quote", text: "Tell us your quantity, rental dates and location." },
  { icon: "laptop", title: "Find your setup", text: "Confirm available laptops and discuss your software needs." },
  { icon: "truck", title: "Plan delivery", text: "Agree on delivery and returns in the USA or Canada." },
  { icon: "check", title: "You’re ready", text: "Get set for your event, your team or your next project." },
];
const faqs = [
  { q: "Which laptops can I rent?", a: "Tell us what software you'll use and the performance you need. Our team will confirm available models and configurations with your quote. Photos show example equipment and workspaces, rather than guaranteed inventory." },
  { q: "Can I rent laptops in the USA or Canada?", a: "We serve people, businesses and teams in the United States and Canada. Include your delivery city, state or province and rental dates so we can confirm available shipping and return options." },
  { q: "How long can I rent for?", a: "Discuss daily, weekly or monthly rental needs with our team. Your quote confirms the available rental period, pricing and terms." },
  { q: "Can you help with software and configuration?", a: "Include your applications, operating system and setup requirements. We’ll confirm which configuration services are available for your rental." },
  { q: "What should I include in my quote request?", a: "Your name and email are enough to start. Quantity, dates, delivery location and a short description of your project help us prepare a useful response. Company, phone and rental details are optional." },
];
function Brand() {
  return <a href="#top" className="brand" aria-label="LaptopRent home"><span className="brand-mark"><BrandMark /></span><span className="brand-wordmark"><span>Laptop</span><span className="brand-rent">Rent</span></span></a>;
}
function QuoteLink() {
  return <a className="button" href="#quote">Get a quote<span className="button-arrow"><Icon name="arrow" /></span></a>;
}
function Countries() {
  return <><span className="country-label"><CountryFlag country="us" />United States</span><span className="country-label"><CountryFlag country="ca" />Canada</span></>;
}
function Eyebrow({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="eyebrow"><span className="section-index">{number}</span>{children}</p>;
}
export default function Home() {
  return <div id="top">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container header-inner">
      <Brand /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <div className="header-actions"><QuoteLink /><MobileNavigation links={navigation} /></div>
    </div></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-heading"><div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow" data-intro="rise"><span className="status-dot" />Laptop rentals for people, businesses & teams</p>
          <h1 id="hero-heading"><span className="headline-line"><span data-intro="headline">Laptop rentals</span></span>{" "}<span className="headline-line"><span data-intro="headline" data-motion-delay="100">for any occasion.</span></span>{" "}<span className="headline-line"><span className="serif-accent" data-intro="headline" data-motion-delay="200">USA & Canada.</span></span></h1>
          <p className="hero-description" data-intro="rise" data-motion-delay="250">Laptops for events, training, temporary staff and remote teams. Flexible rental periods. Your next project, covered.</p>
          <div className="hero-benefits" data-intro="rise" data-motion-delay="300"><Countries /><span><Icon name="truck" />Delivery options</span></div>
          <div className="hero-actions" data-intro="rise" data-motion-delay="350"><QuoteLink /><a href="#how-it-works" className="process-link"><span className="play-circle"><Icon name="play" /></span><span>See how it works<small>Four simple steps</small></span></a></div>
          <MotionEffects />
        </div>
        <div className="hero-visual" aria-label="Real laptop and team photography">
          <div className="hero-lime-shape" aria-hidden="true" />
          <div className="hero-team-photo" data-intro="rise" data-motion-delay="100"><Photo id="team-collaboration" eager sizes="(min-width: 1200px) 580px, (min-width: 768px) 50vw, 90vw" /></div>
          <div className="hero-desk-photo" data-intro="rise" data-motion-delay="200"><Photo id="workshop-desk" sizes="220px" /></div>
          <figure className="hero-photo" data-parallax><Photo id="hero-laptop" eager intro sizes="(min-width: 1200px) 610px, (min-width: 768px) 50vw, 95vw" /><figcaption className="sr-only">Example laptop photography. Your quote confirms available models.</figcaption></figure>
          <div className="hero-feature-card" data-intro="badge" data-motion-delay="450"><span><Icon name="laptop" />Equipment options</span><span><Icon name="settings" />Software planning</span><span><Icon name="truck" />USA & Canada</span><span><Icon name="headphones" />Rental guidance</span></div>
          <p className="hero-handnote" data-intro="rise" data-motion-delay="550"><span aria-hidden="true">⤴</span>Ready for<br />your next chapter.</p>
        </div>
      </div></section>
      <div className="container"><div className="occasion-strip" aria-label="Rental occasions"><p>For the way you work. Wherever work takes you.</p><div><span>Events</span><span>Training</span><span>Business</span><span>Projects</span><span>Remote teams</span></div></div></div>
      <section id="laptops" className="section use-case-section" aria-labelledby="use-case-heading"><div className="container">
        <div className="section-heading" data-motion="rise"><div><Eyebrow number="01">Find your fit</Eyebrow><h2 id="use-case-heading">Different needs.<br /><span className="serif-accent">Same possibilities.</span></h2></div><p className="section-intro">From small team workshops to large conferences, let’s find the laptops for your goals. Tell us what you need and we’ll talk through the options.</p></div>
        <div id="use-cases" className="use-case-grid">{useCases.map((item, index) => <article className="use-case-card" key={item.title} data-motion="rise" data-motion-delay={index * 130} data-tilt>
          <div className="case-photo"><Photo id={item.image} sizes="(min-width: 1200px) 280px, (min-width: 1024px) 23vw, (min-width: 600px) 46vw, 90vw" /></div>
          <div className="case-body"><span className="case-icon"><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p><div className="tag-list">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href="#quote" className="case-link" aria-label={`Request a quote for ${item.title}`}><Icon name="arrow" /></a></div>
        </article>)}</div>
      </div></section>
      <section id="how-it-works" className="process-section" aria-labelledby="process-heading"><div className="container">
        <div className="section-heading" data-motion="rise"><div><Eyebrow number="02">How it works</Eyebrow><h2 id="process-heading">You bring the plan.<br /><span className="serif-accent">We’ll talk laptops.</span></h2></div><p className="section-intro">A clear path from your first request to your next project. Start with a quote, without a commitment.</p></div>
        <ol className="steps">{steps.map((step, index) => <li key={step.title} data-motion="rise" data-motion-delay={index * 120}><span className="step-icon"><Icon name={step.icon} /></span><h3>{index + 1}. {step.title}</h3><p>{step.text}</p>{index < steps.length - 1 && <Icon name="arrow" className="step-arrow" />}</li>)}</ol>
      </div></section>
      <section id="quote" className="section quote-section" aria-labelledby="quote-section-heading"><div className="container quote-layout">
        <div className="quote-copy" data-motion="rise"><Eyebrow number="03">Get started</Eyebrow><h2 id="quote-section-heading">Get a quote.<br /><span className="serif-accent">It’s quick and easy.</span></h2><p>Share a few details about your laptop rental needs and let’s plan your next event or project.</p><ul className="quote-benefits">{["No commitment to request a quote", "Flexible rental periods", "Delivery options in the USA & Canada", "Discuss software and configuration"].map(benefit => <li key={benefit}><span><Icon name="check" /></span>{benefit}</li>)}</ul></div>
        <div className="quote-form-panel" data-motion="rise" data-motion-delay="150"><LeadForm /></div>
      </div></section>
      <section id="coverage" className="coverage-section" aria-labelledby="coverage-heading"><div className="container"><div className="coverage-layout">
        <div className="coverage-copy" data-motion="rise"><p className="eyebrow"><Icon name="globe" />Your country. Your rental plans.</p><h2 id="coverage-heading">USA & Canada.<br /><span className="serif-accent">Your next destination.</span></h2><p>Office, classroom or conference venue. Tell us your city, state or province, and we’ll confirm delivery options and timing for your rental.</p><div className="country-chips"><Countries /></div></div>
        <div className="coverage-map-scene" data-motion="photo"><CoverageMap /><div className="delivery-note"><Icon name="truck" /><span>Let’s plan delivery<br /><strong>where you need it.</strong></span></div><p className="map-caption">Example destinations. Your quote confirms delivery availability.</p></div>
      </div></div></section>
      <section id="faq" className="section faq-section" aria-labelledby="faq-heading"><div className="container faq-layout">
        <div data-motion="rise"><Eyebrow number="04">Good questions</Eyebrow><h2 id="faq-heading">A little clarity.<br /><span className="serif-accent">A lot of possibility.</span></h2></div>
        <div className="faq-list">{faqs.map(faq => <details key={faq.q} data-motion="rise"><summary>{faq.q}<span aria-hidden="true" className="faq-plus">+</span></summary><p>{faq.a}</p></details>)}</div>
      </div></section>
      <section className="final-cta" aria-labelledby="cta-heading"><div className="container"><div className="final-cta-layout">
        <div className="cta-photo" data-parallax><Photo id="team-collaboration" sizes="(min-width: 1200px) 1180px, 95vw" /></div><div className="cta-copy" data-motion="rise"><p className="eyebrow"><span className="status-dot" />Laptop rentals · USA & Canada</p><h2 id="cta-heading">Let’s get to work.</h2><p>Tell us what you need. Let’s find the laptops for it.</p><QuoteLink /></div>
      </div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><Brand /><nav aria-label="Footer navigation">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><a href="#top" className="back-top">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}. Laptop rentals for the work ahead.</span><span>Example equipment and workspaces. <a href="/photo-credits.html">Photo credits</a></span></div></div></footer>
  </div>;
}
