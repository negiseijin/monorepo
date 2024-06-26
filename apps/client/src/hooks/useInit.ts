import useSWR from "swr";

import { useCookie } from "@/hooks/useCookie";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useUser } from "@/hooks/useUser";
import { stubInit } from "@/lib/utils";

const fetcher =
  (arg: ReturnType<typeof useUser>["user"]) =>
  async (): Promise<ReturnType<typeof useUser>["user"]> => {
    return arg;
  };

const key = "init" as const;

export function useInit() {
  // set
  stubInit();

  const [name] = useCookie("name");
  const [user] = useLocalStorage<{ name: string }>("user", {
    name: "",
  });
  const { user: fetchUser, isLoading: userLoading } = useUser({
    username: name ?? user.name,
  });

  const {
    data: init,
    mutate: setInit,
    isLoading: initLoading,
  } = useSWR<Partial<ReturnType<typeof useUser>["user"]>>(key, null, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userLoading ? null : key,
    fetcher(fetchUser),
    {
      onSuccess(data) {
        if (data) {
          setInit((prev) => (prev ? [...prev, ...data] : [...data]));
        }
      },
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data,
    init,
    isError: error,
    isLoading: isLoading || userLoading || initLoading,
    mutate,
    isValidating,
  };
}
