"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Field from "./Field";
import DemoNotice from "./DemoNotice";
import { useToast } from "./Toast";
import { validateName, validateEmail, validateRequired, validateMessage } from "../lib/validation";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const rules = {
    name: validateName,
    email: validateEmail,
    subject: (v) => validateRequired(v, "Please add a subject."),
    message: validateMessage,
  };

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setValidated(false);
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = {};
    Object.keys(rules).forEach((k) => {
      const msg = rules[k](values[k]);
      if (msg) found[k] = msg;
    });
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      setValidated(false);
      toast.show("Please fix the highlighted fields.", "error");
      return;
    }
    // No backend: nothing is sent. Be explicit about that.
    setValidated(true);
    toast.show("Form is valid, but this demo does not send messages.", "info");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-5 sm:p-8" aria-label="Contact form">
      <DemoNotice>
        This demo contact form does not send messages. Nothing you type here leaves your browser.
      </DemoNotice>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={update("name")} />}
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          {(p) => <input {...p} type="email" autoComplete="email" value={values.email} onChange={update("email")} />}
        </Field>
      </div>
      <Field id="subject" label="Subject" required error={errors.subject}>
        {(p) => <input {...p} type="text" value={values.subject} onChange={update("subject")} />}
      </Field>
      <Field id="message" label="Message" required error={errors.message}>
        {(p) => <textarea {...p} rows={5} value={values.message} onChange={update("message")} />}
      </Field>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" /> Check Message (demo)
      </button>

      {validated && (
        <p role="status" className="rounded-lg bg-mist p-4 text-sm text-navy">
          Your message looks valid, but <strong>it was not sent</strong>. This portfolio demo has no
          email or server backend. For real inquiries, call or email the business directly.
        </p>
      )}
    </form>
  );
}
