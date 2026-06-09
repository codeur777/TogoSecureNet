import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Connexion | TogoSecureNet - Système de Surveillance"
        description="Page de connexion pour accéder au système de surveillance TogoSecureNet"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
