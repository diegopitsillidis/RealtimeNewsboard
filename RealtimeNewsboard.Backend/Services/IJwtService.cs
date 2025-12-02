using RealtimeNewsboard.Backend.Models;

namespace RealtimeNewsboard.Backend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
