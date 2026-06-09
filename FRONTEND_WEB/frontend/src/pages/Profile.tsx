import PageMeta from "../components/common/PageMeta";
import PageBreadCrumb from "../components/common/PageBreadCrumb";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";

export default function Profile() {
  return (
    <>
      <PageMeta
        title="Profil Utilisateur | TogoSecureNet"
        description="Gérez votre profil utilisateur TogoSecureNet"
      />
      <PageBreadCrumb pageName="Profil" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <UserInfoCard />
        <UserMetaCard />
        <UserAddressCard />
      </div>
    </>
  );
}
