namespace RealtimeNewsboard.Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public required string Username { get; set; }

        public required string PasswordHash { get; set; }

        // "user" or "admin"
        public string Role { get; set; } = "user";
    }
}
