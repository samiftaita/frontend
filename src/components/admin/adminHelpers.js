export const safeText = (value, fallback = "Non renseigné") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

export const getApiErrorMessage = (
  error,
  fallback = "Une erreur est survenue.",
) => {
  if (!error) return fallback;

  const response = error.response;
  if (!response) {
    return error.message || fallback;
  }

  if (response.status === 422 && response.data?.errors) {
    const messages = Object.values(response.data.errors).flat();
    return messages.length
      ? messages.join(" ")
      : response.data.message || fallback;
  }

  return response.data?.message || fallback;
};

export const getPersonName = (entity) => {
  if (!entity) return "Non renseigné";

  const user = entity.user || entity;
  const nom = user?.nom || "";
  const prenom = user?.prenom || "";
  const fullName = `${prenom} ${nom}`.trim();

  return fullName || `ID ${entity.id || "inconnu"}`;
};

export const getDentisteLabel = (item) => {
  const dentiste = item?.dentiste;
  if (dentiste?.user) {
    const nom = [dentiste.user.prenom, dentiste.user.nom]
      .filter(Boolean)
      .join(" ");
    return nom || `Dentiste #${dentiste.id || item?.dentiste_id || "inconnu"}`;
  }

  return dentiste?.id || item?.dentiste_id || "Dentiste inconnu";
};

export const formatDateTime = (value) => {
  if (!value) return "Non renseigné";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("fr-FR");
};
