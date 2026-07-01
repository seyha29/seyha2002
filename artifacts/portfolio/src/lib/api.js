const BASE = import.meta.env.PROD
  ? `https://${window.location.host}/api`
  : "/api";

export async function fetchPortfolio() {
  const res = await fetch(`${BASE}/portfolio/all`);
  return res.json();
}

export async function saveSection(section, data, password) {
  const res = await fetch(`${BASE}/portfolio/${section}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Unauthorized or error saving");
  return res.json();
}
