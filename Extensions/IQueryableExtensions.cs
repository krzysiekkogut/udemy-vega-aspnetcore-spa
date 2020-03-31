using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace UdemyVega_AspNetCore_Spa.Extensions
{
  public static class IQueryableExtensions
  {
    public static IQueryable<T> ApplyOrdering<T>(
      this IQueryable<T> query,
      IQueryObject queryObj,
      Dictionary<string, Expression<Func<T, object>>> columnsMap)
    {
      if (string.IsNullOrWhiteSpace(queryObj.SortBy) || !columnsMap.ContainsKey(queryObj.SortBy))
      {
        return query;
      }

      return queryObj.IsSortDescending
        ? query.OrderByDescending(columnsMap[queryObj.SortBy])
        : query.OrderBy(columnsMap[queryObj.SortBy]);
    }
  }
}