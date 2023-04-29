using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.Data;
using NotesApp.Models.Entities;

namespace NotesApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        private readonly NotesDbContext notesDbContext;

        public NotesController(NotesDbContext notesDbContext) { 
            this.notesDbContext = notesDbContext;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllNotes()
        {
            return Ok(await notesDbContext.Notes.ToListAsync());
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [ActionName("GetNoteById")]
        public async Task<IActionResult> GetNoteById([FromRoute] Guid id)
        {
            var note = await notesDbContext.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDbContext.Notes.AddAsync(note);
            await notesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNoteById), new { id =  note.Id }, note);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateNote(Guid id, [FromBody] Note updatedNote)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);
            if (existingNote == null)
            {
                return NotFound();
            }

            existingNote.Title = updatedNote.Title;
            existingNote.Description = updatedNote.Description;
            existingNote.IsVisible = updatedNote.IsVisible;

            await notesDbContext.SaveChangesAsync();

            return Ok(existingNote);

        }

        [HttpDelete]
        [Route("{id:Guid}")]

        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);
            if (existingNote == null)
            {
                return NotFound();
            }

            notesDbContext.Notes.Remove(existingNote);
            await notesDbContext.SaveChangesAsync();

            return Ok(existingNote);
        }
    }
}
