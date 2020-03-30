using System.Threading.Tasks;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public interface IUnitOfWork
  {
    Task CompleteAsync();
  }
}