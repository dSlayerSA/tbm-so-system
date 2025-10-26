using Microsoft.EntityFrameworkCore;
using OrdersApi.Data;
using OrdersApi.Models;

namespace OrdersApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly OrdersDbContext _db;

        public OrderService(OrdersDbContext db)
        {
            _db = db;
        }

        public async Task<Order> CreateAsync(Order order, CancellationToken cancellationToken = default)
        {
            order.Id = Guid.NewGuid();
            order.DataCriacao = DateTime.UtcNow;
            order.Status = "Pendente";
            _db.Orders.Add(order);
            await _db.SaveChangesAsync(cancellationToken);
            return order;
        }

        public async Task<IEnumerable<Order>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _db.Orders.AsNoTracking().OrderByDescending(o => o.DataCriacao).ToListAsync(cancellationToken);
        }

        public async Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _db.Orders.FindAsync(new object[]{id}, cancellationToken);
        }

        public async Task<bool> TryUpdateStatusAsync(Guid id, string expectedCurrentStatus, string newStatus, CancellationToken cancellationToken = default)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
            if (order == null) return false;
            if (!string.Equals(order.Status, expectedCurrentStatus, StringComparison.OrdinalIgnoreCase)) return false;
            order.Status = newStatus;
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
