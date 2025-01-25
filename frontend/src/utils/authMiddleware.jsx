export default async function authMiddleware(req) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return null;
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/user-profile`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            Cookie: `accessToken=${accessToken};refreshToken=${refreshToken}`,
          },
        }
    );

    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          }
      );

      if (!refreshResponse.ok) {
        return null;
      }

      const refreshData = await refreshResponse.json();
      const { user } = refreshData || {};
      if (!user) {
        return null;
      }

      return user;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const { user } = data || {};
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return null;
  }
}
