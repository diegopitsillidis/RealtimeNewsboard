using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealtimeNewsboard.Backend.Models;

namespace RealtimeNewsboard.Backend.Data
{
    public class SeedData
    {
        public static async Task InitializeAsync(AppDbContext db)
        {
            await db.Database.MigrateAsync();

            if (!await db.Users.AnyAsync())
            {
                var hasher = new PasswordHasher<User>();

                var admin = new User
                {
                    Username = "admin",
                    Role = "admin",
                    PasswordHash = ""
                };
                admin.PasswordHash = hasher.HashPassword(admin, "admin123");

                var user = new User
                {
                    Username = "user",
                    Role = "user",
                    PasswordHash = ""
                };
                user.PasswordHash = hasher.HashPassword(user, "user123");

                db.Users.AddRange(admin, user);
                await db.SaveChangesAsync();
            }
        }
    }
}
