import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';

// const backendUrl = `${env.PUBLIC_BACKEND_URL}-5004.app.github.dev/user`;
const backendUrl = `${env.PUBLIC_BACKEND_URL}:5004/user`;

export const load = async ({ url, cookies, fetch }) => {
	const session = cookies.get('session');
	if (!session && (url.pathname !== "/" && url.pathname !== "/register")) {
		throw redirect(302, '/');
	}
  if (session && (url.pathname === "/" || url.pathname === "/register")) {
		throw redirect(302, '/cars');
  }

	const res = await fetch(`${backendUrl}/me`, {
		credentials: 'include',
		headers: { cookie: `session=${session}` }
	});

	if (!res.ok) {
		throw redirect(302, '/');
	}

	const user = await res.json();
	return { user };
};
