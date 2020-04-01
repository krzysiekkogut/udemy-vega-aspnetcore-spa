namespace UdemyVega_AspNetCore_Spa.Extensions
{
  public interface IQueryObject
  {
    string SortBy { get; set; }
    bool IsSortDescending { get; set; }
    int Page { get; set; }
    int PageSize { get; set; }
  }
}