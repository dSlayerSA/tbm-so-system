namespace OrdersApi.Messaging
{
    public interface IMessagePublisher
    {
        Task PublishOrderCreatedAsync(Guid orderId, object payload, CancellationToken cancellationToken = default);
    }
}
