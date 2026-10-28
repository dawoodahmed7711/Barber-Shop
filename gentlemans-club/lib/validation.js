const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(v) {
  const s = (v || "").trim();
  if (!s) return "Please enter your full name.";
  if (s.length < 2) return "Name must be at least 2 characters.";
  return "";
}

export function validateEmail(v) {
  const s = (v || "").trim();
  if (!s) return "Please enter your email address.";
  if (!EMAIL_RE.test(s)) return "Enter a valid email, like name@example.com.";
  return "";
}

export function validatePhone(v) {
  const s = (v || "").trim();
  if (!s) return "Please enter your phone number.";
  if (!/^[+\d\s().-]+$/.test(s)) return "Phone can only contain digits, spaces, + ( ) - .";
  const digits = s.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Enter a phone number with 7 to 15 digits.";
  return "";
}

export function validateRequired(v, message) {
  return (v || "").toString().trim() ? "" : message;
}

export function validateMessage(v) {
  const s = (v || "").trim();
  if (!s) return "Please write a message.";
  if (s.length < 10) return "Message should be at least 10 characters.";
  return "";
}
