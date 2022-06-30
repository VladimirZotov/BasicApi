namespace BasicApi.Dto
{
    public class PagedResult<T>
    {
        public int TotalNumber { get; set; }
        public List<T> List { get; set; }
    }
}
