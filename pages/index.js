import { supabase } from "../lib/supabaseClient";
import { PortfolioContextProvider } from "../src/context/projectsContext";
import PortfolioForm from "../src/components/molecules/PortfolioForm";
import ProjectsTable from "../src/components/molecules/ProjectsTable";

function Page({ projectData }) {

  return (
    <PortfolioContextProvider>
      <ProjectsTable projectData={projectData} />
      <PortfolioForm />
    </PortfolioContextProvider>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from("projects").select("*").order("id", {ascending: true});

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
