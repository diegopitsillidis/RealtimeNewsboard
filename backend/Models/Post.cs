namespace RealtimeNewsboard.Backend.Models
{
    public class Post
    {
        public int Id { get; set; }

        public required string Title { get; set; }

        public required string Content { get; set; }

        public required string Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key to User
        public int AuthorId { get; set; }
        public User? Author { get; set; }
    }
}
