/* eslint-disable no-undef */
const parseType = (contactType) => {
  const isString = typeof contactType === "string";

  if (!isString) return;

  const isContactType = (contactType) => {
    [("work", "home", "personal")].includes(contactType);
  };

  if (!isContactType(contactType)) {
    return "personal";
  }

  if (isContactType(contactType)) {
    return contactType;
  }
};

const parseIsFavourite = (favorite) => {
  if (typeof favorite === "boolean") {
    return favorite;
  }
  if (typeof favorite === "string") {
    const tolowercase = favorite.toLowerCase();

    if (["true", "1", "yes", "y", "on"].includes(tolowercase)) {
      return true;
    }

    if (["false", "0", "no", "n", "off"].includes(tolowercase)) {
      return false;
    }
  }

  if (typeof favorite === "number") {
    return favorite !== 0;
  }

  return null;
};

export const parseFilterParams = (query) => {
  const { type } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
