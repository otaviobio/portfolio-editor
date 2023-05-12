import { useRouter } from "next/router";

export function useRefreshServerSideData() {

  const router = useRouter(); 

  function refreshData() {
    router.replace(router.asPath)
  };

  return refreshData;
}
