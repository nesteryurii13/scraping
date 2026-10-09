"use client";

import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import Icon from "@/components/Icon";

type Status = "idle" | "submitting" | "success" | "error";
const FORM_NAME = "lead";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const successHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const previousStatus = useRef<Status>("idle");

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
    if (status === "idle" && previousStatus.current === "success") formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus();
    previousStatus.current = status;
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    const digits = phone.replace(/\D/g, "");
    if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || !/^(?:1)?\d{10}$/.test(digits))) {
      setPhoneError("Use a 10-digit US or Canadian number, with an optional +1.");
      form.querySelector<HTMLInputElement>("input[name=phone]")?.focus();
      return;
    }
    const start = String(data.get("rental-start") ?? "");
    const end = String(data.get("rental-end") ?? "");
    if (start && end && end < start) {
      setDateError("Choose an end date on or after your start date.");
      form.querySelector<HTMLDetailsElement>("details")?.setAttribute("open", "");
      form.querySelector<HTMLInputElement>("input[name=rental-end]")?.focus();
      return;
    }
    setPhoneError("");
    setDateError("");
    setStatus("submitting");
    try {
      const body = new URLSearchParams(Array.from(data.entries()).map(([key, value]) => [key, String(value)]));
      const response = await fetch("/__forms.html", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(), signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
      form.reset();
      setStatus("success");
    } catch { setStatus("error"); }
  }

  return <>
    <p className="sr-only" role="status" aria-live="polite">{status === "submitting" ? "Sending your quote request." : status === "success" ? "Your quote request was received." : ""}</p>
    {status === "success" ? <div className="form-success"><div className="success-icon"><Icon name="check" /></div><h2 ref={successHeading} tabIndex={-1}>Thanks. Your request is in.</h2><p>Our team will follow up about laptop availability and your rental requirements.</p><button className="button" type="button" onClick={() => setStatus("idle")}>Send another request<Icon name="arrow" /></button></div> :
    <form ref={formRef} name={FORM_NAME} method="POST" action="/thanks.html" onSubmit={handleSubmit} className="lead-form" aria-labelledby="quote-heading" aria-busy={status === "submitting"}>
      <div className="form-heading-row"><span className="form-heading-icon"><Icon name="laptop" /></span><span className="form-step">USA & CANADA</span></div><h2 id="quote-heading">Request a quote</h2><p className="form-intro">Let’s talk about availability, your setup and pricing.</p>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <div hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-fields-grid">
        <Field label="Full name" name="name" type="text" autoComplete="name" placeholder="Jane Smith" required />
        <Field label="Company name" name="company" type="text" autoComplete="organization" placeholder="Your company (optional)" />
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="jane@example.com" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="(202) 555-0143" error={phoneError} onChange={() => setPhoneError("")} />
      </div>
      <label className="field" htmlFor="quote-notes">Tell us about your needs <span className="optional">(optional)</span><textarea id="quote-notes" name="notes" rows={2} placeholder="Number of laptops, rental dates, location, software requirements…" /></label>
      <details className="rental-details"><summary>Add rental details (optional)<span aria-hidden="true">+</span></summary>
        <Field label="Number of laptops" name="quantity" type="number" min="1" step="1" placeholder="e.g. 20" />
        <div className="details-grid"><Field label="Start date" name="rental-start" type="date" onChange={() => setDateError("")} /><Field label="End date" name="rental-end" type="date" error={dateError} onChange={() => setDateError("")} /></div>
        <Field label="Delivery city / state / province" name="delivery-location" type="text" autoComplete="address-level2" placeholder="e.g. Austin, TX or Toronto, ON" />
      </details>
      <button type="submit" disabled={status === "submitting"} className="button form-submit">{status === "submitting" ? "Sending…" : "Get a quote"}<Icon name="arrow" /></button>
      {status === "error" && <p className="form-error" role="alert">Your request couldn’t be sent. Your details are still here—please try again.</p>}
      <p className="form-fineprint">We use your details to respond to your request.<br />No commitment required to ask about availability.</p>
    </form>}
  </>;
}

function Field({ label, name, error, required = false, ...props }: { label: string; name: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = `quote-${name}`;
  return <label className="field" htmlFor={id}>{label}{required && <span className="required-mark"> *</span>}{name === "phone" && <span className="optional"> (optional)</span>}<input id={id} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</label>;
}
