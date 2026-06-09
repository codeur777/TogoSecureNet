import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Inscription | TogoSecureNet - Système de Surveillance"
        description="Page d'inscription pour accéder au système de surveillance TogoSecureNet"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
