using Azure.Messaging.ServiceBus;
using System.Text.Json;

namespace OrdersApi.Messaging
{
    public class ServiceBusMessagePublisher : IMessagePublisher, IAsyncDisposable
    {
        private readonly ServiceBusClient _client;
        private readonly ServiceBusSender _sender;
        private readonly IConfiguration _config;

        public ServiceBusMessagePublisher(IConfiguration configuration)
        {
            _config = configuration;
            var conn = configuration["AzureServiceBus:ConnectionString"];
            var queue = configuration["AzureServiceBus:QueueName"] ?? "orders";
            if (string.IsNullOrWhiteSpace(conn))
            {
                // Use a stub that logs if no connection string is provided
                _client = null!;
                _sender = null!;
            }
            else
            {
                _client = new ServiceBusClient(conn);
                _sender = _client.CreateSender(queue);
            }
        }

        public async Task PublishOrderCreatedAsync(Guid orderId, object payload, CancellationToken cancellationToken = default)
        {
            if (_sender == null)
            {
                Console.WriteLine($"[ServiceBusPublisher Stub] OrderCreated: {orderId} - {JsonSerializer.Serialize(payload)}");
                return;
            }

            var body = JsonSerializer.Serialize(payload);
            var message = new ServiceBusMessage(body)
            {
                CorrelationId = orderId.ToString(),
                Subject = "OrderCreated"
            };
            await _sender.SendMessageAsync(message, cancellationToken);
        }

        public async ValueTask DisposeAsync()
        {
            if (_sender != null) await _sender.DisposeAsync();
            if (_client != null) await _client.DisposeAsync();
        }
    }
}
