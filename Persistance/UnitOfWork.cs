using System.Threading.Tasks;

namespace udemy_vega_aspnetcore_spa.Persistance
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