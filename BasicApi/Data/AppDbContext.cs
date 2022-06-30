using Microsoft.EntityFrameworkCore;
using BasicApi.Models;

namespace BasicApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt)
        {

        }

        public DbSet<Record> Records { get; set; }

    }
}
