export const useRouter = (root: any) => {
  return {
    router: root.$router,
    route: root.$route,
  };
};
