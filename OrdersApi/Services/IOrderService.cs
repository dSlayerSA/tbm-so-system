using OrdersApi.Models;

namespace OrdersApi.Services
{
    public interface IOrderService
    {
        Task<Order> CreateAsync(Order order, CancellationToken cancellationToken = default);
        Task<IEnumerable<Order>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> TryUpdateStatusAsync(Guid id, string expectedCurrentStatus, string newStatus, CancellationToken cancellationToken = default);
    }
}
