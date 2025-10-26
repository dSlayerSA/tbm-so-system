using Microsoft.EntityFrameworkCore;
using OrdersApi.Data;
using OrdersApi.Messaging;
using OrdersApi.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.NpgSql;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var configuration = builder.Configuration;

// Add services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<OrdersDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IOrderService, OrderService>();

// Messaging
builder.Services.AddSingleton<IMessagePublisher, ServiceBusMessagePublisher>();

// Health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(configuration.GetConnectionString("DefaultConnection"));

var app = builder.Build();

// Apply migrations with a small retry loop to wait for the database to become available
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

    const int maxAttempts = 12; // ~1 minute total (12 * 5s)
    const int delayMs = 5000;
    var connected = false;

    for (int attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            if (db.Database.CanConnect())
            {
                connected = true;
                break;
            }
        }
        catch
        {
            // ignore and retry
        }

        Console.WriteLine($"Waiting for database to be ready (attempt {attempt}/{maxAttempts})...");
        System.Threading.Thread.Sleep(delayMs);
    }

    if (!connected)
    {
        throw new Exception("Could not connect to the database after multiple attempts.");
    }

    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS (use the default policy defined above)
app.UseCors();

// Only redirect to HTTPS when not in development (helps running in containers)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.MapHealthChecks("/health");

app.Run();
