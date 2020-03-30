using System.Threading.Tasks;

namespace udemy_vega_aspnetcore_spa.Persistance
{
  public interface IUnitOfWork
  {
    Task CompleteAsync();
  }
}