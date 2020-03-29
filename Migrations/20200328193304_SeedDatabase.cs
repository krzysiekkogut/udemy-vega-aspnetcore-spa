using Microsoft.EntityFrameworkCore.Migrations;

namespace udemy_vega_aspnetcore_spa.Migrations
{
  public partial class SeedDatabase : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.InsertData("Makes", "Name", "Renault");
      migrationBuilder.InsertData("Makes", "Name", "Toyota");
      migrationBuilder.InsertData("Makes", "Name", "Skoda");

      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Clio', (SELECT Id FROM Makes WHERE Name = 'Renault'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Megane', (SELECT Id FROM Makes WHERE Name = 'Renault'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Corolla', (SELECT Id FROM Makes WHERE Name = 'Toyota'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('CH-R', (SELECT Id FROM Makes WHERE Name = 'Toyota'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Yaris', (SELECT Id FROM Makes WHERE Name = 'Toyota'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Scala', (SELECT Id FROM Makes WHERE Name = 'Skoda'))");
      migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Kamiq', (SELECT Id FROM Makes WHERE Name = 'Skoda'))");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql("DELETE FROM Models");
      migrationBuilder.Sql("DELETE FROM Makes");
    }
  }
}
