using Microsoft.EntityFrameworkCore;

namespace Worker.Data
{
    public class OrdersDbContext : DbContext
    {
        public OrdersDbContext(DbContextOptions<OrdersDbContext> options) : base(options) { }
        public DbSet<Worker.Models.Order> Orders { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Worker.Models.Order>(b =>
            {
                b.HasKey(o => o.Id);
                b.Property(o => o.Cliente).IsRequired();
                b.Property(o => o.Produto).IsRequired();
                b.Property(o => o.Valor).HasPrecision(18,2);
                b.Property(o => o.Status).IsRequired();
                b.Property(o => o.DataCriacao).IsRequired();
            });
        }
    }
}
