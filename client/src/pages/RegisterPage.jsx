import SignInPage from "./SignInPage";

export default function RegisterPage({ onAuthSuccess }) {
  return <SignInPage onAuthSuccess={onAuthSuccess} initialTab="create" />;
}
