using System.ComponentModel.DataAnnotations;

namespace BasicApi.Models
{
    public class Record
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public int Code { get; set; }
        [Required]
        public string Value { get; set; }
        
    }
}
