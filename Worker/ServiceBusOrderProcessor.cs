using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Worker.Data;
using Worker.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Worker
{
    public class ServiceBusOrderProcessor : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ServiceBusOrderProcessor> _logger;
        private ServiceBusClient _client;
        private ServiceBusProcessor _processor;

        public ServiceBusOrderProcessor(
            IConfiguration configuration,
            IServiceScopeFactory scopeFactory,
            ILogger<ServiceBusOrderProcessor> logger)
        {
            _configuration = configuration;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var connectionString = _configuration["AzureServiceBus:ConnectionString"];
            var queueName = _configuration["AzureServiceBus:QueueName"] ?? "orders";

            _logger.LogInformation("Connection String: {ConnectionString}", connectionString);
            _logger.LogInformation("Queue Name: {QueueName}", queueName);

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Azure Service Bus connection string is empty. Check your configuration.");
            }

            _client = new ServiceBusClient(connectionString);
            _processor = _client.CreateProcessor(queueName);

            _processor.ProcessMessageAsync += ProcessMessageAsync;
            _processor.ProcessErrorAsync += ProcessErrorAsync;

            await _processor.StartProcessingAsync(cancellationToken);
            await base.StartAsync(cancellationToken);
        }

        private async Task ProcessMessageAsync(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            _logger.LogInformation("Received message: {body}", body);

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var envelope = JsonSerializer.Deserialize<MessageEnvelope>(body, options);
                if (envelope != null && string.Equals(envelope.EventType, "OrderCreated", StringComparison.OrdinalIgnoreCase))
                {
                    try 
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

                        var orderId = envelope.Data.GetProperty("OrderId").GetString();
                        if (orderId == null)
                        {
                            throw new Exception("OrderId is null in message data");
                        }

                        var guid = Guid.Parse(orderId);
                        _logger.LogInformation("Looking for order with ID: {OrderId}", guid);

                        var dbOrder = await db.Orders.FindAsync(guid);
                        if (dbOrder != null)
                        {
                            _logger.LogInformation("Found order {OrderId}. Current status: {Status}", guid, dbOrder.Status);
                            
                            // Atualizar para Processando
                            dbOrder.Status = "Processando";
                            await db.SaveChangesAsync();
                            _logger.LogInformation("Order {OrderId} status updated to Processando", guid);

                            // Simular processamento
                            await Task.Delay(TimeSpan.FromSeconds(5));

                            // Finalizar pedido
                            dbOrder.Status = "Finalizado";
                            await db.SaveChangesAsync();

                            _logger.LogInformation("Order {OrderId} processed successfully. Final status: {Status}", guid, dbOrder.Status);
                        }
                        else
                        {
                            _logger.LogWarning("Order {OrderId} not found in database", guid);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing order from message");
                        throw; // Re-throw to be caught by outer try-catch
                    }
                }
                else
                {
                    _logger.LogInformation("Message is not an OrderCreated event. EventType: {EventType}", envelope?.EventType ?? "null");
                }

                await args.CompleteMessageAsync(args.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message");
                await args.DeadLetterMessageAsync(args.Message);
            }
        }

        private Task ProcessErrorAsync(ProcessErrorEventArgs args)
        {
            _logger.LogError(args.Exception, "Error processing message");
            return Task.CompletedTask;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.CompletedTask; // Processing is handled by the processor
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_processor != null)
            {
                await _processor.StopProcessingAsync(cancellationToken);
                await _processor.DisposeAsync();
            }

            if (_client != null)
            {
                await _client.DisposeAsync();
            }

            await base.StopAsync(cancellationToken);
        }
    }
}