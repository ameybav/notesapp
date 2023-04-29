using Microsoft.EntityFrameworkCore;
using NotesApp.Models.Entities;

namespace NotesApp.Data
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
    }
}
