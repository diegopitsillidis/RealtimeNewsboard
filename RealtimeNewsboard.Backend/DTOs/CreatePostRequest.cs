namespace RealtimeNewsboard.Backend.DTOs
{
    public class CreatePostRequest
    {
        public string Title { get; set; } = "";
        public string Content { get; set; } = "";
        public string? Category { get; set; }
    }
}
