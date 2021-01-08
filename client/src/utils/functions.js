import queryString from 'query-string';

export const getSearchQuery = (newFilter, currentSearch = {}) => {
  const { name, category, min, max } = currentSearch;

  newFilter.name = newFilter.name || name;
  newFilter.category = newFilter.category || category;
  newFilter.min = newFilter.min || min;
  newFilter.max = newFilter.max || max;

  if (newFilter.category === 'any') newFilter.category = undefined;
  if (newFilter.min === 'any') newFilter.min = undefined;
  if (newFilter.max === 'any') newFilter.max = undefined;

  const newSearchQuery = queryString.stringify(newFilter);

  return newSearchQuery;
};
