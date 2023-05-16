import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRefreshServerSideData } from "./useRefreshServerSideData";

export function usePortfolio() {
  const refreshData = useRefreshServerSideData();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  const addProject = async (formData) => {
    const { title, desc, link, category, imageKey } = formData;

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, desc, link, category, imageKey });

    if (error) {
      console.error(error);
    } else {
      refreshData();
    }
  };

  const editProject = async (formData) => {
    const { title, desc, link, category, id } = formData;

    const { data, error } = await supabase
      .from("projects")
      .upsert({ title, desc, link, category, id });

    if (error) {
      console.error(error);
    } else {
      refreshData();
    }
  };

  async function uploadToSupabase(images) {
    const promises = images
      .filter((image) => !!image.file)
      .map(async (image) => {
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

  async function deleteProjectById(id) {
    setIsLoading(true);
    const { data, error: selectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    const { data: storageData, error: storageError } = await supabase.storage
      .from("portfolio-images")
      .remove([data.imageKey, `${data.imageKey}-hover`]);

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (selectError) {
      console.error({
        selectError,
      });
    }

    refreshData();
    setIsLoading(false);
  }

  return {
    addProject,
    editProject,
    uploadToSupabase,
    deleteProjectById,
    isLoading,
  };
}
