using RealtimeNewsboard.Backend.Models;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace RealtimeNewsboard.Backend.Services
{
    public class PostBroadcaster
    {
        private readonly List<WebSocket> _sockets = new();
        private readonly object _lock = new();

        public void AddSocket(WebSocket socket)
        {
            lock (_lock)
            {
                _sockets.Add(socket);
            }
        }

        public void RemoveSocket(WebSocket socket)
        {
            lock (_lock)
            {
                _sockets.Remove(socket);
            }
        }

        public async Task BroadcastPostAsync(Post post)
        {
            // Shape we send to clients
            var payload = new
            {
                id = post.Id,
                title = post.Title,
                content = post.Content,
                authorId = post.AuthorId,
                category = post.Category,
                createdAt = post.CreatedAt
            };

            var json = JsonSerializer.Serialize(payload);
            var buffer = Encoding.UTF8.GetBytes(json);
            var segment = new ArraySegment<byte>(buffer);

            WebSocket[] socketsSnapshot;
            lock (_lock)
            {
                socketsSnapshot = _sockets.ToArray();
            }

            var toRemove = new List<WebSocket>();

            foreach (var socket in socketsSnapshot)
            {
                if (socket.State == WebSocketState.Open)
                {
                    try
                    {
                        await socket.SendAsync(
                            segment,
                            WebSocketMessageType.Text,
                            endOfMessage: true,
                            cancellationToken: CancellationToken.None
                        );
                    }
                    catch
                    {
                        // If sending fails, we’ll remove later
                        toRemove.Add(socket);
                    }
                }
                else
                {
                    toRemove.Add(socket);
                }
            }

            if (toRemove.Count > 0)
            {
                lock (_lock)
                {
                    foreach (var s in toRemove)
                    {
                        _sockets.Remove(s);
                    }
                }
            }
        }
    }
}
