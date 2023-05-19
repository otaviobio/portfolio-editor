import { useRouter } from "next/router";

export function useRefreshServerSideData() {

  const router = useRouter(); 

  function refreshData() {
    router.reload();
  };

  return refreshData;
}
