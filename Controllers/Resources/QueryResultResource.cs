using System.Collections.Generic;

namespace UdemyVega_AspNetCore_Spa.Controllers.Resources
{
  public class QueryResultResource<T>
  {
    public int TotalCount { get; set; }
    public IEnumerable<T> Items { get; set; }
  }
}