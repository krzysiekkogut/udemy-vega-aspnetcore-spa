using Microsoft.EntityFrameworkCore;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Persistance
{
  public class UdemyVegaDbContext : DbContext
  {
    public DbSet<Make> Makes { get; set; }
    public DbSet<Model> Models { get; set; }
    public DbSet<Feature> Features { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }

    public UdemyVegaDbContext(DbContextOptions<UdemyVegaDbContext> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<VehicleFeature>().HasKey(vf => new { vf.VehicleId, vf.FeatureId });
    }
  }
}