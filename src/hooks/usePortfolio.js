import { supabase } from "../../lib/supabaseClient";
import { useRefreshServerSideData } from "./useRefreshServerSideData";

export function usePortfolio() {
  const refreshData = useRefreshServerSideData();

  const addProject = async (formData) => {
    const { title, desc, link, category, imageKey } = formData;

    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, desc, link, category, imageKey }]);

    if (error) {
      console.error(error);
    } else {
      refreshData();
    }
  };

  const editProject = async (formData) => {
    const { title, desc, link, category, imageKey, id } = formData;

    const { data, error } = await supabase
      .from("projects")
      .upsert({ title, desc, link, category, imageKey, id });

    if (error) {
      console.error(error);
    } else {
      refreshData();
    }
  };

  async function uploadToSupabase(images) {
    const promises = images
      .filter((image) => !!image.file)
      .map((image) => {
        return supabase.storage
          .from("portfolio-images")
          .upload(`${image.name}`, image.file, {
            upsert: true,
            cacheControl: "0",
          })
          .then(() => console.log(`Uploaded ${image.name}`))
          .catch(() => console.log(`Error uploading ${image.name}`));
      });
    await Promise.allSettled(promises);
  }

  return {
    addProject,
    editProject,
    uploadToSupabase,
  };
}
