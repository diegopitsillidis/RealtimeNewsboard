using Microsoft.EntityFrameworkCore;
using RealtimeNewsboard.Backend.Data;
using Microsoft.Data.Sqlite;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RealtimeNewsboard.Backend.DTOs;
using RealtimeNewsboard.Backend.Models;
using RealtimeNewsboard.Backend.Services;
using Microsoft.AspNetCore.Identity;
using System.Net.WebSockets;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSingleton<PostBroadcaster>();

// JWT service
builder.Services.AddScoped<IJwtService, JwtService>();

// Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = false,  // for simplicity
            ValidateAudience = false // for simplicity
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Seed DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await SeedData.InitializeAsync(db);
}

app.MapPost("/auth/login", async (
    LoginRequest request,
    AppDbContext db,
    IJwtService jwtService) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

    if (user is null)
    {
        // don't reveal whether username exists
        return Results.Unauthorized();
    }

    var hasher = new PasswordHasher<User>();
    var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

    if (result == PasswordVerificationResult.Failed)
    {
        return Results.Unauthorized();
    }

    var token = jwtService.GenerateToken(user);

    var response = new LoginResponse
    {
        Token = token,
        Username = user.Username,
        Role = user.Role
    };

    return Results.Ok(response);
});

app.MapGet("/posts", async (
    string? category,
    string? search,
    AppDbContext db) =>
{
    var query = db.Posts
        .Include(p => p.Author)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(category))
    {
        query = query.Where(p => p.Category == category);
    }

    if (!string.IsNullOrWhiteSpace(search))
    {
        query = query.Where(p =>
            p.Title.Contains(search) ||
            p.Content.Contains(search));
    }

    var posts = await query
        .OrderByDescending(p => p.CreatedAt)
        .Select(p => new
        {
            id = p.Id,
            title = p.Title,
            content = p.Content,
            author = p.Author!.Username,
            category = p.Category,
            createdAt = p.CreatedAt
        })
        .ToListAsync();

    return Results.Ok(posts);
});

app.MapPost("/posts", async (
    CreatePostRequest request,
    AppDbContext db,
    PostBroadcaster broadcaster,
    HttpContext httpContext) =>
{
    // Require auth
    if (!(httpContext.User.Identity?.IsAuthenticated ?? false))
    {
        return Results.Unauthorized();
    }

    var userIdClaim = httpContext.User.FindFirst("userId")?.Value;
    if (!int.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    // Basic validation
    if (string.IsNullOrWhiteSpace(request.Title) ||
        string.IsNullOrWhiteSpace(request.Content))
    {
        return Results.BadRequest("Title and content are required.");
    }

    var category = string.IsNullOrWhiteSpace(request.Category)
        ? "General"
        : request.Category.Trim();

    var post = new Post
    {
        Title = request.Title.Trim(),
        Content = request.Content.Trim(),
        Category = category,
        AuthorId = userId,
        CreatedAt = DateTime.UtcNow
    };

    db.Posts.Add(post);
    await db.SaveChangesAsync();

    // Broadcast to all WS clients
    await broadcaster.BroadcastPostAsync(post);

    return Results.Created($"/posts/{post.Id}", new { post.Id });
})
.RequireAuthorization(policy => policy.RequireRole("admin")); // uses JWT auth

app.Map("/ws/posts", async (HttpContext context, PostBroadcaster broadcaster) =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    using var socket = await context.WebSockets.AcceptWebSocketAsync();
    broadcaster.AddSocket(socket);

    var buffer = new byte[4 * 1024];

    // We keep the connection open until client closes it.
    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(
            new ArraySegment<byte>(buffer),
            CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
        {
            await socket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Closing",
                CancellationToken.None);
        }

        // We ignore incoming messages from clients (broadcast is one-way).
    }

    broadcaster.RemoveSocket(socket);
});

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
