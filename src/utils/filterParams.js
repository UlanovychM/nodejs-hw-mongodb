const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (value) =>
    ['work', 'home', 'personal'].includes(value.toLowerCase());

  if (isType(type)) return type.toLowerCase();
};

const parseIsFavorite = (isFavorite) => {
  if (!['true', 'false'].includes(isFavorite)) return;
  return isFavorite === 'true' ? true : false;
};

export const filterParams = (query) => {
  const { type, isFavorite } = query;
  const parsedType = parseType(type);
  const parsedIsFavorite = parseIsFavorite(isFavorite);

  return {
    contactType: parsedType,
    isFavorite: parsedIsFavorite,
  };
};
