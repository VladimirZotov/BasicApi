using System.ComponentModel.DataAnnotations;

namespace BasicApi.Dto
{
    public class RecordCreateDto
    {
        [Required]
        public int Code { get; set; }
        [Required]
        public string Value { get; set; }
        
    }
}
