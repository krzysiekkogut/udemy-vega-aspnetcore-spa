using System.Collections.Generic;

namespace UdemyVega_AspNetCore_Spa.Core.Models
{
  public class QueryResult<T>
  {
    public int TotalCount { get; set; }
    public IEnumerable<T> Items { get; set; }
  }
}