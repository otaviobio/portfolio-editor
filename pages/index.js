import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PortfolioContextProvider } from "../src/context/projectsContext";
import PortfolioForm from "../src/components/molecules/PortfolioForm";
import ProjectsTable from "../src/components/molecules/ProjectsTable";
import { useEffect, useState } from "react";
import { useAuthorizedGithubUser } from "../src/hooks/useAuthorizedGithubUser";
import SignInWithGitHub from "../src/components/molecules/SignInWithGitHub";
import { Button } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const events = ["SIGNED_IN", "INITIAL_SESSION"];
function Page({ projectData }) {
  const { user, isAuthenticated, signIn, signOut, checkUser } =
    useAuthorizedGithubUser();
  const supabaseClient = useSupabaseClient();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && events.includes(event)) {
        await checkUser(session.user, event);
      }
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <SignInWithGitHub onSignIn={signIn} />;
  }

  return (
    <PortfolioContextProvider>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 24px",
          marginTop: "16px",
          color: "#36454F"
        }}
      >
        <h2 style={{fontSize: "32px", fontWeight: "600"}}>Hello, {user?.user_metadata?.user_name}!</h2>
        <Button variant="outlined" color="inherit" endIcon={<LogoutOutlinedIcon />} onClick={signOut}>
          Sign out
        </Button>
      </div>
      <ProjectsTable projectData={projectData} />
      <PortfolioForm />
    </PortfolioContextProvider>
  );
}

export async function getServerSideProps(ctx) {
  const supabase = createServerSupabaseClient(ctx);

  let { data } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true });

  const projectData = await Promise.all(
    data.map((item) => {
      const { data: img } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(`${item.imageKey}`);

      const { data: hoverImg } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(`${item.imageKey}-hover`);

      return {
        ...item,
        image: img.publicUrl,
        hoverImage: hoverImg.publicUrl,
      };
    })
  );

  return {
    props: {
      projectData: projectData,
    },
  };
}

export default Page;
