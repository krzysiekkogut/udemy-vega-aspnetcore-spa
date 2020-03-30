using System.Threading.Tasks;
using UdemyVega_AspNetCore_Spa.Core;

namespace UdemyVega_AspNetCore_Spa.Persistance
{
  public class UnitOfWork : IUnitOfWork
  {
    private readonly UdemyVegaDbContext context;

    public UnitOfWork(UdemyVegaDbContext context)
    {
      this.context = context;
    }

    public async Task CompleteAsync()
    {
      await context.SaveChangesAsync();
    }
  }
}